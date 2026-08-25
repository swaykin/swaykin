import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import {getDataConnect, DataConnect} from "firebase-admin/data-connect";
import {brightDataApiToken, brightDataDatasetId} from "../config";
import {triggerScrape, pollSnapshotUntilReady} from "./brightDataClient";
import {connectorConfig} from "./dataConnectConfig";
import {pickField, asNumber} from "./pickField";
import {
  isUpstreamTimeout,
  UPSTREAM_FAILURE_MESSAGE,
} from "../shared/clientErrors";
import {
  SNAPSHOT_POLL_TIMEOUT_MS,
  SNAPSHOT_POLL_INTERVAL_MS,
} from "./constants";

const INSTAGRAM_BASE_URL = "https://www.instagram.com";

interface RefreshRequestBody {
  workspaceId: string;
}

/** The NOT NULL columns Workspace has, that upsert requires be re-sent. */
interface WorkspaceRequiredFields {
  name: string;
  planTier: string;
  creditsBalance: number;
  creditsMonthlyAllowance: number;
  createdAt: string;
}

interface WorkspaceForRefresh extends WorkspaceRequiredFields {
  instagramHandle: string | null;
}

/**
 * @param {unknown} body Parsed JSON request body.
 * @return {RefreshRequestBody | null} The validated body, or null.
 */
function parseRequestBody(body: unknown): RefreshRequestBody | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }
  const {workspaceId} = body as Record<string, unknown>;
  if (typeof workspaceId !== "string" || workspaceId.length === 0) {
    return null;
  }
  return {workspaceId};
}

/**
 * @param {DataConnect} dc Data Connect client.
 * @param {string} workspaceId Workspace to fetch.
 * @return {Promise<WorkspaceForRefresh | null>} The fields needed to both
 *   locate the Instagram handle to scrape and satisfy Workspace's NOT NULL
 *   columns on the later upsert, or null if the workspace doesn't exist.
 */
async function fetchWorkspaceForRefresh(
  dc: DataConnect,
  workspaceId: string
): Promise<WorkspaceForRefresh | null> {
  const query = `query($id: UUID!) {
    workspace(id: $id) {
      instagramHandle
      name
      planTier
      creditsBalance
      creditsMonthlyAllowance
      createdAt
    }
  }`;
  const res = await dc.executeGraphqlRead<
    { workspace: WorkspaceForRefresh | null },
    { id: string }
  >(query, {variables: {id: workspaceId}});
  return res.data.workspace ?? null;
}

/**
 * Scrapes a workspace's own `instagramHandle` via Bright Data and caches
 * `igFollowers`/`igPostsCount`/`igAvgEngagementRate` on the `Workspace` row,
 * so the competitor comparison endpoint can include "your own brand" in
 * share-of-voice math without a live scrape on every read. POST body:
 * `{ workspaceId: string }`.
 */
export const refreshWorkspaceInstagramStats = onRequest(
  {secrets: [brightDataApiToken], timeoutSeconds: 600, invoker: "public"},
  async (request, response) => {
    if (request.method !== "POST") {
      response.status(405).json({error: "Use POST"});
      return;
    }

    const parsedBody = parseRequestBody(request.body);
    if (!parsedBody) {
      response
        .status(400)
        .json({error: "Body must be { workspaceId: string }"});
      return;
    }

    const {workspaceId} = parsedBody;
    const dc = getDataConnect(connectorConfig);
    const apiToken = brightDataApiToken.value();

    try {
      const workspace = await fetchWorkspaceForRefresh(dc, workspaceId);
      if (!workspace) {
        response.status(404).json({error: "Workspace not found"});
        return;
      }
      if (!workspace.instagramHandle) {
        response.status(400).json({
          error: "Workspace has no instagramHandle configured",
        });
        return;
      }

      const triggerResult = await triggerScrape({
        urls: [`${INSTAGRAM_BASE_URL}/${workspace.instagramHandle}`],
        datasetId: brightDataDatasetId.value(),
        apiToken,
        limitPerInput: null,
      });

      const data = triggerResult.ready ?
        triggerResult.data :
        await pollSnapshotUntilReady({
          snapshotId: triggerResult.snapshotId,
          apiToken,
          timeoutMs: SNAPSHOT_POLL_TIMEOUT_MS,
          intervalMs: SNAPSHOT_POLL_INTERVAL_MS,
        });

      const items = Array.isArray(data) ? data : [data];
      const profile = items.find(
        (item): item is Record<string, unknown> =>
          typeof item === "object" && item !== null && !("error" in item)
      );

      if (!profile) {
        response.status(502).json({error: UPSTREAM_FAILURE_MESSAGE});
        return;
      }

      const igFollowers = asNumber(
        pickField(profile, ["followers", "followers_count"])
      );
      const igPostsCount = asNumber(pickField(profile, ["posts_count"]));
      const igAvgEngagementRate = asNumber(
        pickField(profile, ["avg_engagement"])
      );

      await dc.upsert("Workspace", {
        id: workspaceId,
        name: workspace.name,
        planTier: workspace.planTier,
        creditsBalance: workspace.creditsBalance,
        creditsMonthlyAllowance: workspace.creditsMonthlyAllowance,
        createdAt: workspace.createdAt,
        igFollowers,
        igPostsCount,
        igAvgEngagementRate,
        igStatsUpdatedAt: new Date().toISOString(),
      });

      response
        .status(200)
        .json({igFollowers, igPostsCount, igAvgEngagementRate});
    } catch (err) {
      logger.error("Failed to refresh workspace Instagram stats", err);
      response.status(isUpstreamTimeout(err) ? 504 : 502).json({
        error: UPSTREAM_FAILURE_MESSAGE,
      });
    }
  }
);

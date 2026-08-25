import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import {brightDataApiToken, brightDataDatasetId} from "../config";
import {
  extractBearerToken,
  verifyFirebaseIdToken,
  fetchUserByFirebaseUid,
} from "../auth/authHelpers";
import {triggerScrape, pollSnapshotUntilReady} from "./brightDataClient";
import {saveScrapedCompetitors} from "./saveCompetitors";
import {
  isUpstreamTimeout,
  UPSTREAM_FAILURE_MESSAGE,
} from "../shared/clientErrors";
import {
  SNAPSHOT_POLL_TIMEOUT_MS,
  SNAPSHOT_POLL_INTERVAL_MS,
} from "./constants";

const INSTAGRAM_BASE_URL = "https://www.instagram.com";

interface CompetitorRequestBody {
  usernames: string[];
  datasetId?: string;
  limitPerInput: number | null;
}

/**
 * @param {unknown} body Parsed JSON request body.
 * @return {CompetitorRequestBody | null} The validated body, or null.
 */
function parseRequestBody(body: unknown): CompetitorRequestBody | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }
  const {usernames, datasetId, limitPerInput} = body as Record<
    string,
    unknown
  >;

  if (
    !Array.isArray(usernames) ||
    usernames.length === 0 ||
    !usernames.every((u) => typeof u === "string" && u.length > 0)
  ) {
    return null;
  }
  if (datasetId !== undefined && typeof datasetId !== "string") {
    return null;
  }
  if (
    limitPerInput !== undefined &&
    limitPerInput !== null &&
    typeof limitPerInput !== "number"
  ) {
    return null;
  }

  return {
    usernames,
    datasetId,
    limitPerInput: limitPerInput ?? null,
  };
}

/**
 * Scrapes a batch of Instagram profiles by username via Bright Data, for
 * competitor tracking. `workspaceId` is resolved server-side from the
 * caller's Firebase ID token — never accepted as request input. POST body:
 * `{ usernames: string[], datasetId?: string, limitPerInput?: number }`.
 * Returns the scraped data once ready, polling internally (up to 10
 * minutes) when Bright Data hands back a snapshot id instead of inline
 * data.
 */
export const competitor = onRequest(
  {secrets: [brightDataApiToken], timeoutSeconds: 600, invoker: "public"},
  async (request, response) => {
    if (request.method !== "POST") {
      response.status(405).json({error: "Use POST"});
      return;
    }

    const idToken = extractBearerToken(request.headers.authorization);
    if (!idToken) {
      response
        .status(401)
        .json({error: "Missing Authorization: Bearer <idToken>"});
      return;
    }

    let firebaseUid: string;
    try {
      firebaseUid = await verifyFirebaseIdToken(idToken);
    } catch (err) {
      logger.warn("competitor: invalid or expired ID token", err);
      response.status(401).json({error: "Invalid or expired ID token"});
      return;
    }

    const user = await fetchUserByFirebaseUid(firebaseUid);
    if (!user) {
      response
        .status(404)
        .json({error: "No user record found for this account"});
      return;
    }

    const parsedBody = parseRequestBody(request.body);
    if (!parsedBody) {
      response.status(400).json({
        error:
          "Body must be { usernames: string[] (non-empty), " +
          "datasetId?: string, limitPerInput?: number }",
      });
      return;
    }

    const {usernames, datasetId, limitPerInput} = parsedBody;
    const workspaceId = user.workspaceId;
    const urls = usernames.map(
      (username) => `${INSTAGRAM_BASE_URL}/${username}`
    );
    const apiToken = brightDataApiToken.value();

    try {
      const triggerResult = await triggerScrape({
        urls,
        datasetId: datasetId ?? brightDataDatasetId.value(),
        apiToken,
        limitPerInput,
      });

      const data = triggerResult.ready ?
        triggerResult.data :
        await pollSnapshotUntilReady({
          snapshotId: triggerResult.snapshotId,
          apiToken,
          timeoutMs: SNAPSHOT_POLL_TIMEOUT_MS,
          intervalMs: SNAPSHOT_POLL_INTERVAL_MS,
        });

      let dbWrite:
        | {competitorCount: number; postCount: number}
        | {error: string};
      try {
        dbWrite = await saveScrapedCompetitors(data, workspaceId);
      } catch (dbErr) {
        logger.error("Failed to write scraped data to database", dbErr);
        dbWrite = {
          error: dbErr instanceof Error ? dbErr.message : "Unknown error",
        };
      }

      response.status(200).json({data, dbWrite});
    } catch (err) {
      logger.error("Bright Data competitor scrape failed", err);
      response.status(isUpstreamTimeout(err) ? 504 : 502).json({
        error: UPSTREAM_FAILURE_MESSAGE,
      });
    }
  }
);

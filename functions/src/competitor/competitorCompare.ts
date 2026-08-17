import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import {getDataConnect} from "firebase-admin/data-connect";
import {applyCors} from "../shared/cors";
import {connectorConfig} from "../brightdata/dataConnectConfig";
import {
  extractBearerToken,
  verifyFirebaseIdToken,
  fetchUserByFirebaseUid,
} from "../auth/authHelpers";
import {getWorkspaceCompetitorMap} from "./workspaceCompetitors";
import {findProfilesByIds} from "./profileRepo";
import {findPostsByProfileId} from "./postRepo";
import {
  computePostingFrequency,
  computeEngagementRate,
  computeAvgReachPerPost,
  computeActiveCollaborations,
  computeContentBreakdown,
} from "./metricsUtils";

const POSTS_LIMIT = 30;

interface WorkspaceBrand {
  brandName: string | null;
  instagramHandle: string | null;
  igFollowers: number | null;
  igAvgEngagementRate: number | null;
}

async function fetchWorkspaceBrand(workspaceId: string): Promise<WorkspaceBrand | null> {
  const dc = getDataConnect(connectorConfig);
  const res = await dc.executeGraphqlRead<
    { workspace: WorkspaceBrand | null },
    { id: string }
  >(
    `query($id: UUID!) {
      workspace(id: $id) {
        brandName
        instagramHandle
        igFollowers
        igAvgEngagementRate
      }
    }`,
    {variables: {id: workspaceId}}
  );
  return res.data.workspace ?? null;
}

/**
 * Compares competitors against the workspace's own brand across key metrics.
 * POST body: `{ profileIds?: string[] }` — omit to compare all active competitors.
 * Metrics computed on-the-go from stored Post rows; no BrightData call at read time.
 */
export const competitorCompare = onRequest(
  {invoker: "public"},
  async (request, response) => {
    if (applyCors(request, response)) return;

    if (request.method !== "POST") {
      response.status(405).json({error: "Use POST"});
      return;
    }

    const idToken = extractBearerToken(request.headers.authorization);
    if (!idToken) {
      response.status(401).json({error: "Missing Authorization: Bearer <idToken>"});
      return;
    }

    let firebaseUid: string;
    try {
      firebaseUid = await verifyFirebaseIdToken(idToken);
    } catch (err) {
      logger.warn("competitorCompare: invalid or expired ID token", err);
      response.status(401).json({error: "Invalid or expired ID token"});
      return;
    }

    const user = await fetchUserByFirebaseUid(firebaseUid);
    if (!user) {
      response.status(404).json({error: "No user record found for this account"});
      return;
    }

    const body = request.body as Record<string, unknown> | null;
    const rawIds = Array.isArray(body?.profileIds) ?
      (body.profileIds as unknown[]).filter((id): id is string => typeof id === "string") :
      null;

    try {
      const [competitorMap, brand] = await Promise.all([
        getWorkspaceCompetitorMap(user.workspaceId),
        fetchWorkspaceBrand(user.workspaceId),
      ]);

      if (!brand) {
        response.status(404).json({error: "Workspace not found"});
        return;
      }

      const validIds = rawIds ?
        rawIds.filter((id) => competitorMap[id]) :
        Object.entries(competitorMap)
          .filter(([, meta]) => meta.status === "active")
          .map(([id]) => id);

      if (validIds.length === 0) {
        response.status(404).json({error: "No active competitors found for this workspace"});
        return;
      }

      const profiles = await findProfilesByIds(validIds);

      const competitors = await Promise.all(
        profiles.map(async (profile) => {
          const posts = await findPostsByProfileId(profile.id, POSTS_LIMIT);
          return {
            profileId: profile.id,
            igHandle: profile.igHandle,
            name: profile.name,
            avatarUrl: profile.avatarUrl ?? null,
            followers: profile.followers ?? null,
            engagementRate: computeEngagementRate(
              posts,
              profile.followers ?? null,
              profile.avgEngagementRate ?? null
            ),
            postingFrequencyPerWeek: computePostingFrequency(posts),
            activeCollaborations: computeActiveCollaborations(posts),
            avgReachPerPost: computeAvgReachPerPost(posts),
            contentBreakdown: computeContentBreakdown(posts),
            followerGrowth30d: null,
            followerGrowth90d: null,
            workspaceStatus: competitorMap[profile.id]?.status ?? null,
            addedAt: competitorMap[profile.id]?.addedAt ?? null,
          };
        })
      );

      const ownBrand = {
        name: brand.brandName ?? null,
        igHandle: brand.instagramHandle ?? null,
        followers: brand.igFollowers ?? null,
        engagementRate: brand.igAvgEngagementRate !== null && brand.igAvgEngagementRate !== undefined ?
          Math.round(brand.igAvgEngagementRate * 10) / 10 :
          null,
        postingFrequencyPerWeek: null,
        activeCollaborations: null,
        avgReachPerPost: null,
        contentBreakdown: null,
        followerGrowth30d: null,
        followerGrowth90d: null,
      };

      response.status(200).json({ownBrand, competitors});
    } catch (err) {
      logger.error("competitorCompare: failed", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      response.status(502).json({error: message});
    }
  }
);

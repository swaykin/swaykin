import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import {applyCors} from "../shared/cors";
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
  computeTopHashtags,
  computeCollaborators,
} from "./metricsUtils";

const RECENT_POSTS_LIMIT = 20;

/**
 * @param {number | null} value Value to round, or null.
 * @param {number} decimals Number of decimal places to round to.
 * @return {number | null} The rounded value, or null if input was null.
 */
function roundTo(value: number | null, decimals: number): number | null {
  if (value === null) return null;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Returns a deep-dive profile for each requested competitor — profile
 * metadata, posting metrics, top hashtags, collaborators, and recent posts.
 * All metrics are computed on-the-go from stored Post rows; no BrightData
 * call is made at read time.
 *
 * Route: GET /v1/competitors/deepdive
 * Query param: `?profileIds=<uuid>,<uuid>,...` (comma-separated, max 20).
 * Only IDs already in the calling workspace's competitor map are processed.
 */
export const competitorDeepdive = onRequest(
  {invoker: "public"},
  async (request, response) => {
    if (applyCors(request, response)) return;

    if (request.method !== "GET") {
      response.status(405).json({error: "Use GET"});
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
      logger.warn("competitorDeepdive: invalid or expired ID token", err);
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

    try {
      const competitorMap = await getWorkspaceCompetitorMap(user.workspaceId);

      const rawIds = request.query.profileIds as string | undefined;
      let validIds: string[];

      if (rawIds) {
        const requestedIds = rawIds
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);
        validIds = requestedIds.filter((id) => competitorMap[id]);
      } else {
        // No filter — return all active competitors for this workspace
        validIds = Object.entries(competitorMap)
          .filter(([, meta]) => meta.status === "active")
          .map(([id]) => id);
      }

      if (validIds.length === 0) {
        response.status(404).json({
          error: "None of the requested profileIds belong to this workspace",
        });
        return;
      }

      const profiles = await findProfilesByIds(validIds);

      const competitors = await Promise.all(
        profiles.map(async (profile) => {
          const posts = await findPostsByProfileId(
            profile.id,
            RECENT_POSTS_LIMIT
          );

          return {
            profileId: profile.id,
            igUsername: profile.igHandle,
            name: profile.name,
            bio: profile.bio,
            followers: profile.followers,
            verified: profile.verified,
            avgEngagementRate: roundTo(profile.avgEngagementRate, 2),
            postingFrequencyPerWeek: computePostingFrequency(posts),
            topHashtags: computeTopHashtags(posts),
            collaborators: computeCollaborators(posts),
            recentPosts: posts.map((post) => ({
              postUrl: post.postUrl,
              type: post.type,
              thumbnailUrl: post.thumbnailUrl,
              likes: post.likes,
              comments: post.comments,
              estimatedViews: post.estimatedViews,
              engagementRatePercent: roundTo(post.engagementRatePercent, 2),
              hashtags: post.hashtags,
              postedAt: post.postedAt,
            })),
            workspaceStatus: competitorMap[profile.id]?.status ?? null,
            addedAt: competitorMap[profile.id]?.addedAt ?? null,
          };
        })
      );

      response.status(200).json({competitors});
    } catch (err) {
      logger.error("competitorDeepdive: failed", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      response.status(502).json({error: message});
    }
  }
);

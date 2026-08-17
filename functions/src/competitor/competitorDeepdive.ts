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
import {findPostsByProfileId, PostRow} from "./postRepo";

const RECENT_POSTS_LIMIT = 20;
const TOP_HASHTAGS_LIMIT = 10;

/**
 * @param {PostRow[]} posts Posts for one profile.
 * @return {number | null} Posts per week, or null if date range is too narrow.
 */
function computePostingFrequency(posts: PostRow[]): number | null {
  if (posts.length < 2) return null;
  const timestamps = posts.map((p) => new Date(p.postedAt).getTime());
  const newest = Math.max(...timestamps);
  const oldest = Math.min(...timestamps);
  const weeks = (newest - oldest) / (7 * 24 * 60 * 60 * 1000);
  if (weeks === 0) return null;
  return posts.length / weeks;
}

/**
 * @param {PostRow[]} posts Posts for one profile.
 * @return {{ tag: string; count: number }[]} Top hashtags by frequency.
 */
function computeTopHashtags(
  posts: PostRow[]
): { tag: string; count: number }[] {
  const freq = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.hashtags ?? []) {
      freq.set(tag, (freq.get(tag) ?? 0) + 1);
    }
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_HASHTAGS_LIMIT)
    .map(([tag, count]) => ({tag, count}));
}

/**
 * @param {PostRow[]} posts Posts for one profile.
 * @return {{ handle: string; postCount: number }[]} Co-authors sorted by
 *   number of co-authored posts, descending.
 */
function computeCollaborators(
  posts: PostRow[]
): { handle: string; postCount: number }[] {
  const freq = new Map<string, number>();
  for (const post of posts) {
    for (const handle of post.collaborators ?? []) {
      freq.set(handle, (freq.get(handle) ?? 0) + 1);
    }
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([handle, postCount]) => ({handle, postCount}));
}

/**
 * Returns a deep-dive profile for each requested competitor — profile
 * metadata, posting metrics, top hashtags, collaborators, and recent posts.
 * All metrics are computed on-the-go from stored Post rows; no BrightData
 * call is made at read time.
 *
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
            igHandle: profile.igHandle,
            name: profile.name,
            bio: profile.bio,
            avatarUrl: profile.avatarUrl,
            followers: profile.followers,
            verified: profile.verified,
            avgEngagementRate: profile.avgEngagementRate,
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
              engagementRatePercent: post.engagementRatePercent,
              estimatedReach: post.estimatedReach,
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

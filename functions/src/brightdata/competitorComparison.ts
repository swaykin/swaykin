import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import {getDataConnect, DataConnect} from "firebase-admin/data-connect";
import {connectorConfig} from "./dataConnectConfig";
import {
  extractBearerToken,
  verifyFirebaseIdToken,
  fetchUserByFirebaseUid,
} from "../auth/authHelpers";

const POSTS_WINDOW_DAYS = 30;
const POSTS_WINDOW_MS = POSTS_WINDOW_DAYS * 24 * 60 * 60 * 1000;

interface WorkspaceBrandRow {
  instagramHandle: string | null;
  igFollowers: number | null;
  igAvgEngagementRate: number | null;
}

interface CompetitorRow {
  id: string;
  name: string;
  igHandle: string;
  followers: number | null;
  avgEngagementRate: number | null;
}

interface CompetitorPostRow {
  competitorId: string;
  likes: number | null;
  comments: number | null;
}

interface BrandMetrics {
  followers: number;
  postsPerMonth?: number;
  avgEngagementRate: number;
  shareOfVoicePct: number;
}

/**
 * @param {DataConnect} dc Data Connect client.
 * @param {string} workspaceId Workspace to fetch.
 * @return {Promise<WorkspaceBrandRow | null>} Own-brand IG stats, or null if
 *   the workspace doesn't exist.
 */
async function fetchWorkspaceBrand(
  dc: DataConnect,
  workspaceId: string
): Promise<WorkspaceBrandRow | null> {
  const query = `query($id: UUID!) {
    workspace(id: $id) {
      instagramHandle
      igFollowers
      igAvgEngagementRate
    }
  }`;
  const res = await dc.executeGraphqlRead<
    { workspace: WorkspaceBrandRow | null },
    { id: string }
  >(query, {variables: {id: workspaceId}});
  return res.data.workspace ?? null;
}

/**
 * @param {DataConnect} dc Data Connect client.
 * @param {string} workspaceId Workspace to scope the lookup to.
 * @return {Promise<CompetitorRow[]>} All competitors tracked for it.
 */
async function fetchCompetitors(
  dc: DataConnect,
  workspaceId: string
): Promise<CompetitorRow[]> {
  const query = `query($workspaceId: UUID!) {
    competitors(where: {workspaceId: {eq: $workspaceId}}) {
      id
      name
      igHandle
      followers
      avgEngagementRate
    }
  }`;
  const res = await dc.executeGraphqlRead<
    { competitors: CompetitorRow[] },
    { workspaceId: string }
  >(query, {variables: {workspaceId}});
  return res.data.competitors;
}

/**
 * @param {DataConnect} dc Data Connect client.
 * @param {string[]} competitorIds Competitors to fetch recent posts for.
 * @return {Promise<CompetitorPostRow[]>} Posts from the last
 *   {@link POSTS_WINDOW_DAYS} days, across all given competitors.
 */
async function fetchRecentPosts(
  dc: DataConnect,
  competitorIds: string[]
): Promise<CompetitorPostRow[]> {
  if (competitorIds.length === 0) return [];

  const sinceIso = new Date(Date.now() - POSTS_WINDOW_MS).toISOString();
  const query = `query($competitorIds: [UUID!], $since: Timestamp!) {
    competitorContents(
      where: {competitorId: {in: $competitorIds}, postedAt: {ge: $since}}
    ) {
      competitorId
      likes
      comments
    }
  }`;
  const res = await dc.executeGraphqlRead<
    { competitorContents: CompetitorPostRow[] },
    { competitorIds: string[]; since: string }
  >(query, {variables: {competitorIds, since: sinceIso}});
  return res.data.competitorContents;
}

/**
 * Average engagement rate over a set of posts, using each post's
 * `(likes + comments) / followers`. Falls back to Bright Data's own
 * `avg_engagement` value captured at fetch time when there are no stored
 * posts to derive it from (e.g. right after the first scrape).
 * @param {CompetitorPostRow[]} posts Posts to average over.
 * @param {number} followers Follower count to normalize against.
 * @param {number | null} fallback Stored `avgEngagementRate` column value.
 * @return {number} The engagement rate, as a fraction (e.g. 0.03 = 3%).
 */
function computeAvgEngagementRate(
  posts: CompetitorPostRow[],
  followers: number,
  fallback: number | null
): number {
  if (posts.length === 0 || followers <= 0) {
    return fallback ?? 0;
  }
  const rates = posts.map(
    (post) => ((post.likes ?? 0) + (post.comments ?? 0)) / followers
  );
  return rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
}

/**
 * Approximate total interaction volume for one entity, used only to weight
 * shareOfVoicePct — average engagement rate times follower count.
 * @param {number} followers Follower count.
 * @param {number} avgEngagementRate Engagement rate, as a fraction.
 * @return {number} Approximate interactions per post.
 */
function interactionVolume(
  followers: number,
  avgEngagementRate: number
): number {
  return followers * avgEngagementRate;
}

export const competitorComparison = onRequest(
  {invoker: "public"},
  async (request, response) => {
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
      logger.warn("competitorComparison: invalid or expired ID token", err);
      response.status(401).json({error: "Invalid or expired ID token"});
      return;
    }

    const callingUser = await fetchUserByFirebaseUid(firebaseUid);
    if (!callingUser) {
      response
        .status(404)
        .json({error: "No user record found for this account"});
      return;
    }
    const workspaceId = callingUser.workspaceId;

    const dc = getDataConnect(connectorConfig);

    try {
      const [brand, competitors] = await Promise.all([
        fetchWorkspaceBrand(dc, workspaceId),
        fetchCompetitors(dc, workspaceId),
      ]);

      if (!brand) {
        response.status(404).json({error: "Workspace not found"});
        return;
      }

      const posts = await fetchRecentPosts(
        dc,
        competitors.map((c) => c.id)
      );
      const postsByCompetitor = new Map<string, CompetitorPostRow[]>();
      for (const post of posts) {
        const bucket = postsByCompetitor.get(post.competitorId) ?? [];
        bucket.push(post);
        postsByCompetitor.set(post.competitorId, bucket);
      }

      const ownFollowers = brand.igFollowers ?? 0;
      const ownAvgEngagementRate = brand.igAvgEngagementRate ?? 0;
      const ownVolume = interactionVolume(ownFollowers, ownAvgEngagementRate);

      const competitorMetrics = competitors.map((competitor) => {
        const followers = competitor.followers ?? 0;
        const recentPosts = postsByCompetitor.get(competitor.id) ?? [];
        const avgEngagementRate = computeAvgEngagementRate(
          recentPosts,
          followers,
          competitor.avgEngagementRate
        );
        return {
          id: competitor.id,
          name: competitor.name,
          igHandle: competitor.igHandle,
          followers,
          postsPerMonth: recentPosts.length,
          avgEngagementRate,
          volume: interactionVolume(followers, avgEngagementRate),
        };
      });

      const totalVolume =
        ownVolume + competitorMetrics.reduce((sum, c) => sum + c.volume, 0);

      const shareOfVoicePct = (volume: number): number =>
        totalVolume > 0 ? (volume / totalVolume) * 100 : 0;

      const ownBrand: BrandMetrics & {handle: string | null} = {
        handle: brand.instagramHandle,
        followers: ownFollowers,
        avgEngagementRate: ownAvgEngagementRate,
        shareOfVoicePct: shareOfVoicePct(ownVolume),
      };

      response.status(200).json({
        ownBrand,
        competitors: competitorMetrics.map((c) => ({
          id: c.id,
          name: c.name,
          igHandle: c.igHandle,
          followers: c.followers,
          postsPerMonth: c.postsPerMonth,
          avgEngagementRate: c.avgEngagementRate,
          shareOfVoicePct: shareOfVoicePct(c.volume),
        })),
      });
    } catch (err) {
      logger.error("Failed to build competitor comparison", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      response.status(502).json({error: message});
    }
  }
);

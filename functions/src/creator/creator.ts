import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import type {Request, Response} from "express";
import {applyCors} from "../shared/cors";
import {UPSTREAM_FAILURE_MESSAGE} from "../shared/clientErrors";
import {
  extractBearerToken,
  verifyFirebaseIdToken,
} from "../auth/authHelpers";
import {normalizeInstagramAccount} from "../competitor/normalizeAccount";
import {
  findProfileByHandle,
  createProfile,
  isProfileStale,
  ProfileRow,
} from "../competitor/profileRepo";
import {findPostsByProfileId, PostRow} from "../competitor/postRepo";
import {fetchAndPersistCompetitor} from "../competitor/competitorFetchWorker";
import {brightDataApiToken} from "../config";
import {computeTopHashtags, computeCollaborators} from "../competitor/metricsUtils";

const INSTAGRAM_BASE_URL = "https://www.instagram.com";

function shapeProfile(profile: ProfileRow, posts: PostRow[]) {
  return {
    id: profile.id,
    igUsername: profile.igHandle,
    profileUrl: `${INSTAGRAM_BASE_URL}/${profile.igHandle}`,
    name: profile.name,
    type: "creator",
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    followers: profile.followers,
    followings: profile.followings,
    postsCount: profile.postsCount,
    avgEngagementRate: profile.avgEngagementRate,
    verified: profile.verified,
    email: profile.email,
    topHashtags: computeTopHashtags(posts, 5),
    collaborators: computeCollaborators(posts),
  };
}

function shapePosts(posts: PostRow[]) {
  return posts.map((post) => ({
    id: post.id,
    postUrl: post.postUrl,
    shortcode: post.shortcode,
    caption: post.caption,
    type: post.type,
    thumbnailUrl: post.thumbnailUrl,
    mediaUrls: post.mediaUrls,
    likes: post.likes,
    comments: post.comments,
    hashtags: post.hashtags,
    collaborators: post.collaborators,
    videoPlayCount: post.videoPlayCount,
    estimatedViews: post.estimatedViews,
    engagementRatePercent: post.engagementRatePercent,
    postedAt: post.postedAt,
  }));
}

function parseBody(body: unknown): { igUsername: string } | null {
  if (typeof body !== "object" || body === null) return null;
  const {igUsername} = body as Record<string, unknown>;
  if (typeof igUsername !== "string" || !igUsername.trim()) return null;
  return {igUsername: igUsername.trim()};
}

export const creator = onRequest(
  {
    invoker: "public",
    timeoutSeconds: 540,
    region: "asia-south1",
    secrets: [brightDataApiToken],
  },
  async (request: Request, response: Response) => {
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

    try {
      await verifyFirebaseIdToken(idToken);
    } catch (err) {
      logger.warn("creator: invalid or expired ID token", err);
      response.status(401).json({error: "Invalid or expired ID token"});
      return;
    }

    const parsed = parseBody(request.body);
    if (!parsed) {
      response.status(400).json({error: "Body must be { igUsername: string }"});
      return;
    }

    const normalized = normalizeInstagramAccount(parsed.igUsername);
    if (!normalized) {
      response.status(400).json({error: "Invalid Instagram handle or URL"});
      return;
    }

    const {igHandle, profileUrl} = normalized;

    try {
      let profile = await findProfileByHandle(igHandle);
      const hasRealData =
        profile !== null &&
        (profile.followers !== null || profile.postsCount !== null);

      if (profile && hasRealData && !isProfileStale(profile)) {
        const posts = await findPostsByProfileId(profile.id, 20);
        if (posts.length > 0) {
          response.status(200).json({
            profile: shapeProfile(profile, posts),
            posts: shapePosts(posts),
          });
          return;
        }
      }

      // Cache miss, stale, or no posts — scrape BrightData synchronously
      let profileId: string;
      if (!profile) {
        profileId = await createProfile({
          igHandle,
          type: "influencer",
          name: igHandle,
        });
      } else {
        profileId = profile.id;
      }

      await fetchAndPersistCompetitor({
        profileId,
        igHandle,
        profileUrl,
        apiToken: brightDataApiToken.value(),
        profileType: "influencer",
      });

      profile = await findProfileByHandle(igHandle);
      const posts = await findPostsByProfileId(profileId, 20);

      response.status(200).json({
        profile: profile ? shapeProfile(profile, posts) : null,
        posts: shapePosts(posts),
      });
    } catch (err) {
      logger.error("creator: failed", {igHandle, err});
      response.status(502).json({error: UPSTREAM_FAILURE_MESSAGE});
    }
  }
);

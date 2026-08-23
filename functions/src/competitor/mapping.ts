import {shortcodeFromInstagramUrl} from "../brightdata/discoveryPostMapper";
import {pickField, asString, asNumber} from "../brightdata/pickField";
import {RawBrightDataPost} from "./brightDataPostsClient";
import {ProfileUpsertData} from "./profileRepo";
import {PostUpsertData} from "./postRepo";

/** Rough engagement-to-view estimation ratio (BrightData's posts dataset
 * doesn't return real view counts even for reels — confirmed empirically
 * across multiple accounts/snapshots). */
const ESTIMATED_VIEWS_MULTIPLIER = 15;

/**
 * Maps a Bright Data Profiles-dataset record onto our global Profile schema.
 * @param {Record<string, unknown>} profile Raw profile scrape row.
 * @param {string} igHandle Canonical Instagram handle.
 * @param {string} profileType Profile type label (e.g. "own", "competitor").
 * @return {ProfileUpsertData} Mapped profile fields ready to persist.
 */
export function mapBrightDataProfileRecord(
  profile: Record<string, unknown>,
  igHandle: string,
  profileType: string
): ProfileUpsertData {
  const verifiedRaw = pickField(profile, ["is_verified", "verified"]);

  return {
    igHandle,
    type: profileType,
    name:
      asString(pickField(profile, ["full_name", "profile_name", "name"])) ??
      igHandle,
    bio: asString(pickField(profile, ["biography", "bio"])) ?? null,
    avatarUrl:
      asString(
        pickField(profile, ["profile_image_link", "avatar", "profile_pic_url"])
      ) ?? null,
    followers:
      asNumber(pickField(profile, ["followers", "followers_count"])) ?? null,
    followings:
      asNumber(pickField(profile, ["following", "following_count"])) ?? null,
    postsCount: asNumber(pickField(profile, ["posts_count"])) ?? null,
    avgEngagementRate:
      asNumber(pickField(profile, ["avg_engagement", "engagement_rate"])) ??
      null,
    verified: typeof verifiedRaw === "boolean" ? verifiedRaw : null,
  };
}

/**
 * Derives the shared profile-level fields (followers, avatar, etc.) from
 * the first post in a Bright Data discovery result — every post for one
 * profile carries the same profile-level fields.
 * @param {RawBrightDataPost[]} posts Raw posts for one Instagram account.
 * @param {string} igHandle The handle these posts were fetched for.
 * @return {ProfileUpsertData} Mapped profile fields ready to persist.
 */
export function extractProfileData(
  posts: RawBrightDataPost[],
  igHandle: string,
  profileType = "competitor"
): ProfileUpsertData {
  const sample = posts[0] as Record<string, unknown> | undefined;

  return {
    igHandle,
    type: profileType,
    name: igHandle,
    avatarUrl: (sample?.profile_image_link as string) ?? null,
    followers: (sample?.followers as number) ?? null,
    followings: (sample?.following as number) ?? (sample?.following_count as number) ?? null,
    postsCount: (sample?.posts_count as number) ?? null,
    verified: (sample?.is_verified as boolean) ?? null,
    avgEngagementRate: calculateAvgEngagementRate(
      posts,
      (sample?.followers as number) ?? null
    ),
  };
}

/**
 * @param {RawBrightDataPost[]} posts Raw posts to average across.
 * @param {number | null} followers Follower count to divide by.
 * @return {number | null} Average engagement rate percent, or null if
 *   followers is unknown/zero.
 */
export function calculateAvgEngagementRate(
  posts: RawBrightDataPost[],
  followers: number | null
): number | null {
  if (!followers) return null;
  const rates = posts.map((p) =>
    ((p.likes ?? 0) + (p.num_comments ?? 0)) / followers * 100
  );
  if (rates.length === 0) return null;
  return rates.reduce((a, b) => a + b, 0) / rates.length;
}

/**
 * Maps one raw Bright Data post record onto our global `Post` schema.
 * @param {RawBrightDataPost} post Raw post record.
 * @param {string} profileId Owning global Profile row id.
 * @param {number | null} followers Profile followers, for engagement calc.
 * @return {PostUpsertData | null} The row to upsert, or null if unusable
 *   (missing the fields required to dedupe/display it).
 */
function normalizePostedAt(value: string): string {
  return value.includes("T") ? value : new Date(value).toISOString();
}

export function toPostUpsertData(
  post: RawBrightDataPost,
  profileId: string,
  followers: number | null
): PostUpsertData | null {
  const url = post.url;
  if (!url) return null;

  const postIdRaw = post.post_id ?? post.id;
  const postId = postIdRaw != null ? String(postIdRaw) : null;
  const shortcode =
    post.shortcode ?? shortcodeFromInstagramUrl(url) ?? postId;
  const datePosted = post.date_posted ?? post.datetime;

  if (!postId || !shortcode || !datePosted) return null;

  const likes = post.likes ?? 0;
  const comments = post.num_comments ?? 0;
  const videoViews = post.video_play_count ?? post.video_view_count ?? null;
  const estimatedViews = videoViews ?? likes * ESTIMATED_VIEWS_MULTIPLIER;

  return {
    profileId,
    postUrl: url,
    postId,
    shortcode,
    caption: post.description ?? null,
    type: post.content_type ?? "Image",
    thumbnailUrl: post.thumbnail ?? post.image_url ?? null,
    mediaUrls: [...(post.photos ?? []), ...(post.videos ?? [])],
    likes,
    comments,
    hashtags: post.hashtags ?? [],
    collaborators: post.coauthor_producers ?? [],
    videoPlayCount: videoViews,
    estimatedViews,
    engagementRatePercent: followers ?
      (likes + comments) / followers * 100 :
      null,
    estimatedReach: estimatedViews,
    postedAt: normalizePostedAt(datePosted),
    source: "brightdata",
  };
}

import type { Creator } from "./types";

/** Maps a raw Bright Data / Firestore `Influencer` collection record (POST /discovery bulk
 * search result) into the UI-facing Creator shape — field names vary across the two sources
 * this endpoint can return, so each field tries a few aliases. */
export const mapProfileToCreator = (raw: Record<string, unknown>): Creator => {
  const handle = String(raw.account ?? raw.username ?? raw.handle ?? "");
  const name = String(raw.full_name ?? raw.profile_name ?? raw.name ?? handle);
  const followers = Number(raw.followers ?? raw.followers_count ?? 0);
  const following = Number(raw.following ?? raw.following_count ?? 0);
  const posts = Number(raw.posts_count ?? raw.media_count ?? 0);
  const er = Number(raw.engagement_rate ?? raw.avg_engagement ?? 0);
  const hashtags: string[] = Array.isArray(raw.post_hashtags)
    ? (raw.post_hashtags as string[])
    : [];

  return {
    id: String(raw.id ?? raw.input ?? handle),
    name,
    handle,
    niche: hashtags[0] ?? "",
    location: String(raw.city ?? raw.country ?? raw.location ?? ""),
    verified: Boolean(raw.is_verified ?? raw.verified ?? false),
    followersNum: followers,
    followingNum: following,
    erNum: er,
    avgLikesNum: Number(raw.avg_likes ?? 0),
    avgCommentsNum: Number(raw.avg_comments ?? 0),
    postsWeekNum: 0,
    totalPostsNum: posts,
    pctReels: 0,
    pctStatic: 0,
    pctCarousel: 0,
    tags: hashtags,
    bio: String(raw.biography ?? raw.bio ?? ""),
    themes: [],
    hashtags: [],
    posts: [],
    email: raw.email_address ? String(raw.email_address) : undefined,
  };
};

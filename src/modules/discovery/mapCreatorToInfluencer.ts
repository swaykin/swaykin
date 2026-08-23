import type { Influencer, InfluencerHashtag, InfluencerPost } from "@/mocks/discovery";
import type { CreatorLookupResponse, CreatorPost } from "./types";

const POST_TYPE_LABEL: Record<string, InfluencerPost["type"]> = {
  Reel: "Reel",
  Carousel: "Carousel",
  Image: "Post",
};

const POST_TYPE_ICON: Record<InfluencerPost["type"], string> = {
  Reel: "ph-play",
  Carousel: "ph-images",
  Post: "ph-image",
};

const formatRelativeDate = (iso: string) => {
  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000),
  );
  if (days === 0) return "Today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const stripHash = (tag: string) => tag.replace(/^#/, "");

const mapPost = (post: CreatorPost): InfluencerPost => {
  const type = POST_TYPE_LABEL[post.type] ?? "Post";
  return {
    type,
    icon: POST_TYPE_ICON[type],
    date: formatRelativeDate(post.postedAt),
    likes: post.likes ?? 0,
    comments: post.comments ?? 0,
    views: post.estimatedViews ?? post.videoPlayCount ?? 0,
    caption: post.caption ?? undefined,
    hashtags: post.hashtags.map(stripHash),
    postUrl: post.postUrl,
  };
};

const average = (values: number[]) =>
  values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;

const pct = (count: number, total: number) =>
  total ? Math.round((count / total) * 100) : 0;

const topHashtags = (
  profileHashtags: string[],
  posts: CreatorPost[],
): InfluencerHashtag[] => {
  if (profileHashtags.length) {
    return profileHashtags.slice(0, 5).map((tag) => ({ tag: stripHash(tag), uses: 0 }));
  }
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.hashtags.map(stripHash)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, uses]) => ({ tag, uses }));
};

/** Adapts the real /creator API response into the shape DetailView expects — fields BrightData
 * doesn't return (niche, location, tags, themes, followingNum) are left empty/zero rather than
 * guessed, since DetailView renders them conditionally or not at all. */
export const mapCreatorToInfluencer = ({
  profile,
  posts,
}: CreatorLookupResponse): Influencer => {
  const reels = posts.filter((post) => post.type === "Reel").length;
  const carousels = posts.filter((post) => post.type === "Carousel").length;
  const images = posts.length - reels - carousels;

  return {
    id: profile.id,
    name: profile.name,
    handle: profile.igUsername,
    niche: "",
    verified: profile.verified ?? false,
    followersNum: profile.followers ?? 0,
    followingNum: profile.followings ?? 0,
    erNum: profile.avgEngagementRate ?? 0,
    avgLikesNum: average(posts.map((post) => post.likes ?? 0)),
    avgCommentsNum: average(posts.map((post) => post.comments ?? 0)),
    postsWeekNum: 0,
    totalPostsNum: profile.postsCount ?? posts.length,
    pctReels: pct(reels, posts.length),
    pctStatic: pct(images, posts.length),
    pctCarousel: pct(carousels, posts.length),
    tags: [],
    bio: profile.bio ?? "",
    themes: [],
    hashtags: topHashtags(profile.topHashtags, posts),
    posts: posts.map(mapPost),
    email: profile.email ?? undefined,
  };
};

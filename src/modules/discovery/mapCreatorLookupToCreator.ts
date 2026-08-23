import type { Post } from "@/infra/components/RecentPostsCard";
import type { Hashtag } from "@/infra/components/TopHashtagsCard";
import { formatPostDate } from "@/lib/format";
import type { Creator, CreatorLookupResponse, CreatorPost, CreatorProfile } from "./types";

const POST_TYPE_LABEL: Record<string, Post["type"]> = {
  Reel: "Reel",
  Carousel: "Carousel",
  Image: "Post",
};

const POST_TYPE_ICON: Record<Post["type"], string> = {
  Reel: "ph-play",
  Carousel: "ph-images",
  Post: "ph-image",
};

const stripHash = (tag: string) => tag.replace(/^#/, "");

const mapPost = (post: CreatorPost): Post => {
  const type = POST_TYPE_LABEL[post.type] ?? "Post";
  return {
    type,
    icon: POST_TYPE_ICON[type],
    date: formatPostDate(post.postedAt),
    likes: post.likes ?? 0,
    comments: post.comments ?? 0,
    views: post.estimatedViews ?? post.videoPlayCount ?? 0,
    caption: post.caption ?? undefined,
    hashtags: post.hashtags.map(stripHash),
    postUrl: post.postUrl,
    thumbnailUrl: post.thumbnailUrl ?? undefined,
  };
};

const average = (values: number[]) =>
  values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;

const pct = (count: number, total: number) =>
  total ? Math.round((count / total) * 100) : 0;

const topHashtags = (
  profileHashtags: CreatorProfile["topHashtags"],
  posts: CreatorPost[],
): Hashtag[] => {
  if (profileHashtags.length) {
    return profileHashtags
      .slice(0, 5)
      .map(({ tag, count }) => ({ tag: stripHash(tag), uses: count }));
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
export const mapCreatorLookupToCreator = ({
  profile,
  posts,
}: CreatorLookupResponse): Creator => {
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

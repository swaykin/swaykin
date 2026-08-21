import type { Collaboration } from "@/mocks/competitors";
import { formatCompactNumber } from "@/lib/format";
import type { DeepdiveCompetitor, DeepdivePost } from "./hooks/useCompetitorDeepdive";
import type { CompareBrand, CompareCompetitor } from "./hooks/useCompetitorCompare";
import type { ColoredBrandMetrics, ColoredCompetitor } from "./types";

const NO_DATA = "—";

const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const postTypeMeta = (type: string) => {
  if (type === "Reel") return { type: "Reel", icon: "ph-play" };
  if (type === "Carousel") return { type: "Carousel", icon: "ph-square-half" };
  return { type: "Static", icon: "ph-image" };
};

const mapPost = (post: DeepdivePost) => ({
  ...postTypeMeta(post.type),
  date: formatShortDate(post.postedAt),
  likes: post.likes ?? 0,
  comments: post.comments ?? 0,
  views: post.estimatedViews ?? 0,
  hashtags: post.hashtags.map((tag) => tag.replace(/^#/, "")),
  postUrl: post.postUrl,
});

const computeContentBreakdown = (posts: DeepdivePost[]) => {
  if (posts.length === 0) return { pctReels: 0, pctCarousel: 0, pctStatic: 0 };
  const reels = posts.filter((p) => p.type === "Reel").length;
  const carousels = posts.filter((p) => p.type === "Carousel").length;
  return {
    pctReels: Math.round((reels / posts.length) * 100),
    pctCarousel: Math.round((carousels / posts.length) * 100),
    pctStatic: Math.round(((posts.length - reels - carousels) / posts.length) * 100),
  };
};

/** Adapts GET /competitors/deepdive's response into the shape DeepDiveView expects. Fields the
 * endpoint doesn't return — growth, avg reach, benchmark vs. your brand, and per-collaborator
 * tier/engagement/last-collab-date — have no real data source yet, so they're placeholders
 * ("—" / 0) rather than guessed. Content-type % is computed client-side from recentPosts since
 * that's genuinely derivable, unlike the others. */
export const mapDeepdiveToColoredCompetitor = (
  data: DeepdiveCompetitor,
  color: string,
  tint: string,
): ColoredCompetitor => {
  const { pctReels, pctCarousel, pctStatic } = computeContentBreakdown(data.recentPosts);
  const engagementNum = data.avgEngagementRate ?? 0;
  const collabs: Collaboration[] = data.collaborators.map(({ handle }) => ({
    name: handle,
    tier: NO_DATA,
    eng: NO_DATA,
    lastDate: NO_DATA,
    worksWithYou: false,
  }));

  return {
    key: data.profileId,
    name: data.name,
    handle: data.igUsername,
    followers: data.followers !== null ? formatCompactNumber(data.followers) : NO_DATA,
    growth30: NO_DATA,
    growth90: NO_DATA,
    engagement: `${engagementNum}%`,
    engagementNum,
    postFreq: `${data.postingFrequencyPerWeek}/wk`,
    postFreqNum: data.postingFrequencyPerWeek,
    avgReach: NO_DATA,
    avgReachNum: 0,
    activeCollabs: data.collaborators.length,
    bio: data.bio ?? "",
    isVerified: data.verified ?? false,
    brandTags: [],
    benchmarkGood: true,
    benchmarkDelta: NO_DATA,
    pctReels,
    pctCarousel,
    pctStatic,
    posts: data.recentPosts.map(mapPost),
    collabs,
    hashtags: data.topHashtags.map((tag) => ({ tag: tag.replace(/^#/, ""), uses: 0 })),
    hashtagNote: "",
    color,
    tint,
  };
};

const brandMetricsFields = (metrics: {
  followers: number | null;
  engagementRate: number | null;
  postingFrequencyPerWeek: number | null;
  activeCollaborations: number | null;
  avgReachPerPost: number | null;
  contentBreakdown: { reelsPct: number; staticPct: number; carouselPct: number } | null;
}) => ({
  // Numeric fields fall back to NaN, not 0, when the backend sent null — buildCompareRows
  // renders NaN as "—" instead of formatting it, so a real measured zero (e.g. 0 collabs) still
  // reads as "0" while genuinely missing data (e.g. this workspace's brand profile) doesn't get
  // misrepresented as a fabricated zero.
  followers: metrics.followers !== null ? formatCompactNumber(metrics.followers) : NO_DATA,
  growth30: NO_DATA,
  growth90: NO_DATA,
  engagement: metrics.engagementRate !== null ? `${metrics.engagementRate}%` : NO_DATA,
  engagementNum: metrics.engagementRate ?? NaN,
  postFreq: metrics.postingFrequencyPerWeek !== null ? `${metrics.postingFrequencyPerWeek}/wk` : NO_DATA,
  postFreqNum: metrics.postingFrequencyPerWeek ?? NaN,
  avgReach:
    metrics.avgReachPerPost !== null ? formatCompactNumber(metrics.avgReachPerPost) : NO_DATA,
  avgReachNum: metrics.avgReachPerPost ?? NaN,
  activeCollabs: metrics.activeCollaborations ?? NaN,
  pctReels: metrics.contentBreakdown?.reelsPct ?? 0,
  pctCarousel: metrics.contentBreakdown?.carouselPct ?? 0,
  pctStatic: metrics.contentBreakdown?.staticPct ?? 0,
});

/** Adapts one entry of POST /competitor/compare's `competitors` array. Bio, verification,
 * hashtags, collaborator details, and posts aren't part of this endpoint's response (that's
 * competitorDeepdive's job) — placeholders here, same reasoning as mapDeepdiveToColoredCompetitor. */
export const mapCompareToColoredCompetitor = (
  data: CompareCompetitor,
  color: string,
  tint: string,
): ColoredCompetitor => ({
  key: data.igUsername,
  name: data.igUsername,
  handle: data.igUsername,
  ...brandMetricsFields(data),
  bio: "",
  isVerified: false,
  brandTags: [],
  benchmarkGood: true,
  benchmarkDelta: NO_DATA,
  posts: [],
  collabs: [],
  hashtags: [],
  hashtagNote: "",
  color,
  tint,
});

/** Adapts POST /competitor/compare's `myBrand` — the workspace's own brand, shown as the "you"
 * column. Fixed accent color (not hashed) since it's always the same identity, not one of many
 * interchangeable competitors. */
export const mapMyBrandToColoredBrandMetrics = (data: CompareBrand): ColoredBrandMetrics => ({
  key: "you",
  name: data.name ?? "Your brand",
  handle: data.igUsername ?? "",
  ...brandMetricsFields(data),
  color: "var(--sk-accent)",
  tint: "var(--sk-accent-subtle)",
});

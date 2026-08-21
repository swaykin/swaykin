import type { Post as ContentPost } from "@/infra/components/RecentPostsCard";
import type { Hashtag as CompetitorHashtag } from "@/infra/components/TopHashtagsCard";

export type { ContentPost, CompetitorHashtag };

// Mock data has been removed — the competitors module runs on real data now (useTrackedCompetitors,
// useCompetitorCompare, useCompetitorsDeepdive). These type definitions are kept as the shared
// shape modules/competitors/types.ts builds on.

export type Collaboration = {
  name: string;
  tier: string;
  eng: string;
  lastDate: string;
  worksWithYou: boolean;
};

export type BrandMetrics = {
  key: string;
  name: string;
  handle: string;
  followers: string;
  engagement: string;
  engagementNum: number;
  growth30: string;
  growth90: string;
  postFreq: string;
  postFreqNum: number;
  avgReach: string;
  avgReachNum: number;
  activeCollabs: number;
  pctReels: number;
  pctCarousel: number;
  pctStatic: number;
};

export type Competitor = BrandMetrics & {
  bio: string;
  isVerified: boolean;
  brandTags: string[];
  benchmarkGood: boolean;
  benchmarkDelta: string;
  posts: ContentPost[];
  collabs: Collaboration[];
  hashtags: CompetitorHashtag[];
  hashtagNote: string;
};

export type CompetitorAlert = {
  competitorKey: string;
  brand: string;
  text: string;
  time: string;
  icon: string;
};

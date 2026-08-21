export type DiscoveryFilters = {
  hasEmail: boolean;
  isVerified: boolean;
  bookmarked: boolean;
  hashtags: string[];
  categories: string[];
  locations: string[];
  followers: [string, string];
  engagementRate: [string, string];
};

export type { Influencer } from "@/mocks/discovery";

/** Response shape of POST /creator, captured from the live endpoint — the version in
 * functions/src/creator/creator.ts is stale and doesn't match what's actually deployed. */
export type CreatorProfile = {
  id: string;
  igUsername: string;
  profileUrl: string;
  name: string;
  type: string;
  bio: string | null;
  avatarUrl: string | null;
  followers: number | null;
  followings: number | null;
  postsCount: number | null;
  avgEngagementRate: number | null;
  verified: boolean | null;
  email: string | null;
  /** Includes the leading "#". */
  topHashtags: string[];
  collaborators: string[];
};

export type CreatorPost = {
  id: string;
  postUrl: string;
  shortcode: string;
  caption: string | null;
  type: string;
  thumbnailUrl: string | null;
  mediaUrls: string[];
  likes: number | null;
  comments: number | null;
  /** Includes the leading "#". */
  hashtags: string[];
  collaborators: string[];
  videoPlayCount: number | null;
  estimatedViews: number | null;
  engagementRatePercent: number | null;
  postedAt: string;
};

export type CreatorLookupResponse = {
  profile: CreatorProfile;
  posts: CreatorPost[];
};

/** Owned here (not by `mocks/savedSearches.ts`) since it embeds `DiscoveryFilters` — a
 * module-level concept the mocks layer shouldn't need to know about. */
export type SavedSearch = {
  id: string;
  name: string;
  desc: string;
  filters: DiscoveryFilters;
};

export type NumericRangeFilter = {
  key: string;
  label: string;
  icon: string;
  /** "integer" restricts input to positive whole numbers, "decimal" allows a single decimal point. */
  valueType: "integer" | "decimal";
  minVal: string;
  maxVal: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
};

import type { Post } from "@/infra/components/RecentPostsCard";
import type { Hashtag } from "@/infra/components/TopHashtagsCard";
import type { SavedStatus } from "@/modules/saved/constants";

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

export type BrandCollaboration = {
  brand: string;
  date: string;
  via: string;
  reach: number;
  emv: number;
  likes: number;
  comments: number;
  logoColor: string;
};

export type Creator = {
  id: string;
  name: string;
  handle: string;
  niche: string;
  location?: string;
  verified: boolean;
  followersNum: number;
  followingNum: number;
  erNum: number;
  avgLikesNum: number;
  avgCommentsNum: number;
  postsWeekNum: number;
  totalPostsNum: number;
  pctReels: number;
  pctStatic: number;
  pctCarousel: number;
  tags: string[];
  bio: string;
  /** Content themes inferred from captions/hashtags, and top hashtags ranked by usage —
   * shown unconditionally in the Detail View, unlike the optional contact/collab fields below. */
  themes: string[];
  hashtags: Hashtag[];
  posts: Post[];
  /** Literal values on a couple of mocks only — presence of the field is the signal, no
   * separate hasEmail/hasPhone/hasAddress/hasCollabs booleans to keep in sync. Address
   * reuses `location`. */
  email?: string;
  phone?: string;
  collabs?: BrandCollaboration[];
  /** Saved Influencers page fields — literal values only on mocks pre-seeded as saved;
   * presence of `savedDaysAgo` is the "is saved" signal, no separate isSaved boolean. */
  lists?: string[];
  status?: SavedStatus;
  savedDaysAgo?: number;
  newPostsCount?: number;
  followerChangePct?: number;
  erChangePts?: number;
};

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
  /** `tag` includes the leading "#". */
  topHashtags: { tag: string; count: number }[];
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

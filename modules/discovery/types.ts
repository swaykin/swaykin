export type DiscoveryFilters = {
  hasEmail: boolean;
  isVerified: boolean;
  hashtags: string[];
  categories: string[];
  locations: string[];
  followers: [string, string];
  engagementRate: [string, string];
};

export type { Influencer } from "@/mocks/discovery";

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

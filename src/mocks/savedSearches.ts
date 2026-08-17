import type { SavedSearch } from "@/modules/discovery/types";

export const mockSavedSearches: SavedSearch[] = [
  {
    id: "skincare-mumbai",
    name: "Skincare, Mumbai",
    desc: "Skincare · Mumbai · 4%+ engagement",
    filters: {
      hasEmail: false,
      isVerified: false,
      hashtags: [],
      categories: ["Skincare"],
      locations: ["Mumbai"],
      followers: ["", ""],
      engagementRate: ["4", ""],
    },
  },
  {
    id: "verified-micro",
    name: "Verified micro-influencers",
    desc: "Verified only · 50K–200K followers",
    filters: {
      hasEmail: false,
      isVerified: true,
      hashtags: [],
      categories: [],
      locations: [],
      followers: ["50000", "200000"],
      engagementRate: ["", ""],
    },
  },
];

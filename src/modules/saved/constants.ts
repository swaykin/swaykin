export type SavedListOption = {
  name: string;
  count: number;
};

/** Hardcoded for the standalone top-bar preview — will come from real saved-influencer
 * data once the list/status model is wired up. */
export const LIST_OPTIONS: SavedListOption[] = [
  { name: "Q3 Skincare Candidates", count: 5 },
  { name: "Fitness & Grooming Watch", count: 3 },
  { name: "Fashion Edit Shortlist", count: 1 },
];

export const STATUS_OPTIONS = [
  "Not Contacted",
  "Contacted",
  "In Discussion",
  "Confirmed",
  "Active",
  "Declined",
] as const;

export type SavedStatus = (typeof STATUS_OPTIONS)[number];

export const STATUS_META: Record<SavedStatus, { bg: string; color: string }> = {
  "Not Contacted": {
    bg: "var(--sk-surface-sunken)",
    color: "var(--sk-text-secondary)",
  },
  Contacted: { bg: "var(--blue-50)", color: "var(--blue-600)" },
  "In Discussion": { bg: "var(--orange-100)", color: "var(--orange-700)" },
  Confirmed: {
    bg: "var(--sk-accent-subtle)",
    color: "var(--sk-accent-strong)",
  },
  Active: { bg: "var(--green-50)", color: "var(--green-700)" },
  Declined: { bg: "var(--pink-100)", color: "var(--pink-600)" },
};

export type SavedSortOption = {
  key: string;
  label: string;
};

export const SORT_OPTIONS: SavedSortOption[] = [
  { key: "savedDesc", label: "Recently saved" },
  { key: "followerGrowth", label: "Follower growth" },
  { key: "erChange", label: "Engagement change" },
  { key: "followers", label: "Follower count" },
];

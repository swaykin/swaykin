export type BrandKey = "you" | "mamaearth" | "plum" | "minimalist";

export type Brand = {
  key: BrandKey;
  name: string;
  color: string;
  tint: string;
};

export const BRANDS: Brand[] = [
  { key: "you", name: "Nova Beauty (you)", color: "var(--sk-accent)", tint: "var(--sk-accent-subtle)" },
  { key: "mamaearth", name: "Mamaearth", color: "var(--pink-500)", tint: "var(--pink-50)" },
  { key: "plum", name: "Plum Goodness", color: "var(--teal-500)", tint: "var(--teal-50)" },
  { key: "minimalist", name: "Minimalist", color: "var(--orange-500)", tint: "var(--orange-100)" },
];

export const INITIAL_BRAND_ACTIVE: Record<BrandKey, boolean> = {
  you: true,
  mamaearth: true,
  plum: true,
  minimalist: false,
};

export type EngagementRow = {
  key: BrandKey;
  name: string;
  value: string;
  pct: number;
  color: string;
};

export const ENGAGEMENT_COMPARE: EngagementRow[] = [
  { key: "you", name: "Nova Beauty (you)", value: "5.6%", pct: 56, color: "var(--sk-accent)" },
  { key: "mamaearth", name: "Mamaearth", value: "4.1%", pct: 41, color: "var(--pink-500)" },
  { key: "plum", name: "Plum Goodness", value: "6.8%", pct: 68, color: "var(--teal-500)" },
];

export type CompetitorContent = {
  brand: string;
  bg: string;
  icon: string;
  iconColor: string;
  likes: string;
  type: string;
};

export const COMPETITOR_CONTENT: CompetitorContent[] = [
  { brand: "Mamaearth", bg: "var(--pink-100)", icon: "ph-play", iconColor: "var(--pink-600)", likes: "14.2K", type: "Reel" },
  { brand: "Mamaearth", bg: "var(--pink-50)", icon: "ph-image", iconColor: "var(--pink-600)", likes: "9.1K", type: "Post" },
  { brand: "Plum", bg: "var(--teal-100)", icon: "ph-play", iconColor: "var(--teal-600)", likes: "11.8K", type: "Reel" },
  { brand: "Plum", bg: "var(--teal-50)", icon: "ph-image", iconColor: "var(--teal-600)", likes: "7.4K", type: "Post" },
  { brand: "Minimalist", bg: "var(--orange-100)", icon: "ph-play", iconColor: "var(--orange-700)", likes: "8.9K", type: "Reel" },
  { brand: "You", bg: "var(--sk-accent-subtle)", icon: "ph-play", iconColor: "var(--sk-accent-strong)", likes: "12.4K", type: "Reel" },
];

export const HASHTAGS: string[] = [
  "skincare",
  "cleanbeauty",
  "glowup",
  "monsoonskin",
  "derminfluencer",
  "sponsored",
  "skinbarrier",
  "novabeauty",
];

export const THEMES: string[] = ["Product reviews", "Get-ready-with-me", "Ingredient breakdowns", "Before/after"];

const HEAT_VALUES: number[] = [
  0, 1, 2, 1, 0, 3, 4,
  1, 2, 3, 2, 1, 4, 4,
  0, 1, 1, 2, 3, 4, 3,
  1, 0, 2, 1, 2, 3, 4,
];

function heatmapColor(v: number): string {
  if (v === 0) return "var(--sk-surface-sunken)";
  const map: Record<number, string> = {
    1: "var(--violet-100)",
    2: "var(--violet-300)",
    3: "var(--violet-500)",
    4: "var(--violet-700)",
  };
  return map[v] ?? "var(--violet-700)";
}

export const HEATMAP: { color: string }[] = HEAT_VALUES.map((v) => ({ color: heatmapColor(v) }));

export const DAY_LABELS: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export type TimelineEvent = {
  brand: string;
  event: string;
  date: string;
  color: string;
};

export const TIMELINE: TimelineEvent[] = [
  { brand: "Mamaearth", event: "launched a 40-creator Diwali campaign", date: "Jul 2, 2026", color: "var(--pink-500)" },
  { brand: "Plum Goodness", event: "signed 3 new long-term ambassadors", date: "Jun 24, 2026", color: "var(--teal-500)" },
  { brand: "You", event: 'ran "Monsoon Glow Launch" with 18 creators', date: "Jun 18, 2026", color: "var(--sk-accent)" },
  { brand: "Minimalist", event: "increased Reels cadence by 60%", date: "Jun 10, 2026", color: "var(--orange-500)" },
];

export const ADD_COMPETITOR_TOAST = "Competitor added — crunching their last 90 days of data…";
export const ADD_BRAND_TOAST = "Add brand coming soon";

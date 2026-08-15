import type { CompareMetric } from "./types";

export const DEFAULT_SELECTED_COMPETITORS: Record<string, boolean> = {
  mamaearth: true,
  plum: true,
  minimalist: true,
  wow: false,
};

export const COMPARE_METRICS: CompareMetric[] = [
  {
    label: "Engagement rate",
    key: "engagementNum",
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    label: "Follower growth (30d)",
    key: "growth30",
    raw: true,
    format: String,
  },
  {
    label: "Follower growth (90d)",
    key: "growth90",
    raw: true,
    format: String,
  },
  {
    label: "Posting frequency",
    key: "postFreqNum",
    format: (v) => `${v.toFixed(1)}/wk`,
  },
  {
    label: "Avg. reach per post",
    key: "avgReachNum",
    format: (v) => `${Math.round(v / 1000)}K`,
  },
  {
    label: "Active collaborations",
    key: "activeCollabs",
    format: (v) => String(v),
  },
];

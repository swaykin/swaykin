import type { CompareMetric } from "./types";

/** Empty — real tracked-competitor keys aren't known ahead of time. useCompareSelection
 * defaults to "all selected" until the user explicitly customizes it. */
export const DEFAULT_SELECTED_COMPETITORS: Record<string, boolean> = {};

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

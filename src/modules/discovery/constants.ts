import { formatCompactNumber } from "@/lib/format";
import type { Creator } from "./types";

export type CompareMetric = {
  label: string;
  key: keyof Creator;
  format: (value: number) => string;
};

export const COMPARE_METRICS: CompareMetric[] = [
  { label: "Followers", key: "followersNum", format: formatCompactNumber },
  { label: "Engagement rate", key: "erNum", format: (v) => `${v.toFixed(1)}%` },
  {
    label: "Avg. likes per post",
    key: "avgLikesNum",
    format: formatCompactNumber,
  },
  {
    label: "Avg. comments per post",
    key: "avgCommentsNum",
    format: formatCompactNumber,
  },
  {
    label: "Posting frequency",
    key: "postsWeekNum",
    format: (v) => `${v.toFixed(1)}/wk`,
  },
  {
    label: "Total posts",
    key: "totalPostsNum",
    format: (v) => v.toLocaleString(),
  },
];

export const MIN_COMPARE_SELECTION = 2;
export const MAX_COMPARE_SELECTION = 10;

import type { EntityColor } from "@/lib/entityColor";
import type { BrandMetrics, Competitor, CompetitorAlert } from "@/mocks/competitors";

/** UI-enriched shapes — `color`/`tint` are assigned in `useGetCompetitors`, never stored in the mock data. */
export type ColoredBrandMetrics = BrandMetrics & EntityColor;
export type ColoredCompetitor = Competitor & EntityColor;
export type ColoredCompetitorAlert = CompetitorAlert & EntityColor;

export type CompareCell = {
  value: string;
  isBest: boolean;
};

export type CompareRow = {
  label: string;
  cells: CompareCell[];
};

export type CompareMetricKey =
  | "engagementNum"
  | "growth30"
  | "growth90"
  | "postFreqNum"
  | "avgReachNum"
  | "activeCollabs";

export type CompareMetric = {
  label: string;
  key: CompareMetricKey;
  raw?: boolean;
  format: (value: number) => string;
};

import type { CompareTableRow } from "@/infra/components/CompareTable";
import { COMPARE_METRICS } from "./constants";
import type { Creator, DiscoveryFilters } from "./types";

export const buildCompareRows = (cols: Creator[]): CompareTableRow[] =>
  COMPARE_METRICS.map((metric) => {
    const values = cols.map((col) => col[metric.key] as number);
    const best = Math.max(...values);
    return {
      label: metric.label,
      cells: cols.map((col, i) => ({
        value: metric.format(values[i]),
        isBest: values[i] === best,
      })),
    };
  });

const inRange = (value: number, minStr: string, maxStr: string): boolean => {
  if (minStr !== "" && value < parseFloat(minStr)) return false;
  if (maxStr !== "" && value > parseFloat(maxStr)) return false;
  return true;
};

export const filterCreators = (
  creators: Creator[],
  filters: DiscoveryFilters,
): Creator[] =>
  creators.filter((inf) => {
    if (filters.categories.length && !filters.categories.includes(inf.niche)) {
      return false;
    }
    if (
      filters.locations.length &&
      !(inf.location && filters.locations.includes(inf.location))
    ) {
      return false;
    }
    if (
      filters.hashtags.length &&
      !filters.hashtags.some((tag) => inf.tags.includes(tag.toLowerCase()))
    ) {
      return false;
    }
    if (!inRange(inf.followersNum, filters.followers[0], filters.followers[1])) {
      return false;
    }
    if (
      !inRange(inf.erNum, filters.engagementRate[0], filters.engagementRate[1])
    ) {
      return false;
    }
    if (filters.hasEmail && !inf.email) return false;
    if (filters.isVerified && !inf.verified) return false;
    return true;
  });

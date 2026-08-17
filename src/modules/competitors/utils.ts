import type { BrandMetrics } from "@/mocks/competitors";
import { COMPARE_METRICS } from "./constants";
import type { CompareRow } from "./types";

export const buildCompareRows = (cols: BrandMetrics[]): CompareRow[] =>
  COMPARE_METRICS.map((metric) => {
    const numeric = cols.map((col) =>
      metric.raw ? parseFloat(String(col[metric.key])) : (col[metric.key] as number),
    );
    const best = Math.max(...numeric);
    return {
      label: metric.label,
      cells: cols.map((col, i) => ({
        value: metric.raw ? String(col[metric.key]) : metric.format(numeric[i]),
        isBest: numeric[i] === best,
      })),
    };
  });

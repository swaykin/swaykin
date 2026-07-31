import { useMemo } from "react";
import { getEntityColor } from "@/lib/entityColor";
import {
  mockCompetitorAlerts,
  mockCompetitors,
  mockYourBrand,
} from "@/mocks/competitors";
import type {
  ColoredBrandMetrics,
  ColoredCompetitor,
  ColoredCompetitorAlert,
} from "../types";

/**
 * The one seam that reads `mocks/competitors.ts` — everything else goes through this.
 * Also the one place `color`/`tint` get attached, since the backend-shaped mock data never
 * carries color itself (see `lib/entityColor.ts`).
 *
 * The mocks are static module-level data, so these are memoized with empty deps — otherwise
 * every consumer downstream (useCompareSelection, useDeepDiveSelection, ...) sees a new
 * `competitors`/`yourBrand` reference on every render and their own memoization never hits.
 */
export const useGetCompetitors = () => {
  const competitors: ColoredCompetitor[] = useMemo(
    () => mockCompetitors.map((c, i) => ({ ...c, ...getEntityColor(i) })),
    [],
  );

  // "You" always reads as the app's own brand, not a palette color.
  const yourBrand: ColoredBrandMetrics = useMemo(
    () => ({
      ...mockYourBrand,
      color: "var(--sk-accent)",
      tint: "var(--sk-accent-subtle)",
    }),
    [],
  );

  const alerts: ColoredCompetitorAlert[] = useMemo(
    () =>
      mockCompetitorAlerts.map((alert) => {
        const index = mockCompetitors.findIndex(
          (c) => c.key === alert.competitorKey,
        );
        return { ...alert, ...getEntityColor(index) };
      }),
    [],
  );

  return { competitors, yourBrand, alerts };
};

import { useCallback, useMemo } from "react";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { useSnackbar } from "@/infra/baseweb/useSnackbar";
import { DEFAULT_SELECTED_COMPETITORS } from "../../constants";
import type { ColoredBrandMetrics, ColoredCompetitor } from "../../types";
import { buildCompareRows } from "../../utils";

export const useCompareSelection = (
  activeCompetitors: ColoredCompetitor[],
  yourBrand: ColoredBrandMetrics,
  maxTracked: number,
) => {
  const { onError } = useSnackbar();
  const [storedSelected, setStoredSelected] = useLocalStorageState<Record<string, boolean>>(
    "competitors:compareSelected",
    DEFAULT_SELECTED_COMPETITORS,
  );

  // Real tracked-competitor keys aren't known ahead of time, so nothing being stored yet means
  // "not customized" rather than "none selected" — every tracked competitor shows by default.
  const hasCustomSelection = Object.keys(storedSelected).length > 0;
  const selected: Record<string, boolean> = useMemo(
    () =>
      hasCustomSelection
        ? storedSelected
        : Object.fromEntries(activeCompetitors.map((c) => [c.key, true])),
    [hasCustomSelection, storedSelected, activeCompetitors],
  );

  const toggleSelected = useCallback(
    (key: string) => {
      const activeCount = Object.values(selected).filter(Boolean).length;
      if (!selected[key] && activeCount >= maxTracked - 1) {
        onError(
          `You can compare up to ${maxTracked} brands (including yours) at once.`,
        );
        return;
      }
      setStoredSelected(() => ({ ...selected, [key]: !selected[key] }));
    },
    [selected, maxTracked, onError, setStoredSelected],
  );

  // Kept as its own useMemo (rather than folded into compareCols) so a selection change doesn't
  // also invalidate compareCols identity for consumers that only care about the column list.
  const selectedComps = useMemo(
    () => activeCompetitors.filter((c) => selected[c.key]),
    [activeCompetitors, selected],
  );
  const compareCols: ColoredBrandMetrics[] = useMemo(
    () => [yourBrand, ...selectedComps],
    [yourBrand, selectedComps],
  );
  const compareRows = useMemo(
    () => buildCompareRows(compareCols),
    [compareCols],
  );

  return { selected, toggleSelected, compareCols, compareRows };
};

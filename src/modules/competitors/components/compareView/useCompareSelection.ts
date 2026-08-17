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
  const [selected, setSelected] = useLocalStorageState<Record<string, boolean>>(
    "competitors:compareSelected",
    DEFAULT_SELECTED_COMPETITORS,
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
      setSelected((s) => ({ ...s, [key]: !s[key] }));
    },
    [selected, maxTracked, onError, setSelected],
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

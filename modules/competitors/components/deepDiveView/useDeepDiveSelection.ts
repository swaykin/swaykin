import { useMemo } from "react";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import type { ColoredCompetitor } from "../../types";

export const useDeepDiveSelection = (
  activeCompetitors: ColoredCompetitor[],
  allCompetitors: ColoredCompetitor[],
) => {
  const [deepDiveKey, setDeepDiveKey] = useLocalStorageState(
    "competitors:deepDiveKey",
    "mamaearth",
  );

  const activeCompetitor: ColoredCompetitor = useMemo(
    () =>
      activeCompetitors.find((c) => c.key === deepDiveKey) ??
      activeCompetitors[0] ??
      allCompetitors[0],
    [activeCompetitors, allCompetitors, deepDiveKey],
  );

  return { deepDiveKey, setDeepDiveKey, activeCompetitor };
};

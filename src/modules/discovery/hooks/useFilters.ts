import { useCallback, useState } from "react";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import type { DiscoveryFilters } from "../types";

const FILTERS_STORAGE_KEY = "discovery.appliedFilters";

const EMPTY_FILTERS: DiscoveryFilters = {
  hasEmail: false,
  isVerified: false,
  bookmarked: false,
  hashtags: [],
  categories: [],
  locations: [],
  followers: ["", ""],
  engagementRate: ["", ""],
};

export const useFilters = () => {
  const [appliedFilters, setAppliedFilters] =
    useLocalStorageState<DiscoveryFilters>(FILTERS_STORAGE_KEY, EMPTY_FILTERS);

  const [filterState, setFilterState] =
    useState<DiscoveryFilters>(appliedFilters);
  const [dirty, setDirty] = useState(false);

  const onAction = useCallback((patch: Partial<DiscoveryFilters>) => {
    setFilterState((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  }, []);

  const onApply = useCallback(() => {
    setAppliedFilters(filterState);
    setDirty(false);
  }, [filterState, setAppliedFilters]);

  const onRestore = useCallback(() => {
    setFilterState(appliedFilters);
    setDirty(false);
  }, [appliedFilters]);

  const onClearAll = useCallback(() => {
    setFilterState(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setDirty(false);
  }, [setAppliedFilters]);

  /** Overwrites both filter and applied state at once — used when applying a saved search. */
  const onApplySnapshot = useCallback(
    (filters: DiscoveryFilters) => {
      setFilterState(filters);
      setAppliedFilters(filters);
      setDirty(false);
    },
    [setAppliedFilters],
  );

  return {
    appliedFilters,
    filterState,
    dirty,
    onAction,
    onApply,
    onRestore,
    onClearAll,
    onApplySnapshot,
  };
};

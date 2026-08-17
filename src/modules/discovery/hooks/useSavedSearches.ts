import { useCallback, useState } from "react";
import { mockSavedSearches } from "@/mocks/savedSearches";
import type { DiscoveryFilters, SavedSearch } from "../types";

/** The one seam that reads `mocks/savedSearches.ts` — everything else goes through this. */
export const useSavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(mockSavedSearches);
  const [activeId, setActiveId] = useState<string | null>(null);

  const addSavedSearch = useCallback((name: string, filters: DiscoveryFilters) => {
    const saved: SavedSearch = {
      id: crypto.randomUUID(),
      name,
      desc: "Custom filters",
      filters,
    };
    setSavedSearches((prev) => [...prev, saved]);
  }, []);

  const removeSavedSearch = useCallback((id: string) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
    setActiveId((prev) => (prev === id ? null : prev));
  }, []);

  /** Returns the snapshot to apply (undefined if `id` is stale, e.g. just deleted). */
  const applySavedSearch = useCallback(
    (id: string): DiscoveryFilters | undefined => {
      const found = savedSearches.find((s) => s.id === id);
      if (!found) return undefined;
      setActiveId(id);
      return found.filters;
    },
    [savedSearches],
  );

  return {
    savedSearches,
    activeId,
    addSavedSearch,
    removeSavedSearch,
    applySavedSearch,
  };
};

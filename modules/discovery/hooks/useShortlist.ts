import { useCallback } from "react";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

const SHORTLIST_STORAGE_KEY = "discovery.shortlistedInfluencers";

/** Persisted separately from bulk-select — this is "saved to Saved Influencers", not
 * "checked for a Compare/Add-to-campaign action right now". */
export const useShortlist = () => {
  const [shortlisted, setShortlisted] = useLocalStorageState<Record<string, boolean>>(
    SHORTLIST_STORAGE_KEY,
    {},
  );

  const toggleShortlist = useCallback(
    (id: string) => {
      setShortlisted((prev) => ({ ...prev, [id]: !prev[id] }));
    },
    [setShortlisted],
  );

  /** Adds every id, without flipping off ones already shortlisted — for bulk "Save". */
  const shortlistMany = useCallback(
    (ids: string[]) => {
      setShortlisted((prev) => {
        const next = { ...prev };
        ids.forEach((id) => {
          next[id] = true;
        });
        return next;
      });
    },
    [setShortlisted],
  );

  return { shortlisted, toggleShortlist, shortlistMany };
};

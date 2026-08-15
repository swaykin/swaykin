import { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";

const SAVED_INFLUENCERS_STORAGE_KEY = "savedInfluencers";

/** Backs the Saved Influencers page — shared by Discovery (shortlist toggle) and the Detail
 * View (both discovery's and saved's), since "saved" is an influencer-entity concern, not a
 * discovery-search one. */
export const useSavedInfluencers = () => {
  const [savedIds, setSavedIds] = useLocalStorageState<Record<string, boolean>>(
    SAVED_INFLUENCERS_STORAGE_KEY,
    {},
  );

  const toggleSaved = useCallback(
    (id: string) => {
      setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    },
    [setSavedIds],
  );

  /** Adds every id, without flipping off ones already saved — for bulk "Save". */
  const saveMany = useCallback(
    (ids: string[]) => {
      setSavedIds((prev) => {
        const next = { ...prev };
        ids.forEach((id) => {
          next[id] = true;
        });
        return next;
      });
    },
    [setSavedIds],
  );

  return { savedIds, toggleSaved, saveMany };
};

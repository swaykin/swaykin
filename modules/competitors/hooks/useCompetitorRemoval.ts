import { useState } from "react";
import type { ColoredCompetitor } from "../types";

export const useCompetitorRemoval = (competitors: ColoredCompetitor[]) => {
  const [removed, setRemoved] = useState<Record<string, boolean>>({});
  const [confirmRemoveKey, setConfirmRemoveKey] = useState<string | null>(null);

  const requestRemove = (key: string) => setConfirmRemoveKey(key);
  const cancelRemove = () => setConfirmRemoveKey(null);

  /** Marks the pending competitor as removed and returns its key, or null if none was pending. */
  const removeNow = (): string | null => {
    if (!confirmRemoveKey) return null;
    const key = confirmRemoveKey;
    setRemoved((r) => ({ ...r, [key]: true }));
    setConfirmRemoveKey(null);
    return key;
  };

  const confirmRemoveName = confirmRemoveKey
    ? (competitors.find((c) => c.key === confirmRemoveKey)?.name ?? "")
    : "";

  return {
    removed,
    confirmRemoveKey,
    confirmRemoveName,
    requestRemove,
    cancelRemove,
    removeNow,
  };
};

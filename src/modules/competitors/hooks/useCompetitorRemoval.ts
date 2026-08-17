import { useCallback, useMemo, useState } from "react";
import type { ColoredCompetitor } from "../types";

export const useCompetitorRemoval = (competitors: ColoredCompetitor[]) => {
  const [removed, setRemoved] = useState<Record<string, boolean>>({});
  const [confirmRemoveKey, setConfirmRemoveKey] = useState<string | null>(null);

  const requestRemove = useCallback(
    (key: string) => setConfirmRemoveKey(key),
    [],
  );
  const cancelRemove = useCallback(() => setConfirmRemoveKey(null), []);

  /** Marks the pending competitor as removed and returns its key, or null if none was pending. */
  const removeNow = useCallback((): string | null => {
    if (!confirmRemoveKey) return null;
    const key = confirmRemoveKey;
    setRemoved((r) => ({ ...r, [key]: true }));
    setConfirmRemoveKey(null);
    return key;
  }, [confirmRemoveKey]);

  const confirmRemoveName = useMemo(
    () =>
      confirmRemoveKey
        ? (competitors.find((c) => c.key === confirmRemoveKey)?.name ?? "")
        : "",
    [confirmRemoveKey, competitors],
  );

  return {
    removed,
    confirmRemoveKey,
    confirmRemoveName,
    requestRemove,
    cancelRemove,
    removeNow,
  };
};

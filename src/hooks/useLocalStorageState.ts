import { useEffect, useState } from "react";

/**
 * Same API as `useState`, but persists to `localStorage` under `key` — so state like "which
 * tab was open" survives a reload instead of resetting to the default every time.
 *
 * Starts at `defaultValue` (matches what the server rendered, since `localStorage` isn't
 * available during SSR), then hydrates from storage on mount and writes back on every change
 * after that.
 */
export const useLocalStorageState = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(key);
    if (stored !== null) {
      try {
        setValue(JSON.parse(stored) as T);
      } catch {
        // Malformed/stale value — fall back to the default already set.
      }
    }
    setHydrated(true);
    // Only ever run on mount for this key — re-running on `defaultValue` changes would
    // clobber a value the user already set.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, hydrated]);

  return [value, setValue] as const;
};

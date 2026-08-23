import { useCallback, useMemo } from "react";
import { useMutation } from "@/lib/api/useMutation";
import type { DiscoveryFilters } from "../types";
import { mapProfileToCreator } from "../mapProfileToCreator";
import type { DiscoveryFilterInput } from "./discoveryFilterMapper";
import { buildDiscoveryFilters } from "./discoveryFilterMapper";

interface DiscoveryResponse {
  data: unknown[];
  dbWrite: { insertedCount: number } | { error: string };
}

interface DiscoveryRequest {
  filters: DiscoveryFilterInput[];
  recordsLimit: number;
}

/** Calls Cloud Functions directly (bypassing the v1 proxy's 60s timeout) since a cold
 * Bright Data scrape can poll for several minutes before the snapshot is ready. */
export const useGetCreators = (recordsLimit = 20) => {
  const { data, loading, error, mutate } = useMutation<
    DiscoveryResponse,
    DiscoveryRequest
  >("/discovery", { direct: true });

  const search = useCallback(
    (filters: DiscoveryFilters) => {
      const discoveryFilters = buildDiscoveryFilters(filters);
      if (discoveryFilters.length === 0) return;
      return mutate({ filters: discoveryFilters, recordsLimit });
    },
    [mutate, recordsLimit],
  );

  const creators = useMemo(
    () =>
      (data?.data ?? [])
        .filter(
          (item): item is Record<string, unknown> =>
            typeof item === "object" && item !== null,
        )
        .map(mapProfileToCreator),
    [data],
  );

  return { creators, loading, error, search };
};

import { useMutation } from "@/lib/api/useMutation";
import { useEffect } from "react";

export type CompareContentBreakdown = {
  reelsPct: number;
  staticPct: number;
  carouselPct: number;
};

export type CompareCompetitor = {
  igUsername: string;
  followers: number | null;
  engagementRate: number | null;
  postingFrequencyPerWeek: number | null;
  activeCollaborations: number | null;
  avgReachPerPost: number | null;
  contentBreakdown: CompareContentBreakdown | null;
};

export type CompareBrand = {
  name: string | null;
  igUsername: string | null;
  followers: number | null;
  engagementRate: number | null;
  postingFrequencyPerWeek: number | null;
  activeCollaborations: number | null;
  avgReachPerPost: number | null;
  contentBreakdown: CompareContentBreakdown | null;
};

type CompareResponse = {
  myBrand: CompareBrand;
  competitors: CompareCompetitor[];
};

/** The one seam that reads POST /competitor/compare — computed engagement/reach/content-mix
 * metrics for every active tracked competitor vs. the workspace's own brand, in one call. */
export const useCompetitorCompare = () => {
  const { data, loading, mutate } = useMutation<CompareResponse, Record<string, never>>(
    "/competitor/compare",
  );

  useEffect(() => {
    mutate({});
    // Fetch once on mount, same as a query — mutate's identity is stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    myBrand: data?.myBrand ?? null,
    competitors: data?.competitors ?? [],
    loading,
    refetch: () => mutate({}),
  };
};

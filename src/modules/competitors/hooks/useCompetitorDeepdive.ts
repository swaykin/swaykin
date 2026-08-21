import { useQuery } from "@/lib/api/useQuery";

export type DeepdivePost = {
  postUrl: string;
  type: string;
  likes: number | null;
  comments: number | null;
  estimatedViews: number | null;
  engagementRatePercent: number | null;
  hashtags: string[];
  postedAt: string;
};

export type DeepdiveCompetitor = {
  profileId: string;
  igUsername: string;
  name: string;
  bio: string | null;
  followers: number | null;
  verified: boolean | null;
  avgEngagementRate: number | null;
  postingFrequencyPerWeek: number;
  topHashtags: string[];
  collaborators: { handle: string; postCount: number }[];
  recentPosts: DeepdivePost[];
};

type DeepdiveResponse = { competitors: DeepdiveCompetitor[] };

/** The one seam that reads GET /competitors/deepdive. Omitting `profileIds` returns full data
 * for every active tracked competitor in one call — no need to fetch the lightweight list first
 * and bridge through a profile id. */
export const useCompetitorsDeepdive = () => {
  const { data, loading, error, refetch } = useQuery<DeepdiveResponse>(
    "/competitors/deepdive",
  );

  return {
    competitors: data?.competitors ?? [],
    loading,
    error,
    refetch,
  };
};

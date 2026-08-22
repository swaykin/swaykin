import { useCallback, useState } from "react";
import { api } from "@/lib/api";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import type { DiscoveryFilters, Influencer } from "../types";
import type { DiscoveryFilterInput } from "./discoveryFilterMapper";
import { buildDiscoveryFilters } from "./discoveryFilterMapper";

interface DiscoveryResponse {
  data: unknown[];
  dbWrite: { insertedCount: number } | { error: string };
}

function mapProfileToInfluencer(raw: Record<string, unknown>): Influencer {
  const handle = String(
    raw.account ?? raw.username ?? raw.handle ?? ""
  );
  const name = String(raw.full_name ?? raw.profile_name ?? raw.name ?? handle);
  const followers = Number(raw.followers ?? raw.followers_count ?? 0);
  const following = Number(raw.following ?? raw.following_count ?? 0);
  const posts = Number(raw.posts_count ?? raw.media_count ?? 0);
  const er = Number(raw.engagement_rate ?? raw.avg_engagement ?? 0);
  const hashtags: string[] = Array.isArray(raw.post_hashtags)
    ? (raw.post_hashtags as string[])
    : [];

  return {
    id: String(raw.id ?? raw.input ?? handle),
    name,
    handle,
    niche: hashtags[0] ?? "",
    location: String(raw.city ?? raw.country ?? raw.location ?? ""),
    verified: Boolean(raw.is_verified ?? raw.verified ?? false),
    followersNum: followers,
    followingNum: following,
    erNum: er,
    avgLikesNum: Number(raw.avg_likes ?? 0),
    avgCommentsNum: Number(raw.avg_comments ?? 0),
    postsWeekNum: 0,
    totalPostsNum: posts,
    pctReels: 0,
    pctStatic: 0,
    pctCarousel: 0,
    tags: hashtags,
    bio: String(raw.biography ?? raw.bio ?? ""),
    themes: [],
    hashtags: [],
    posts: [],
    email: raw.email_address ? String(raw.email_address) : undefined,
  };
}

export const useGetInfluencers = (
  filters: DiscoveryFilters,
  recordsLimit = 20,
) => {
  const { user: firebaseUser } = useFirebaseUser();
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!firebaseUser) return;

    const discoveryFilters: DiscoveryFilterInput[] =
      buildDiscoveryFilters(filters);

    if (discoveryFilters.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.post<DiscoveryResponse>("/v1/discovery", {
        filters: discoveryFilters,
        recordsLimit,
      });

      const mapped = (res.data ?? [])
        .filter((item): item is Record<string, unknown> =>
          typeof item === "object" && item !== null
        )
        .map(mapProfileToInfluencer);

      setInfluencers(mapped);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Discovery failed"));
    } finally {
      setLoading(false);
    }
  }, [firebaseUser, filters, recordsLimit]);

  return { influencers, loading, error, refetch: fetch };
};

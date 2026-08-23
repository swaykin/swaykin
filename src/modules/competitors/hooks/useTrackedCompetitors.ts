import { useQuery } from "@/lib/api/useQuery";
import { getEntityColor } from "@/lib/entityColor";
import type { ColoredCompetitorAlert } from "../types";

/** Real shape as returned by GET /competitors today — no id/followers/avatarUrl yet (backend
 * gap, being fixed). `igUsername` isn't in the response either; `name` is the same value until
 * that's added, so it's derived here rather than left missing. */
export type TrackedCompetitor = {
  name: string;
  igUsername: string;
  verified: boolean | null;
  lastStatsUpdatedAt: string | null;
};

type RawTrackedCompetitor = {
  name: string;
  verified: boolean | null;
  lastStatsUpdatedAt: string | null;
};

/** Not returned by /competitors yet — activity feed is planned to ship on this same endpoint,
 * so this type is here ready for when it does rather than guessed at from scratch later. */
type RawCompetitorAlert = {
  competitorKey: string;
  brand: string;
  text: string;
  time: string;
  icon: string;
};

type ListCompetitorsResponse = {
  competitors: RawTrackedCompetitor[];
  alerts?: RawCompetitorAlert[];
};

/** Real tracked-competitor list/count from the backend — used for the "Tracking N" count.
 * Full profile + metrics for Deep Dive come from useCompetitorsDeepdive instead, which fetches
 * everything in one call and doesn't depend on this endpoint's (currently limited) fields. */
export const useTrackedCompetitors = () => {
  const { data, loading, refetch } = useQuery<ListCompetitorsResponse>(
    "/competitors?status=active",
  );

  const competitors: TrackedCompetitor[] = (data?.competitors ?? []).map((c) => ({
    ...c,
    igUsername: c.name,
  }));

  // Hashes competitorKey (expected to be the same igUsername used elsewhere), not the display
  // name, so an alert's color/tint matches that competitor's identity color in Compare/Deep Dive.
  const alerts: ColoredCompetitorAlert[] = (data?.alerts ?? []).map((alert) => ({
    ...alert,
    ...getEntityColor(alert.competitorKey),
  }));

  return {
    competitors,
    count: competitors.length,
    alerts,
    loading,
    refetch,
  };
};

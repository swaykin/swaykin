import { useMemo } from "react";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { PageHeader } from "@/infra/components/PageHeader";
import { getEntityColor } from "@/lib/entityColor";
import { useWorkspaceContext } from "@/providers/WorkspaceProvider";
import { AddCompetitorControl } from "./components/AddCompetitorControl";
import { AlertsGrid } from "./components/AlertsGrid";
import { CompareView } from "./components/compareView";
import { DeepDiveView } from "./components/deepDiveView";
import { ModeTabs } from "./components/ModeTabs";
import { useCompetitorCompare } from "./hooks/useCompetitorCompare";
import { useCompetitorRemoval } from "./hooks/useCompetitorRemoval";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { useTrackedCompetitors } from "./hooks/useTrackedCompetitors";
import { mapCompareToColoredCompetitor, mapMyBrandToColoredBrandMetrics } from "./mapCompetitor";

const Competitors = () => {
  const [tab, setTab] = useLocalStorageState<"compare" | "deepdive">(
    "competitors:tab",
    "compare",
  );
  const {
    workspace: { maxTrackedCompetitors },
  } = useWorkspaceContext();
  const tracked = useTrackedCompetitors();
  const {
    myBrand,
    competitors: rawCompetitors,
    loading,
    refetch: refetchCompare,
  } = useCompetitorCompare();

  const competitors = useMemo(
    () =>
      rawCompetitors.map((c) => {
        const { color, tint } = getEntityColor(c.igUsername);
        return mapCompareToColoredCompetitor(c, color, tint);
      }),
    [rawCompetitors],
  );
  const yourBrand = useMemo(
    () => mapMyBrandToColoredBrandMetrics(myBrand ?? {
      name: null,
      igUsername: null,
      followers: null,
      engagementRate: null,
      postingFrequencyPerWeek: null,
      activeCollaborations: null,
      avgReachPerPost: null,
      contentBreakdown: null,
    }),
    [myBrand],
  );

  const removal = useCompetitorRemoval(competitors);
  const activeCompetitors = useMemo(
    () => competitors.filter((c) => !removal.removed[c.key]),
    [competitors, removal.removed],
  );

  return (
    <Box>
      <PageHeader
        title="Competitors"
        description="Track competitor activity and benchmark against your brand"
      />
      <AddCompetitorControl
        trackedCount={tracked.count}
        maxTracked={maxTrackedCompetitors}
        onAdded={() => {
          tracked.refetch();
          refetchCompare();
        }}
      />
      <AlertsGrid alerts={tracked.alerts} />
      <ModeTabs tab={tab} setTab={setTab} />
      <Box className="px-7 pb-5">
        {loading && competitors.length === 0 ? (
          <Box className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-16 text-sm text-text-secondary">
            <Icon name="ph-circle-notch" size={16} className="animate-spin" />
            Loading competitors…
          </Box>
        ) : tab === "compare" ? (
          <CompareView
            activeCompetitors={activeCompetitors}
            yourBrand={yourBrand}
            maxTracked={maxTrackedCompetitors}
            onRequestRemove={removal.requestRemove}
          />
        ) : (
          <DeepDiveView yourBrand={yourBrand} />
        )}
      </Box>
    </Box>
  );
};

export default Competitors;

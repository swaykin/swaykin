import { useMemo } from "react";
import { Box } from "@/infra/baseweb/Box";
import { PageHeader } from "@/infra/components/PageHeader";
import { useWorkspaceContext } from "@/providers/WorkspaceProvider";
import { AddCompetitorControl } from "./components/AddCompetitorControl";
import { AlertsGrid } from "./components/AlertsGrid";
import { CompareView } from "./components/compareView";
import { DeepDiveView } from "./components/deepDiveView";
import { ModeTabs } from "./components/ModeTabs";
import { useCompetitorRemoval } from "./hooks/useCompetitorRemoval";
import { useCompetitorState } from "./hooks/useCompetitorState";

const Competitors = () => {
  const { tab, setTab, competitors, yourBrand, alerts } = useCompetitorState();
  const {
    workspace: { maxTrackedCompetitors },
  } = useWorkspaceContext();
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
        trackedCount={activeCompetitors.length}
        maxTracked={maxTrackedCompetitors}
      />
      <AlertsGrid alerts={alerts} />
      <ModeTabs tab={tab} setTab={setTab} />
      <Box className="px-7 pb-5">
        {tab === "compare" ? (
          <CompareView
            activeCompetitors={activeCompetitors}
            yourBrand={yourBrand}
            maxTracked={maxTrackedCompetitors}
            onRequestRemove={removal.requestRemove}
          />
        ) : (
          <DeepDiveView
            activeCompetitors={activeCompetitors}
            allCompetitors={competitors}
            yourBrand={yourBrand}
          />
        )}
      </Box>
    </Box>
  );
};

export default Competitors;

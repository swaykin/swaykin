import { Box } from "@/infra/baseweb/Box";
import type { ColoredBrandMetrics, ColoredCompetitor } from "../../types";
import { BioSummaryCard } from "./BioSummaryCard";
import { CollaborationsList } from "./CollaborationsList";
import { CompetitorPillSelector } from "./CompetitorPillSelector";
import { ContentTypeBreakdown } from "./ContentTypeBreakdown";
import { HashtagsPanel } from "./HashtagsPanel";
import { OverviewCards } from "./OverviewCards";
import { RecentPostsGrid } from "./RecentPostsGrid";
import { useDeepDiveSelection } from "./useDeepDiveSelection";

type DeepDiveViewProps = {
  activeCompetitors: ColoredCompetitor[];
  allCompetitors: ColoredCompetitor[];
  yourBrand: ColoredBrandMetrics;
};

export const DeepDiveView = ({
  activeCompetitors,
  allCompetitors,
  yourBrand,
}: DeepDiveViewProps) => {
  const { deepDiveKey, setDeepDiveKey, activeCompetitor } =
    useDeepDiveSelection(activeCompetitors, allCompetitors);

  return (
    <Box className="flex flex-col gap-4">
      <CompetitorPillSelector
        competitors={activeCompetitors}
        activeKey={deepDiveKey}
        onSelect={setDeepDiveKey}
      />
      <BioSummaryCard competitor={activeCompetitor} />
      <OverviewCards
        competitor={activeCompetitor}
        yourBrandName={yourBrand.name}
      />
      <Box className="grid grid-cols-[1.3fr_1fr] items-start gap-4">
        <CollaborationsList collabs={activeCompetitor.collabs} />
        <HashtagsPanel
          hashtags={activeCompetitor.hashtags}
          hashtagNote={activeCompetitor.hashtagNote}
        />
      </Box>
      <RecentPostsGrid competitor={activeCompetitor} />
      <ContentTypeBreakdown competitor={activeCompetitor} />
    </Box>
  );
};

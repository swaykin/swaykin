import { Box } from "@/infra/baseweb/Box";
import { ContentTypeBreakdown } from "@/infra/components/ContentTypeBreakdown";
import { RecentPostsCard } from "@/infra/components/RecentPostsCard";
import { TopHashtagsCard } from "@/infra/components/TopHashtagsCard";
import type { ColoredBrandMetrics, ColoredCompetitor } from "../../types";
import { BioSummaryCard } from "./BioSummaryCard";
import { CollaborationsList } from "./CollaborationsList";
import { CompetitorPillSelector } from "./CompetitorPillSelector";
import { OverviewCards } from "./OverviewCards";
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
    <Box className="flex flex-col gap-5">
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
      <Box className="flex flex-wrap items-start gap-5">
        <Box className="min-w-[380px] flex-[2_1_380px]">
          <CollaborationsList collabs={activeCompetitor.collabs} />
        </Box>
        <Box className="min-w-[260px] flex-[1_1_300px]">
          <TopHashtagsCard
            hashtags={activeCompetitor.hashtags}
            note={activeCompetitor.hashtagNote}
          />
        </Box>
      </Box>
      <RecentPostsCard
        posts={activeCompetitor.posts}
        bgColor={activeCompetitor.tint}
      />
      <ContentTypeBreakdown
        pctReels={activeCompetitor.pctReels}
        pctStatic={activeCompetitor.pctStatic}
        pctCarousel={activeCompetitor.pctCarousel}
      />
    </Box>
  );
};

import { useMemo } from "react";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { ContentTypeBreakdown } from "@/infra/components/ContentTypeBreakdown";
import { RecentPostsCard } from "@/infra/components/RecentPostsCard";
import { TopHashtagsCard } from "@/infra/components/TopHashtagsCard";
import { getEntityColor } from "@/lib/entityColor";
import { useCompetitorsDeepdive } from "../../hooks/useCompetitorDeepdive";
import { mapDeepdiveToColoredCompetitor } from "../../mapCompetitor";
import type { ColoredBrandMetrics } from "../../types";
import { BioSummaryCard } from "./BioSummaryCard";
import { CollaborationsList } from "./CollaborationsList";
import { CompetitorPillSelector } from "./CompetitorPillSelector";
import { OverviewCards } from "./OverviewCards";
import { useDeepDiveSelection } from "./useDeepDiveSelection";

type DeepDiveViewProps = {
  yourBrand: ColoredBrandMetrics;
};

export const DeepDiveView = ({ yourBrand }: DeepDiveViewProps) => {
  const { competitors: rawCompetitors, loading } = useCompetitorsDeepdive();

  const competitors = useMemo(
    () =>
      // Hashes igUsername (not name) so a competitor's identity color/tint matches CompareView,
      // which keys the same way — consistent across both tabs.
      rawCompetitors.map((c) => {
        const { color, tint } = getEntityColor(c.igUsername);
        return mapDeepdiveToColoredCompetitor(c, color, tint);
      }),
    [rawCompetitors],
  );

  const { deepDiveKey, setDeepDiveKey, activeCompetitor } = useDeepDiveSelection(
    competitors,
    competitors,
  );

  if (loading && competitors.length === 0) {
    return (
      <Box className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-16 text-sm text-text-secondary">
        <Icon name="ph-circle-notch" size={16} className="animate-spin" />
        Loading competitors…
      </Box>
    );
  }

  if (competitors.length === 0) {
    return (
      <Box className="flex items-center justify-center rounded-2xl border border-border bg-surface py-16 text-sm text-text-secondary">
        No tracked competitors yet — add one above to see its deep dive.
      </Box>
    );
  }

  return (
    <Box className="flex flex-col gap-5">
      <CompetitorPillSelector
        competitors={competitors}
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

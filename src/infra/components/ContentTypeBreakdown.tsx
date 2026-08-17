import { Box } from "@/infra/baseweb/Box";
import { CAROUSEL, REEL, STATIC } from "@/lib/entityColor";
import { ContentMixLegend } from "./ContentMixLegend";
import { ContentMixSegment } from "./ContentMixSegment";

type ContentTypeBreakdownProps = {
  pctReels: number;
  pctStatic: number;
  pctCarousel: number;
};

export const ContentTypeBreakdown = ({
  pctReels,
  pctStatic,
  pctCarousel,
}: ContentTypeBreakdownProps) => (
  <Box className="rounded-2xl border border-border bg-surface p-5 shadow-card">
    <Box className="mb-3.5 text-sm font-bold text-text">
      Content type breakdown
    </Box>
    <Box className="mb-3.5 flex h-[18px] overflow-hidden rounded-[7px]">
      <ContentMixSegment fraction={pctReels} color={REEL} />
      <ContentMixSegment fraction={pctStatic} color={STATIC} />
      <ContentMixSegment fraction={pctCarousel} color={CAROUSEL} />
    </Box>
    <ContentMixLegend />
  </Box>
);

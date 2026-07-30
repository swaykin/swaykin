import { Box } from "@/infra/baseweb/Box";
import { CAROUSEL, REEL, STATIC } from "@/lib/entityColor";
import type { ColoredBrandMetrics } from "../../types";
import { ContentMixLegend } from "../ContentMixLegend";
import { ContentMixSegment } from "../ContentMixSegment";

type ContentMixCardProps = {
  compareCols: ColoredBrandMetrics[];
};

const ContentMixRow = ({ col }: { col: ColoredBrandMetrics }) => (
  <Box>
    <Box className="mb-1.5 flex items-center gap-1.5 text-[12.5px] text-text-secondary">
      <Box className="h-2 w-2 rounded-full" style={{ background: col.color }} />
      {col.name}
    </Box>
    <Box className="flex h-[18px] overflow-hidden rounded-md">
      <ContentMixSegment fraction={col.pctReels} color={REEL} />
      <ContentMixSegment fraction={col.pctStatic} color={STATIC} />
      <ContentMixSegment fraction={col.pctCarousel} color={CAROUSEL} />
    </Box>
  </Box>
);

export const ContentMixCard = ({ compareCols }: ContentMixCardProps) => (
  <Box className="rounded-2xl border border-border bg-surface p-5 shadow-card">
    <Box className="mb-3.5 text-sm font-bold text-text">Content Breakdown</Box>
    <Box className="mb-3.5 flex flex-col gap-3.5">
      {compareCols.map((col) => (
        <ContentMixRow key={col.key} col={col} />
      ))}
    </Box>
    <ContentMixLegend />
  </Box>
);

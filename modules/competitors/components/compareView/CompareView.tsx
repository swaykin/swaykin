import { Box } from "@/infra/baseweb/Box";
import { useCompareSelection } from "./useCompareSelection";
import type { ColoredBrandMetrics, ColoredCompetitor } from "../../types";
import { CompareTable } from "./CompareTable";
import { CompetitorSelectorChips } from "./CompetitorSelectorChips";
import { ContentMixCard } from "./ContentMixCard";

type CompareViewProps = {
  activeCompetitors: ColoredCompetitor[];
  yourBrand: ColoredBrandMetrics;
  maxTracked: number;
  onRequestRemove: (key: string) => void;
};

export const CompareView = ({
  activeCompetitors,
  yourBrand,
  maxTracked,
  onRequestRemove,
}: CompareViewProps) => {
  const { selected, toggleSelected, compareCols, compareRows } =
    useCompareSelection(activeCompetitors, yourBrand, maxTracked);

  return (
    <Box className="flex flex-col gap-4">
      <CompetitorSelectorChips
        activeCompetitors={activeCompetitors}
        selected={selected}
        onToggle={toggleSelected}
        onRemove={onRequestRemove}
      />
      <CompareTable compareCols={compareCols} compareRows={compareRows} />
      <ContentMixCard compareCols={compareCols} />
    </Box>
  );
};

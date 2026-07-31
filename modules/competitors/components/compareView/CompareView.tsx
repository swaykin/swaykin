import { useMemo } from "react";
import { Box } from "@/infra/baseweb/Box";
import { CompareTable, type CompareTableColumn } from "@/infra/components/CompareTable";
import { useCompareSelection } from "./useCompareSelection";
import type { ColoredBrandMetrics, ColoredCompetitor } from "../../types";
import { CompetitorSelectorChips } from "./CompetitorSelectorChips";
import { ContentMixCard } from "./ContentMixCard";

type CompareViewProps = {
  activeCompetitors: ColoredCompetitor[];
  yourBrand: ColoredBrandMetrics;
  maxTracked: number;
  onRequestRemove: (key: string) => void;
};

const CompareColumnHeader = ({ col }: { col: ColoredBrandMetrics }) => (
  <Box className="flex flex-col items-center gap-1">
    <Box className="h-[9px] w-[9px] rounded-full" style={{ background: col.color }} />
    <Box className="whitespace-nowrap text-xs font-bold text-text">{col.name}</Box>
  </Box>
);

export const CompareView = ({
  activeCompetitors,
  yourBrand,
  maxTracked,
  onRequestRemove,
}: CompareViewProps) => {
  const { selected, toggleSelected, compareCols, compareRows } =
    useCompareSelection(activeCompetitors, yourBrand, maxTracked);

  const columns: CompareTableColumn[] = useMemo(
    () =>
      compareCols.map((col) => ({
        key: col.key,
        header: <CompareColumnHeader col={col} />,
      })),
    [compareCols],
  );

  return (
    <Box className="flex flex-col gap-4">
      <CompetitorSelectorChips
        activeCompetitors={activeCompetitors}
        selected={selected}
        onToggle={toggleSelected}
        onRemove={onRequestRemove}
      />
      <CompareTable columns={columns} rows={compareRows} />
      <ContentMixCard compareCols={compareCols} />
    </Box>
  );
};

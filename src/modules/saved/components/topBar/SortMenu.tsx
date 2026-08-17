import { Box } from "@/infra/baseweb/Box";
import { FilterMenuRow } from "../FilterMenuRow";
import { SORT_OPTIONS } from "../../constants";

type SortMenuProps = {
  onSelect: (key: string) => void;
  sortBy?: string;
};

export const SortMenu = ({ onSelect, sortBy }: SortMenuProps) => (
  <Box className="w-[220px] rounded-xl border border-border bg-surface p-2 shadow-overlay">
    {SORT_OPTIONS.map((option) => (
      <FilterMenuRow
        active={sortBy === option.key}
        key={option.key}
        label={option.label}
        onClick={() => onSelect(option.key)}
      />
    ))}
  </Box>
);

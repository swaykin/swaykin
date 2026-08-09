import { Box } from "@/infra/baseweb/Box";
import { FilterMenuRow } from "../FilterMenuRow";
import { STATUS_OPTIONS, type SavedStatus } from "../../constants";

type StatusPillMenuProps = {
  status: SavedStatus;
  onSelect: (status: SavedStatus) => void;
};

export const StatusPillMenu = ({ status, onSelect }: StatusPillMenuProps) => (
  <Box className="w-[160px] rounded-xl border border-border bg-surface p-2 shadow-overlay">
    {STATUS_OPTIONS.map((option) => (
      <FilterMenuRow
        key={option}
        label={option}
        active={status === option}
        onClick={() => onSelect(option)}
      />
    ))}
  </Box>
);

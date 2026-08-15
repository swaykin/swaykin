import { Box } from "@/infra/baseweb/Box";
import { FilterMenuRow } from "../FilterMenuRow";
import { STATUS_OPTIONS } from "../../constants";

type StatusFilterMenuProps = {
  onSelect: (status: string | null) => void;
  selected: string | null;
};

export const StatusFilterMenu = ({
  onSelect,
  selected,
}: StatusFilterMenuProps) => (
  <Box className="w-[200px] rounded-xl border border-border bg-surface p-2 shadow-overlay">
    <FilterMenuRow
      label="All statuses"
      bold
      onClick={() => onSelect(null)}
      active={!selected}
    />
    {STATUS_OPTIONS.map((status) => (
      <FilterMenuRow
        key={status}
        label={status}
        active={selected === status}
        onClick={() => onSelect(status)}
      />
    ))}
  </Box>
);

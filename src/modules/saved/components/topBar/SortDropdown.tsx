import { StatefulPopover } from "@/infra/baseweb/StatefulPopover";
import { FilterTriggerButton } from "@/infra/components/FilterTriggerButton";
import { SortMenu } from "./SortMenu";
import { SORT_OPTIONS } from "../../constants";

type SortDropdownProps = {
  sortBy: string;
  onChange: (key: string) => void;
};

export const SortDropdown = ({ sortBy, onChange }: SortDropdownProps) => {
  const label = SORT_OPTIONS.find((option) => option.key === sortBy)?.label;

  return (
    <StatefulPopover
      placement="bottomRight"
      content={({ close }) => (
        <SortMenu
          sortBy={sortBy}
          onSelect={(key) => {
            onChange(key);
            close();
          }}
        />
      )}
    >
      <FilterTriggerButton
        icon="ph-sort-ascending"
        fontSize="12.5px"
        label={label ?? "Default"}
        active={false}
      />
    </StatefulPopover>
  );
};

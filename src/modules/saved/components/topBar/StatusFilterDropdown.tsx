import { StatefulPopover } from "@/infra/baseweb/StatefulPopover";
import { FilterTriggerButton } from "@/infra/components/FilterTriggerButton";
import { StatusFilterMenu } from "./StatusFilterMenu";

type StatusFilterDropdownProps = {
  selected: string | null;
  onSelect: (status: string | null) => void;
};

export const StatusFilterDropdown = ({
  selected,
  onSelect,
}: StatusFilterDropdownProps) => (
  <StatefulPopover
    placement="bottomLeft"
    content={({ close }) => (
      <StatusFilterMenu
        selected={selected}
        onSelect={(status) => {
          onSelect(status);
          close();
        }}
      />
    )}
  >
    <FilterTriggerButton
      icon="ph-funnel"
      fontSize="12.5px"
      label={selected ?? "All statuses"}
      active={selected !== null}
    />
  </StatefulPopover>
);

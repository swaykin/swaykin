import { StatefulPopover } from "@/infra/baseweb/StatefulPopover";
import { SearchableMenu } from "@/infra/components/searchableMenu";
import { FilterTriggerButton } from "./FilterTriggerButton";

type FilterCapsuleProps = {
  icon: string;
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multi?: boolean;
  creatable?: boolean;
};

const displayLabel = (label: string, selected: string[]) => {
  if (selected.length === 0) return label;
  if (selected.length <= 2) return selected.join(", ");
  return `${selected.slice(0, 2).join(", ")} +${selected.length - 2}`;
};

export const FilterCapsule = ({
  icon,
  label,
  options,
  selected,
  onChange,
  multi = true,
  creatable = false,
}: FilterCapsuleProps) => {
  return (
    <StatefulPopover
      placement="bottomLeft"
      content={({ close }) => (
        <SearchableMenu
          options={options}
          selected={selected}
          onChange={onChange}
          multi={multi}
          creatable={creatable}
          onCloseRequest={close}
        />
      )}
    >
      <FilterTriggerButton
        icon={icon}
        label={displayLabel(label, selected)}
        active={selected.length > 0}
      />
    </StatefulPopover>
  );
};

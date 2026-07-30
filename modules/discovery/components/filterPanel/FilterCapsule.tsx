import { Button } from "@/infra/baseweb/Button";
import { Icon } from "@/infra/baseweb/Icon";
import { StatefulPopover } from "@/infra/baseweb/StatefulPopover";
import { SearchableMenu } from "@/infra/components/searchableMenu";
import { Truncate } from "@/infra/components/Truncate";

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
  const active = selected.length > 0;
  const borderColor = active ? "var(--sk-accent)" : "var(--sk-border)";

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
      <Button
        kind="secondary"
        type="button"
        height="36px"
        weight="semiBold"
        fontSize="12px"
        maxWidth="220px"
        borderColor={borderColor}
        backgroundColor={
          active ? "var(--sk-accent-subtle)" : "var(--sk-surface)"
        }
        textColor={
          active ? "var(--sk-accent-strong)" : "var(--sk-text-secondary)"
        }
        startEnhancer={<Icon name={icon} weight="bold" size={13} />}
        endEnhancer={<Icon name="ph-caret-down" size={10} />}
      >
        <Truncate>{displayLabel(label, selected)}</Truncate>
      </Button>
    </StatefulPopover>
  );
};

import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { Icon } from "@/infra/baseweb/Icon";
import { Switch } from "@/infra/baseweb/Switch";

type ToggleDef = {
  key: string;
  label: string;
  checked: boolean;
  onToggle: () => void;
};

type FilterActionsRowProps = {
  toggles: ToggleDef[];
  dirty: boolean;
  onClearAll: () => void;
  onRestore: () => void;
  onApply: () => void;
};

const DirtyBanner = () => (
  <Box className="mt-2 flex items-center gap-[5px] text-[11.5px] text-[var(--orange-700)]">
    <Icon name="ph-warning-circle" weight="fill" size={13} />
    Filters changed — click Apply to update results.
  </Box>
);

export const FilterActionsRow = ({
  toggles,
  dirty,
  onClearAll,
  onRestore,
  onApply,
}: FilterActionsRowProps) => (
  <Box>
    <Box className="flex flex-wrap items-center gap-5 border-t border-border pt-3">
      {toggles.map((toggle) => (
        <Switch
          key={toggle.key}
          checked={toggle.checked}
          onChange={toggle.onToggle}
        >
          {toggle.label}
        </Switch>
      ))}
      <Box className="flex-1" />
      <Button
        kind="tertiary"
        onClick={onClearAll}
        startEnhancer={<Icon name="ph-x" weight="bold" size={11} />}
      >
        Clear all
      </Button>
      <Button
        kind="secondary"
        onClick={onRestore}
        startEnhancer={
          <Icon name="ph-arrow-counter-clockwise" weight="bold" size={12} />
        }
      >
        Restore
      </Button>
      <Button
        kind="primary"
        onClick={onApply}
        startEnhancer={<Icon name="ph-check" weight="bold" size={14} />}
      >
        Apply
      </Button>
    </Box>
    {dirty && <DirtyBanner />}
  </Box>
);

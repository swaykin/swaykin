import type { ComponentProps } from "react";
import { Button } from "@/infra/baseweb/Button";
import { Icon } from "@/infra/baseweb/Icon";
import { Truncate } from "@/infra/components/Truncate";

// Extends Button's own props (not just a fixed icon/label/active shape) because this is meant
// to sit directly inside StatefulPopover — it clones its single child via React.cloneElement
// and injects onClick/ref/onBlur/onFocus/aria-* onto it directly, so anything dropped here
// silently breaks the popover (no open, no positioning).
type FilterTriggerButtonProps = ComponentProps<typeof Button> & {
  icon: string;
  label: string;
  active: boolean;
};

export const FilterTriggerButton = ({
  icon,
  label,
  active,
  ...rest
}: FilterTriggerButtonProps) => (
  <Button
    kind="secondary"
    type="button"
    height="36px"
    fontSize="12px"
    maxWidth="220px"
    borderColor={active ? "var(--sk-accent)" : "var(--sk-border)"}
    backgroundColor={active ? "var(--sk-accent-subtle)" : "var(--sk-surface)"}
    textColor={active ? "var(--sk-accent-strong)" : "var(--sk-text-secondary)"}
    startEnhancer={<Icon name={icon} weight="bold" size={13} />}
    endEnhancer={<Icon name="ph-caret-down" size={10} />}
    {...rest}
  >
    <Truncate>{label}</Truncate>
  </Button>
);

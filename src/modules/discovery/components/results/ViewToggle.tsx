import { Box } from "@/infra/baseweb/Box";
import { IconButton } from "@/infra/baseweb/IconButton";
import { Icon } from "@/infra/baseweb/Icon";

export type ResultsView = "grid" | "list";

type ViewToggleProps = {
  view: ResultsView;
  onChange: (view: ResultsView) => void;
};

const ToggleButton = ({
  icon,
  active,
  borderLeft,
  onClick,
  label,
}: {
  icon: string;
  active: boolean;
  borderLeft?: boolean;
  onClick: () => void;
  label: string;
}) => (
  <IconButton
    kind="tertiary"
    type="button"
    aria-label={label}
    aria-pressed={active}
    onClick={onClick}
    height="34px"
    width="34px"
    overrides={{
      BaseButton: {
        style: {
          borderRadius: 0,
          backgroundColor: active ? "var(--sk-accent-subtle)" : "var(--sk-surface)",
          ...(borderLeft ? { borderLeft: "1px solid var(--sk-border)" } : undefined),
        },
      },
    }}
  >
    <Icon
      name={icon}
      size={16}
      color={active ? "var(--sk-accent-strong)" : "var(--sk-text-tertiary)"}
    />
  </IconButton>
);

export const ViewToggle = ({ view, onChange }: ViewToggleProps) => (
  <Box className="flex overflow-hidden rounded-[9px] border border-border">
    <ToggleButton
      icon="ph-squares-four"
      active={view === "grid"}
      onClick={() => onChange("grid")}
      label="Grid view"
    />
    <ToggleButton
      icon="ph-rows"
      active={view === "list"}
      borderLeft
      onClick={() => onChange("list")}
      label="List view"
    />
  </Box>
);

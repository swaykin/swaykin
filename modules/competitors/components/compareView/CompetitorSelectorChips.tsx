import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { Icon } from "@/infra/baseweb/Icon";
import { IconButton } from "@/infra/baseweb/IconButton";
import type { ColoredCompetitor } from "../../types";

type CompetitorSelectorChipsProps = {
  activeCompetitors: ColoredCompetitor[];
  selected: Record<string, boolean>;
  onToggle: (key: string) => void;
  onRemove: (key: string) => void;
};

const ActiveIcon = ({ active, color }: { active: boolean; color: string }) => (
  <Box
    className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded"
    style={{
      background: active ? color : "transparent",
      border: `1.5px solid ${active ? color : "var(--sk-border-strong)"}`,
    }}
  >
    {active && <Icon name="ph-check" weight="bold" size={10} color="#fff" />}
  </Box>
);

const CompetitorChip = ({
  competitor,
  active,
  onToggle,
  onRemove,
}: {
  competitor: ColoredCompetitor;
  active: boolean;
  onToggle: (key: string) => void;
  onRemove: (key: string) => void;
}) => (
  <Box
    className="inline-flex h-[34px] items-center gap-1.5 rounded-lg py-0 pr-1.5 text-xs font-bold"
    style={{
      border: `1.5px solid ${active ? competitor.color : "var(--sk-border)"}`,
      background: active ? competitor.tint : "var(--sk-surface)",
      color: active ? "var(--sk-text)" : "var(--sk-text-tertiary)",
    }}
  >
    <Button
      kind="tertiary"
      type="button"
      onClick={() => onToggle(competitor.key)}
      startEnhancer={<ActiveIcon active={active} color={competitor.color} />}
      height="auto"
      weight="bold"
      fontSize="12px"
      // Explicit, not inherited — kind="tertiary" defaults to its own text color, which
      // would otherwise override the chip's active/inactive color.
      textColor={active ? "var(--sk-text)" : "var(--sk-text-tertiary)"}
      overrides={{
        BaseButton: {
          style: {
            "@media (hover: hover)": {
              ":hover": { boxShadow: "none" },
            },
          },
        },
      }}
    >
      {competitor.name}
    </Button>
    <IconButton
      kind="tertiary"
      type="button"
      aria-label={`Remove ${competitor.name}`}
      onClick={() => onRemove(competitor.key)}
      height="20px"
      width="20px"
    >
      <Icon
        name="ph-x"
        weight="bold"
        size={10}
        color={active ? "var(--sk-text)" : "var(--sk-text-tertiary)"}
      />
    </IconButton>
  </Box>
);

export const CompetitorSelectorChips = ({
  activeCompetitors,
  selected,
  onToggle,
  onRemove,
}: CompetitorSelectorChipsProps) => (
  <Box className="flex flex-wrap items-center gap-2">
    {activeCompetitors.map((competitor) => (
      <CompetitorChip
        key={competitor.key}
        competitor={competitor}
        active={!!selected[competitor.key]}
        onToggle={onToggle}
        onRemove={onRemove}
      />
    ))}
  </Box>
);

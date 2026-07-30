import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { CheckmarkGlyph } from "@/infra/baseweb/Checkbox";
import { Icon } from "@/infra/baseweb/Icon";
import { IconButton } from "@/infra/baseweb/IconButton";
import { Truncate } from "@/infra/components/Truncate";
import type { ColoredCompetitor } from "../../types";

type CompetitorSelectorChipsProps = {
  activeCompetitors: ColoredCompetitor[];
  selected: Record<string, boolean>;
  onToggle: (key: string) => void;
  onRemove: (key: string) => void;
};

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
      startEnhancer={<CheckmarkGlyph checked={active} color={competitor.color} />}
      height="auto"
      weight="bold"
      fontSize="12px"
      maxWidth="160px"
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
      <Truncate>{competitor.name}</Truncate>
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

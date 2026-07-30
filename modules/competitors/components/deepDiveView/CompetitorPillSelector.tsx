import { Avatar } from "@/infra/baseweb/Avatar";
import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { Truncate } from "@/infra/components/Truncate";
import type { ColoredCompetitor } from "../../types";

type CompetitorPillSelectorProps = {
  competitors: ColoredCompetitor[];
  activeKey: string;
  onSelect: (key: string) => void;
};

export const CompetitorPillSelector = ({
  competitors,
  activeKey,
  onSelect,
}: CompetitorPillSelectorProps) => (
  <Box className="flex flex-wrap items-center gap-2">
    {competitors.map((competitor) => {
      const active = competitor.key === activeKey;
      const borderColor = active ? competitor.color : "var(--sk-border)";
      return (
        <Button
          key={competitor.key}
          kind="secondary"
          type="button"
          height="36px"
          weight="bold"
          fontSize="12.5px"
          maxWidth="160px"
          borderColor={borderColor}
          backgroundColor={active ? competitor.color : "var(--sk-surface)"}
          textColor={active ? "#ffffff" : "var(--sk-text-secondary)"}
          onClick={() => onSelect(competitor.key)}
          startEnhancer={
            <Avatar
              name={competitor.name}
              size="22px"
              fontSize="9px"
              fillColor={active ? "rgba(255,255,255,.25)" : competitor.color}
            />
          }
          overrides={{
            BaseButton: {
              style: {
                boxShadow: active ? "var(--sk-shadow-card)" : "none",
                "@media (hover: hover)": {
                  ":hover": {
                    backgroundColor: active
                      ? competitor.color
                      : "var(--sk-surface-sunken)",
                  },
                },
              },
            },
          }}
        >
          <Truncate>{competitor.name}</Truncate>
        </Button>
      );
    })}
  </Box>
);

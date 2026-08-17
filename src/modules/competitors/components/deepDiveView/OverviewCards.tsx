import type { ReactNode } from "react";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import type { ColoredCompetitor } from "../../types";

type OverviewCardsProps = {
  competitor: ColoredCompetitor;
  yourBrandName: string;
};

const OverviewCard = ({
  label,
  value,
  sub,
  background,
  border,
  valueColor,
}: {
  label: string;
  value: string;
  sub: ReactNode;
  background?: string;
  border?: string;
  valueColor?: string;
}) => (
  <Box
    className="rounded-2xl border p-4 px-[18px]"
    style={{
      background: background ?? "var(--sk-surface)",
      borderColor: border ?? "var(--sk-border)",
      boxShadow: background ? undefined : "var(--sk-shadow-card)",
    }}
  >
    <Box className="mb-2 text-[11px] font-bold uppercase tracking-[0.03em] text-text-tertiary">
      {label}
    </Box>
    <Box
      className="text-[21px] font-bold"
      style={{ color: valueColor ?? "var(--sk-text)" }}
    >
      {value}
    </Box>
    <Box className="mt-1 text-[11.5px] text-text-secondary">{sub}</Box>
  </Box>
);

export const OverviewCards = ({
  competitor,
  yourBrandName,
}: OverviewCardsProps) => {
  const benchmarkBg = competitor.benchmarkGood
    ? "var(--sk-accent-subtle)"
    : "var(--orange-50)";
  const benchmarkBorder = competitor.benchmarkGood
    ? "var(--sk-accent-subtle-strong)"
    : "var(--orange-100)";
  const benchmarkColor = competitor.benchmarkGood
    ? "var(--sk-accent-strong)"
    : "var(--orange-700)";
  const benchmarkLabel = competitor.benchmarkGood ? "ahead of" : "behind";

  return (
    <Box className="grid grid-cols-4 gap-3">
      <OverviewCard
        label="Followers"
        value={competitor.followers}
        sub={
          <Box className="flex items-center gap-1 text-[var(--green-700)]">
            <Icon name="ph-trend-up" weight="bold" size={12} />
            {competitor.growth30} · 30d
          </Box>
        }
      />
      <OverviewCard
        label="Avg. engagement rate"
        value={competitor.engagement}
        sub={`Avg reach ${competitor.avgReach}/post`}
      />
      <OverviewCard
        label="Posting frequency"
        value={competitor.postFreq}
        sub={`${competitor.activeCollabs} active collabs`}
      />
      <OverviewCard
        label={`Vs. ${yourBrandName}`}
        value={competitor.benchmarkDelta}
        sub={`engagement rate ${benchmarkLabel} you`}
        background={benchmarkBg}
        border={benchmarkBorder}
        valueColor={benchmarkColor}
      />
    </Box>
  );
};

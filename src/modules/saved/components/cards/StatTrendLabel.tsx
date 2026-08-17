import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";

type StatTrendLabelProps = {
  label: string;
  change: number;
  suffix: string;
};

export const StatTrendLabel = ({ label, change, suffix }: StatTrendLabelProps) => {
  const positive = change >= 0;
  const color = positive ? "var(--green-700)" : "var(--pink-600)";

  return (
    <Box as="span" className="inline-flex items-center gap-1">
      {label}
      <Box
        as="span"
        className="inline-flex items-center gap-0.5 font-bold"
        style={{ color }}
      >
        <Icon
          name={positive ? "ph-trend-up" : "ph-trend-down"}
          weight="bold"
          size={9}
        />
        {positive ? "+" : ""}
        {change}
        {suffix}
      </Box>
    </Box>
  );
};

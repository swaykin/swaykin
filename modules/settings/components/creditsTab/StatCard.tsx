import { Box } from "@/infra/baseweb/Box";

type StatCardProps = {
  label: string;
  value: string;
  valueColor?: string;
  valueClassName?: string;
};

export const StatCard = ({
  label,
  value,
  valueColor,
  valueClassName,
}: StatCardProps) => (
  <Box className="flex flex-col justify-between rounded-[14px] border border-border bg-surface p-[18px] shadow-card">
    <Box className="text-[11.5px] text-text-tertiary">{label}</Box>
    <Box
      className={`font-bold tracking-tight ${valueClassName ?? "text-2xl"}`}
      style={{ color: valueColor ?? "var(--sk-text)" }}
    >
      {value}
    </Box>
  </Box>
);

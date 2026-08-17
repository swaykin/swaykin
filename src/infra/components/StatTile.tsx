import type { ReactNode } from "react";
import { Box } from "@/infra/baseweb/Box";

type StatTileProps = {
  label: ReactNode;
  value: string;
  valueColor?: string;
};

export const StatTile = ({ label, value, valueColor }: StatTileProps) => (
  <Box className="rounded-[9px] bg-sunken px-2.5 py-2">
    <Box
      className="text-[13.5px] font-bold"
      style={{ color: valueColor ?? "var(--sk-text)" }}
    >
      {value}
    </Box>
    <Box className="text-[10.5px] text-text-tertiary">{label}</Box>
  </Box>
);
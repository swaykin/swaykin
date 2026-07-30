import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import type { ColoredCompetitorAlert } from "../types";

type AlertsGridProps = {
  alerts: ColoredCompetitorAlert[];
};

export const AlertsGrid = ({ alerts }: AlertsGridProps) => (
  <Box className="my-3.5 grid grid-cols-1 gap-3 px-7 md:grid-cols-2 xl:grid-cols-3">
    {alerts.map((alert, i) => (
      <Box
        key={i}
        className="flex items-start gap-2.5 rounded-xl border border-border bg-surface p-3 shadow-card"
        style={{ borderLeft: `3px solid ${alert.color}` }}
      >
        <Icon
          name={alert.icon}
          weight="fill"
          size={16}
          color={alert.color}
          className="mt-px flex-shrink-0"
        />
        <Box className="min-w-0">
          <Box className="text-[12.5px] leading-snug text-text">
            <Box as="strong">{alert.brand}</Box> {alert.text}
          </Box>
          <Box className="mt-[3px] text-[10.5px] text-text-tertiary">
            {alert.time}
          </Box>
        </Box>
      </Box>
    ))}
  </Box>
);

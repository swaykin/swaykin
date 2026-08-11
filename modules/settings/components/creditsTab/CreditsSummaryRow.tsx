import { Box } from "@/infra/baseweb/Box";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useBillingPlan } from "../../hooks/useBillingPlan";
import { StatCard } from "./StatCard";

export const CreditsSummaryRow = () => {
  const { workspace } = useWorkspace();
  const { plan } = useBillingPlan();

  return (
    <Box className="grid grid-cols-3 gap-3">
      <StatCard
        label="Available credits"
        value={workspace.credits.toLocaleString()}
      />
      <StatCard
        label="Used this month"
        value={workspace.creditsUsedThisMonth.toLocaleString()}
      />
      <StatCard
        label="Current plan"
        value={`${plan.name.split(" ")[0]} · ${plan.creditsPerMonth.toLocaleString()}/mo`}
        valueClassName="text-[16px]"
      />
    </Box>
  );
};

import { Box } from "@/infra/baseweb/Box";
import { useWorkspaceContext } from "@/providers/WorkspaceProvider";
import { useBillingPlan } from "../../hooks/useBillingPlan";
import { StatCard } from "./StatCard";

export const CreditsSummaryRow = () => {
  const { workspace } = useWorkspaceContext();
  const { plan } = useBillingPlan();

  return (
    <Box className="grid grid-cols-2 gap-3">
      <StatCard
        label="Available credits"
        value={workspace.creditBalance.toLocaleString()}
      />
      <StatCard
        label="Current plan"
        value={`${plan.name.split(" ")[0]} · ${plan.creditsPerMonth.toLocaleString()}/mo`}
        valueClassName="text-[16px]"
      />
    </Box>
  );
};

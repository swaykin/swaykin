import _noop from "lodash/noop";
import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { useBillingPlan } from "../../hooks/useBillingPlan";

export const CurrentPlanCard = () => {
  const { plan } = useBillingPlan();

  return (
    <Box className="flex items-center justify-between gap-3.5 rounded-2xl border border-border bg-surface p-5 shadow-card">
      <Box>
        <Box className="mb-0.5 text-[14px] font-bold text-text">
          {plan.name}
        </Box>
        <Box className="text-[12.5px] text-text-secondary">
          {plan.priceLabel} · {plan.creditsPerMonth.toLocaleString()} credits
          · renews {plan.renewsOn}
        </Box>
      </Box>
      <Button kind="secondary" height="34px" onClick={_noop}>
        Change plan
      </Button>
    </Box>
  );
};

import { Box } from "@/infra/baseweb/Box";
import { CurrentPlanCard } from "./CurrentPlanCard";
import { PaymentMethodCard } from "./PaymentMethodCard";

export const BillingTab = () => (
  <Box className="flex max-w-[640px] flex-col gap-4">
    <CurrentPlanCard />
    <PaymentMethodCard />
  </Box>
);

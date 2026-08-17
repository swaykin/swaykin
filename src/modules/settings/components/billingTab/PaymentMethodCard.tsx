import _noop from "lodash/noop";
import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { Icon } from "@/infra/baseweb/Icon";
import { useBillingPlan } from "../../hooks/useBillingPlan";

export const PaymentMethodCard = () => {
  const { paymentMethod } = useBillingPlan();

  return (
    <Box className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <Box className="mb-3.5 text-[14px] font-bold text-text">
        Payment method
      </Box>
      <Box className="flex items-center gap-3 rounded-xl border border-border p-3">
        <Icon
          name="ph-credit-card"
          weight="fill"
          size={22}
          color="var(--sk-text-secondary)"
        />
        <Box className="flex-1">
          <Box className="text-[13px] font-semibold text-text">
            {paymentMethod.brand} •••• {paymentMethod.last4}
          </Box>
          <Box className="text-[11.5px] text-text-tertiary">
            Expires {paymentMethod.expiry}
          </Box>
        </Box>
        <Button kind="secondary" height="30px" onClick={_noop}>
          Update
        </Button>
      </Box>
    </Box>
  );
};

import { mockBillingPlan, mockPaymentMethod } from "@/mocks/billing";

/** The one seam that reads `mocks/billing.ts` — everything else goes through this. */
export const useBillingPlan = () => {
  return { plan: mockBillingPlan, paymentMethod: mockPaymentMethod };
};

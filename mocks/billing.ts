export type BillingPlan = {
  name: string;
  priceLabel: string;
  creditsPerMonth: number;
  renewsOn: string;
};

export type PaymentMethod = {
  brand: string;
  last4: string;
  expiry: string;
};

export const mockBillingPlan: BillingPlan = {
  name: "Growth plan",
  priceLabel: "₹14,999/month",
  creditsPerMonth: 2000,
  renewsOn: "Aug 12, 2026",
};

export const mockPaymentMethod: PaymentMethod = {
  brand: "Visa",
  last4: "4242",
  expiry: "08/28",
};

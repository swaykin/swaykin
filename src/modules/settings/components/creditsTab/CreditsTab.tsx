import { Box } from "@/infra/baseweb/Box";
import { CreditHistoryTable } from "./CreditHistoryTable";
import { CreditsSummaryRow } from "./CreditsSummaryRow";
import { TopUpCard } from "./TopUpCard";

export const CreditsTab = () => (
  <Box className="flex max-w-[820px] flex-col gap-4">
    <CreditsSummaryRow />
    <TopUpCard />
    <CreditHistoryTable />
  </Box>
);

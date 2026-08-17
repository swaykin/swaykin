import _noop from "lodash/noop";
import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";

export const TopUpCard = () => (
  <Box className="flex flex-wrap items-center justify-between gap-3.5 rounded-2xl border border-border bg-surface p-5 shadow-card">
    <Box>
      <Box className="mb-0.5 text-[13.5px] font-bold text-text">
        Need more credits this month?
      </Box>
      <Box className="text-[12.5px] text-text-secondary">
        Top up instantly or upgrade your plan for a higher monthly allowance.
      </Box>
    </Box>
    <Box className="flex flex-shrink-0 gap-2">
      <Button kind="secondary" height="34px" onClick={_noop}>
        Buy top-up
      </Button>
      <Button kind="primary" height="34px" onClick={_noop}>
        Upgrade plan
      </Button>
    </Box>
  </Box>
);

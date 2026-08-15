import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";

export const PrivacyCard = () => (
  <Box className="rounded-2xl border border-border bg-surface p-5 shadow-card">
    <Box className="mb-3.5 text-[14px] font-bold text-text">Privacy</Box>
    <Box className="flex items-center justify-between gap-3 border-b border-border py-2.5">
      <Box as="span" className="text-[13px] text-text">
        Download a copy of your data
      </Box>
      <Button kind="secondary" height="30px">
        Request export
      </Button>
    </Box>
    <Box className="flex items-center justify-between gap-3 py-2.5">
      <Box as="span" className="text-[13px] text-text">
        Privacy policy
      </Box>
      <Box
        as="a"
        href="#"
        className="text-[12.5px] font-semibold text-accent-strong"
      >
        View policy
      </Box>
    </Box>
  </Box>
);

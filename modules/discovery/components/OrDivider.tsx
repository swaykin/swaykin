import { Box } from "@/infra/baseweb/Box";

export const OrDivider = () => (
  <Box className="my-3.5 flex items-center gap-2.5">
    <Box className="h-px flex-1 bg-border" />
    <Box as="span" className="text-[11px] font-bold text-text-tertiary">
      OR
    </Box>
    <Box className="h-px flex-1 bg-border" />
  </Box>
);

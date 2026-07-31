import { Box } from "@/infra/baseweb/Box";

export const NoResults = () => (
  <Box className="py-12 text-center text-[13px] text-text-tertiary">
    No creators match these filters. Try widening your ranges or clearing a few filters.
  </Box>
);

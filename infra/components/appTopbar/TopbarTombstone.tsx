import { Box } from "@/infra/baseweb/Box";
import { Pulse } from "@/infra/components/Pulse";

export const TopbarTombstone = () => (
  <Box
    as="header"
    className="sticky top-0 z-20 flex h-14 flex-shrink-0 items-center gap-3.5 border-b bg-surface px-5 border-border"
  >
    <Pulse className="h-8 w-100" />
    <Box className="ml-auto flex items-center gap-3.5">
      <Pulse className="h-8 w-30" />
      <Pulse className="h-8 w-24" />
      <Pulse className="h-8 w-8" />
      <Pulse className="h-8 w-8 rounded-full" />
    </Box>
  </Box>
);

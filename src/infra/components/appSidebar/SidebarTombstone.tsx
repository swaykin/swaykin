import { Box } from "@/infra/baseweb/Box";
import { Pulse } from "@/infra/components/Pulse";

export const SidebarTombstone = () => (
  <Box
    as="nav"
    className="sticky left-0 top-0 flex h-screen w-[248px] min-w-[248px] flex-shrink-0 flex-col border-r bg-[var(--sk-sidebar-bg)] border-[var(--sk-sidebar-border)]"
  >
    <Box className="flex items-center gap-2 px-5 pb-2.5 pt-4">
      <Pulse className="h-5 w-5 flex-shrink-0" />
      <Pulse className="h-3 w-20" />
    </Box>
    <Box className="px-2.5 pb-2.5 pt-1">
      <Pulse className="h-9 w-full" />
    </Box>
    <Box className="flex-1 space-y-1.5 px-2.5 pt-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <Pulse key={i} className="h-8 w-full" />
      ))}
    </Box>
  </Box>
);
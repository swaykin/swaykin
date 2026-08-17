import { Box } from "@/infra/baseweb/Box";
import { SidebarTombstone } from "@/infra/components/appSidebar/SidebarTombstone";
import { TopbarTombstone } from "@/infra/components/appTopbar/TopbarTombstone";

/** App-shell placeholder rendered while user/workspace data is loading, so the sidebar and topbar don't flash blank. */
export const AppTombstone = () => {
  return (
    <Box className="flex min-h-screen bg-page">
      <SidebarTombstone />
      <Box className="flex min-w-0 flex-1 flex-col">
        <TopbarTombstone />
        <Box as="main" className="min-w-0 flex-1" />
      </Box>
    </Box>
  );
};

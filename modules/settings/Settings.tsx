import { Box } from "@/infra/baseweb/Box";
import { PageHeader } from "@/infra/components/PageHeader";
import { SettingsTabs } from "./components/SettingsTabs";
import { BillingTab } from "./components/billingTab";
import { CreditsTab } from "./components/creditsTab";
import { ProfileTab } from "./components/profileTab";
import { TeamMembersTab } from "./components/teamMembersTab";
import { WorkspaceTab } from "./components/workspaceTab";
import { useSettingsTabs } from "./hooks/useSettingsTabs";
import type { SettingsTabKey } from "./constants";

const SETTINGS_TAB_PANELS: Record<SettingsTabKey, () => React.JSX.Element> = {
  profile: ProfileTab,
  workspace: WorkspaceTab,
  team: TeamMembersTab,
  credits: CreditsTab,
  billing: BillingTab,
};

const Settings = () => {
  const { tab, onTabChange } = useSettingsTabs();
  const TabPanel = SETTINGS_TAB_PANELS[tab];

  return (
    <Box>
      <PageHeader
        title="Settings"
        description="Manage your workspace, team and billing preferences."
      />
      <Box className="px-7">
        <SettingsTabs tab={tab} onTabChange={onTabChange} />
        <Box className="pb-5">
          <TabPanel />
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;

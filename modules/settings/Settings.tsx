import { Box } from "@/infra/baseweb/Box";
import { PageHeader } from "@/infra/components/PageHeader";
import { SettingsTabs } from "./components/SettingsTabs";
import { WorkspaceTab } from "./components/workspaceTab/WorkspaceTab";
import { SETTINGS_TABS } from "./constants";
import { useSettingsTabs } from "./hooks/useSettingsTabs";

const Settings = () => {
  const { tab, setTab } = useSettingsTabs();

  return (
    <Box>
      <PageHeader
        title="Settings"
        description="Manage your workspace, team and billing preferences."
      />
      <Box className="px-7">
        <SettingsTabs tab={tab} setTab={setTab} />
        <Box className="pb-5">
          {tab === "workspace" ? (
            <WorkspaceTab />
          ) : (
            <Box className="py-16 text-center text-[13px] text-text-tertiary">
              {SETTINGS_TABS.find((t) => t.key === tab)?.label} — coming soon
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;

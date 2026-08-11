import { Icon } from "@/infra/baseweb/Icon";
import { Tab, Tabs, TAB_OVERRIDES } from "@/infra/baseweb/Tabs";
import { SETTINGS_TABS, type SettingsTabKey } from "../constants";

type SettingsTabsProps = {
  tab: SettingsTabKey;
  setTab: (tab: SettingsTabKey) => void;
};

export const SettingsTabs = ({ tab, setTab }: SettingsTabsProps) => (
  <Tabs
    activeKey={tab}
    onChange={({ activeKey }) => setTab(activeKey as SettingsTabKey)}
  >
    {SETTINGS_TABS.map((t) => (
      <Tab
        key={t.key}
        title={t.label}
        overrides={TAB_OVERRIDES}
        artwork={() => (
          <Icon name={t.icon} weight="bold" size={14} color="currentColor" />
        )}
      />
    ))}
  </Tabs>
);

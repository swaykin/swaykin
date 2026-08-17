import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { Tab, Tabs, TAB_OVERRIDES } from "@/infra/baseweb/Tabs";

type ModeTabKey = "compare" | "deepdive";

type ModeTabsProps = {
  tab: ModeTabKey;
  setTab: (tab: ModeTabKey) => void;
};

export const ModeTabs = ({ tab, setTab }: ModeTabsProps) => (
  <Box className="mx-7">
    <Tabs
      fill="fixed"
      activeKey={tab}
      onChange={({ activeKey }) => setTab(activeKey as ModeTabKey)}
    >
      <Tab
        key="compare"
        title="Compare"
        overrides={TAB_OVERRIDES}
        artwork={() => (
          <Icon
            name={"ph-columns"}
            weight="bold"
            size={14}
            color="currentColor"
          />
        )}
      />
      <Tab
        key="deepDive"
        title="Deep Dive"
        overrides={TAB_OVERRIDES}
        artwork={() => (
          <Icon
            name={"ph-magnifying-glass-plus"}
            weight="bold"
            size={14}
            color="currentColor"
          />
        )}
      />
    </Tabs>
  </Box>
);

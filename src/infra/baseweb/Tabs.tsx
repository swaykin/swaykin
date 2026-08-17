import { mergeOverrides } from "baseui";
import {
  Tab as BaseTab,
  Tabs as BaseTabs,
  type TabOverrides,
  type TabsOverrides,
  type TabsProps,
} from "baseui/tabs-motion";

const DEFAULT_TABS_OVERRIDES: TabsOverrides = {
  TabHighlight: { style: { height: "2px" } },
  // Base Web's default TabBorder is a 5px-tall block, not a hairline — the design wants a
  // plain 1px border-bottom under the whole tab bar.
  TabBorder: { style: { height: "1px", backgroundColor: "var(--sk-border)" } },
  // TabList reserves 5px of bottom padding (with a matching -5px margin to cancel it out of
  // layout) sized for Base Web's default 5px-tall highlight — since ours is 2px, that leaves
  // a visible gap between TabBorder and TabHighlight instead of them sitting flush. Match it
  // to the 2px highlight instead.
  TabList: { style: { paddingBottom: "2px", marginBottom: "-2px" } },
};

export const Tabs = ({ overrides, ...props }: TabsProps) => (
  <BaseTabs
    overrides={mergeOverrides(DEFAULT_TABS_OVERRIDES, overrides)}
    {...props}
  />
);

// `Tab` is unlike every other infra/baseweb wrapper: `Tabs` reads each child's raw `.props`
// via `React.Children.map` instead of ever mounting the child element, so a wrapping
// component here would never actually run — its own render (and any override-merging inside
// it) is simply skipped. The default styling has to be passed as a literal `overrides` value
// at each call site instead, using this constant, with `Tab` re-exported unwrapped.
export const TAB_OVERRIDES: TabOverrides = {
  Tab: {
    style: ({ $isActive }: { $isActive: boolean }) => ({
      color: $isActive ? "var(--sk-text)" : "var(--sk-text-tertiary)",
      fontWeight: 700,
      fontSize: "13px",
      background: "transparent",
    }),
  },
};

export { BaseTab as Tab };

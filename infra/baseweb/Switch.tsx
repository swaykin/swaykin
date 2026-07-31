import { mergeOverrides } from "baseui";
import { Switch as BaseSwitch, type SwitchProps } from "baseui/switch";

// Base Web's default Switch is a much larger control (52x32 track, optional checkmark icon in
// the knob) built around backgroundInversePrimary/contentInversePrimary tokens — this app's
// theme deliberately doesn't wire those up for an accent look (see lib/baseTheme.ts), so the
// accent-vs-neutral track color and the design's 34x20 sizing are baked in here instead. Knob
// stays literal white regardless of theme, matching the design's own hardcoded `background:#fff`.
const DEFAULT_OVERRIDES = {
  Root: { style: { alignItems: "center" } },
  ToggleTrack: {
    style: ({ $checked }: { $checked: boolean }) => ({
      width: "34px",
      height: "20px",
      paddingTop: "2px",
      paddingBottom: "2px",
      paddingLeft: "2px",
      paddingRight: "2px",
      borderWidth: "0px",
      backgroundColor: $checked ? "var(--sk-accent)" : "var(--sk-border-strong)",
      boxShadow: "none",
    }),
  },
  Toggle: {
    style: ({ $checked }: { $checked: boolean }) => ({
      width: "16px",
      height: "16px",
      backgroundColor: "#ffffff",
      backgroundImage: "none",
      boxShadow: "var(--sk-shadow-card)",
      // Base Web computes its own translateX off the *default* 52px track (sizing.scale700),
      // unaware of the 34px width above — recomputed by hand to match: track(34) - padding(2*2)
      // - knob(16) = 14px of travel.
      transform: $checked ? "translateX(14px)" : undefined,
    }),
  },
  Label: {
    style: {
      fontSize: "12.5px",
      fontWeight: 600,
      color: "var(--sk-text-secondary)",
    },
  },
};

export const Switch = ({ overrides, ...props }: SwitchProps) => (
  <BaseSwitch
    overrides={mergeOverrides(DEFAULT_OVERRIDES, overrides)}
    {...props}
  />
);

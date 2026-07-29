import { mergeOverrides } from "baseui";
import { type ButtonOverrides, type KIND, SIZE } from "baseui/button";

export const BUTTON_SIZE_OVERRIDES: Partial<Record<string, ButtonOverrides>> = {
  [SIZE.compact]: {
    BaseButton: {
      style: { height: "32px" },
    },
  },
};

// "Solid brand" — filled primary buttons. Base Web's `buttonDisabledFill`/`buttonDisabledText`
// theme tokens are shared across every kind, so we can't fix this in the theme without also
// graying-out disabled secondary/tertiary buttons — scope the fix to primary's own `:disabled`
// style instead, keeping the accent fill/text and just dialing back opacity.
const primaryOverrides: ButtonOverrides = {
  BaseButton: {
    style: {
      ":disabled": {
        backgroundColor: "var(--sk-accent)",
        color: "var(--sk-accent-on)",
        opacity: 0.6,
      },
    },
  },
};

// "Outlined chip" — bordered, surface-colored utility buttons in the topbar (Ask us,
// Notifications). Longhand border/radius properties (not the `border`/`borderRadius`
// shorthand) so each one lands as its own Styletron style key and reliably wins over
// Base Web's own longhand defaults regardless of injection order — see the shorthand vs.
// longhand note in the Tailwind/Styletron overrides guidance.
const secondaryOverrides: ButtonOverrides = {
  BaseButton: {
    style: {
      borderTopWidth: "1px",
      borderBottomWidth: "1px",
      borderLeftWidth: "1px",
      borderRightWidth: "1px",
      borderTopStyle: "solid",
      borderBottomStyle: "solid",
      borderLeftStyle: "solid",
      borderRightStyle: "solid",
      borderTopColor: "var(--sk-border)",
      borderBottomColor: "var(--sk-border)",
      borderLeftColor: "var(--sk-border)",
      borderRightColor: "var(--sk-border)",
    },
  },
};

// "Ghost" — borderless, transparent icon-only utility buttons (clear/close/copy).
const tertiaryOverrides: ButtonOverrides = {
  BaseButton: {
    style: {
      padding: "0",
      backgroundColor: "transparent",
    },
  },
};

export const BUTTON_KIND_OVERRIDES: Partial<Record<string, ButtonOverrides>> = {
  primary: primaryOverrides,
  secondary: secondaryOverrides,
  tertiary: tertiaryOverrides,
};

export const getButtonOverrides = (
  kind?: (typeof KIND)[keyof typeof KIND],
  size?: (typeof SIZE)[keyof typeof SIZE],
): ButtonOverrides =>
  mergeOverrides(
    kind ? BUTTON_KIND_OVERRIDES[kind] : undefined,
    size ? BUTTON_SIZE_OVERRIDES[size] : undefined,
  );

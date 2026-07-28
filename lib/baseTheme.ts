import { createLightTheme } from "baseui";

/**
 * Base Web theme values are static JS, not live CSS — but CSS custom property
 * strings ("var(--sk-accent)") are valid values here and get serialized as-is
 * into the generated stylesheet, so the browser resolves them at paint time.
 * That means this single theme automatically tracks the --sk-* light/dark
 * swap in app/globals.css ([data-theme]) with no separate dark theme object.
 */
export const skTheme = createLightTheme({
  colors: {
    // primaryA/primaryB are Base Web's foundation "default ink / default surface" pair — a lot
    // of component-level color defaults derive from them internally (e.g. menu item text color)
    // *before* our explicit overrides below are applied. Base Web's own defaults are black/white;
    // we point them at our ink/surface tokens instead of teal, otherwise every unset component
    // token that derives from "primary" quietly inherits the accent color instead of body text.
    primaryA: "var(--sk-text)",
    primaryB: "var(--sk-surface)",
    accent: "var(--sk-accent)",
    negative: "var(--red-600)",
    warning: "var(--orange-600)",
    positive: "var(--green-600)",

    backgroundPrimary: "var(--sk-surface)",
    backgroundSecondary: "var(--sk-surface-sunken)",
    backgroundTertiary: "var(--sk-surface-sunken)",
    contentPrimary: "var(--sk-text)",
    contentSecondary: "var(--sk-text-secondary)",
    contentTertiary: "var(--sk-text-tertiary)",
    borderOpaque: "var(--sk-border)",
    borderTransparent: "var(--sk-border)",
    borderSelected: "var(--sk-accent)",

    brandBackgroundPrimary: "var(--sk-accent)",
    brandContentOnPrimary: "var(--sk-accent-on)",
    brandContentPrimary: "var(--sk-accent-strong)",
    // Focus-ring color for Checkbox/Switch (shared getFocusOutlineStyle helper) — Base Web
    // defaults this to a near-black brand primitive, not derived from accent/primaryA.
    brandBorderAccessible: "var(--sk-accent)",
    // Focus-ring color for Input/Select's outline — also a standalone token, not derived.
    borderAccent: "var(--sk-accent)",

    buttonPrimaryFill: "var(--sk-accent)",
    buttonPrimaryText: "var(--sk-accent-on)",
    buttonPrimaryHover: "var(--sk-accent-hover)",
    buttonPrimaryActive: "var(--sk-accent-strong)",
    buttonSecondaryFill: "var(--sk-surface)",
    buttonSecondaryText: "var(--sk-text)",
    buttonSecondaryHover: "var(--sk-surface-sunken)",
    buttonTertiaryFill: "transparent",
    buttonTertiaryText: "var(--sk-text-secondary)",
    buttonTertiaryHover: "var(--sk-surface-sunken)",

    inputFill: "var(--sk-surface)",
    inputFillActive: "var(--sk-surface)",
    inputBorder: "var(--sk-border-strong)",
    inputPlaceholder: "var(--sk-text-tertiary)",

    // Note: Switch's checked-state colors (Toggle/ToggleTrack) come from the shared
    // contentInversePrimary/backgroundInversePrimary tokens (via primaryB/primaryA above),
    // not from a dedicated "toggleFillChecked"-style token — that token exists in Base Web's
    // theme *type*, but this version's Switch component doesn't actually read it. Switch.tsx
    // overrides Toggle/ToggleTrack directly for the accent look instead of hijacking the
    // shared inverse-surface tokens globally.

    tickFill: "var(--sk-surface)",
    tickFillHover: "var(--sk-surface)",
    tickFillActive: "var(--sk-surface)",
    tickFillSelected: "var(--sk-accent)",
    tickFillSelectedHover: "var(--sk-accent-hover)",
    tickFillSelectedHoverActive: "var(--sk-accent-strong)",
    tickBorder: "var(--sk-border-strong)",
    tickMarkFill: "var(--sk-accent-on)",

    menuFill: "var(--sk-surface)",
    menuFontDefault: "var(--sk-text)",
    menuFontHighlighted: "var(--sk-text)",
    menuFontSelected: "var(--sk-accent-strong)",

    modalCloseColor: "var(--sk-text-secondary)",
  },
  typography: {
    primaryFontFamily: "var(--font-sans)",
  },
  borders: {
    radius100: "7px",
    radius200: "9px",
    radius300: "10px",
    radius400: "14px",
    buttonBorderRadius: "9px",
    inputBorderRadius: "9px",
    popoverBorderRadius: "12px",
    surfaceBorderRadius: "14px",
    tagBorderRadius: "7px",
    checkboxBorderRadius: "5px",
  },
});

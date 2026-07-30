import { mergeOverrides } from "baseui";
import { Checkbox as BaseCheckbox, type CheckboxProps } from "baseui/checkbox";
import { Box } from "./Box";
import { Icon } from "./Icon";

type CheckmarkGlyphProps = {
  checked?: boolean;
  color: string;
  iconColor?: string;
};

/** Checked/unchecked square glyph — border+fill switch to `color` when checked. Exported
 * standalone since some toggles (e.g. CompetitorSelectorChips) render this look without a
 * real Checkbox input underneath (see a11y note there). */
export const CheckmarkGlyph = ({
  checked,
  color,
  iconColor = "#fff",
}: CheckmarkGlyphProps) => (
  <Box
    className="flex h-[15px] w-[15px] flex-shrink-0 items-center justify-center rounded"
    style={{
      border: `1.5px solid ${checked ? color : "var(--sk-border-strong)"}`,
      backgroundColor: checked ? color : "transparent",
    }}
  >
    {checked && <Icon name="ph-check" weight="bold" size={10} color={iconColor} />}
  </Box>
);

// Base Web's classic Checkbox bakes its checkmark glyph into an SVG data-URI background-image,
// with the fill set to a raw `var(--sk-accent-on)` string baked into the SVG markup — CSS
// custom properties can't resolve inside a data-URI image (it's an isolated resource, not part
// of the page's cascade), so the checkmark silently renders invisible no matter the theme.
// Swapping the whole Checkmark slot for CheckmarkGlyph sidesteps that entirely. A stable,
// module-scope component (not an inline closure) so Base Web doesn't remount it every render.
const IconCheckmark = ({
  $checked,
  backgroundColor,
}: {
  $checked?: boolean;
  backgroundColor: string;
}) => <CheckmarkGlyph checked={$checked} color={backgroundColor} iconColor="var(--sk-accent-on)" />;

type CheckboxOwnProps = CheckboxProps & {
  /** Swaps in the CheckmarkGlyph above instead of Base Web's default checkmark. */
  icon?: boolean;
  backgroundColor?: string;
};

export const Checkbox = ({
  icon,
  backgroundColor = "var(--sk-accent)",
  overrides,
  ...props
}: CheckboxOwnProps) => (
  <BaseCheckbox
    overrides={mergeOverrides(
      icon
        ? {
            // Root defaults to alignItems:"flex-start" (a top-aligned label, meant to pair
            // with Label's own compensating top-padding for Base Web's original 17px
            // Checkmark) — our 15px replacement doesn't match that padding hack, so center
            // both directly instead.
            Root: { style: { alignItems: "center" } },
            Checkmark: { component: IconCheckmark, props: { backgroundColor } },
          }
        : undefined,
      overrides,
    )}
    {...props}
  />
);

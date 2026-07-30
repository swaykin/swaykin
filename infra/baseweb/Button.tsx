import { mergeOverrides } from "baseui";
import { Button as BaseButton, SIZE, type ButtonProps } from "baseui/button";
import {
  BUTTON_FONT_WEIGHTS,
  BUTTON_KIND_OVERRIDES,
  type ButtonFontWeight,
} from "./buttonKindOverrides";

type ButtonOwnProps = ButtonProps & {
  height?: string;
  width?: string;
  maxWidth?: string;
  weight?: ButtonFontWeight;
  fontSize?: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
};

export const Button = ({
  kind = "primary",
  size,
  height,
  width,
  maxWidth,
  weight,
  fontSize,
  textColor,
  backgroundColor,
  borderColor,
  overrides,
  ...props
}: ButtonOwnProps) => (
  <BaseButton
    kind={kind}
    size={size}
    overrides={mergeOverrides(
      mergeOverrides(BUTTON_KIND_OVERRIDES[kind], {
        BaseButton: {
          style: {
            ...(height ? { height } : undefined),
            ...(width ? { width } : undefined),
            ...(maxWidth ? { maxWidth } : undefined),
            ...(weight ? { fontWeight: BUTTON_FONT_WEIGHTS[weight] } : undefined),
            ...(fontSize ? { fontSize } : undefined),
            ...(textColor ? { color: textColor } : undefined),
            ...(backgroundColor ? { backgroundColor } : undefined),
            ...(borderColor
              ? {
                  borderTopColor: borderColor,
                  borderRightColor: borderColor,
                  borderBottomColor: borderColor,
                  borderLeftColor: borderColor,
                }
              : undefined),
          },
        },
      }),
      overrides,
    )}
    {...props}
  />
);

export { SIZE };

import type { ReactNode } from "react";
import { mergeOverrides } from "baseui";
import { Button as BaseButton, SIZE, type ButtonProps } from "baseui/button";
import {
  BUTTON_FONT_WEIGHTS,
  BUTTON_KIND_OVERRIDES,
  type ButtonFontWeight,
} from "./buttonKindOverrides";
import { StatefulTooltip } from "./StatefulTooltip";

type ButtonOwnProps = ButtonProps & {
  height?: string;
  width?: string;
  maxWidth?: string;
  weight?: ButtonFontWeight;
  fontSize?: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  tooltip?: ReactNode;
};

export const Button = ({
  kind = "primary",
  size = "small",
  height,
  width,
  maxWidth,
  weight = "semiBold",
  fontSize = size === "small" ? "12.5px" : undefined,
  textColor,
  backgroundColor,
  borderColor,
  tooltip,
  overrides,
  ...props
}: ButtonOwnProps) => {
  const button = (
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

  return tooltip ? (
    <StatefulTooltip content={tooltip}>{button}</StatefulTooltip>
  ) : (
    button
  );
};

export { SIZE };

import type { ReactNode } from "react";
import { mergeOverrides } from "baseui";
import { Button as BaseButton, type ButtonProps, SIZE } from "baseui/button";
import { BUTTON_KIND_OVERRIDES } from "./buttonKindOverrides";
import { StatefulTooltip } from "./StatefulTooltip";

type IconButtonOwnProps = ButtonProps & {
  height?: string;
  width?: string;
  tooltip?: ReactNode;
  backgroundColor?: string;
  borderRadius?: string;
};

export const IconButton = ({
  kind = "primary",
  size,
  height,
  width,
  tooltip,
  overrides,
  borderRadius,
  backgroundColor,
  ...props
}: IconButtonOwnProps) => {
  const button = (
    <BaseButton
      kind={kind}
      shape="square"
      size={size}
      overrides={mergeOverrides(
        mergeOverrides(BUTTON_KIND_OVERRIDES[kind], {
          BaseButton: {
            style: {
              ...(height ? { height } : undefined),
              ...(width ? { width } : undefined),
              ...(backgroundColor ? { backgroundColor } : undefined),
              ...(borderRadius
                ? {
                    borderTopLeftRadius: borderRadius,
                    borderTopRightRadius: borderRadius,
                    borderBottomRightRadius: borderRadius,
                    borderBottomLeftRadius: borderRadius,
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

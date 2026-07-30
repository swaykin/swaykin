import { mergeOverrides } from "baseui";
import { Button as BaseButton, type ButtonProps, SIZE } from "baseui/button";
import { BUTTON_KIND_OVERRIDES } from "./buttonKindOverrides";

type IconButtonOwnProps = ButtonProps & {
  height?: string;
  width?: string;
};

export const IconButton = ({
  kind = "primary",
  size,
  height,
  width,
  overrides,
  ...props
}: IconButtonOwnProps) => (
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
          },
        },
      }),
      overrides,
    )}
    {...props}
  />
);

export { SIZE };

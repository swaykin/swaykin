import { mergeOverrides } from "baseui";
import { Input as BaseInput, type InputProps } from "baseui/input";

type InputOwnProps = InputProps & {
  height?: string;
  width?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  backgroundColor?: string;
  fontSize?: string;
};

export const Input = ({
  height,
  width,
  borderRadius,
  borderWidth,
  borderColor,
  backgroundColor,
  fontSize,
  overrides,
  ...props
}: InputOwnProps) => (
  <BaseInput
    overrides={mergeOverrides(
      {
        Root: {
          style: {
            ...(height ? { height } : undefined),
            ...(width ? { width } : undefined),
            ...(borderRadius
              ? {
                  borderTopLeftRadius: borderRadius,
                  borderTopRightRadius: borderRadius,
                  borderBottomRightRadius: borderRadius,
                  borderBottomLeftRadius: borderRadius,
                }
              : undefined),
            ...(borderWidth
              ? {
                  borderTopWidth: borderWidth,
                  borderBottomWidth: borderWidth,
                  borderLeftWidth: borderWidth,
                  borderRightWidth: borderWidth,
                }
              : undefined),
            ...(borderColor
              ? {
                  borderTopColor: borderColor,
                  borderBottomColor: borderColor,
                  borderLeftColor: borderColor,
                  borderRightColor: borderColor,
                }
              : undefined),
            ...(backgroundColor ? { backgroundColor } : undefined),
          },
        },
        // Base Web's InputContainer paints its own opaque background on top of Root, so a
        // caller-set backgroundColor needs to land on both to actually show through.
        InputContainer: {
          style: {
            ...(backgroundColor ? { backgroundColor } : undefined),
          },
        },
        Input: {
          style: {
            ...(fontSize ? { fontSize } : undefined),
          },
        },
      },
      overrides,
    )}
    {...props}
  />
);

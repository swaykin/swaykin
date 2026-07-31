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
  borderWidth = "1px",
  borderColor,
  backgroundColor = "var(--sk-surface-sunken)",
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
        // Base Web's InputContainer/StartEnhancer/EndEnhancer each paint their own opaque
        // background on top of Root, so a caller-set backgroundColor needs to land on all of
        // them to actually show through — not just Root. (Padding around enhancers is left
        // alone here — that's call-site-specific, not a shared primitive concern.)
        InputContainer: {
          style: {
            ...(backgroundColor ? { backgroundColor } : undefined),
          },
        },
        StartEnhancer: {
          style: {
            ...(backgroundColor ? { backgroundColor } : undefined),
          },
        },
        EndEnhancer: {
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

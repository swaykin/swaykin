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
  borderColor = "var(--sk-border)",
  backgroundColor = "var(--sk-surface-sunken)",
  fontSize,
  overrides,
  startEnhancer,
  endEnhancer,
  ...props
}: InputOwnProps) => (
  <BaseInput
    startEnhancer={startEnhancer}
    endEnhancer={endEnhancer}
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
            // Base Web's Root keeps its own left/right inset even when an enhancer already
            // supplies one, doubling up the gap to the icon — drop the Root side once an
            // enhancer takes over that side.
            ...(startEnhancer ? { paddingLeft: 0 } : undefined),
            ...(endEnhancer ? { paddingRight: 0 } : undefined),
          },
        },
        // Base Web's InputContainer/StartEnhancer/EndEnhancer each paint their own opaque
        // background on top of Root, so a caller-set backgroundColor needs to land on all of
        // them to actually show through — not just Root.
        InputContainer: {
          style: {
            ...(backgroundColor ? { backgroundColor } : undefined),
            ...(startEnhancer ? { paddingLeft: 0 } : undefined),
            ...(endEnhancer ? { paddingRight: 0 } : undefined),
          },
        },
        StartEnhancer: {
          style: {
            ...(backgroundColor ? { backgroundColor } : undefined),
            ...(startEnhancer
              ? { paddingLeft: "10px", paddingRight: "6px" }
              : undefined),
          },
        },
        EndEnhancer: {
          style: {
            ...(backgroundColor ? { backgroundColor } : undefined),
            ...(endEnhancer
              ? { paddingLeft: "6px", paddingRight: "10px" }
              : undefined),
          },
        },
        Input: {
          style: {
            ...(fontSize ? { fontSize } : undefined),
            // The inner <input> carries its own 14px inset regardless of enhancers, stacking
            // on top of StartEnhancer/EndEnhancer's own gap — drop the side an enhancer owns.
            ...(startEnhancer ? { paddingLeft: 0 } : undefined),
            ...(endEnhancer ? { paddingRight: 0 } : undefined),
          },
        },
      },
      overrides,
    )}
    {...props}
  />
);

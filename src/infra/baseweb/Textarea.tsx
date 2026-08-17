import { mergeOverrides } from "baseui";
import {
  Textarea as BaseTextarea,
  type TextareaProps as TextareaPropsType,
  type SharedStyleProps,
} from "baseui/textarea";

export type TextareaProps = TextareaPropsType & {
  height?: string;
  width?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  backgroundColor?: string;
  fontSize?: string;
};

export const Textarea = ({
  height,
  width,
  borderRadius,
  borderWidth = "1px",
  borderColor = "var(--sk-border)",
  backgroundColor,
  fontSize,
  overrides,
  ...props
}: TextareaProps) => (
  <BaseTextarea
    overrides={mergeOverrides(
      {
        Root: {
          style: ({ $isFocused }: SharedStyleProps) => {
            const activeBorderColor = $isFocused
              ? "var(--sk-accent)"
              : borderColor;
            return {
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
              ...(activeBorderColor
                ? {
                    borderTopColor: activeBorderColor,
                    borderBottomColor: activeBorderColor,
                    borderLeftColor: activeBorderColor,
                    borderRightColor: activeBorderColor,
                  }
                : undefined),
              ...(backgroundColor ? { backgroundColor } : undefined),
            };
          },
        },
        // Base Web's InputContainer paints its own opaque background on top of Root, so a
        // caller-set backgroundColor needs to land there too to actually show through.
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

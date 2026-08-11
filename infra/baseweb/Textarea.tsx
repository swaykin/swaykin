import { mergeOverrides } from "baseui";
import {
  Textarea as BaseTextarea,
  type TextareaProps as TextareaPropsType,
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

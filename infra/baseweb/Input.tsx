import { mergeOverrides } from "baseui";
import {
  Input as BaseInput,
  type InputProps as InputPropsType,
  type SharedProps,
} from "baseui/input";
import { Box } from "./Box";
import { Icon } from "./Icon";

export type InputProps = Omit<InputPropsType, "type"> & {
  type?: InputPropsType["type"] | "userName";
  height?: string;
  width?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  backgroundColor?: string;
  fontSize?: string;
};

const UserNameEnhancer = ({ size }: { size?: string }) => (
  <Box className="flex items-center">
    <Icon
      name="ph-instagram-logo"
      weight="fill"
      size={size === "compact" ? 13 : 16}
      color="#E1306C"
      className="mr-1.5"
    />
    <Box as="span" className="text-md font-bold text-text-tertiary">
      @
    </Box>
  </Box>
);

export const Input = ({
  type,
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
}: InputProps) => {
  const isUserName = type === "userName";
  const resolvedStartEnhancer = isUserName ? (
    <UserNameEnhancer size={props.size} />
  ) : (
    startEnhancer
  );

  return (
    <BaseInput
      type={isUserName ? "text" : type}
      startEnhancer={resolvedStartEnhancer}
      endEnhancer={endEnhancer}
      overrides={mergeOverrides(
        {
          Root: {
            style: ({ $isFocused }: SharedProps) => {
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
                // Base Web's Root keeps its own left/right inset even when an enhancer already
                // supplies one, doubling up the gap to the icon — drop the Root side once an
                // enhancer takes over that side.
                ...(resolvedStartEnhancer ? { paddingLeft: 0 } : undefined),
                ...(endEnhancer ? { paddingRight: 0 } : undefined),
              };
            },
          },
          // Base Web's InputContainer/StartEnhancer/EndEnhancer each paint their own opaque
          // background on top of Root, so a caller-set backgroundColor needs to land on all of
          // them to actually show through — not just Root.
          InputContainer: {
            style: {
              ...(backgroundColor ? { backgroundColor } : undefined),
              ...(resolvedStartEnhancer ? { paddingLeft: 0 } : undefined),
              ...(endEnhancer ? { paddingRight: 0 } : undefined),
            },
          },
          StartEnhancer: {
            style: {
              ...(backgroundColor ? { backgroundColor } : undefined),
              ...(resolvedStartEnhancer
                ? {
                    paddingLeft: "10px",
                    // "@" sits flush against the typed value — only a generic (non-userName)
                    // enhancer, like a globe/search icon, keeps a gap before the text.
                    paddingRight: isUserName ? "0px" : "6px",
                  }
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
              ...(resolvedStartEnhancer ? { paddingLeft: 0 } : undefined),
              ...(endEnhancer ? { paddingRight: 0 } : undefined),
            },
          },
        },
        overrides,
      )}
      {...props}
    />
  );
};

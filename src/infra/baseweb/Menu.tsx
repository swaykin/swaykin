import { mergeOverrides } from "baseui";
import { StatefulMenu, type StatefulMenuProps } from "baseui/menu";

type MenuOwnProps = StatefulMenuProps & {
  width?: string;
};

export const Menu = ({ width = "220px", overrides, ...props }: MenuOwnProps) => (
  <StatefulMenu
    overrides={mergeOverrides(
      {
        List: {
          style: {
            width,
            borderTopWidth: "1px",
            borderBottomWidth: "1px",
            borderLeftWidth: "1px",
            borderRightWidth: "1px",
            borderTopStyle: "solid",
            borderBottomStyle: "solid",
            borderLeftStyle: "solid",
            borderRightStyle: "solid",
            borderTopColor: "var(--sk-border)",
            borderBottomColor: "var(--sk-border)",
            borderLeftColor: "var(--sk-border)",
            borderRightColor: "var(--sk-border)",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            borderBottomRightRadius: "12px",
            borderBottomLeftRadius: "12px",
            backgroundColor: "var(--sk-surface)",
            boxShadow: "var(--sk-shadow-overlay)",
            padding: "8px",
          },
        },
      },
      overrides,
    )}
    {...props}
  />
);

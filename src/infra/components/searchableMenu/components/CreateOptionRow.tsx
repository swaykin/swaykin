import { Button } from "@/infra/baseweb/Button";
import { Icon } from "@/infra/baseweb/Icon";

type CreateOptionRowProps = {
  value: string;
  onClick: () => void;
};

export const CreateOptionRow = ({ value, onClick }: CreateOptionRowProps) => (
  <Button
    kind="tertiary"
    onClick={onClick}
    startEnhancer={<Icon name="ph-plus" weight="bold" size={14} />}
    overrides={{
      BaseButton: {
        style: {
          width: "100%",
          justifyContent: "flex-start",
          paddingTop: "2.5px",
          paddingBottom: "2.5px",
          paddingLeft: "8px",
          paddingRight: "8px",
          fontSize: "12.5px",
          lineHeight: "24px",
          borderTopLeftRadius: "7px",
          borderTopRightRadius: "7px",
          borderBottomRightRadius: "7px",
          borderBottomLeftRadius: "7px",
          "@media (hover: hover)": {
            ":hover": {
              backgroundColor: "var(--sk-surface-sunken)",
              boxShadow: "none",
            },
          },
        },
      },
    }}
  >
    Create &quot;{value}&quot;
  </Button>
);

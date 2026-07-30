import { Box } from "@/infra/baseweb/Box";
import { Checkbox } from "@/infra/baseweb/Checkbox";

const OPTION_CHECKBOX_OVERRIDES = {
  Root: { style: { width: "100%" } },
  Label: {
    style: {
      fontSize: "12.5px",
      color: "var(--sk-text)",
      paddingLeft: "8px",
      paddingTop: "0px",
    },
  },
};

type OptionRowProps = {
  label: string;
  checked: boolean;
  onToggle: () => void;
};

export const OptionRow = ({ label, checked, onToggle }: OptionRowProps) => (
  <Box className="rounded-[7px] px-2 py-[2.5px] hover:bg-sunken">
    <Checkbox
      icon
      checked={checked}
      onChange={onToggle}
      overrides={OPTION_CHECKBOX_OVERRIDES}
    >
      {label}
    </Checkbox>
  </Box>
);

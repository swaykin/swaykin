import { Box } from "@/infra/baseweb/Box";
import { Checkbox } from "@/infra/baseweb/Checkbox";
import { Truncate } from "@/infra/components/Truncate";

const OPTION_CHECKBOX_OVERRIDES = {
  Root: { style: { width: "100%" } },
  Label: {
    style: {
      display: "flex",
      minWidth: 0,
      fontSize: "12.5px",
      color: "var(--sk-text)",
      paddingLeft: "8px",
      paddingTop: "0px",
    },
  },
};

type ListMembershipMenuProps = {
  lists: string[];
  selected: string[];
  onToggle: (list: string) => void;
};

export const ListMembershipMenu = ({
  lists,
  selected,
  onToggle,
}: ListMembershipMenuProps) => (
  <Box className="w-[210px] rounded-xl border border-border bg-surface p-2 shadow-overlay">
    {lists.map((list) => (
      <Box key={list} className="rounded-[7px] px-2 py-1 hover:bg-sunken">
        <Checkbox
          icon
          checked={selected.includes(list)}
          onChange={() => onToggle(list)}
          overrides={OPTION_CHECKBOX_OVERRIDES}
        >
          <Truncate>{list}</Truncate>
        </Checkbox>
      </Box>
    ))}
  </Box>
);

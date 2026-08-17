import { StatefulPopover } from "@/infra/baseweb/StatefulPopover";
import { IconButton } from "@/infra/baseweb/IconButton";
import { Icon } from "@/infra/baseweb/Icon";
import { ListMembershipMenu } from "./ListMembershipMenu";

type ListMembershipButtonProps = {
  name: string;
  lists: string[];
  selected: string[];
  onToggle: (list: string) => void;
};

export const ListMembershipButton = ({
  name,
  lists,
  selected,
  onToggle,
}: ListMembershipButtonProps) => (
  <StatefulPopover
    placement="bottomRight"
    content={
      <ListMembershipMenu
        lists={lists}
        selected={selected}
        onToggle={onToggle}
      />
    }
  >
    <IconButton
      kind="tertiary"
      type="button"
      size="xSmall"
      aria-label={`Manage lists for ${name}`}
      height="20px"
      width="20px"
      borderRadius="6px"
      backgroundColor="var(--sk-surface-sunken)"
    >
      <Icon name="ph-plus" weight="bold" size={12} />
    </IconButton>
  </StatefulPopover>
);

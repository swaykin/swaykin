import { Avatar } from "@/infra/baseweb/Avatar";
import { Box } from "@/infra/baseweb/Box";
import { Checkbox } from "@/infra/baseweb/Checkbox";
import { Icon } from "@/infra/baseweb/Icon";
import type { Influencer } from "@/mocks/discovery";
import { ListMembershipButton } from "./ListMembershipButton";

type SavedInfluencerCardHeaderProps = {
  influencer: Influencer;
  selected: boolean;
  onToggleSelect: () => void;
  onOpen: () => void;
  lists: string[];
  listNames: string[];
  onToggleList: (list: string) => void;
};

export const SavedInfluencerCardHeader = ({
  influencer,
  selected,
  onToggleSelect,
  onOpen,
  lists,
  listNames,
  onToggleList,
}: SavedInfluencerCardHeaderProps) => (
  <Box className="flex items-start gap-2.5">
    <Checkbox
      icon
      checked={selected}
      onChange={onToggleSelect}
      overrides={{ Root: { style: { marginTop: "5px" } } }}
    />
    <Box
      className="flex min-w-0 flex-1 cursor-pointer items-start gap-2.5"
      onClick={onOpen}
    >
      <Avatar name={influencer.name} size="44px" fontSize="14px" />
      <Box className="min-w-0 flex-1">
        <Box className="flex items-center gap-1.5">
          <Box as="span" className="truncate text-[13.5px] font-bold text-text">
            {influencer.name}
          </Box>
          {influencer.verified && (
            <Icon
              name="ph-seal-check"
              weight="fill"
              size={13}
              color="var(--sk-accent-strong)"
            />
          )}
        </Box>
        <Box className="truncate text-[11.5px] text-text-tertiary">
          @{influencer.handle} · {influencer.niche}
          {influencer.location ? ` · ${influencer.location}` : ""}
        </Box>
      </Box>
    </Box>
    <ListMembershipButton
      name={influencer.name}
      lists={listNames}
      selected={lists}
      onToggle={onToggleList}
    />
  </Box>
);

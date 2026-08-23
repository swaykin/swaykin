import { formatCompactNumber } from "@/lib/format";
import { Avatar } from "@/infra/baseweb/Avatar";
import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { Checkbox } from "@/infra/baseweb/Checkbox";
import { Icon } from "@/infra/baseweb/Icon";
import { IconButton } from "@/infra/baseweb/IconButton";
import { StatTile } from "@/infra/components/StatTile";
import { Tag } from "@/infra/components/Tag";
import type { Creator } from "../../types";

type CreatorCardProps = {
  creator: Creator;
  selected: boolean;
  onToggleSelect: () => void;
  saved: boolean;
  onToggleShortlist: () => void;
  onOpen: () => void;
};

type CreatorCardHeaderProps = {
  creator: Creator;
  selected: boolean;
  onToggleSelect: () => void;
  saved: boolean;
  onToggleShortlist: () => void;
  onOpen: () => void;
};

const CreatorCardHeader = ({
  creator,
  selected,
  onToggleSelect,
  saved,
  onToggleShortlist,
  onOpen,
}: CreatorCardHeaderProps) => (
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
      <Avatar name={creator.name} size="44px" fontSize="14px" />
      <Box className="min-w-0 flex-1">
        <Box className="flex items-center gap-1.5">
          <Box as="span" className="truncate text-[13.5px] font-bold text-text">
            {creator.name}
          </Box>
          {creator.verified && (
            <Icon
              name="ph-seal-check"
              weight="fill"
              size={13}
              color="var(--sk-accent-strong)"
            />
          )}
        </Box>
        <Box className="truncate text-[11.5px] text-text-tertiary">
          @{creator.handle}
          {creator.location ? ` · ${creator.location}` : ""}
        </Box>
      </Box>
    </Box>
    {/* <IconButton
      kind="tertiary"
      type="button"
      aria-label={saved ? "Remove from shortlist" : "Add to shortlist"}
      tooltip={saved ? "Remove from shortlist" : "Add to shortlist"}
      onClick={onToggleShortlist}
      height="auto"
      width="auto"
    >
      <Icon
        name="ph-bookmark-simple"
        weight={saved ? "fill" : "regular"}
        size={17}
        color={saved ? "var(--sk-accent-strong)" : "var(--sk-text-tertiary)"}
      />
    </IconButton> */}
  </Box>
);

type CreatorCardFooterProps = {
  handle: string;
  onOpen: () => void;
};

const CreatorCardFooter = ({ handle, onOpen }: CreatorCardFooterProps) => (
  <Box className="flex gap-2">
    <a
      href={`https://instagram.com/${handle}`}
      target="_blank"
      rel="noreferrer"
      className="flex h-9 w-[42px] flex-shrink-0 items-center justify-center rounded-[9px] border border-border bg-sunken"
    >
      <Icon name="ph-instagram-logo" weight="fill" size={16} color="#E1306C" />
    </a>
    <Button
      kind="tertiary"
      onClick={onOpen}
      width="100%"
      height="36px"
      weight="bold"
      textColor="var(--sk-accent-strong)"
      backgroundColor="var(--sk-accent-subtle)"
      endEnhancer={<Icon name="ph-arrow-right" weight="bold" size={13} />}
    >
      View full profile
    </Button>
  </Box>
);

export const CreatorCard = ({
  creator,
  selected,
  onToggleSelect,
  saved,
  onToggleShortlist,
  onOpen,
}: CreatorCardProps) => (
  <Box
    className="flex flex-col gap-3 rounded-2xl bg-surface p-4"
    style={{
      border: `1px solid ${selected ? "var(--sk-accent)" : "var(--sk-border)"}`,
      boxShadow: selected ? "var(--sk-shadow-raised)" : "var(--sk-shadow-card)",
    }}
  >
    <CreatorCardHeader
      creator={creator}
      selected={selected}
      onToggleSelect={onToggleSelect}
      saved={saved}
      onToggleShortlist={onToggleShortlist}
      onOpen={onOpen}
    />

    <Box className="flex flex-wrap gap-1.5">
      <Tag label={creator.niche} />
      {!!creator.collabs?.length && (
        <Tag label="Recent collabs" icon="ph-handshake" tone="accent" />
      )}
      {creator.email && (
        <Tag label="Email available" icon="ph-envelope-simple" tone="teal" />
      )}
    </Box>

    <Box className="grid grid-cols-2 gap-2">
      <StatTile
        label="Followers"
        value={formatCompactNumber(creator.followersNum)}
      />
      <StatTile
        label="Engagement"
        value={`${creator.erNum.toFixed(1)}%`}
        valueColor="var(--green-700)"
      />
      <StatTile
        label="Avg. likes"
        value={formatCompactNumber(creator.avgLikesNum)}
      />
      <StatTile
        label="Avg. comments"
        value={formatCompactNumber(creator.avgCommentsNum)}
      />
    </Box>
    <CreatorCardFooter handle={creator.handle} onOpen={onOpen} />
  </Box>
);

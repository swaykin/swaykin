import { formatCompactNumber } from "@/lib/format";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { StatTile } from "@/infra/components/StatTile";
import type { Influencer } from "@/mocks/discovery";
import { ListBadges } from "./ListBadges";
import { SavedInfluencerCardHeader } from "./SavedInfluencerCardHeader";
import { StatTrendLabel } from "./StatTrendLabel";
import { StatusPillButton } from "./StatusPillButton";

type SavedInfluencerCardProps = {
  influencer: Influencer;
  selected: boolean;
  onToggleSelect: () => void;
  onOpen: () => void;
  listNames: string[];
  onToggleList: (list: string) => void;
  onChangeStatus: (status: NonNullable<Influencer["status"]>) => void;
};

export const SavedInfluencerCard = ({
  influencer,
  selected,
  onToggleSelect,
  onOpen,
  listNames,
  onToggleList,
  onChangeStatus,
}: SavedInfluencerCardProps) => {
  const lists = influencer.lists ?? [];
  const status = influencer.status ?? "Not Contacted";

  return (
    <Box
      className="flex flex-col gap-3 rounded-2xl bg-surface p-4"
      style={{
        border: `1px solid ${selected ? "var(--sk-accent)" : "var(--sk-border)"}`,
        boxShadow: selected ? "var(--sk-shadow-raised)" : "var(--sk-shadow-card)",
      }}
    >
      <SavedInfluencerCardHeader
        influencer={influencer}
        selected={selected}
        onToggleSelect={onToggleSelect}
        onOpen={onOpen}
        lists={lists}
        listNames={listNames}
        onToggleList={onToggleList}
      />

      {lists.length > 0 && <ListBadges lists={lists} />}

      <Box className="grid grid-cols-2 gap-2">
        <StatTile
          value={formatCompactNumber(influencer.followersNum)}
          label={
            <StatTrendLabel
              label="Followers"
              change={influencer.followerChangePct ?? 0}
              suffix="%"
            />
          }
        />
        <StatTile
          value={`${influencer.erNum.toFixed(1)}%`}
          label={
            <StatTrendLabel
              label="Engagement"
              change={influencer.erChangePts ?? 0}
              suffix="pts"
            />
          }
        />
      </Box>

      {!!influencer.newPostsCount && (
        <Box className="flex items-center gap-1.5 rounded-[7px] bg-accent-subtle px-2.5 py-1.5 text-[11.5px] font-semibold text-accent-strong">
          <Icon name="ph-sparkle" weight="fill" size={12} />
          {influencer.newPostsCount} new post
          {influencer.newPostsCount === 1 ? "" : "s"}
        </Box>
      )}

      <Box className="flex flex-wrap items-center gap-2">
        <StatusPillButton status={status} onSelect={onChangeStatus} />
        <Box className="flex-1" />
        <Box as="span" className="whitespace-nowrap text-[10.5px] text-text-tertiary">
          Saved {influencer.savedDaysAgo ?? 0}d ago
        </Box>
      </Box>
    </Box>
  );
};

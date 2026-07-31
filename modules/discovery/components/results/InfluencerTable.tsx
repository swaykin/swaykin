import { formatCompactNumber } from "@/lib/format";
import { Avatar } from "@/infra/baseweb/Avatar";
import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { Checkbox } from "@/infra/baseweb/Checkbox";
import { Icon } from "@/infra/baseweb/Icon";
import { StickyColumnDivider } from "@/infra/components/StickyColumnDivider";
import type { Influencer } from "../../types";

type InfluencerTableProps = {
  influencers: Influencer[];
  selected: Record<string, boolean>;
  onToggleSelect: (id: string) => void;
  onOpen: (id: string) => void;
};

const HEADER_CELL =
  "border-b border-border bg-sunken px-3 py-2.5 text-[10.5px] font-bold uppercase tracking-wide text-text-tertiary";
const BODY_CELL = "border-b border-border px-3 py-2.5";

const InfluencerRow = ({
  influencer,
  selected,
  onToggleSelect,
  onOpen,
}: {
  influencer: Influencer;
  selected: boolean;
  onToggleSelect: () => void;
  onOpen: () => void;
}) => (
  <tr>
    <td
      className={`${BODY_CELL} sticky left-0 z-[1] max-w-8 bg-surface px-3.5`}
    >
      <Checkbox icon checked={selected} onChange={onToggleSelect} />
    </td>
    <td
      className={`${BODY_CELL} sticky left-8 z-[1] cursor-pointer bg-surface`}
      onClick={onOpen}
    >
      <Box className="flex items-center gap-2">
        <Avatar name={influencer.name} size="28px" fontSize="11px" />
        <Box className="min-w-0">
          <Box className="flex items-center gap-1 text-[12.5px] font-semibold text-text">
            <Box as="span" className="truncate">
              {influencer.name}
            </Box>
            {influencer.verified && (
              <Icon
                name="ph-seal-check"
                weight="fill"
                size={11}
                color="var(--sk-accent-strong)"
              />
            )}
          </Box>
          <Box className="truncate text-[11.5px] text-text-tertiary">
            @{influencer.handle}
          </Box>
        </Box>
      </Box>
      <StickyColumnDivider />
    </td>
    <td className={`${BODY_CELL} pl-10 text-[12.5px] text-text-secondary`}>
      {influencer.niche}
    </td>
    <td className={`${BODY_CELL} text-right text-[12.5px] text-text`}>
      {formatCompactNumber(influencer.followersNum)}
    </td>
    <td
      className={`${BODY_CELL} text-right text-[12.5px] font-bold`}
      style={{ color: "var(--green-700)" }}
    >
      {influencer.erNum.toFixed(1)}%
    </td>
    <td className={`${BODY_CELL} text-right text-[12.5px] text-text`}>
      {formatCompactNumber(influencer.avgLikesNum)}
    </td>
    <td className={`${BODY_CELL} text-right text-[12.5px] text-text`}>
      {formatCompactNumber(influencer.avgCommentsNum)}
    </td>
    <td className={`${BODY_CELL} text-center`}>
      {influencer.hasCollabs && (
        <Icon
          name="ph-handshake"
          weight="fill"
          size={14}
          color="var(--sk-accent-strong)"
        />
      )}
    </td>
    <td className={`${BODY_CELL} text-center`}>
      {influencer.hasEmail && (
        <Icon
          name="ph-envelope-simple"
          weight="fill"
          size={14}
          color="var(--teal-600)"
        />
      )}
    </td>
    <td className={`${BODY_CELL} px-3.5 text-right`}>
      <Button
        kind="tertiary"
        onClick={onOpen}
        height="auto"
        weight="bold"
        fontSize="12px"
        textColor="var(--sk-link)"
        endEnhancer={<Icon name="ph-arrow-right" weight="bold" size={11} />}
        overrides={{
          BaseButton: {
            style: {
              "@media (hover: hover)": {
                ":hover": { boxShadow: "none" },
              },
            },
          },
        }}
      >
        View
      </Button>
    </td>
  </tr>
);

export const InfluencerTable = ({
  influencers,
  selected,
  onToggleSelect,
  onOpen,
}: InfluencerTableProps) => (
  <Box className="overflow-hidden overflow-x-auto rounded-2xl border border-border bg-surface">
    {/* Auto layout (not `table-fixed`) with a width *hint* on every column — `table-fixed`
        treats one unhinted column as the sole outlet for leftover width when the table is
        stretched to `w-full`, which dumped 500+px of empty space into whichever column
        lacked a rule. Auto layout instead grows every column proportionally from its hint. */}
    <table className="w-full min-w-[1080px] border-collapse">
      <thead>
        <tr>
          <th
            className={`${HEADER_CELL} sticky left-0 z-[2] w-8 max-w-8 px-3.5`}
          />
          <th
            className={`${HEADER_CELL} sticky left-8 z-[2] w-[190px] text-left`}
          >
            Creator
            <StickyColumnDivider />
          </th>
          <th className={`${HEADER_CELL} w-[110px] pl-10 text-left`}>
            Category
          </th>
          <th className={`${HEADER_CELL} w-[90px] text-right`}>Followers</th>
          <th className={`${HEADER_CELL} w-[100px] text-right`}>Engagement</th>
          <th className={`${HEADER_CELL} w-[90px] text-right`}>Avg. likes</th>
          <th className={`${HEADER_CELL} w-[100px] text-right`}>
            Avg. comments
          </th>
          <th className={`${HEADER_CELL} w-[70px] text-center`}>Collabs</th>
          <th className={`${HEADER_CELL} w-[70px] text-center`}>Email</th>
          <th className={`${HEADER_CELL} w-[90px] px-3.5`} />
        </tr>
      </thead>
      <tbody>
        {influencers.map((influencer) => (
          <InfluencerRow
            key={influencer.id}
            influencer={influencer}
            selected={!!selected[influencer.id]}
            onToggleSelect={() => onToggleSelect(influencer.id)}
            onOpen={() => onOpen(influencer.id)}
          />
        ))}
      </tbody>
    </table>
  </Box>
);

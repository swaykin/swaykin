import { Avatar } from "@/infra/baseweb/Avatar";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import type { Collaboration } from "@/mocks/competitors";

type CollaborationsListProps = {
  collabs: Collaboration[];
};

const CollaborationRow = ({ collab }: { collab: Collaboration }) => (
  <Box className="flex items-center gap-2.5 rounded-[10px] px-3 py-[9px] hover:bg-sunken">
    <Avatar name={collab.name} size="32px" fontSize="11px" />
    <Box className="min-w-0 flex-1">
      <Box className="flex items-center gap-1.5">
        <Box as="span" className="text-[12.5px] font-bold text-text">
          {collab.name}
        </Box>
        <Box
          as="span"
          className="rounded-[5px] bg-sunken px-1.5 py-px text-[9.5px] font-bold text-text-secondary"
        >
          {collab.tier}
        </Box>
        {collab.worksWithYou && (
          <Box
            as="span"
            className="flex items-center gap-1 rounded-[5px] bg-accent-subtle px-1.5 py-px text-[9.5px] font-bold text-accent-strong"
          >
            <Icon name="ph-star" weight="fill" size={9} />
            Also works with you
          </Box>
        )}
      </Box>
      <Box className="text-[11px] text-text-tertiary">
        {collab.eng} eng. · last collab {collab.lastDate}
      </Box>
    </Box>
  </Box>
);

export const CollaborationsList = ({ collabs }: CollaborationsListProps) => (
  <Box className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
    <Box className="px-5 pb-1 pt-4 text-sm font-bold text-text">
      Influencer collaborations
    </Box>
    <Box className="px-2 pb-3 pt-2">
      {collabs.map((collab, i) => (
        <CollaborationRow key={`${collab.name}-${i}`} collab={collab} />
      ))}
    </Box>
  </Box>
);

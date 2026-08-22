"use client";

import { useState } from "react";
import { Avatar } from "@/infra/baseweb/Avatar";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import type { Collaboration } from "@/mocks/competitors";

type CollaborationsListProps = {
  collabs: Collaboration[];
};

const CollaborationRow = ({ collab }: { collab: Collaboration }) => (
  <Box className="flex items-center gap-2.5 rounded-[10px] px-2 py-[9px] hover:bg-sunken">
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

export const CollaborationsList = ({ collabs }: CollaborationsListProps) => {
  const [scrolled, setScrolled] = useState(false);

  return (
    <Box className="rounded-2xl border border-border bg-surface pt-5 shadow-card">
      <Box
        className="flex items-center gap-2 px-5 pb-2 transition-shadow duration-150"
        style={{ boxShadow: scrolled ? "var(--sk-shadow-bottom)" : "none" }}
      >
        <Icon
          name="ph-handshake"
          weight="fill"
          size={16}
          color="var(--sk-accent-strong)"
        />
        <Box as="span" className="text-[14.5px] font-bold text-text">
          Creator collaborations
        </Box>
      </Box>
      <Box
        className="max-h-[260px] overflow-y-auto px-5 pb-5"
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 0)}
      >
        {collabs.map((collab, i) => (
          <CollaborationRow key={`${collab.name}-${i}`} collab={collab} />
        ))}
        {collabs.map((collab, i) => (
          <CollaborationRow key={`${collab.name}-${i}`} collab={collab} />
        ))}
        {collabs.map((collab, i) => (
          <CollaborationRow key={`${collab.name}-${i}`} collab={collab} />
        ))}
        {collabs.map((collab, i) => (
          <CollaborationRow key={`${collab.name}-${i}`} collab={collab} />
        ))}
      </Box>
    </Box>
  );
};

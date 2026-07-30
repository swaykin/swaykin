import { Avatar } from "@/infra/baseweb/Avatar";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import type { ColoredCompetitor } from "../../types";
import { InstagramLink } from "../InstagramLink";

type BioSummaryCardProps = {
  competitor: ColoredCompetitor;
};

export const BioSummaryCard = ({ competitor }: BioSummaryCardProps) => (
  <Box className="flex items-start gap-[18px] rounded-2xl border border-border bg-surface p-5 shadow-card">
    <Avatar
      name={competitor.name}
      size="64px"
      fontSize="20px"
      fillColor={competitor.color}
    />
    <Box className="min-w-0 flex-1">
      <Box className="flex flex-wrap items-center gap-1.5">
        <Box as="span" className="text-base font-bold text-text">
          {competitor.name}
        </Box>
        {competitor.isVerified && (
          <Icon
            name="ph-seal-check"
            weight="fill"
            size={14}
            color="var(--blue-600)"
          />
        )}
        <Box as="span" className="text-[12.5px] text-text-tertiary">
          @{competitor.handle}
        </Box>
        <InstagramLink
          handle={competitor.handle}
          label="View Instagram"
          className="ml-auto"
        />
      </Box>
      <Box
        as="p"
        className="my-1.5 max-w-[640px] text-[12.5px] text-text-secondary"
      >
        {competitor.bio}
      </Box>
      <Box className="flex flex-wrap gap-2">
        {competitor.brandTags.map((tag) => (
          <Box
            key={tag}
            as="span"
            className="rounded-md bg-sunken px-2.5 py-1 text-[11px] font-semibold text-text-secondary"
          >
            {tag}
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

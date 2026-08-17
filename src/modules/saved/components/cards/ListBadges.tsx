import { Box } from "@/infra/baseweb/Box";
import { Tag } from "@/infra/components/Tag";

type ListBadgesProps = {
  lists: string[];
};

export const ListBadges = ({ lists }: ListBadgesProps) => (
  <Box className="flex flex-wrap gap-1.5">
    {lists.map((list) => (
      <Tag key={list} label={list} icon="ph-folder-simple" tone="neutral" />
    ))}
  </Box>
);

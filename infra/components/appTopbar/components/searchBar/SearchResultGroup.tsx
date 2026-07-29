"use client";

import { Box } from "@/infra/baseweb/Box";
import { SearchResultGroup as SearchResultGroupType } from "@/hooks/useGlobalSearch";
import { SearchResultItem } from "./SearchResultItem";

type SearchResultGroupProps = {
  group: SearchResultGroupType;
  onSelect: () => void;
};

export const SearchResultGroup = ({ group, onSelect }: SearchResultGroupProps) => (
  <Box className="mb-1">
    <Box className="px-2 pb-1 pt-1.5 text-[10.5px] font-bold uppercase tracking-wide text-text-tertiary">
      {group.label}
    </Box>
    {group.items.map((item) => (
      <SearchResultItem
        key={item.id}
        item={item}
        icon={group.icon}
        iconColor={group.iconColor}
        tint={group.tint}
        onSelect={onSelect}
      />
    ))}
  </Box>
);

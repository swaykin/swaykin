import { useMemo } from "react";
import { mockSearchIndex, SEARCH_GROUP_META, SearchResult } from "@/mocks/search";

export type SearchResultGroup = {
  label: string;
  icon: string;
  iconColor: string;
  tint: string;
  items: SearchResult[];
};

export const useGlobalSearch = (query: string): SearchResultGroup[] => {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matches = mockSearchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q),
    );

    const groups: SearchResultGroup[] = [];
    matches.forEach((item) => {
      const meta = SEARCH_GROUP_META[item.type];
      let group = groups.find((g) => g.label === meta.label);
      if (!group) {
        group = {
          label: meta.label,
          icon: meta.icon,
          iconColor: meta.iconColor,
          tint: meta.tint,
          items: [],
        };
        groups.push(group);
      }
      group.items.push(item);
    });

    return groups;
  }, [query]);
};

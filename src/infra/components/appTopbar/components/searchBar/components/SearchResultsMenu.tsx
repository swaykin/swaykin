import { Box } from "@/infra/baseweb/Box";
import { SearchResultGroup as SearchResultGroupType } from "../useGlobalSearch";
import { SearchResultGroup } from "./SearchResultGroup";

type SearchResultsMenuProps = {
  query: string;
  groups: SearchResultGroupType[];
  onSelect: () => void;
};

export const SearchResultsMenu = ({
  query,
  groups,
  onSelect,
}: SearchResultsMenuProps) => (
  <Box className="absolute left-0 top-[44px] z-30 max-h-[400px] w-full min-w-[340px] overflow-y-auto rounded-xl border border-border bg-surface p-2 shadow-overlay">
    {groups.length > 0 ? (
      groups.map((group) => (
        <SearchResultGroup
          key={group.label}
          group={group}
          onSelect={onSelect}
        />
      ))
    ) : (
      <Box className="px-2 py-4 text-center text-[12.5px] text-text-tertiary">
        No results for &quot;{query}&quot;
      </Box>
    )}
  </Box>
);

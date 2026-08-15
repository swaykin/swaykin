import { Box } from "@/infra/baseweb/Box";
import { StatefulPopover } from "@/infra/baseweb/StatefulPopover";
import { FilterTriggerButton } from "@/infra/components/FilterTriggerButton";
import { SavedSearchRow } from "./SavedSearchRow";
import type { SavedSearch } from "../../types";

type SavedSearchesDropdownProps = {
  savedSearches: SavedSearch[];
  activeId: string | null;
  onApply: (id: string) => void;
  onDelete: (id: string) => void;
};

export const SavedSearchesDropdown = ({
  savedSearches,
  activeId,
  onApply,
  onDelete,
}: SavedSearchesDropdownProps) => (
  <StatefulPopover
    placement="bottomLeft"
    content={
      <Box className="w-[260px] rounded-xl border border-border bg-surface p-1.5 shadow-overlay">
        {savedSearches.length > 0 ? (
          savedSearches.map((savedSearch) => (
            <SavedSearchRow
              key={savedSearch.id}
              savedSearch={savedSearch}
              active={savedSearch.id === activeId}
              onApply={() => onApply(savedSearch.id)}
              onDelete={() => onDelete(savedSearch.id)}
            />
          ))
        ) : (
          <Box className="px-2.5 py-3.5 text-center text-xs text-text-tertiary">
            No saved searches yet
          </Box>
        )}
      </Box>
    }
  >
    <FilterTriggerButton
      icon="ph-bookmark-simple"
      label={`${savedSearches.length} saved searches`}
      active={activeId !== null}
    />
  </StatefulPopover>
);

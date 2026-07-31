import { Box } from "@/infra/baseweb/Box";
import { useSavedSearches } from "../../hooks/useSavedSearches";
import type { DiscoveryFilters } from "../../types";
import { SaveSearchButton } from "./SaveSearchButton";
import { SavedSearchesDropdown } from "./SavedSearchesDropdown";

type SavedSearchesProps = {
  appliedFilters: DiscoveryFilters;
  onApplyFilters: (filters: DiscoveryFilters) => void;
};

export const SavedSearches = ({ appliedFilters, onApplyFilters }: SavedSearchesProps) => {
  const { savedSearches, activeId, addSavedSearch, removeSavedSearch, applySavedSearch } =
    useSavedSearches();

  const handleApply = (id: string) => {
    const filters = applySavedSearch(id);
    if (filters) onApplyFilters(filters);
  };

  return (
    <Box className="flex items-center gap-2">
      <SaveSearchButton onSave={(name) => addSavedSearch(name, appliedFilters)} />
      <SavedSearchesDropdown
        savedSearches={savedSearches}
        activeId={activeId}
        onApply={handleApply}
        onDelete={removeSavedSearch}
      />
    </Box>
  );
};

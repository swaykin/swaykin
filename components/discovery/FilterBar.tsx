import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { FilterChips } from "./FilterChips";
import { SavedSearchesDropdown } from "./SavedSearchesDropdown";
import type { FilterKey, FilterState, SavedSearch, View } from "./types";

export function FilterBar({
  filters,
  onToggleFilter,
  anyFilterActive,
  onClearFilters,
  moreFiltersOpen,
  onToggleMoreFilters,
  onSaveSearch,
  savedSearchesOpen,
  onToggleSavedSearches,
  savedSearches,
  onApplySavedSearch,
  onDeleteSavedSearch,
  view,
  onSetView,
}: {
  filters: FilterState;
  onToggleFilter: (key: FilterKey) => void;
  anyFilterActive: boolean;
  onClearFilters: () => void;
  moreFiltersOpen: boolean;
  onToggleMoreFilters: () => void;
  onSaveSearch: () => void;
  savedSearchesOpen: boolean;
  onToggleSavedSearches: () => void;
  savedSearches: SavedSearch[];
  onApplySavedSearch: (sv: SavedSearch) => void;
  onDeleteSavedSearch: (id: number) => void;
  view: View;
  onSetView: (v: View) => void;
}) {
  return (
    <Card padding="10px 12px" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <FilterChips filters={filters} onToggle={onToggleFilter} />

      <button
        onClick={onToggleMoreFilters}
        style={{
          height: 32,
          padding: "0 12px",
          borderRadius: 9,
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          border: "1px dashed var(--sk-border-strong)",
          background: "transparent",
          color: "var(--sk-text-secondary)",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Icon name="ph-sliders-horizontal" size={13} />
        +8 more filters
      </button>

      {anyFilterActive && (
        <button
          onClick={onClearFilters}
          style={{
            height: 32,
            padding: "0 10px",
            borderRadius: 9,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
            background: "transparent",
            color: "var(--sk-text-tertiary)",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Icon name="ph-x" size={12} />
          Clear
        </button>
      )}

      <div style={{ flex: 1 }} />

      <button
        onClick={onSaveSearch}
        style={{
          height: 32,
          padding: "0 10px",
          borderRadius: 8,
          border: "1px solid var(--sk-border)",
          background: "var(--sk-surface)",
          color: "var(--sk-text-secondary)",
          fontSize: 11.5,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <Icon name="ph-bookmark-simple" weight="bold" size={12} />
        Save this search
      </button>

      <SavedSearchesDropdown
        open={savedSearchesOpen}
        onToggle={onToggleSavedSearches}
        savedSearches={savedSearches}
        onApply={onApplySavedSearch}
        onDelete={onDeleteSavedSearch}
      />

      <div style={{ width: 1, height: 20, background: "var(--sk-border)" }} />

      <div style={{ display: "flex", border: "1px solid var(--sk-border)", borderRadius: 9, overflow: "hidden" }}>
        <button
          onClick={() => onSetView("grid")}
          style={{
            width: 32,
            height: 32,
            border: "none",
            background: view === "grid" ? "var(--sk-accent-subtle)" : "var(--sk-surface)",
            color: view === "grid" ? "var(--sk-accent-strong)" : "var(--sk-text-tertiary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="ph-squares-four" size={15} />
        </button>
        <button
          onClick={() => onSetView("table")}
          style={{
            width: 32,
            height: 32,
            border: "none",
            borderLeft: "1px solid var(--sk-border)",
            background: view === "table" ? "var(--sk-accent-subtle)" : "var(--sk-surface)",
            color: view === "table" ? "var(--sk-accent-strong)" : "var(--sk-text-tertiary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="ph-rows" size={15} />
        </button>
      </div>
    </Card>
  );
}

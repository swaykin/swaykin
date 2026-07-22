"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/PageHeader";
import { useToast } from "@/components/ui/Toast";
import { BulkSelectionBar } from "@/components/discovery/BulkSelectionBar";
import { CompareModal } from "@/components/discovery/CompareModal";
import { FILTER_DEFS, INITIAL_FILTERS, INITIAL_INFLUENCERS, INITIAL_SAVED_SEARCHES } from "@/components/discovery/data";
import { FilterBar } from "@/components/discovery/FilterBar";
import { InfluencerGrid } from "@/components/discovery/InfluencerGrid";
import { InfluencerTable } from "@/components/discovery/InfluencerTable";
import { MoreFiltersPanel } from "@/components/discovery/MoreFiltersPanel";
import type { FilterKey, Influencer, SavedSearch, View } from "@/components/discovery/types";

export default function InfluencerDiscovery() {
  const { showToast } = useToast();

  const [view, setView] = useState<View>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [savedSearchesOpen, setSavedSearchesOpen] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(INITIAL_SAVED_SEARCHES);
  const [influencers, setInfluencers] = useState<Influencer[]>(INITIAL_INFLUENCERS);
  const [compareOpen, setCompareOpen] = useState(false);

  const anyFilterActive = Object.values(filters).some(Boolean);
  const selectedCount = influencers.filter((i) => i.selected).length;

  const filteredInfluencers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return influencers;
    return influencers.filter(
      (i) => i.name.toLowerCase().includes(q) || i.handle.toLowerCase().includes(q) || i.niche.toLowerCase().includes(q)
    );
  }, [influencers, searchQuery]);

  const compareList = influencers.filter((i) => i.selected);

  const toggleFilter = (key: FilterKey) => setFilters((f) => ({ ...f, [key]: !f[key] }));

  const clearFilters = () =>
    setFilters((f) => Object.fromEntries(Object.keys(f).map((k) => [k, false])) as typeof f);

  const toggleSelect = (id: number) =>
    setInfluencers((list) => list.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i)));

  const clearSelection = () => setInfluencers((list) => list.map((i) => ({ ...i, selected: false })));

  const onAddToCampaign = () => {
    showToast(`${Math.max(selectedCount, 1)} creator(s) added to campaign shortlist`);
  };

  const onSaveSearch = () => {
    const activeLabels = FILTER_DEFS.filter((f) => filters[f.key]).map((f) => f.label);
    if (activeLabels.length === 0) {
      showToast("Turn on at least one filter to save a search");
      return;
    }
    const name = activeLabels.join(" · ");
    const newSearch: SavedSearch = {
      id: Date.now(),
      name,
      desc: activeLabels.join(", "),
      filters: { ...filters },
    };
    setSavedSearches((s) => [newSearch, ...s]);
    showToast(`Saved search "${name}"`);
  };

  const onApplySavedSearch = (sv: SavedSearch) => {
    setFilters(sv.filters);
    setSavedSearchesOpen(false);
    showToast(`Applied saved search "${sv.name}"`);
  };

  const onDeleteSavedSearch = (id: number) => setSavedSearches((s) => s.filter((x) => x.id !== id));

  return (
    <div style={{ padding: "18px 28px 44px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <PageHeader
          breadcrumb="SwayKin AI · Influencer Discovery"
          title="Influencer Discovery"
          subtitle="Search 2.1M+ Instagram creators with filters."
          actions={
            <Button variant="primary" icon={<Icon name="ph-flag" weight="bold" size={14} />} onClick={onAddToCampaign}>
              Add to Campaign
            </Button>
          }
        />

        <div style={{ position: "relative" }}>
          <Icon
            name="ph-magnifying-glass"
            size={18}
            color="var(--sk-text-tertiary)"
            style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, @handle, niche or bio keyword — e.g. 'skincare creator Mumbai'"
            style={{
              width: "100%",
              height: 52,
              borderRadius: 14,
              border: "1px solid var(--sk-border)",
              background: "var(--sk-surface)",
              padding: "0 16px 0 44px",
              fontSize: 14.5,
              color: "var(--sk-text)",
              outline: "none",
              boxShadow: "var(--sk-shadow-card)",
            }}
          />
        </div>

        <FilterBar
          filters={filters}
          onToggleFilter={toggleFilter}
          anyFilterActive={anyFilterActive}
          onClearFilters={clearFilters}
          moreFiltersOpen={moreFiltersOpen}
          onToggleMoreFilters={() => setMoreFiltersOpen((o) => !o)}
          onSaveSearch={onSaveSearch}
          savedSearchesOpen={savedSearchesOpen}
          onToggleSavedSearches={() => setSavedSearchesOpen((o) => !o)}
          savedSearches={savedSearches}
          onApplySavedSearch={onApplySavedSearch}
          onDeleteSavedSearch={onDeleteSavedSearch}
          view={view}
          onSetView={setView}
        />

        {moreFiltersOpen && <MoreFiltersPanel />}

        <BulkSelectionBar
          selectedCount={selectedCount}
          onAddToCampaign={onAddToCampaign}
          onCompare={() => setCompareOpen(true)}
          onClear={clearSelection}
        />

        <div style={{ fontSize: 12, color: "var(--sk-text-tertiary)" }}>
          Showing {filteredInfluencers.length} of <strong style={{ color: "var(--sk-text-secondary)" }}>18,204</strong>{" "}
          matching creators
        </div>

        {view === "grid" ? (
          <InfluencerGrid influencers={filteredInfluencers} onToggleSelect={toggleSelect} />
        ) : (
          <InfluencerTable influencers={filteredInfluencers} onToggleSelect={toggleSelect} />
        )}
      </div>

      <CompareModal open={compareOpen} onClose={() => setCompareOpen(false)} influencers={compareList} />
    </div>
  );
}

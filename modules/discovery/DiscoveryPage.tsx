import { useMemo, useState } from "react";
import _noop from "lodash/noop";
import { Box } from "@/infra/baseweb/Box";
import { PageHeader } from "@/infra/components/PageHeader";
import { useSnackbar } from "@/infra/baseweb/useSnackbar";
import { OrDivider } from "./components/OrDivider";
import { UsernameInput } from "./components/UsernameInput";
import { Filters } from "./components/filterPanel/Filters";
import { BulkSelectBar } from "./components/results/BulkSelectBar";
import { CompareModal } from "./components/results/CompareModal";
import { InfluencerCard } from "./components/results/InfluencerCard";
import { InfluencerTable } from "./components/results/InfluencerTable";
import { LoadMoreButton } from "./components/results/LoadMoreButton";
import { NoResults } from "./components/results/NoResults";
import { ViewToggle, type ResultsView } from "./components/results/ViewToggle";
import { SavedSearches } from "./components/savedSearches/SavedSearches";
import { MIN_COMPARE_SELECTION, MAX_COMPARE_SELECTION } from "./constants";
import { useFilters } from "./hooks/useFilters";
import { useGetInfluencers } from "./hooks/useGetInfluencers";
import { useShortlist } from "./hooks/useShortlist";
import { filterInfluencers } from "./utils";

const DiscoveryPage = () => {
  const { influencers } = useGetInfluencers();
  const { onError, onSuccess } = useSnackbar();
  const {
    filterState,
    appliedFilters,
    dirty,
    onAction,
    onApply,
    onRestore,
    onClearAll,
    onApplySnapshot,
  } = useFilters();

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [view, setView] = useState<ResultsView>("grid");
  const [compareOpen, setCompareOpen] = useState(false);
  const { shortlisted, toggleShortlist, shortlistMany } = useShortlist();

  const visibleInfluencers = useMemo(
    () => filterInfluencers(influencers, appliedFilters),
    [influencers, appliedFilters],
  );

  const toggleSelect = (id: string) =>
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));

  const selectedInfluencers = useMemo(
    () => influencers.filter((influencer) => selected[influencer.id]),
    [influencers, selected],
  );
  const selectedCount = selectedInfluencers.length;

  const onCompare = () => {
    if (selectedCount < MIN_COMPARE_SELECTION) {
      onError(`Select at least ${MIN_COMPARE_SELECTION} creators to compare.`);
      return;
    }
    if (selectedCount > MAX_COMPARE_SELECTION) {
      onError(
        `You can compare up to ${MAX_COMPARE_SELECTION} creators at once.`,
      );
      return;
    }
    setCompareOpen(true);
  };

  const onSave = () => {
    shortlistMany(selectedInfluencers.map((influencer) => influencer.id));
    onSuccess(`Saved ${selectedCount} creator${selectedCount === 1 ? "" : "s"} to your shortlist.`);
  };

  return (
    <Box>
      <PageHeader
        title="Influencer Discovery"
        description="Look up a creator directly, or filter public Instagram data to discover new ones."
      />
      <Box className="px-7 pb-5">
        <UsernameInput />
        <OrDivider />
        <Filters
          filterState={filterState}
          dirty={dirty}
          onAction={onAction}
          onApply={onApply}
          onRestore={onRestore}
          onClearAll={onClearAll}
        />
        <Box className="mb-3.5 flex flex-wrap items-center gap-2">
          <SavedSearches
            appliedFilters={appliedFilters}
            onApplyFilters={onApplySnapshot}
          />
          <Box className="flex-1" />
          <ViewToggle view={view} onChange={setView} />
        </Box>
        {selectedCount > 0 && (
          <BulkSelectBar
            selectedCount={selectedCount}
            onSave={onSave}
            onCompare={onCompare}
            onAddToCampaign={_noop}
            onClear={() => setSelected({})}
          />
        )}
        <CompareModal
          isOpen={compareOpen}
          onClose={() => setCompareOpen(false)}
          influencers={selectedInfluencers.slice(0, MAX_COMPARE_SELECTION)}
        />
        {visibleInfluencers.length === 0 ? (
          <NoResults />
        ) : (
          <>
            {view === "grid" ? (
              <Box className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                {visibleInfluencers.map((influencer) => (
                  <InfluencerCard
                    key={influencer.id}
                    influencer={influencer}
                    selected={!!selected[influencer.id]}
                    onToggleSelect={() => toggleSelect(influencer.id)}
                    shortlisted={!!shortlisted[influencer.id]}
                    onToggleShortlist={() => toggleShortlist(influencer.id)}
                    onOpen={_noop}
                  />
                ))}
              </Box>
            ) : (
              <InfluencerTable
                influencers={visibleInfluencers}
                selected={selected}
                onToggleSelect={toggleSelect}
                onOpen={_noop}
              />
            )}
            <LoadMoreButton onClick={_noop} />
          </>
        )}
      </Box>
    </Box>
  );
};

export { DiscoveryPage };
export default DiscoveryPage;

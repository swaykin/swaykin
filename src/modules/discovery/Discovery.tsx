import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import _noop from "lodash/noop";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { PageHeader } from "@/infra/components/PageHeader";
import { useSnackbar } from "@/infra/baseweb/useSnackbar";
import { useSavedInfluencers } from "@/hooks/useSavedInfluencers";
import { OrDivider } from "./components/OrDivider";
import { UsernameInput } from "./components/UsernameInput";
import { Filters } from "./components/filterPanel/Filters";
import { BulkSelectBar } from "./components/results/BulkSelectBar";
import { CompareModal } from "./components/results/CompareModal";
import { CreatorCard } from "./components/results/CreatorCard";
import { CreatorTable } from "./components/results/CreatorTable";
import { LoadMoreButton } from "./components/results/LoadMoreButton";
import { NoResults } from "./components/results/NoResults";
import { ViewToggle, type ResultsView } from "./components/results/ViewToggle";
import { SavedSearches } from "./components/savedSearches/SavedSearches";
import { MIN_COMPARE_SELECTION, MAX_COMPARE_SELECTION } from "./constants";
import { useFilters } from "./hooks/useFilters";
import { useGetCreators } from "./hooks/useGetCreators";
import { filterCreators } from "./utils";

const Discovery = () => {
  const { creators, loading, error, search } = useGetCreators();
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

  const router = useRouter();
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [view, setView] = useState<ResultsView>("grid");
  const [compareOpen, setCompareOpen] = useState(false);
  const { savedIds, toggleSaved, saveMany } = useSavedInfluencers();

  /** Routes on `igUsername`, not `creator.id` — the discovery search result's id isn't
   * guaranteed to be the handle, but the detail page's real /creator lookup needs it to be. */
  const onOpenCreator = (igUsername: string) =>
    router.push(`/discovery/${encodeURIComponent(igUsername)}`);

  useEffect(() => {
    search(appliedFilters);
    // Re-runs whenever the user applies new filters (Apply, Clear all, or a saved search) —
    // `search` itself is stable, only `appliedFilters` identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters]);

  useEffect(() => {
    if (error) onError(error.message || "Discovery search failed.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const visibleCreators = useMemo(
    () => filterCreators(creators, appliedFilters),
    [creators, appliedFilters],
  );

  const toggleSelect = (id: string) =>
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));

  const selectedCreators = useMemo(
    () => creators.filter((creator) => selected[creator.id]),
    [creators, selected],
  );
  const selectedCount = selectedCreators.length;

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
    saveMany(selectedCreators.map((creator) => creator.id));
    onSuccess(
      `Saved ${selectedCount} creator${selectedCount === 1 ? "" : "s"} to your shortlist.`,
    );
  };

  return (
    <Box>
      <PageHeader
        title="Discovery"
        description="Look up a creator directly, or discover new ones fit for your brand"
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
        {/* <Box className="mb-3.5 flex flex-wrap items-center gap-2">
          <SavedSearches
            appliedFilters={appliedFilters}
            onApplyFilters={onApplySnapshot}
          />
          <Box className="flex-1" />
          <ViewToggle view={view} onChange={setView} />
        </Box> */}
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
          creators={selectedCreators.slice(0, MAX_COMPARE_SELECTION)}
        />
        {loading ? (
          <Box className="flex items-center justify-center gap-2 py-12 text-sm text-text-secondary">
            <Icon name="ph-circle-notch" size={16} className="animate-spin" />
            Searching creators…
          </Box>
        ) : visibleCreators.length === 0 ? (
          <NoResults />
        ) : (
          <>
            {view === "grid" ? (
              <Box className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                {visibleCreators.map((creator) => (
                  <CreatorCard
                    key={creator.id}
                    creator={creator}
                    selected={!!selected[creator.id]}
                    onToggleSelect={() => toggleSelect(creator.id)}
                    saved={!!savedIds[creator.id]}
                    onToggleShortlist={() => toggleSaved(creator.id)}
                    onOpen={() => onOpenCreator(creator.handle)}
                  />
                ))}
              </Box>
            ) : (
              <CreatorTable
                creators={visibleCreators}
                selected={selected}
                onToggleSelect={toggleSelect}
                onOpen={onOpenCreator}
              />
            )}
            <LoadMoreButton onClick={_noop} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default Discovery;

import { useMemo, useState } from "react";
import _noop from "lodash/noop";
import { Box } from "@/infra/baseweb/Box";
import { PageHeader } from "@/infra/components/PageHeader";
import { mockInfluencers } from "@/mocks/discovery";
import type { SavedStatus } from "./constants";
import { TopBar } from "./components/topBar/TopBar";
import { BulkActionsBar } from "./components/bulkActionsBar/BulkActionsBar";
import { SavedInfluencerCard } from "./components/cards/SavedInfluencerCard";
import { EmptyState } from "./components/EmptyState";
import { useCreatorLists } from "./hooks/useCreatorLists";

type CardState = { lists: string[]; status: SavedStatus };

const Saved = () => {
  const savedInfluencers = useMemo(
    () => mockInfluencers.filter((influencer) => influencer.lists !== undefined),
    [],
  );

  const [cardState, setCardState] = useState<Record<string, CardState>>(() =>
    Object.fromEntries(
      savedInfluencers.map((influencer) => [
        influencer.id,
        {
          lists: influencer.lists ?? [],
          status: influencer.status ?? "Not Contacted",
        },
      ]),
    ),
  );
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const { lists, listNames, addList, removeList } = useCreatorLists();

  const toggleSelect = (id: string) =>
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleList = (id: string, list: string) =>
    setCardState((prev) => {
      const current = prev[id];
      const hasList = current.lists.includes(list);
      return {
        ...prev,
        [id]: {
          ...current,
          lists: hasList
            ? current.lists.filter((l) => l !== list)
            : [...current.lists, list],
        },
      };
    });

  const changeStatus = (id: string, status: SavedStatus) =>
    setCardState((prev) => ({ ...prev, [id]: { ...prev[id], status } }));

  const selectedCount = Object.values(selected).filter(Boolean).length;

  return (
    <Box>
      <PageHeader
        title="Saved Creators"
        description="Scale your creator network, automate outreach, and maximize ROI"
      />
      <Box className="flex flex-col gap-3.5 px-7 pb-5">
        <TopBar lists={lists} onCreateList={addList} onDeleteList={removeList} />
        {selectedCount > 0 && (
          <BulkActionsBar
            selectedCount={selectedCount}
            onAddToCampaign={_noop}
            onUpdateStatus={_noop}
            onExport={_noop}
            onRemove={_noop}
            onClear={() => setSelected({})}
          />
        )}
        {savedInfluencers.length === 0 ? (
          <EmptyState />
        ) : (
          <Box className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {savedInfluencers.map((influencer) => (
              <SavedInfluencerCard
                key={influencer.id}
                influencer={{ ...influencer, ...cardState[influencer.id] }}
                selected={!!selected[influencer.id]}
                onToggleSelect={() => toggleSelect(influencer.id)}
                onOpen={_noop}
                listNames={listNames}
                onToggleList={(list) => toggleList(influencer.id, list)}
                onChangeStatus={(status) => changeStatus(influencer.id, status)}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Saved;

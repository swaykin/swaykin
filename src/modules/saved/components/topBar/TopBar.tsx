import { useState } from "react";
import { Box } from "@/infra/baseweb/Box";
import { SORT_OPTIONS, type SavedListOption } from "../../constants";
import { SearchField } from "./SearchField";
import { ListsFilterDropdown } from "./ListsFilterDropdown";
import { StatusFilterDropdown } from "./StatusFilterDropdown";
import { SortDropdown } from "./SortDropdown";

type TopBarProps = {
  lists: SavedListOption[];
  onCreateList: (name: string) => void;
  onDeleteList: (name: string) => void;
};

/** Sort/status/search filter state lives here as a standalone preview until this wires up
 * to real saved-creator data. List catalog itself is lifted to useCreatorLists since
 * cards also need it for list-membership toggling. */
export const TopBar = ({ lists, onCreateList, onDeleteList }: TopBarProps) => {
  const [search, setSearch] = useState("");
  const [listFilter, setListFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0].key);

  const handleCreateList = (name: string) => {
    onCreateList(name);
    setListFilter(name);
  };

  const handleDeleteList = (name: string) => {
    onDeleteList(name);
    setListFilter((prev) => (prev === name ? null : prev));
  };

  return (
    <Box className="flex flex-wrap items-center gap-2.5">
      <SearchField value={search} onChange={setSearch} />
      <ListsFilterDropdown
        lists={lists}
        selected={listFilter}
        onSelect={setListFilter}
        onCreateList={handleCreateList}
        onDeleteList={handleDeleteList}
      />
      <StatusFilterDropdown
        selected={statusFilter}
        onSelect={setStatusFilter}
      />
      <SortDropdown sortBy={sortBy} onChange={setSortBy} />
      <Box className="flex-1" />
      <Box as="span" className="text-[13px] font-bold text-text-secondary">
        9 Creators
      </Box>
    </Box>
  );
};

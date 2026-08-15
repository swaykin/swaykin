import { StatefulPopover } from "@/infra/baseweb/StatefulPopover";
import { FilterTriggerButton } from "@/infra/components/FilterTriggerButton";
import { ListsFilterMenu } from "./ListsFilterMenu";
import type { SavedListOption } from "../../constants";

type ListsFilterDropdownProps = {
  lists: SavedListOption[];
  selected: string | null;
  onSelect: (name: string | null) => void;
  onCreateList: (name: string) => void;
  onDeleteList: (name: string) => void;
};

export const ListsFilterDropdown = ({
  lists,
  selected,
  onSelect,
  onCreateList,
  onDeleteList,
}: ListsFilterDropdownProps) => (
  <StatefulPopover
    placement="bottomLeft"
    content={({ close }) => (
      <ListsFilterMenu
        lists={lists}
        selected={selected}
        onSelect={(name) => {
          onSelect(name);
          close();
        }}
        onCreateList={onCreateList}
        onDeleteList={onDeleteList}
      />
    )}
  >
    <FilterTriggerButton
      fontSize="12.5px"
      icon="ph-folder-simple"
      label={selected ?? "All lists"}
      active={selected !== null}
    />
  </StatefulPopover>
);

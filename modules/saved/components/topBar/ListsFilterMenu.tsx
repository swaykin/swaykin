import { useState } from "react";
import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { Input } from "@/infra/baseweb/Input";
import { FilterMenuRow } from "../FilterMenuRow";
import type { SavedListOption } from "../../constants";

type ListsFilterMenuProps = {
  lists: SavedListOption[];
  selected: string | null;
  onSelect: (name: string | null) => void;
  onCreateList: (name: string) => void;
  onDeleteList: (name: string) => void;
};

export const ListsFilterMenu = ({
  lists,
  selected,
  onSelect,
  onCreateList,
  onDeleteList,
}: ListsFilterMenuProps) => {
  const [newList, setNewList] = useState("");

  const submit = () => {
    const name = newList.trim();
    if (!name) return;
    onCreateList(name);
    setNewList("");
  };

  return (
    <Box className="w-[240px] rounded-xl border border-border bg-surface p-2 shadow-overlay">
      <FilterMenuRow
        label="All lists"
        bold
        active={!selected}
        onClick={() => onSelect(null)}
      />
      {lists.map((list) => (
        <FilterMenuRow
          key={list.name}
          label={list.name}
          count={list.count}
          active={selected === list.name}
          onClick={() => onSelect(list.name)}
          onDelete={() => onDeleteList(list.name)}
        />
      ))}
      <Box className="mt-2 flex gap-1.5 border-t border-border pt-2">
        <Input
          value={newList}
          onChange={(e) => setNewList(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder="+ New list"
          height="30px"
          borderRadius="7px"
          fontSize="11.5px"
          overrides={{ Root: { style: { flex: 1, minWidth: 0 } } }}
        />
        <Button
          kind="primary"
          type="button"
          onClick={submit}
          height="30px"
          fontSize="11.5px"
        >
          Add
        </Button>
      </Box>
    </Box>
  );
};

import { useState } from "react";
import { Box } from "@/infra/baseweb/Box";
import { Input } from "@/infra/baseweb/Input";
import { CreateOptionRow } from "./components/CreateOptionRow";
import { OptionRow } from "./components/OptionRow";

type SearchableMenuProps = {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multi?: boolean;
  creatable?: boolean;
  /** Called after a single-select pick (multi=false) — lets the caller close its own popover. */
  onCloseRequest?: () => void;
};

const SEARCH_INPUT_OVERRIDES = {
  Input: {
    style: {
      paddingTop: "0px",
      paddingBottom: "0px",
      paddingLeft: "8px",
      paddingRight: "8px",
    },
  },
};

export const SearchableMenu = ({
  options,
  selected,
  onChange,
  multi = true,
  creatable = false,
  onCloseRequest,
}: SearchableMenuProps) => {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const filtered = options.filter((option) =>
    option.toLowerCase().includes(query),
  );
  const exactMatch = options.some((option) => option.toLowerCase() === query);
  const showCreate = creatable && query.length > 0 && !exactMatch;

  const pick = (value: string) => {
    if (multi) {
      onChange(
        selected.includes(value)
          ? selected.filter((v) => v !== value)
          : [...selected, value],
      );
    } else {
      onChange([value]);
      onCloseRequest?.();
    }
  };

  return (
    <Box className="w-[230px] rounded-xl border border-border bg-surface p-2 shadow-overlay">
      <Box className="mb-1.5">
        <Input
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          placeholder="Search"
          size="mini"
          height="30px"
          borderRadius="7px"
          borderWidth="1px"
          backgroundColor="var(--sk-surface-sunken)"
          fontSize="12.5px"
          overrides={SEARCH_INPUT_OVERRIDES}
        />
      </Box>
      <Box className="flex max-h-[220px] flex-col gap-px overflow-y-auto">
        {filtered.map((option) => (
          <OptionRow
            key={option}
            label={option}
            checked={selected.includes(option)}
            onToggle={() => pick(option)}
          />
        ))}
        {showCreate && (
          <CreateOptionRow
            value={search.trim()}
            onClick={() => {
              pick(search.trim());
              setSearch("");
            }}
          />
        )}
      </Box>
    </Box>
  );
};

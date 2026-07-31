import { useCallback, useEffect, useRef, useState } from "react";
import { Box } from "@/infra/baseweb/Box";
import { useGlobalSearch } from "./useGlobalSearch";
import { SearchInput } from "./components/SearchInput";
import { SearchResultsMenu } from "./components/SearchResultsMenu";

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const groups = useGlobalSearch(query);

  const handleChange = useCallback((value: string) => {
    setQuery(value);
    setIsOpen(value.trim().length > 0);
  }, []);

  const handleClear = useCallback(() => {
    setQuery("");
    setIsOpen(false);
  }, []);

  const handleFocus = useCallback(() => {
    if (query.trim()) setIsOpen(true);
  }, [query]);

  const handleResultSelect = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  return (
    <Box ref={containerRef} className="relative w-full max-w-[420px] flex-1">
      <SearchInput
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        onClear={handleClear}
      />
      {isOpen && (
        <SearchResultsMenu
          query={query}
          groups={groups}
          onSelect={handleResultSelect}
        />
      )}
    </Box>
  );
};

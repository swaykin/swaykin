"use client";

import { useEffect, useRef, useState } from "react";
import { Box } from "@/infra/baseweb/Box";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { SearchInput } from "./SearchInput";
import { SearchResultsMenu } from "./SearchResultsMenu";

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const groups = useGlobalSearch(query);

  const handleChange = (value: string) => {
    setQuery(value);
    setIsOpen(value.trim().length > 0);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
  };

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
        onFocus={() => {
          if (query.trim()) setIsOpen(true);
        }}
        onClear={handleClear}
      />
      {isOpen && (
        <SearchResultsMenu
          query={query}
          groups={groups}
          onSelect={() => setIsOpen(false)}
        />
      )}
    </Box>
  );
};

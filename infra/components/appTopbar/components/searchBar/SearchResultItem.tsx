"use client";

import Link from "next/link";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { SearchResult } from "@/mocks/search";

type SearchResultItemProps = {
  item: SearchResult;
  icon: string;
  iconColor: string;
  tint: string;
  onSelect: () => void;
};

export const SearchResultItem = ({
  item,
  icon,
  iconColor,
  tint,
  onSelect,
}: SearchResultItemProps) => (
  <Link
    href={item.href}
    onClick={onSelect}
    className="flex items-center gap-2.5 rounded-lg p-2 no-underline hover:bg-sunken"
  >
    <Icon name={icon} weight="fill" size={13} color={iconColor} backgroundColor={tint} />
    <Box className="min-w-0 flex-1">
      <Box className="truncate text-[12.5px] font-semibold text-text">
        {item.title}
      </Box>
      <Box className="text-[11px] text-text-tertiary">{item.subtitle}</Box>
    </Box>
  </Link>
);

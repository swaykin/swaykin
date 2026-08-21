import { useMemo } from "react";
import { Box } from "@/infra/baseweb/Box";
import type { DiscoveryFilters, NumericRangeFilter } from "../../types";
import { AISearchBar } from "./AISearchBar";
import { FilterActionsRow } from "./FilterActionsRow";
import { FilterCapsule } from "./FilterCapsule";
import { HashtagFilterCapsule } from "./HashtagFilterCapsule";
import { NumericRangeFilters } from "./NumericRangeFilters";

const CATEGORY_OPTIONS = [
  "Skincare",
  "Beauty & Makeup",
  "Haircare",
  "Fashion",
  "Fitness",
  "Lifestyle",
  "Men's grooming",
];

const LOCATION_OPTIONS = [
  "Mumbai",
  "Delhi NCR",
  "Bangalore",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
];

type FiltersProps = {
  filterState: DiscoveryFilters;
  dirty: boolean;
  onAction: (patch: Partial<DiscoveryFilters>) => void;
  onApply: () => void;
  onRestore: () => void;
  onClearAll: () => void;
};

export const Filters = ({
  filterState,
  dirty,
  onAction,
  onApply,
  onRestore,
  onClearAll,
}: FiltersProps) => {
  const numericFilters: NumericRangeFilter[] = useMemo(
    () => [
      {
        key: "followers",
        label: "Followers",
        icon: "ph-users-three",
        valueType: "integer",
        minVal: filterState.followers[0],
        maxVal: filterState.followers[1],
        onMinChange: (value) =>
          onAction({ followers: [value, filterState.followers[1]] }),
        onMaxChange: (value) =>
          onAction({ followers: [filterState.followers[0], value] }),
      },
    ],
    [filterState.followers, onAction],
  );

  const toggles = useMemo(
    () => [
      {
        key: "hasEmail",
        label: "Has public email",
        checked: filterState.hasEmail,
        onToggle: () => onAction({ hasEmail: !filterState.hasEmail }),
      },
      {
        key: "isVerified",
        label: "Verified account",
        checked: filterState.isVerified,
        onToggle: () => onAction({ isVerified: !filterState.isVerified }),
      },
      {
        key: "bookmarked",
        label: "Bookmarked",
        checked: filterState.bookmarked,
        onToggle: () => onAction({ bookmarked: !filterState.bookmarked }),
      },
    ],
    [
      filterState.hasEmail,
      filterState.isVerified,
      filterState.bookmarked,
      onAction,
    ],
  );

  return (
    <Box>
      <AISearchBar />
      <Box className="flex flex-col gap-3 mb-3.5 rounded-2xl border border-border bg-surface px-[18px] py-4 shadow-card">
        <Box className="flex flex-wrap items-center gap-2.5">
          <NumericRangeFilters filters={numericFilters} />
          <Box className="h-6 w-px bg-border" />
          <FilterCapsule
            icon="ph-tag"
            label="Category"
            options={CATEGORY_OPTIONS}
            selected={filterState.categories}
            onChange={(categories) => onAction({ categories })}
            multi
            creatable
          />
          <FilterCapsule
            icon="ph-map-pin"
            label="Location"
            options={LOCATION_OPTIONS}
            selected={filterState.locations}
            onChange={(locations) => onAction({ locations })}
            multi
            creatable
          />
          <HashtagFilterCapsule
            tags={filterState.hashtags}
            onChange={(hashtags) => onAction({ hashtags })}
          />
        </Box>
        <FilterActionsRow
          toggles={toggles}
          dirty={dirty}
          onClearAll={onClearAll}
          onRestore={onRestore}
          onApply={onApply}
        />
      </Box>
    </Box>
  );
};

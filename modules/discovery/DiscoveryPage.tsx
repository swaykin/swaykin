import { useState } from "react";
import { Box } from "@/infra/baseweb/Box";
import { FilterCapsule } from "./components/filterPanel/FilterCapsule";
import { NumericRangeFilters } from "./components/filterPanel/NumericRangeFilters";
import type { NumericRangeFilter } from "./types";

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

// TEMP preview wiring — each Discovery piece gets mounted here with local dummy state as it's
// built, so it can be checked live. Gets replaced once the real DiscoveryPage is composed.
const DiscoveryPage = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [followerMin, setFollowerMin] = useState("");
  const [followerMax, setFollowerMax] = useState("");
  const [erMin, setErMin] = useState("");
  const [erMax, setErMax] = useState("");

  const numericFilters: NumericRangeFilter[] = [
    {
      key: "followers",
      label: "Followers",
      icon: "ph-users-three",
      valueType: "integer",
      minVal: followerMin,
      maxVal: followerMax,
      onMinChange: setFollowerMin,
      onMaxChange: setFollowerMax,
    },
    {
      key: "er",
      label: "Engagement %",
      icon: "ph-heart",
      valueType: "decimal",
      minVal: erMin,
      maxVal: erMax,
      onMinChange: setErMin,
      onMaxChange: setErMax,
    },
  ];

  return (
    <Box className="flex flex-col gap-4 p-7">
      <Box as="h1" className="text-lg font-bold text-text">
        Discovery
      </Box>
      <NumericRangeFilters filters={numericFilters} />
      <Box className="flex gap-2.5">
        <FilterCapsule
          icon="ph-tag"
          label="Category"
          options={CATEGORY_OPTIONS}
          selected={categories}
          onChange={setCategories}
          multi
          creatable
        />
        <FilterCapsule
          icon="ph-map-pin"
          label="Location"
          options={LOCATION_OPTIONS}
          selected={locations}
          onChange={setLocations}
          multi
          creatable
        />
      </Box>
    </Box>
  );
};

export { DiscoveryPage };
export default DiscoveryPage;

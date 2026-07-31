import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { Input } from "@/infra/baseweb/Input";
import type { NumericRangeFilter } from "../../types";

type NumericRangeFiltersProps = {
  filters: NumericRangeFilter[];
};

/** Strips a typed/pasted value down to a valid positive integer or decimal as it's entered. */
const sanitizeNumericInput = (
  value: string,
  valueType: NumericRangeFilter["valueType"],
) => {
  if (valueType === "integer") return value.replace(/[^0-9]/g, "");
  const decimalOnly = value.replace(/[^0-9.]/g, "");
  const [whole, ...rest] = decimalOnly.split(".");
  return rest.length ? `${whole}.${rest.join("")}` : whole;
};

const RANGE_INPUT_OVERRIDES = {
  Input: {
    style: {
      paddingTop: "0px",
      paddingBottom: "0px",
      paddingLeft: "6px",
      paddingRight: "6px",
    },
  },
};

const RANGE_INPUT_PROPS = {
  width: "125px",
  height: "26px",
  borderRadius: "5px",
  borderColor: "var(--sk-border)",
  fontSize: "12.5px",
};

const NumericRangeField = ({ filter }: { filter: NumericRangeFilter }) => (
  <Box className="flex h-9 min-w-[260px] flex-1 items-center gap-[7px] rounded-lg border border-border bg-surface px-3">
    <Icon
      name={filter.icon}
      weight="bold"
      size={13}
      color="var(--sk-text-tertiary)"
    />
    <Box
      as="span"
      className="whitespace-nowrap text-xs font-semibold text-text-secondary"
    >
      {filter.label}
    </Box>
    <Box className="flex-1" />
    <Input
      value={filter.minVal}
      onChange={(e) =>
        filter.onMinChange(
          sanitizeNumericInput(e.currentTarget.value, filter.valueType),
        )
      }
      placeholder="Min"
      {...RANGE_INPUT_PROPS}
      overrides={RANGE_INPUT_OVERRIDES}
    />
    <Box as="span" className="text-[11px] text-text-tertiary">
      –
    </Box>
    <Input
      value={filter.maxVal}
      onChange={(e) =>
        filter.onMaxChange(
          sanitizeNumericInput(e.currentTarget.value, filter.valueType),
        )
      }
      placeholder="Max"
      {...RANGE_INPUT_PROPS}
      overrides={RANGE_INPUT_OVERRIDES}
    />
  </Box>
);

export const NumericRangeFilters = ({ filters }: NumericRangeFiltersProps) => (
  <Box className="flex flex-wrap gap-2.5">
    {filters.map((filter) => (
      <NumericRangeField key={filter.key} filter={filter} />
    ))}
  </Box>
);

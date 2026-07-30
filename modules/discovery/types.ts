export type NumericRangeFilter = {
  key: string;
  label: string;
  icon: string;
  /** "integer" restricts input to positive whole numbers, "decimal" allows a single decimal point. */
  valueType: "integer" | "decimal";
  minVal: string;
  maxVal: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
};

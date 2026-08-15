import {
  DatasetFilter,
  DatasetFilterCondition,
} from "./instagramProfileFilterClient";

/** Range filter types, translated to two `>=`/`<=` conditions. */
const RANGE_FIELD_NAMES: Record<string, string> = {
  followers: "followers",
  following: "following",
  postsCount: "posts_count",
  avgEngagement: "engagement_rate",
};

/**
 * Named filter types without a dedicated Bright Data column on this dataset
 * default to a best-effort field. Override with an explicit `field` if the
 * default doesn't return the expected matches — this dataset has no
 * verified geo column, so `location` is unconfirmed.
 */
const NAMED_FIELD_DEFAULTS: Record<string, string> = {
  location: "business_address",
};

/**
 * Confirmed via Bright Data docs: `=`, `>=`, `in`, `includes`. The rest of
 * this comparison set is a best-effort mirror of their typical filter APIs
 * and hasn't been individually verified against this dataset.
 */
const OPERATOR_ALIASES: Record<string, string> = {
  "equal": "=",
  "equals": "=",
  "=": "=",
  "==": "=",
  "notequal": "!=",
  "!=": "!=",
  "greaterthan": ">",
  ">": ">",
  "greaterthanorequal": ">=",
  ">=": ">=",
  "lessthan": "<",
  "<": "<",
  "lessthanorequal": "<=",
  "<=": "<=",
  "in": "in",
  "notin": "not_in",
  "not_in": "not_in",
  "includes": "includes",
  "notincludes": "not_includes",
  "not_includes": "not_includes",
};

interface RangeFilterInput {
  type: keyof typeof RANGE_FIELD_NAMES;
  value: { min?: number; max?: number };
}

interface FieldFilterInput {
  type: "location" | "field";
  field?: string;
  operator: string;
  value: string | number | boolean;
}

export type DiscoveryFilterInput = RangeFilterInput | FieldFilterInput;

/**
 * Translates the app's friendly filter DSL — range filters like `{ type:
 * "followers", value: { min, max } }` and named/generic field filters like
 * `{ type: "location", operator: "Equal", value: "udaipur" }` — into Bright
 * Data's `{ operator, filters: [{ name, operator, value }] }` shape. Bright
 * Data has no native range operator, so a min/max range becomes two
 * conditions (`>=` and `<=`) ANDed together with everything else.
 * @param {DiscoveryFilterInput[]} inputs Friendly filter conditions.
 * @return {DatasetFilter} The equivalent Bright Data filter payload.
 */
export function buildDatasetFilter(
  inputs: DiscoveryFilterInput[]
): DatasetFilter {
  const filters: DatasetFilterCondition[] = inputs.flatMap(toConditions);

  if (filters.length === 0) {
    throw new Error("At least one filter condition is required");
  }

  return {operator: "and", filters};
}

/**
 * @param {DiscoveryFilterInput} input One friendly filter condition.
 * @return {DatasetFilterCondition[]} Zero or more Bright Data conditions.
 */
function toConditions(input: DiscoveryFilterInput): DatasetFilterCondition[] {
  if (input.type in RANGE_FIELD_NAMES) {
    return rangeToConditions(input as RangeFilterInput);
  }

  const fieldInput = input as FieldFilterInput;
  const fieldName = fieldInput.field ?? NAMED_FIELD_DEFAULTS[fieldInput.type];
  if (!fieldName) {
    throw new Error(
      `Filter type "${fieldInput.type}" needs an explicit "field" name`
    );
  }

  return [{
    name: fieldName,
    operator: normalizeOperator(fieldInput.operator),
    value: fieldInput.value,
  }];
}

/**
 * @param {RangeFilterInput} input A min/max range filter.
 * @return {DatasetFilterCondition[]} Up to two `>=`/`<=` conditions.
 */
function rangeToConditions(input: RangeFilterInput): DatasetFilterCondition[] {
  const fieldName = RANGE_FIELD_NAMES[input.type];
  const conditions: DatasetFilterCondition[] = [];

  if (input.value.min !== undefined) {
    conditions.push({name: fieldName, operator: ">=", value: input.value.min});
  }
  if (input.value.max !== undefined) {
    conditions.push({name: fieldName, operator: "<=", value: input.value.max});
  }
  if (conditions.length === 0) {
    throw new Error(`Filter "${input.type}" needs a min or max value`);
  }

  return conditions;
}

/**
 * @param {string} operator Friendly operator name (e.g. "Equal", ">=").
 * @return {string} The Bright Data operator symbol.
 */
function normalizeOperator(operator: string): string {
  const normalized = OPERATOR_ALIASES[operator.toLowerCase()];
  if (!normalized) {
    throw new Error(`Unsupported filter operator: "${operator}"`);
  }
  return normalized;
}

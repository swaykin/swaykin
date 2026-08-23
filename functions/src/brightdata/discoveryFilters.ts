import {
  DatasetFilter,
  DatasetFilterCondition,
} from "./instagramProfileFilterClient";

/** Confirmed numeric range fields from Brightdata dataset gd_l1vikfch901nx3by4. */
const RANGE_FIELD_NAMES: Record<string, string> = {
  followers: "followers",
  following: "following",
};

/** Confirmed operators from Brightdata docs for this dataset. */
const OPERATOR_ALIASES: Record<string, string> = {
  "equal": "=",
  "equals": "=",
  "is": "=",
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
  "exists": "exists",
  "notexists": "not_exists",
  "not_exists": "not_exists",
};

interface RangeFilterInput {
  type: "followers" | "following";
  value: { min?: number; max?: number };
}

/** Single hashtag match against post_hashtags. */
interface HashtagFilterInput {
  type: "hashtag";
  value: string;
}

/**
 * OR match — combines hashtags, categories, and locations into one
 * `post_hashtags in [...]` condition. Empty array is a no-op.
 */
interface HashtagsORFilterInput {
  type: "hashtagsOR";
  values: string[];
}

/** Filter on is_verified boolean field. */
interface VerifiedFilterInput {
  type: "isVerified";
  value: boolean;
}

/** Filter on email_address existence. */
interface EmailExistsFilterInput {
  type: "hasEmail";
  value: boolean; // true → exists, false → not_exists
}

/** Escape hatch — pass any Brightdata field/operator/value directly. */
interface RawFieldFilterInput {
  type: "field";
  field: string;
  operator: string;
  value: string | number | boolean;
}

export type DiscoveryFilterInput =
  | RangeFilterInput
  | HashtagFilterInput
  | HashtagsORFilterInput
  | VerifiedFilterInput
  | EmailExistsFilterInput
  | RawFieldFilterInput;

/**
 * Translates app-level filters into Bright Data's
 * `{ operator, filters: [{ name, operator, value }] }` shape.
 * All conditions are ANDed together.
 * @param {DiscoveryFilterInput[]} inputs Filter conditions.
 * @return {DatasetFilter} Bright Data filter payload.
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

function toConditions(input: DiscoveryFilterInput): DatasetFilterCondition[] {
  if (input.type === "followers" || input.type === "following") {
    return rangeToConditions(input);
  }

  if (input.type === "hashtag") {
    return [{name: "post_hashtags", operator: "=", value: input.value}];
  }

  if (input.type === "hashtagsOR") {
    if (input.values.length === 0) return [];
    return [{name: "post_hashtags", operator: "in", value: input.values}];
  }

  if (input.type === "isVerified") {
    return [{name: "is_verified", operator: "=", value: input.value}];
  }

  if (input.type === "hasEmail") {
    return [{
      name: "email_address",
      operator: input.value ? "exists" : "not_exists",
      value: true,
    }];
  }

  // raw field passthrough
  const raw = input as RawFieldFilterInput;
  return [{
    name: raw.field,
    operator: normalizeOperator(raw.operator),
    value: raw.value,
  }];
}

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

function normalizeOperator(operator: string): string {
  const normalized = OPERATOR_ALIASES[operator.toLowerCase()];
  if (!normalized) {
    throw new Error(`Unsupported filter operator: "${operator}"`);
  }
  return normalized;
}

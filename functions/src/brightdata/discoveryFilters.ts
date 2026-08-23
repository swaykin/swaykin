import {
  DatasetFilter,
  DatasetFilterCondition,
  DatasetFilterNode,
} from "./instagramProfileFilterClient";

interface RangeFilterInput {
  type: "followers" | "following";
  value: { min?: number; max?: number };
}

/** Category terms → OR on biography, post_hashtags, posts:caption */
interface CategoryFilterInput {
  type: "category";
  values: string[];
}

/** Location terms → OR on biography, posts:caption, posts:post_hashtags */
interface LocationFilterInput {
  type: "location";
  values: string[];
}

/** Hashtag terms → OR on bio_hashtags, post_hashtags, posts:post_hashtags */
interface HashtagFilterInput {
  type: "hashtag";
  values: string[];
}

interface VerifiedFilterInput {
  type: "isVerified";
  value: boolean;
}

interface EmailExistsFilterInput {
  type: "hasEmail";
  value: boolean;
}

interface RawFieldFilterInput {
  type: "field";
  field: string;
  operator: string;
  value: string | number | boolean;
}

export type DiscoveryFilterInput =
  | RangeFilterInput
  | CategoryFilterInput
  | LocationFilterInput
  | HashtagFilterInput
  | VerifiedFilterInput
  | EmailExistsFilterInput
  | RawFieldFilterInput;

export type DiscoveryTermBlock =
  | {kind: "category"; value: string}
  | {kind: "location"; value: string}
  | {kind: "hashtag"; value: string};

/** Term blocks (category / location / hashtag) in request order — ANDed in BD + DB. */
export function extractTermBlocks(
  filters: DiscoveryFilterInput[]
): DiscoveryTermBlock[] {
  const blocks: DiscoveryTermBlock[] = [];
  for (const input of filters) {
    if (input.type === "category" && input.values[0]) {
      blocks.push({kind: "category", value: input.values[0]});
    } else if (input.type === "location" && input.values[0]) {
      blocks.push({kind: "location", value: input.values[0]});
    } else if (input.type === "hashtag" && input.values[0]) {
      blocks.push({kind: "hashtag", value: input.values[0]});
    }
  }
  return blocks;
}

/**
 * Builds the nested Brightdata filter from app-level filter inputs.
 *
 * Scalar conditions (followers, verified, email) → inner `and` block.
 * Each category/location/hashtag value → its own `or` block:
 *   category "fashion"  → OR[biography includes, post_hashtags array_includes, posts:caption includes]
 *   location "mumbai"   → OR[biography includes, posts:caption includes, posts:post_hashtags array_includes]
 *   hashtag  "skincare" → OR[bio_hashtags array_includes, post_hashtags array_includes, posts:post_hashtags array_includes]
 */
export function buildDatasetFilter(
  inputs: DiscoveryFilterInput[]
): DatasetFilter {
  const scalarConditions: DatasetFilterCondition[] = [];
  const termBlocks: DatasetFilter[] = [];

  for (const input of inputs) {
    if (input.type === "followers" || input.type === "following") {
      const name = input.type;
      if (input.value.min !== undefined) {
        scalarConditions.push({name, operator: ">=", value: input.value.min});
      }
      if (input.value.max !== undefined) {
        scalarConditions.push({name, operator: "<=", value: input.value.max});
      }
      continue;
    }

    if (input.type === "isVerified") {
      scalarConditions.push({name: "is_verified", operator: "=", value: input.value});
      continue;
    }

    if (input.type === "hasEmail" && input.value) {
      scalarConditions.push({name: "email_address", operator: "is_not_null"});
      continue;
    }

    if (input.type === "category") {
      if (input.values[0]) termBlocks.push(categoryOrBlock(input.values[0]));
      continue;
    }

    if (input.type === "location") {
      if (input.values[0]) termBlocks.push(locationOrBlock(input.values[0]));
      continue;
    }

    if (input.type === "hashtag") {
      if (input.values[0]) termBlocks.push(hashtagOrBlock(input.values[0]));
      continue;
    }

    if (input.type === "field") {
      scalarConditions.push({name: input.field, operator: input.operator, value: input.value});
    }
  }

  const topLevel: DatasetFilterNode[] = [];
  if (scalarConditions.length > 0) {
    topLevel.push({operator: "and", filters: scalarConditions});
  }
  for (const block of termBlocks) {
    topLevel.push(block);
  }

  if (topLevel.length === 0) {
    throw new Error("At least one filter condition is required");
  }

  return {operator: "and", filters: topLevel};
}

function categoryOrBlock(value: string): DatasetFilter {
  return {
    operator: "or",
    filters: [
      {name: "biography", operator: "includes", value},
      {name: "post_hashtags", operator: "array_includes", value},
      {name: "posts:caption", operator: "includes", value},
    ],
  };
}

function locationOrBlock(value: string): DatasetFilter {
  return {
    operator: "or",
    filters: [
      {name: "biography", operator: "includes", value},
      {name: "posts:caption", operator: "includes", value},
      {name: "posts:post_hashtags", operator: "array_includes", value},
    ],
  };
}

function hashtagOrBlock(value: string): DatasetFilter {
  return {
    operator: "or",
    filters: [
      {name: "bio_hashtags", operator: "array_includes", value},
      {name: "post_hashtags", operator: "array_includes", value},
      {name: "posts:post_hashtags", operator: "array_includes", value},
    ],
  };
}

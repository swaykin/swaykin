import type { DiscoveryFilters } from "../types";

// Mirror of the backend type — kept here to avoid importing functions/ into the frontend.
export type DiscoveryFilterInput =
  | { type: "followers"; value: { min?: number; max?: number } }
  | { type: "following"; value: { min?: number; max?: number } }
  | { type: "category"; values: string[] }
  | { type: "location"; values: string[] }
  | { type: "hashtag"; values: string[] }
  | { type: "isVerified"; value: boolean }
  | { type: "hasEmail"; value: boolean }
  | { type: "field"; field: string; operator: string; value: string | number | boolean };

function normalizeTerms(terms: string[]): string[] {
  return terms.map((t) => t.toLowerCase().replace(/^#/, "")).filter(Boolean);
}

/** Converts UI DiscoveryFilters into the backend DiscoveryFilterInput[] shape. */
export function buildDiscoveryFilters(
  filters: DiscoveryFilters,
): DiscoveryFilterInput[] {
  const result: DiscoveryFilterInput[] = [];

  const followerMin = filters.followers[0] !== "" ? Number(filters.followers[0]) : undefined;
  const followerMax = filters.followers[1] !== "" ? Number(filters.followers[1]) : undefined;
  if (followerMin !== undefined || followerMax !== undefined) {
    result.push({ type: "followers", value: { min: followerMin, max: followerMax } });
  }

  const categories = normalizeTerms(filters.categories ?? []);
  if (categories.length > 0) {
    result.push({ type: "category", values: categories });
  }

  const locations = normalizeTerms(filters.locations ?? []);
  if (locations.length > 0) {
    result.push({ type: "location", values: locations });
  }

  const hashtags = normalizeTerms(filters.hashtags ?? []);
  if (hashtags.length > 0) {
    result.push({ type: "hashtag", values: hashtags });
  }

  if (filters.isVerified) {
    result.push({ type: "isVerified", value: true });
  }

  if (filters.hasEmail) {
    result.push({ type: "hasEmail", value: true });
  }

  return result;
}

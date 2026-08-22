import type { DiscoveryFilters } from "../types";

// Mirror of the backend type — kept here to avoid importing functions/ into the frontend.
export type DiscoveryFilterInput =
  | { type: "followers"; value: { min?: number; max?: number } }
  | { type: "following"; value: { min?: number; max?: number } }
  | { type: "hashtagsOR"; values: string[] }
  | { type: "isVerified"; value: boolean }
  | { type: "hasEmail"; value: boolean }
  | { type: "field"; field: string; operator: string; value: string | number | boolean };

/**
 * Converts UI DiscoveryFilters into the backend DiscoveryFilterInput[] shape.
 * hashtags + categories + locations are OR-merged into one post_hashtags filter.
 */
export function buildDiscoveryFilters(
  filters: DiscoveryFilters,
): DiscoveryFilterInput[] {
  const result: DiscoveryFilterInput[] = [];

  const followerMin = filters.followers[0] !== "" ? Number(filters.followers[0]) : undefined;
  const followerMax = filters.followers[1] !== "" ? Number(filters.followers[1]) : undefined;
  if (followerMin !== undefined || followerMax !== undefined) {
    result.push({ type: "followers", value: { min: followerMin, max: followerMax } });
  }

  // Merge hashtags + categories + locations → single OR filter on post_hashtags
  const combinedTags = [
    ...filters.hashtags,
    ...filters.categories,
    ...filters.locations,
  ].map((t) => t.toLowerCase().replace(/^#/, "")).filter(Boolean);

  if (combinedTags.length > 0) {
    result.push({ type: "hashtagsOR", values: combinedTags });
  }

  if (filters.isVerified) {
    result.push({ type: "isVerified", value: true });
  }

  if (filters.hasEmail) {
    result.push({ type: "hasEmail", value: true });
  }

  return result;
}

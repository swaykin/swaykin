import {PostRow} from "./postRepo";

/**
 * Posts per week from the date range of fetched posts.
 * Returns null if fewer than 2 posts (no range to compute).
 * Result is rounded to 1 decimal place.
 */
export function computePostingFrequency(posts: PostRow[]): number | null {
  if (posts.length < 2) return null;
  const timestamps = posts
    .map((p) => new Date(p.postedAt).getTime())
    .filter((t) => !isNaN(t));
  if (timestamps.length < 2) return null;
  const newest = Math.max(...timestamps);
  const oldest = Math.min(...timestamps);
  const weeks = (newest - oldest) / (7 * 24 * 60 * 60 * 1000);
  if (weeks === 0) return null;
  return Math.round((posts.length / weeks) * 10) / 10;
}

/**
 * Top N hashtags by frequency across all posts.
 * Skips null/empty tags.
 */
export function computeTopHashtags(
  posts: PostRow[],
  limit = 10
): { tag: string; count: number }[] {
  const freq = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.hashtags ?? []) {
      if (tag) freq.set(tag, (freq.get(tag) ?? 0) + 1);
    }
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({tag, count}));
}

/**
 * Unique collaborator handles across all posts, sorted by number of
 * co-authored posts descending.
 */
export function computeCollaborators(
  posts: PostRow[]
): { handle: string; postCount: number }[] {
  const freq = new Map<string, number>();
  for (const post of posts) {
    for (const handle of post.collaborators ?? []) {
      if (handle) freq.set(handle, (freq.get(handle) ?? 0) + 1);
    }
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([handle, postCount]) => ({handle, postCount}));
}

/**
 * Count of unique collaborator handles across all posts.
 */
export function computeActiveCollaborations(posts: PostRow[]): number {
  const unique = new Set<string>();
  for (const post of posts) {
    for (const handle of post.collaborators ?? []) {
      if (handle) unique.add(handle);
    }
  }
  return unique.size;
}

/**
 * Average engagement rate (%) across posts.
 * Falls back to profile-level avgEngagementRate if posts have no usable data.
 * Rounded to 1 decimal place.
 */
export function computeEngagementRate(
  posts: PostRow[],
  followers: number | null,
  fallback: number | null
): number | null {
  if (!followers || followers === 0) {
    return fallback !== null ? Math.round(fallback * 10) / 10 : null;
  }
  const rates = posts
    .filter((p) => p.likes !== null || p.comments !== null)
    .map((p) => (((p.likes ?? 0) + (p.comments ?? 0)) / followers) * 100);
  if (rates.length === 0) {
    return fallback !== null ? Math.round(fallback * 10) / 10 : null;
  }
  const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
  return Math.round(avg * 10) / 10;
}

/**
 * Average estimated views per post, rounded to nearest integer.
 * Returns null if no posts have estimatedViews data.
 */
export function computeAvgReachPerPost(posts: PostRow[]): number | null {
  const views = posts
    .map((p) => p.estimatedViews)
    .filter((v): v is number => v !== null && v !== undefined);
  if (views.length === 0) return null;
  return Math.round(views.reduce((a, b) => a + b, 0) / views.length);
}

export interface ContentBreakdown {
  reelsPct: number;
  staticPct: number;
  carouselPct: number;
}

/**
 * Percentage breakdown of post types (Reel / Image / Carousel).
 * Returns null if posts array is empty.
 * Percentages are rounded; may not sum to exactly 100 due to rounding.
 */
export function computeContentBreakdown(
  posts: PostRow[]
): ContentBreakdown | null {
  if (posts.length === 0) return null;
  let reels = 0;
  let images = 0;
  let carousels = 0;
  for (const post of posts) {
    const type = post.type ?? "";
    if (type === "Reel") reels++;
    else if (type === "Carousel") carousels++;
    else images++; // "Image" or unknown → Static
  }
  const total = posts.length;
  return {
    reelsPct: Math.round((reels / total) * 100),
    staticPct: Math.round((images / total) * 100),
    carouselPct: Math.round((carousels / total) * 100),
  };
}

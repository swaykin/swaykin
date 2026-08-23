import {normalizeInstagramAccount} from "./normalizeAccount";
import {findProfilesByHandles} from "./profileRepo";
import type {CompetitorMap} from "./workspaceCompetitors";

const UUID_RE =
  /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

/** Profile UUIDs for every active competitor in the workspace map. */
export function getActiveCompetitorProfileIds(
  competitorMap: CompetitorMap
): string[] {
  return Object.entries(competitorMap)
    .filter(([, meta]) => meta.status === "active")
    .map(([id]) => id);
}

/**
 * Maps client `profileIds` (Instagram handles, URLs, or legacy UUIDs) to
 * global Profile row ids that exist in this workspace's competitor map.
 */
export async function resolveCompetitorProfileIds(
  identifiers: string[],
  competitorMap: CompetitorMap
): Promise<string[]> {
  const resolved = new Set<string>();
  const handlesToLookup: string[] = [];

  for (const raw of identifiers) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    if (UUID_RE.test(trimmed)) {
      if (competitorMap[trimmed]) resolved.add(trimmed);
      continue;
    }

    const normalized = normalizeInstagramAccount(trimmed);
    if (normalized) handlesToLookup.push(normalized.igHandle);
  }

  if (handlesToLookup.length > 0) {
    const uniqueHandles = [...new Set(handlesToLookup)];
    const profiles = await findProfilesByHandles(uniqueHandles);
    for (const profile of profiles) {
      if (competitorMap[profile.id]) resolved.add(profile.id);
    }
  }

  return [...resolved];
}

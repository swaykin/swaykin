import * as logger from "firebase-functions/logger";
import {normalizeInstagramAccount} from "./normalizeAccount";
import {
  findProfilesByHandles,
  findProfilesByIds,
  ProfileRow,
} from "./profileRepo";
import {findPostsByProfileId, PostRow} from "./postRepo";

export interface OwnBrandData {
  profile: ProfileRow;
  posts: PostRow[];
}

/**
 * @param {string} input Raw Instagram handle or URL.
 * @return {string[]} Deduped lookup keys (normalized, bare, lowercase).
 */
function buildHandleCandidates(input: string): string[] {
  const out = new Set<string>();
  const trimmed = input.trim();
  if (!trimmed) return [];

  const normalized = normalizeInstagramAccount(trimmed);
  if (normalized) out.add(normalized.igHandle);

  const bare = trimmed.replace(/^@/, "").trim();
  if (bare) {
    out.add(bare);
    out.add(bare.toLowerCase());
  }

  return [...out];
}

/**
 * @param {ProfileRow[]} profiles Candidate profiles from a handle query.
 * @param {string[]} candidates Handle variants we searched for.
 * @return {ProfileRow | null} Best matching profile, if any.
 */
function pickProfileMatch(
  profiles: ProfileRow[],
  candidates: string[]
): ProfileRow | null {
  if (profiles.length === 0) return null;
  if (profiles.length === 1) return profiles[0];

  const byLower = new Map(profiles.map((p) => [p.igHandle.toLowerCase(), p]));
  for (const candidate of candidates) {
    const hit = byLower.get(candidate.toLowerCase());
    if (hit) return hit;
  }
  return profiles[0];
}

/**
 * Loads the workspace's own brand from global Profile + Post rows.
 * Tries Workspace.instagramHandle first (with case/@/URL variants), then
 * falls back to an active competitor Profile with type "own" or a matching
 * handle when the workspace handle is missing or mismatched.
 * @param {string | null} instagramHandle Workspace.instagramHandle (raw).
 * @param {number} postsLimit Posts to load for metric computation.
 * @param {string[]} competitorProfileIds Active competitor Profile ids for
 *   fallback resolution.
 * @return {Promise<OwnBrandData | null>} Profile and posts, or null.
 */
export async function loadOwnBrandForWorkspace(
  instagramHandle: string | null,
  postsLimit: number,
  competitorProfileIds: string[] = []
): Promise<OwnBrandData | null> {
  if (instagramHandle) {
    const candidates = buildHandleCandidates(instagramHandle);
    if (candidates.length > 0) {
      const profiles = await findProfilesByHandles(candidates);
      const profile = pickProfileMatch(profiles, candidates);
      if (profile) {
        const posts = await findPostsByProfileId(profile.id, postsLimit);
        return {profile, posts};
      }
    }
  }

  if (competitorProfileIds.length === 0) {
    if (instagramHandle) {
      logger.warn(
        "loadOwnBrandForWorkspace: no Profile matched workspace handle",
        {instagramHandle}
      );
    }
    return null;
  }

  const competitors = await findProfilesByIds(competitorProfileIds);
  const targetLower = instagramHandle ?
    normalizeInstagramAccount(instagramHandle)?.igHandle.toLowerCase() :
    null;

  const ownProfile =
    competitors.find((p) => p.type === "own") ??
    (targetLower ?
      competitors.find((p) => p.igHandle.toLowerCase() === targetLower) :
      undefined);

  if (!ownProfile) {
    if (instagramHandle) {
      logger.warn(
        "loadOwnBrandForWorkspace: handle and competitor fallback failed",
        {instagramHandle, competitorCount: competitorProfileIds.length}
      );
    }
    return null;
  }

  const posts = await findPostsByProfileId(ownProfile.id, postsLimit);
  return {profile: ownProfile, posts};
}

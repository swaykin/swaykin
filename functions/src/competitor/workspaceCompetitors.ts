import {getDataConnect} from "firebase-admin/data-connect";
import {connectorConfig} from "../brightdata/dataConnectConfig";

export type CompetitorStatus =
  | "active"
  | "inactive"
  | "archived"
  | "pending"
  | "error";

export interface CompetitorMapEntry {
  status: CompetitorStatus;
  addedAt: string;
  notes?: string | null;
  error?: string | null;
}

export type CompetitorMap = Record<string, CompetitorMapEntry>;

/** Reserved key inside Workspace.competitors JSON for in-flight operation locks. */
export const WORKSPACE_LOCKS_KEY = "$locks";

export interface WorkspaceCompetitorsPayload {
  [WORKSPACE_LOCKS_KEY]?: Record<string, {requestId: string; startedAtMs: number}>;
  [profileId: string]: unknown;
}

const dc = getDataConnect(connectorConfig);

const UUID_RE =
  /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

/**
 * Drops any map entries whose key isn't a UUID-shaped Profile.id. Guards
 * against corrupted entries (e.g. a caller accidentally stringifying a
 * non-string value as a JS object key) so one bad entry never breaks
 * every read of this workspace's competitors.
 * @param {CompetitorMap} map Raw parsed map.
 * @return {CompetitorMap} The map with invalid keys removed.
 */
function dropInvalidKeys(map: CompetitorMap): CompetitorMap {
  const clean: CompetitorMap = {};
  for (const [key, value] of Object.entries(map)) {
    if (UUID_RE.test(key)) clean[key] = value;
  }
  return clean;
}

/**
 * @param {string | null | undefined} raw Stored Workspace.competitors JSON.
 * @return {{locks: Record<string, {requestId: string, startedAtMs: number}>, competitors: CompetitorMap}}
 */
export function parseWorkspaceCompetitorsColumn(
  raw: string | null | undefined
): {
  locks: Record<string, {requestId: string; startedAtMs: number}>;
  competitors: CompetitorMap;
} {
  if (!raw) {
    return {locks: {}, competitors: {}};
  }
  try {
    const parsed = JSON.parse(raw) as WorkspaceCompetitorsPayload;
    const locks = parsed[WORKSPACE_LOCKS_KEY] ?? {};
    const competitors: CompetitorMap = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (key === WORKSPACE_LOCKS_KEY) continue;
      if (UUID_RE.test(key) && value && typeof value === "object") {
        competitors[key] = value as CompetitorMapEntry;
      }
    }
    return {locks, competitors: dropInvalidKeys(competitors)};
  } catch {
    return {locks: {}, competitors: {}};
  }
}

/**
 * @param {Record<string, {requestId: string, startedAtMs: number}>} locks Operation locks.
 * @param {CompetitorMap} competitors Competitor pointer map.
 * @return {string} Serialized Workspace.competitors JSON.
 */
export function serializeWorkspaceCompetitorsColumn(
  locks: Record<string, {requestId: string; startedAtMs: number}>,
  competitors: CompetitorMap
): string {
  const payload: WorkspaceCompetitorsPayload = {...competitors};
  if (Object.keys(locks).length > 0) {
    payload[WORKSPACE_LOCKS_KEY] = locks;
  }
  return JSON.stringify(payload);
}

/**
 * @param {string} workspaceId Workspace row id.
 * @return {Promise<{locks: Record<string, {requestId: string, startedAtMs: number}>, competitors: CompetitorMap}>}
 */
export async function readWorkspaceCompetitorsColumn(
  workspaceId: string
): Promise<{
  locks: Record<string, {requestId: string; startedAtMs: number}>;
  competitors: CompetitorMap;
}> {
  const query = `query($id: UUID!) {
    workspace(id: $id) {
      competitors
    }
  }`;
  const res = await dc.executeGraphqlRead<
    { workspace: { competitors: string | null } | null },
    { id: string }
  >(query, {variables: {id: workspaceId}});
  return parseWorkspaceCompetitorsColumn(res.data.workspace?.competitors);
}

/**
 * @param {string} workspaceId Workspace row id.
 * @param {Record<string, {requestId: string, startedAtMs: number}>} locks Operation locks.
 * @param {CompetitorMap} competitors Competitor pointer map.
 * @return {Promise<void>}
 */
export async function writeWorkspaceCompetitorsColumn(
  workspaceId: string,
  locks: Record<string, {requestId: string; startedAtMs: number}>,
  competitors: CompetitorMap
): Promise<void> {
  await dc.executeGraphql<
    { workspace_update: { id: string } | null },
    { id: string; data: { competitors: string } }
  >(
    `mutation($id: UUID!, $data: Workspace_Data!) {
      workspace_update(id: $id, data: $data)
    }`,
    {
      variables: {
        id: workspaceId,
        data: {
          competitors: serializeWorkspaceCompetitorsColumn(locks, competitors),
        },
      },
    }
  );
}

/**
 * @param {string} workspaceId Workspace row id.
 * @return {Promise<CompetitorMap>} The workspace's competitor pointer map
 *   (Profile.id -> workspace-specific status/notes), or `{}` if unset.
 */
export async function getWorkspaceCompetitorMap(
  workspaceId: string
): Promise<CompetitorMap> {
  const {competitors} = await readWorkspaceCompetitorsColumn(workspaceId);
  return competitors;
}

/**
 * @param {CompetitorMap} map Workspace competitor pointer map.
 * @param {string} profileId Global Profile.id.
 * @return {boolean} Whether the profile is actively tracked by the workspace.
 */
export function isActiveWorkspaceCompetitor(
  map: CompetitorMap,
  profileId: string
): boolean {
  return map[profileId]?.status === "active";
}

/**
 * Writes the full competitor pointer map back to the workspace row.
 * @param {string} workspaceId Workspace row id.
 * @param {CompetitorMap} map Full competitor map to persist.
 * @return {Promise<void>}
 */
export async function setWorkspaceCompetitorMap(
  workspaceId: string,
  map: CompetitorMap
): Promise<void> {
  const {locks} = await readWorkspaceCompetitorsColumn(workspaceId);
  await writeWorkspaceCompetitorsColumn(workspaceId, locks, map);
}

/**
 * Adds or reactivates a competitor pointer for a workspace. Only ever
 * touches this workspace's own map — never the shared Profile/Post rows.
 * @param {string} workspaceId Workspace row id.
 * @param {string} profileId Global Profile.id being tracked.
 * @param {CompetitorStatus} status Status to set — "active" when reusing an
 *   already-fetched Profile, "pending" when a background fetch was just
 *   enqueued for a brand-new one.
 * @param {string | undefined} notes Optional workspace-specific notes.
 * @return {Promise<void>}
 */
export async function addCompetitorToWorkspace(
  workspaceId: string,
  profileId: string,
  status: CompetitorStatus,
  notes?: string
): Promise<void> {
  const map = await getWorkspaceCompetitorMap(workspaceId);
  map[profileId] = {
    status,
    addedAt: new Date().toISOString(),
    notes: notes ?? map[profileId]?.notes ?? null,
    error: null,
  };
  await setWorkspaceCompetitorMap(workspaceId, map);
}

/**
 * Flips an existing competitor pointer's status — used by the background
 * fetch worker once it finishes (or fails) processing a "pending" entry.
 * A read-modify-write cycle through {@link getWorkspaceCompetitorMap} also
 * drops any stale invalid keys as a side effect (self-healing).
 * @param {string} workspaceId Workspace row id.
 * @param {string} profileId Global Profile.id being updated.
 * @param {"active" | "error"} status Resulting status after the fetch.
 * @param {string | undefined} errorMessage Failure detail, if status is
 *   "error".
 * @return {Promise<void>}
 */
export async function setCompetitorFetchResult(
  workspaceId: string,
  profileId: string,
  status: "active" | "error",
  errorMessage?: string
): Promise<void> {
  const map = await getWorkspaceCompetitorMap(workspaceId);
  if (!map[profileId]) return; // Entry removed/never existed — nothing to do.
  map[profileId] = {
    ...map[profileId],
    status,
    error: status === "error" ? errorMessage ?? "Unknown error" : null,
  };
  await setWorkspaceCompetitorMap(workspaceId, map);
}

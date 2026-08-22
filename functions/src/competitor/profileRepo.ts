import {getDataConnect} from "firebase-admin/data-connect";
import {connectorConfig} from "../brightdata/dataConnectConfig";

export interface ProfileRow {
  id: string;
  igHandle: string;
  name: string;
  type: string;
  bio: string | null;
  avatarUrl: string | null;
  followers: number | null;
  followings: number | null;
  postsCount: number | null;
  avgEngagementRate: number | null;
  verified: boolean | null;
  email: string | null;
  lastStatsUpdatedAt: string | null;
}

export interface ProfileUpsertData {
  igHandle: string;
  type: string;
  name: string;
  bio?: string | null;
  avatarUrl?: string | null;
  followers?: number | null;
  followings?: number | null;
  postsCount?: number | null;
  avgEngagementRate?: number | null;
  verified?: boolean | null;
}

const dc = getDataConnect(connectorConfig);

const PROFILE_FIELDS = `
  id
  igHandle
  name
  type
  bio
  avatarUrl
  followers
  followings
  postsCount
  avgEngagementRate
  verified
  email
  lastStatsUpdatedAt
`;

/**
 * @param {string} igHandle Instagram handle to look up (dedup key).
 * @return {Promise<ProfileRow | null>} The existing global Profile row, or
 *   null if this Instagram account has never been tracked by any workspace.
 */
export async function findProfileByHandle(
  igHandle: string
): Promise<ProfileRow | null> {
  const query = `query($igHandle: String!) {
    profiles(where: {igHandle: {eq: $igHandle}}, limit: 1) {
      ${PROFILE_FIELDS}
    }
  }`;
  const res = await dc.executeGraphqlRead<
    { profiles: ProfileRow[] },
    { igHandle: string }
  >(query, {variables: {igHandle}});
  return res.data.profiles[0] ?? null;
}

/**
 * @param {string[]} profileIds Profile row ids to fetch.
 * @return {Promise<ProfileRow[]>} Matching global Profile rows.
 */
export async function findProfilesByIds(
  profileIds: string[]
): Promise<ProfileRow[]> {
  if (profileIds.length === 0) return [];
  const query = `query($ids: [UUID!]!) {
    profiles(where: {id: {in: $ids}}) {
      ${PROFILE_FIELDS}
    }
  }`;
  const res = await dc.executeGraphqlRead<
    { profiles: ProfileRow[] },
    { ids: string[] }
  >(query, {variables: {ids: profileIds}});
  return res.data.profiles;
}

/** Profile fields plus the timestamps set on first creation. */
type ProfileInsertData = ProfileUpsertData & {
  createdAt: string;
  lastStatsUpdatedAt: string;
};

/**
 * Creates a brand-new global Profile row. Caller must have already checked
 * {@link findProfileByHandle} to avoid violating the igHandle uniqueness
 * convention.
 * @param {ProfileUpsertData} data Mapped profile fields.
 * @return {Promise<string>} The new Profile row's id.
 */
export async function createProfile(data: ProfileUpsertData): Promise<string> {
  const now = new Date().toISOString();
  // profile_insert returns Profile_KeyOutput — a scalar in the schema (no
  // `{ id }` sub-selection allowed), but its actual JSON value is an object
  // `{id: "<uuid>"}`, confirmed empirically. Must unwrap .id here.
  const res = await dc.executeGraphql<
    { profile_insert: { id: string } },
    { data: ProfileInsertData }
  >(
    `mutation($data: Profile_Data!) {
      profile_insert(data: $data)
    }`,
    {
      variables: {
        data: {...data, createdAt: now, lastStatsUpdatedAt: now},
      },
    }
  );
  return res.data.profile_insert.id;
}

/** Partial profile fields plus the refreshed-at timestamp. */
type ProfileRefreshData = Partial<ProfileUpsertData> & {
  lastStatsUpdatedAt: string;
};

/**
 * Refreshes a stale global Profile's cached stats in place.
 * @param {string} profileId Existing Profile row id.
 * @param {ProfileUpsertData} data Freshly fetched profile fields.
 * @return {Promise<void>}
 */
export async function refreshProfileStats(
  profileId: string,
  data: ProfileUpsertData
): Promise<void> {
  await dc.executeGraphql<
    { profile_update: { id: string } | null },
    { id: string; data: ProfileRefreshData }
  >(
    `mutation($id: UUID!, $data: Profile_Data!) {
      profile_update(id: $id, data: $data)
    }`,
    {
      variables: {
        id: profileId,
        data: {...data, lastStatsUpdatedAt: new Date().toISOString()},
      },
    }
  );
}

/** Staleness threshold before a shared Profile's stats are re-fetched. */
export const PROFILE_STALE_MS = 15 * 24 * 60 * 60 * 1000;

/**
 * @param {ProfileRow} profile Existing global Profile row.
 * @return {boolean} Whether its cached stats are stale and should refresh.
 */
export function isProfileStale(profile: ProfileRow): boolean {
  if (!profile.lastStatsUpdatedAt) return true;
  const age = Date.now() - new Date(profile.lastStatsUpdatedAt).getTime();
  return age > PROFILE_STALE_MS;
}

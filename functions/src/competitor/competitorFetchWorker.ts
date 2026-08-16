import {
  triggerPostsDiscovery,
  pollPostsSnapshotUntilReady,
  sortPostsByDateDesc,
  RawBrightDataPost,
} from "./brightDataPostsClient";
import {
  SNAPSHOT_POLL_TIMEOUT_MS,
  SNAPSHOT_POLL_INTERVAL_MS,
} from "../brightdata/constants";
import {refreshProfileStats} from "./profileRepo";
import {upsertPosts} from "./postRepo";
import {extractProfileData, toPostUpsertData} from "./mapping";

const NUM_REELS = 20;
const LIMIT_PER_INPUT = 30;

export interface FetchResult {
  followers: number | null;
  postsFetched: number;
}

/**
 * Does the slow part: fetches an Instagram account's recent Reels from
 * Bright Data (a ~90-200s trigger+poll cycle), then refreshes the given
 * global Profile row's cached stats and upserts its Posts. Callers run
 * this from a background task (never directly behind Firebase Hosting's
 * ~60s rewrite timeout, which this routinely exceeds).
 * @param {object} params Fetch parameters.
 * @param {string} params.profileId Existing global Profile row id — the
 *   caller must have already created a (possibly placeholder) row.
 * @param {string} params.igHandle Instagram handle to fetch.
 * @param {string} params.profileUrl Normalized Instagram profile URL.
 * @param {string} params.apiToken Bright Data API bearer token.
 * @return {Promise<FetchResult>} Follower count and posts written.
 * @throws If Bright Data returns no usable data for this account.
 */
export async function fetchAndPersistCompetitor({
  profileId,
  igHandle,
  profileUrl,
  apiToken,
}: {
  profileId: string;
  igHandle: string;
  profileUrl: string;
  apiToken: string;
}): Promise<FetchResult> {
  const triggerResult = await triggerPostsDiscovery({
    profileUrl,
    numReels: NUM_REELS,
    limitPerInput: LIMIT_PER_INPUT,
    apiToken,
  });

  const rawData = triggerResult.ready ?
    triggerResult.data :
    await pollPostsSnapshotUntilReady({
      snapshotId: triggerResult.snapshotId,
      apiToken,
      timeoutMs: SNAPSHOT_POLL_TIMEOUT_MS,
      intervalMs: SNAPSHOT_POLL_INTERVAL_MS,
    });

  const rawPosts = (Array.isArray(rawData) ? rawData : [rawData]).filter(
    (p): p is RawBrightDataPost => typeof p === "object" && p !== null
  );

  if (rawPosts.length === 0) {
    throw new Error("No posts found for this account");
  }

  const selectedPosts = sortPostsByDateDesc(rawPosts);
  const profileData = extractProfileData(rawPosts, igHandle);

  // Bright Data occasionally returns a malformed/non-array payload that
  // still passes the `rawPosts.length === 0` check above (e.g. a single
  // stray object). Guard against persisting garbage profile stats.
  if (profileData.followers === null && profileData.postsCount === null) {
    throw new Error(
      "Bright Data returned no usable profile data for this account"
    );
  }

  await refreshProfileStats(profileId, profileData);

  const postRows = selectedPosts
    .map((p) => toPostUpsertData(p, profileId, profileData.followers ?? null))
    .filter((p): p is NonNullable<typeof p> => p !== null);
  const postsFetched = await upsertPosts(postRows);

  return {followers: profileData.followers ?? null, postsFetched};
}

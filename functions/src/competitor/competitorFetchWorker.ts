import * as logger from "firebase-functions/logger";
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
import {brightDataDatasetId} from "../config";
import {refreshProfileStats} from "./profileRepo";
import {upsertPosts} from "./postRepo";
import {
  calculateAvgEngagementRate,
  extractProfileData,
  mapBrightDataProfileRecord,
  toPostUpsertData,
} from "./mapping";
import {fetchRawProfileRecord} from "./profileDetailsClient";

const NUM_POSTS = 30;
const LIMIT_PER_INPUT = 30;

/**
 * @param {string} profileUrl Instagram profile URL.
 * @param {string} apiToken Bright Data API bearer token.
 * @return {Promise<unknown>} Raw posts data (array or single object).
 */
async function fetchRawPostsData(
  profileUrl: string,
  apiToken: string
): Promise<unknown> {
  const triggerResult = await triggerPostsDiscovery({
    profileUrl,
    numPosts: NUM_POSTS,
    limitPerInput: LIMIT_PER_INPUT,
    apiToken,
  });

  return triggerResult.ready ?
    triggerResult.data :
    await pollPostsSnapshotUntilReady({
      snapshotId: triggerResult.snapshotId,
      apiToken,
      timeoutMs: SNAPSHOT_POLL_TIMEOUT_MS,
      intervalMs: SNAPSHOT_POLL_INTERVAL_MS,
    });
}

export interface FetchResult {
  followers: number | null;
  postsFetched: number;
}

/**
 * Fetches an Instagram account from Bright Data in two sequential steps:
 * Profiles dataset first (persist stats), then Posts dataset (persist posts).
 * Callers that sit behind Firebase Hosting's ~60s rewrite timeout should run
 * this in the background with a long function timeout.
 * @param {object} params Fetch parameters.
 * @param {string} params.profileId Existing global Profile row id — the
 *   caller must have already created a (possibly placeholder) row.
 * @param {string} params.igHandle Instagram handle to fetch.
 * @param {string} params.profileUrl Normalized Instagram profile URL.
 * @param {string} params.apiToken Bright Data API bearer token.
 * @return {Promise<FetchResult>} Follower count and posts written.
 * @throws If the Profiles scrape returns no usable data for this account.
 */
export async function fetchAndPersistCompetitor({
  profileId,
  igHandle,
  profileUrl,
  apiToken,
  profileType = "competitor",
}: {
  profileId: string;
  igHandle: string;
  profileUrl: string;
  apiToken: string;
  profileType?: string;
}): Promise<FetchResult> {
  const rawProfile = await fetchRawProfileRecord(
    profileUrl,
    brightDataDatasetId.value(),
    apiToken
  );

  if (!rawProfile) {
    throw new Error("Bright Data profile scrape returned no usable data");
  }

  let profileData = mapBrightDataProfileRecord(
    rawProfile,
    igHandle,
    profileType
  );

  if (profileData.followers === null && profileData.postsCount === null) {
    throw new Error(
      "Something went wrong, upstream service is currently not providing data"
    );
  }

  await refreshProfileStats(profileId, profileData);

  const rawData = await fetchRawPostsData(profileUrl, apiToken);
  const rawPosts = (Array.isArray(rawData) ? rawData : [rawData]).filter(
    (p): p is RawBrightDataPost => typeof p === "object" && p !== null
  );

  if (rawPosts.length === 0) {
    logger.warn(
      `fetchAndPersistCompetitor: profile saved for ${igHandle} but posts ` +
      "scrape returned nothing"
    );
    return {followers: profileData.followers ?? null, postsFetched: 0};
  }

  const selectedPosts = sortPostsByDateDesc(rawPosts);
  const followers = profileData.followers ?? null;

  if (followers) {
    const avgEngagementRate = calculateAvgEngagementRate(selectedPosts, followers);
    if (avgEngagementRate !== profileData.avgEngagementRate) {
      profileData = {...profileData, avgEngagementRate};
      await refreshProfileStats(profileId, profileData);
    }
  } else {
    const fromPosts = extractProfileData(selectedPosts, igHandle, profileType);
    if (fromPosts.followers !== null || fromPosts.postsCount !== null) {
      profileData = {...profileData, ...fromPosts};
      await refreshProfileStats(profileId, profileData);
    }
  }

  const postRows = selectedPosts
    .map((p) => toPostUpsertData(p, profileId, profileData.followers ?? null))
    .filter((p): p is NonNullable<typeof p> => p !== null);

  if (postRows.length === 0) {
    logger.warn(
      `fetchAndPersistCompetitor: ${rawPosts.length} raw posts for ${igHandle} ` +
      "but none mapped — check BrightData field names"
    );
  }

  const postsFetched = await upsertPosts(postRows);

  return {followers: profileData.followers ?? null, postsFetched};
}

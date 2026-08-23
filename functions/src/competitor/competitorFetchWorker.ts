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
import {extractProfileData, toPostUpsertData} from "./mapping";
import {fetchProfileDetails} from "./profileDetailsClient";

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
  profileType = "competitor",
}: {
  profileId: string;
  igHandle: string;
  profileUrl: string;
  apiToken: string;
  profileType?: string;
}): Promise<FetchResult> {
  const [rawData, profileDetails] = await Promise.all([
    fetchRawPostsData(profileUrl, apiToken),
    fetchProfileDetails(profileUrl, brightDataDatasetId.value(), apiToken).catch(
      (err) => {
        logger.warn(
          `fetchAndPersistCompetitor: profile-details fetch failed for ${igHandle}`,
          err
        );
        return null;
      }
    ),
  ]);

  const rawPosts = (Array.isArray(rawData) ? rawData : [rawData]).filter(
    (p): p is RawBrightDataPost => typeof p === "object" && p !== null
  );

  if (rawPosts.length === 0) {
    throw new Error("No posts found for this account");
  }

  console.log("BrightData raw sample:", JSON.stringify(rawPosts[0]));

  const selectedPosts = sortPostsByDateDesc(rawPosts);
  const profileData = extractProfileData(rawPosts, igHandle, profileType);

  if (profileDetails) {
    if (profileDetails.name) profileData.name = profileDetails.name;
    if (profileDetails.bio) profileData.bio = profileDetails.bio;
    if (profileDetails.followings !== undefined) {
      profileData.followings = profileDetails.followings;
    }
    if (profileDetails.igAccountId) {
      // No Profile column for Bright Data's own account id yet — logged only,
      // ready to backfill once one exists (earmarked as a future Profile PK).
      logger.info(
        `fetchAndPersistCompetitor: igAccountId for ${igHandle} = ` +
        profileDetails.igAccountId
      );
    }
  }

  // Bright Data occasionally returns a malformed/non-array payload that
  // still passes the `rawPosts.length === 0` check above (e.g. a single
  // stray object). Guard against persisting garbage profile stats.
  if (profileData.followers === null && profileData.postsCount === null) {
    throw new Error(
      "Something went wrong, upstream service is currently not providing data"
    );
  }

  await refreshProfileStats(profileId, profileData);

  const postRows = selectedPosts
    .map((p) => toPostUpsertData(p, profileId, profileData.followers ?? null))
    .filter((p): p is NonNullable<typeof p> => p !== null);
  const postsFetched = await upsertPosts(postRows);

  return {followers: profileData.followers ?? null, postsFetched};
}

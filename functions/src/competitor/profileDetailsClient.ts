import {triggerScrape, pollSnapshotUntilReady} from "../brightdata/brightDataClient";
import {pickField, asString, asNumber} from "../brightdata/pickField";
import {
  SNAPSHOT_POLL_TIMEOUT_MS,
  SNAPSHOT_POLL_INTERVAL_MS,
} from "../brightdata/constants";

export interface ProfileDetails {
  name?: string;
  bio?: string;
  followings?: number;
  igAccountId?: string;
}

/**
 * Fetches richer profile-level fields (full name, bio, following count, the
 * platform's own account id) from Bright Data's Instagram Profiles dataset.
 * The Posts-by-URL dataset used elsewhere for competitor posts doesn't carry
 * these fields at all.
 * @param {string} profileUrl Instagram profile URL.
 * @param {string} datasetId Bright Data Instagram Profiles dataset id.
 * @param {string} apiToken Bright Data API bearer token.
 * @return {Promise<ProfileDetails | null>} Extracted fields, or null if
 *   Bright Data returned nothing usable for this account.
 */
export async function fetchProfileDetails(
  profileUrl: string,
  datasetId: string,
  apiToken: string
): Promise<ProfileDetails | null> {
  const triggerResult = await triggerScrape({
    urls: [profileUrl],
    datasetId,
    apiToken,
    limitPerInput: null,
  });

  const data = triggerResult.ready ?
    triggerResult.data :
    await pollSnapshotUntilReady({
      snapshotId: triggerResult.snapshotId,
      apiToken,
      timeoutMs: SNAPSHOT_POLL_TIMEOUT_MS,
      intervalMs: SNAPSHOT_POLL_INTERVAL_MS,
    });

  const items = Array.isArray(data) ? data : [data];
  const profile = items.find(
    (item): item is Record<string, unknown> =>
      typeof item === "object" && item !== null && !("error" in item)
  );
  if (!profile) return null;

  return {
    name: asString(pickField(profile, ["full_name", "profile_name"])),
    bio: asString(pickField(profile, ["biography", "bio"])),
    followings: asNumber(pickField(profile, ["following", "following_count"])),
    igAccountId: asString(pickField(profile, ["id", "fbid"])),
  };
}

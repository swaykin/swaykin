import {triggerScrape, pollSnapshotUntilReady} from "../brightdata/brightDataClient";
import {
  SNAPSHOT_POLL_TIMEOUT_MS,
  SNAPSHOT_POLL_INTERVAL_MS,
} from "../brightdata/constants";

/**
 * Scrapes one Instagram profile URL via Bright Data's Profiles dataset and
 * returns the first usable record. Call this before the Posts dataset scrape
 * so profile stats are persisted even when post mapping fails.
 * @param {string} profileUrl Instagram profile URL.
 * @param {string} datasetId Bright Data Instagram Profiles dataset id.
 * @param {string} apiToken Bright Data API bearer token.
 * @return {Promise<Record<string, unknown> | null>} Raw profile object, or
 *   null if Bright Data returned nothing usable.
 */
export async function fetchRawProfileRecord(
  profileUrl: string,
  datasetId: string,
  apiToken: string
): Promise<Record<string, unknown> | null> {
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
  return items.find(
    (item): item is Record<string, unknown> =>
      typeof item === "object" && item !== null && !("error" in item)
  ) ?? null;
}

import {extractSnapshotId, isPendingSnapshotBody} from "./snapshotResponse";
import {pollUntilReady} from "./poller";

const BASE_URL = "https://api.brightdata.com/datasets/v3";

export type ScrapeTriggerResult =
  | { ready: true; data: unknown }
  | { ready: false; snapshotId: string };

/**
 * Kicks off a scrape for the given URLs. Bright Data returns the data inline
 * when the job is fast enough, otherwise it returns a snapshot id that must
 * be polled via {@link fetchSnapshotOnce}.
 * @param {object} params Request parameters.
 * @param {string[]} params.urls Target URLs to scrape.
 * @param {string} params.datasetId Bright Data dataset id.
 * @param {string} params.apiToken Bright Data API bearer token.
 * @param {number | null} params.limitPerInput Optional per-input result limit.
 * @return {Promise<ScrapeTriggerResult>} Inline data or a snapshot id to poll.
 */
export async function triggerScrape({
  urls,
  datasetId,
  apiToken,
  limitPerInput,
}: {
  urls: string[];
  datasetId: string;
  apiToken: string;
  limitPerInput: number | null;
}): Promise<ScrapeTriggerResult> {
  const url =
    `${BASE_URL}/scrape?dataset_id=${encodeURIComponent(datasetId)}` +
    "&notify=false&include_errors=true";
  const response = await fetch(
    url,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: urls.map((url) => ({url})),
        limit_per_input: limitPerInput,
      }),
    }
  );

  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      `Bright Data scrape request failed (${response.status}): ` +
      JSON.stringify(body)
    );
  }

  const snapshotId = extractSnapshotId(body);
  if (snapshotId) {
    return {ready: false, snapshotId};
  }

  return {ready: true, data: body};
}

export type SnapshotFetchResult =
  | { ready: true; data: unknown }
  | { ready: false };

/**
 * Fetches a snapshot once. Bright Data reports "not ready" either via a
 * non-2xx status or a JSON body carrying a pending status field.
 * @param {string} snapshotId Snapshot id returned by {@link triggerScrape}.
 * @param {string} apiToken Bright Data API bearer token.
 * @return {Promise<SnapshotFetchResult>} The data if ready, else not-ready.
 */
export async function fetchSnapshotOnce(
  snapshotId: string,
  apiToken: string
): Promise<SnapshotFetchResult> {
  const response = await fetch(
    `${BASE_URL}/snapshot/${encodeURIComponent(snapshotId)}?format=json`,
    {headers: {Authorization: `Bearer ${apiToken}`}}
  );

  if (response.status === 202) {
    return {ready: false};
  }

  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      `Bright Data snapshot request failed (${response.status}): ` +
      JSON.stringify(body)
    );
  }

  if (isPendingSnapshotBody(body)) {
    return {ready: false};
  }

  return {ready: true, data: body};
}

/**
 * Polls a snapshot until it is ready or the timeout elapses.
 * @param {object} params Poll parameters.
 * @param {string} params.snapshotId Snapshot id to poll.
 * @param {string} params.apiToken Bright Data API bearer token.
 * @param {number} params.timeoutMs Overall timeout budget in milliseconds.
 * @param {number} params.intervalMs Delay between poll attempts, in ms.
 * @return {Promise<unknown>} The snapshot data once ready.
 */
export async function pollSnapshotUntilReady({
  snapshotId,
  apiToken,
  timeoutMs,
  intervalMs,
}: {
  snapshotId: string;
  apiToken: string;
  timeoutMs: number;
  intervalMs: number;
}): Promise<unknown> {
  return pollUntilReady({
    fetchOnce: () => fetchSnapshotOnce(snapshotId, apiToken),
    timeoutMs,
    intervalMs,
    notReadyMessage:
      `Bright Data snapshot ${snapshotId} was not ready after ${timeoutMs}ms`,
  });
}

import {
  extractSnapshotId,
  isPendingSnapshotBody,
  isSnapshotNotReadyErrorBody,
} from "./snapshotResponse";
import {pollUntilReady} from "./poller";

const BASE_URL = "https://api.brightdata.com/datasets";

export interface DatasetFilterCondition {
  name: string;
  value: string | number | boolean;
  operator: string;
}

export interface DatasetFilter {
  operator: "and" | "or";
  filters: DatasetFilterCondition[];
}

export type DatasetFilterTriggerResult =
  | { ready: true; data: unknown }
  | { ready: false; snapshotId: string };

/**
 * Kicks off a filtered dataset query. Bright Data returns the data inline
 * when the job is fast enough, otherwise it returns a snapshot id that must
 * be polled via {@link fetchDatasetSnapshotOnce}.
 * @param {object} params Request parameters.
 * @param {string} params.datasetId Bright Data dataset id.
 * @param {DatasetFilter} params.filter Filter conditions to apply.
 * @param {string} params.apiToken Bright Data API bearer token.
 * @param {number} [params.recordsLimit] Max number of records to return.
 * @return {Promise<DatasetFilterTriggerResult>} Inline data or a snapshot id.
 */
export async function triggerDatasetFilter({
  datasetId,
  filter,
  apiToken,
  recordsLimit,
}: {
  datasetId: string;
  filter: DatasetFilter;
  apiToken: string;
  recordsLimit?: number;
}): Promise<DatasetFilterTriggerResult> {
  const response = await fetch(`${BASE_URL}/filter`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dataset_id: datasetId,
      filter,
      ...(recordsLimit !== undefined && {records_limit: recordsLimit}),
    }),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      `Bright Data dataset filter request failed (${response.status}): ` +
      JSON.stringify(body)
    );
  }

  const snapshotId = extractSnapshotId(body);
  if (snapshotId) {
    return {ready: false, snapshotId};
  }

  return {ready: true, data: body};
}

export type DatasetSnapshotFetchResult =
  | { ready: true; data: unknown }
  | { ready: false };

/**
 * Fetches a filtered-dataset snapshot once. Bright Data reports "not ready"
 * either via a non-2xx status or a JSON body carrying a pending status field.
 * @param {string} snapshotId Snapshot id returned by trigger call.
 * @param {string} apiToken Bright Data API bearer token.
 * @return {Promise<DatasetSnapshotFetchResult>} The data if ready, else not.
 */
export async function fetchDatasetSnapshotOnce(
  snapshotId: string,
  apiToken: string
): Promise<DatasetSnapshotFetchResult> {
  const url =
    `${BASE_URL}/snapshots/${encodeURIComponent(snapshotId)}` +
    "/download?format=json";
  const response = await fetch(
    url,
    {headers: {Authorization: `Bearer ${apiToken}`}}
  );

  if (response.status === 202) {
    return {ready: false};
  }

  const body = await response.json();

  if (!response.ok) {
    if (isSnapshotNotReadyErrorBody(body)) {
      return {ready: false};
    }
    throw new Error(
      `Bright Data dataset snapshot request failed (${response.status}): ` +
      JSON.stringify(body)
    );
  }

  if (isPendingSnapshotBody(body)) {
    return {ready: false};
  }

  return {ready: true, data: body};
}

/**
 * Polls a filtered-dataset snapshot until ready or the timeout elapses.
 * @param {object} params Poll parameters.
 * @param {string} params.snapshotId Snapshot id to poll.
 * @param {string} params.apiToken Bright Data API bearer token.
 * @param {number} params.timeoutMs Overall timeout budget in milliseconds.
 * @param {number} params.intervalMs Delay between poll attempts, in ms.
 * @return {Promise<unknown>} The snapshot data once ready.
 */
export async function pollDatasetSnapshotUntilReady({
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
    fetchOnce: () => fetchDatasetSnapshotOnce(snapshotId, apiToken),
    timeoutMs,
    intervalMs,
    notReadyMessage:
      `Bright Data dataset snapshot ${snapshotId} was not ready after ` +
      `${timeoutMs}ms`,
  });
}

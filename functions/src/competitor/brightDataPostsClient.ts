import {extractSnapshotId} from "../brightdata/snapshotResponse";
import {pollUntilReady} from "../brightdata/poller";

const BASE_URL = "https://api.brightdata.com/datasets/v3";
const POSTS_DATASET_ID = "gd_lk5ns7kz21pck8jpis";

export interface RawBrightDataPost {
  post_id?: string;
  shortcode?: string;
  url?: string;
  description?: string;
  content_type?: string; // "Reel" | "Carousel" | "Image"
  date_posted?: string;
  likes?: number;
  num_comments?: number;
  hashtags?: string[];
  thumbnail?: string;
  photos?: string[];
  videos?: string[];
  video_view_count?: number;
  video_play_count?: number;
  [key: string]: unknown;
}

export type PostsTriggerResult =
  | { ready: true; data: unknown }
  | { ready: false; snapshotId: string };

/**
 * Triggers a "discover_new by URL" scrape for a profile's Reels only.
 * @param {object} params Request parameters.
 * @param {string} params.profileUrl Instagram profile URL to scrape.
 * @param {number} params.numReels Number of recent reels to request.
 * @param {number} params.limitPerInput Bright Data's per-input result cap.
 * @param {string} params.apiToken Bright Data API bearer token.
 * @return {Promise<PostsTriggerResult>} Inline data or a snapshot id.
 */
export async function triggerPostsDiscovery({
  profileUrl,
  numReels,
  limitPerInput,
  apiToken,
}: {
  profileUrl: string;
  numReels: number;
  limitPerInput: number;
  apiToken: string;
}): Promise<PostsTriggerResult> {
  const url =
    `${BASE_URL}/scrape?dataset_id=${encodeURIComponent(POSTS_DATASET_ID)}` +
    "&notify=false&include_errors=true&type=discover_new&discover_by=url";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: [
        {url: profileUrl, num_of_posts: numReels, post_type: "Reel"},
      ],
      limit_per_input: limitPerInput,
    }),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      `Bright Data posts discovery failed (${response.status}): ` +
      JSON.stringify(body)
    );
  }

  const snapshotId = extractSnapshotId(body);
  if (snapshotId) {
    return {ready: false, snapshotId};
  }

  return {ready: true, data: body};
}

/**
 * Lightweight status check via Bright Data's `/progress/{id}` endpoint —
 * confirmed empirically to report `{"status":"running"|"ready", ...}`.
 * Avoids transferring the (potentially large) snapshot payload on every
 * poll attempt; the full data is only fetched once, via
 * {@link fetchPostsSnapshot}, after progress reports "ready".
 * @param {string} snapshotId Snapshot id from {@link triggerPostsDiscovery}.
 * @param {string} apiToken Bright Data API bearer token.
 * @return {Promise<{ready: boolean}>} Whether the snapshot is ready.
 */
async function checkSnapshotProgress(
  snapshotId: string,
  apiToken: string
): Promise<{ ready: boolean }> {
  const response = await fetch(
    `${BASE_URL}/progress/${encodeURIComponent(snapshotId)}`,
    {headers: {Authorization: `Bearer ${apiToken}`}}
  );

  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      `Bright Data progress check failed (${response.status}): ` +
      JSON.stringify(body)
    );
  }

  const status = (body as {status?: unknown}).status;
  return {ready: status === "ready"};
}

/**
 * @param {string} snapshotId Snapshot id, already confirmed ready.
 * @param {string} apiToken Bright Data API bearer token.
 * @return {Promise<unknown>} The snapshot data (array of post records).
 */
async function fetchPostsSnapshot(
  snapshotId: string,
  apiToken: string
): Promise<unknown> {
  const response = await fetch(
    `${BASE_URL}/snapshot/${encodeURIComponent(snapshotId)}?format=json`,
    {headers: {Authorization: `Bearer ${apiToken}`}}
  );

  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      `Bright Data snapshot fetch failed (${response.status}): ` +
      JSON.stringify(body)
    );
  }

  return body;
}

/**
 * Polls Bright Data's `/progress/{id}` endpoint until the snapshot reports
 * ready, then fetches the final payload exactly once via `/snapshot/{id}`.
 * @param {object} params Poll parameters.
 * @param {string} params.snapshotId Snapshot id to poll.
 * @param {string} params.apiToken Bright Data API bearer token.
 * @param {number} params.timeoutMs Overall timeout budget in milliseconds.
 * @param {number} params.intervalMs Delay between poll attempts, in ms.
 * @return {Promise<unknown>} The snapshot data once ready.
 */
export async function pollPostsSnapshotUntilReady({
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
  await pollUntilReady({
    fetchOnce: async () => {
      const {ready} = await checkSnapshotProgress(snapshotId, apiToken);
      return ready ? {ready: true, data: null} : {ready: false};
    },
    timeoutMs,
    intervalMs,
    notReadyMessage:
      `Bright Data snapshot ${snapshotId} was not ready after ${timeoutMs}ms`,
  });

  return fetchPostsSnapshot(snapshotId, apiToken);
}

/**
 * Sorts posts newest-first by their Instagram post date.
 * @param {RawBrightDataPost[]} posts Posts returned by Bright Data.
 * @return {RawBrightDataPost[]} The same posts, sorted date descending.
 */
export function sortPostsByDateDesc(
  posts: RawBrightDataPost[]
): RawBrightDataPost[] {
  return [...posts].sort(
    (a, b) =>
      new Date(b.date_posted ?? 0).getTime() -
      new Date(a.date_posted ?? 0).getTime()
  );
}

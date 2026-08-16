/** Statuses Bright Data uses on a snapshot while it is still being built. */
const PENDING_SNAPSHOT_STATUSES = ["running", "building", "scheduled"];

/**
 * @param {unknown} body Parsed JSON response body.
 * @return {string | null} The snapshot id if the body only carries one.
 */
export function extractSnapshotId(body: unknown): string | null {
  if (
    typeof body === "object" &&
    body !== null &&
    "snapshot_id" in body &&
    typeof (body as {snapshot_id: unknown}).snapshot_id === "string"
  ) {
    return (body as {snapshot_id: string}).snapshot_id;
  }
  return null;
}

/**
 * Some Bright Data endpoints signal "not ready yet" as a non-2xx error body
 * (e.g. `{"error":"Snapshot not ready"}`) rather than a pending status field.
 * @param {unknown} body Parsed JSON response body.
 * @return {boolean} Whether the body is a "snapshot not ready" error.
 */
export function isSnapshotNotReadyErrorBody(body: unknown): boolean {
  if (typeof body !== "object" || body === null) {
    return false;
  }
  const error = (body as {error?: unknown}).error;
  return typeof error === "string" && error.toLowerCase().includes("not ready");
}

/**
 * @param {unknown} body Parsed JSON response body.
 * @return {boolean} Whether the body indicates the snapshot is still pending.
 */
export function isPendingSnapshotBody(body: unknown): boolean {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return false;
  }
  const status = (body as {status?: unknown}).status;
  return (
    typeof status === "string" && PENDING_SNAPSHOT_STATUSES.includes(status)
  );
}

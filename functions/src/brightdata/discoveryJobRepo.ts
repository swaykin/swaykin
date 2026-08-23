import {getDataConnect} from "firebase-admin/data-connect";
import * as logger from "firebase-functions/logger";
import {connectorConfig} from "./dataConnectConfig";

const dc = getDataConnect(connectorConfig);

export type DiscoveryJobStatus =
  | "pending"
  | "completed"
  | "failed"
  | "timeout"
  | "db_only";

interface DiscoveryJobInsertData {
  workspaceId: string;
  snapshotId: string | null;
  filters: string;
  recordsLimit: number;
  status: DiscoveryJobStatus;
  dbResultCount: number | null;
  bdResultCount: number | null;
  insertedCount: number | null;
  error: string | null;
}

interface DiscoveryJobUpdateData {
  status: DiscoveryJobStatus;
  bdResultCount?: number | null;
  insertedCount?: number | null;
  error?: string | null;
  completedAt?: string;
}

/**
 * Inserts a DiscoveryJob row and returns the generated id.
 * @param {DiscoveryJobInsertData} data Job fields to insert.
 * @return {Promise<string>} The new row id.
 */
export async function createDiscoveryJob(
  data: DiscoveryJobInsertData
): Promise<string> {
  const res = await dc.executeGraphql<
    {discoveryJob_insert: {id: string}},
    {data: DiscoveryJobInsertData}
  >(
    `mutation($data: DiscoveryJob_Data!) {
      discoveryJob_insert(data: $data)
    }`,
    {variables: {data}}
  );
  return res.data.discoveryJob_insert.id;
}

/**
 * Updates a DiscoveryJob row by id. Fire-and-forget safe — returns void.
 * @param {string} id Job row id.
 * @param {DiscoveryJobUpdateData} data Fields to update.
 */
export async function updateDiscoveryJob(
  id: string,
  data: DiscoveryJobUpdateData
): Promise<void> {
  await dc.executeGraphql<
    {discoveryJob_update: {id: string} | null},
    {id: string; data: DiscoveryJobUpdateData}
  >(
    `mutation($id: UUID!, $data: DiscoveryJob_Data!) {
      discoveryJob_update(id: $id, data: $data)
    }`,
    {variables: {id, data}}
  );
}

/** Fire-and-forget wrapper — logs warnings, never throws. */
export function trackDiscoveryJob(
  workspaceId: string,
  snapshotId: string | null,
  filters: string,
  recordsLimit: number,
  dbResultCount: number
): {complete: (bdResultCount: number, insertedCount: number) => void;
    fail: (status: "failed" | "timeout", error: string) => void} {
  let jobId: string | null = null;

  createDiscoveryJob({
    workspaceId,
    snapshotId,
    filters,
    recordsLimit,
    status: snapshotId ? "pending" : "db_only",
    dbResultCount,
    bdResultCount: null,
    insertedCount: null,
    error: null,
  })
    .then((id) => { jobId = id; })
    .catch((err) => logger.warn("discoveryJob insert failed (non-critical)", err));

  return {
    complete(bdResultCount: number, insertedCount: number) {
      if (!jobId) return;
      updateDiscoveryJob(jobId, {
        status: "completed",
        bdResultCount,
        insertedCount,
        completedAt: new Date().toISOString(),
      }).catch((err) =>
        logger.warn("discoveryJob update (completed) failed", err)
      );
    },
    fail(status: "failed" | "timeout", error: string) {
      if (!jobId) return;
      updateDiscoveryJob(jobId, {
        status,
        error,
        completedAt: new Date().toISOString(),
      }).catch((err) =>
        logger.warn("discoveryJob update (failed) failed", err)
      );
    },
  };
}

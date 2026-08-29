import * as logger from "firebase-functions/logger";
import {operationLockStaleMs} from "../config";
import {
  readWorkspaceCompetitorsColumn,
  writeWorkspaceCompetitorsColumn,
} from "../competitor/workspaceCompetitors";
import type {LockableOperation} from "./creditCosts";
import {OperationInProgressError} from "./creditErrors";

interface LockEntry {
  requestId: string;
  startedAtMs: number;
}

type LockMap = Partial<Record<LockableOperation, LockEntry>>;

/**
 * @return {number} Milliseconds before a stale in-flight lock may be replaced.
 */
export function getOperationLockStaleMs(): number {
  const parsed = Number(operationLockStaleMs.value());
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 5 * 60 * 1000;
  }
  return Math.floor(parsed);
}

/**
 * Acquires a per-workspace operation lock. Concurrent callers receive
 * OperationInProgressError until the lock is released or goes stale.
 * ponytail: stored in Workspace.competitors JSON under $locks until a
 * dedicated column migration lands.
 * @param {string} workspaceId Workspace row id.
 * @param {LockableOperation} operation Operation key.
 * @return {Promise<() => Promise<void>>} Release function for this lock holder.
 */
export async function acquireOperationLock(
  workspaceId: string,
  operation: LockableOperation
): Promise<() => Promise<void>> {
  const requestId = crypto.randomUUID();
  const staleMs = getOperationLockStaleMs();
  const now = Date.now();
  const {locks: rawLocks, competitors} =
    await readWorkspaceCompetitorsColumn(workspaceId);
  const locks = rawLocks as LockMap;
  const existing = locks[operation];

  if (existing && now - existing.startedAtMs < staleMs) {
    throw new OperationInProgressError();
  }
  if (existing) {
    logger.warn("operationLock: replacing stale lock", {
      workspaceId,
      operation,
      previousRequestId: existing.requestId,
    });
  }

  locks[operation] = {requestId, startedAtMs: now};
  await writeWorkspaceCompetitorsColumn(workspaceId, locks, competitors);

  return async () => {
    try {
      const current = await readWorkspaceCompetitorsColumn(workspaceId);
      const currentLocks = current.locks as LockMap;
      if (currentLocks[operation]?.requestId !== requestId) return;
      delete currentLocks[operation];
      await writeWorkspaceCompetitorsColumn(
        workspaceId,
        currentLocks,
        current.competitors
      );
    } catch (err) {
      logger.warn("operationLock: release failed", {workspaceId, operation, err});
    }
  };
}

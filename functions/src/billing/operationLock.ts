import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import {operationLockStaleMs} from "../config";
import type {LockableOperation} from "./creditCosts";
import {OperationInProgressError} from "./creditErrors";

const COLLECTION = "operationLocks";

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
 * @param {string} workspaceId Workspace row id.
 * @param {LockableOperation} operation Operation key.
 * @return {FirebaseFirestore.DocumentReference} Firestore lock document ref.
 */
function lockRef(workspaceId: string, operation: LockableOperation) {
  return admin
    .firestore()
    .collection(COLLECTION)
    .doc(`${workspaceId}_${operation}`);
}

/**
 * Acquires a per-workspace operation lock. Concurrent callers receive
 * OperationInProgressError until the lock is released or goes stale.
 * @param {string} workspaceId Workspace row id.
 * @param {LockableOperation} operation Operation key.
 * @return {Promise<() => Promise<void>>} Release function for this lock holder.
 */
export async function acquireOperationLock(
  workspaceId: string,
  operation: LockableOperation
): Promise<() => Promise<void>> {
  const ref = lockRef(workspaceId, operation);
  const requestId = crypto.randomUUID();
  const staleMs = getOperationLockStaleMs();
  const now = Date.now();

  await admin.firestore().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists) {
      const data = snap.data() as {requestId?: string; startedAtMs?: number};
      const startedAtMs = data.startedAtMs ?? 0;
      if (now - startedAtMs < staleMs) {
        throw new OperationInProgressError();
      }
      logger.warn("operationLock: replacing stale lock", {
        workspaceId,
        operation,
        previousRequestId: data.requestId,
      });
    }
    tx.set(ref, {requestId, startedAtMs: now});
  });

  return async () => {
    try {
      await admin.firestore().runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists) return;
        const data = snap.data() as {requestId?: string};
        if (data.requestId === requestId) {
          tx.delete(ref);
        }
      });
    } catch (err) {
      logger.warn("operationLock: release failed", {workspaceId, operation, err});
    }
  };
}

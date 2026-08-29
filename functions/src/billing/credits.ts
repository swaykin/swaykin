import {getDataConnect} from "firebase-admin/data-connect";
import * as logger from "firebase-functions/logger";
import {connectorConfig} from "../brightdata/dataConnectConfig";
import type {BillableOperation} from "./creditCosts";
import {getCreditCost} from "./creditCosts";
import {InsufficientCreditsError} from "./creditErrors";

const dc = getDataConnect(connectorConfig);

export interface CreditMutationMeta {
  activityType: BillableOperation | "refund";
  activityDescription: string;
}

/**
 * @param {string} workspaceId Workspace row id.
 * @return {Promise<number>} Current credits balance.
 */
export async function getCreditsBalance(workspaceId: string): Promise<number> {
  const res = await dc.executeGraphqlRead<
    {workspace: {creditsBalance: number} | null},
    {id: string}
  >(
    `query($id: UUID!) {
      workspace(id: $id) {
        creditsBalance
      }
    }`,
    {variables: {id: workspaceId}}
  );
  return res.data.workspace?.creditsBalance ?? 0;
}

/**
 * Deducts credits up front and records a ledger row. Rolls back if a
 * concurrent request drives the balance negative.
 * @param {string} workspaceId Workspace row id.
 * @param {number} amount Positive credits to deduct.
 * @param {CreditMutationMeta} meta Ledger metadata.
 * @return {Promise<number>} Balance after deduction.
 */
export async function deductCredits(
  workspaceId: string,
  amount: number,
  meta: CreditMutationMeta
): Promise<number> {
  if (amount <= 0) {
    return getCreditsBalance(workspaceId);
  }

  const balance = await getCreditsBalance(workspaceId);
  if (balance < amount) {
    throw new InsufficientCreditsError(balance, amount);
  }

  await dc.executeGraphql<
    {workspace_update: unknown},
    {id: string; data: {creditsBalance_update: Array<{inc: number}>}}
  >(
    `mutation($id: UUID!, $data: Workspace_Data!) {
      workspace_update(id: $id, data: $data)
    }`,
    {
      variables: {
        id: workspaceId,
        data: {creditsBalance_update: [{inc: -amount}]},
      },
    }
  );

  const balanceAfter = balance - amount;
  await insertCreditTransaction(workspaceId, -amount, balanceAfter, meta);

  const actual = await getCreditsBalance(workspaceId);
  if (actual < 0) {
    logger.warn("credits: balance went negative after deduct, rolling back", {
      workspaceId,
      amount,
      actual,
    });
    await applyBalanceDelta(workspaceId, amount);
    throw new InsufficientCreditsError(Math.max(actual + amount, 0), amount);
  }

  return actual;
}

/**
 * Refunds credits after a failed paid operation.
 * @param {string} workspaceId Workspace row id.
 * @param {number} amount Positive credits to restore.
 * @param {CreditMutationMeta} meta Ledger metadata.
 * @return {Promise<number>} Balance after refund.
 */
export async function refundCredits(
  workspaceId: string,
  amount: number,
  meta: CreditMutationMeta
): Promise<number> {
  if (amount <= 0) {
    return getCreditsBalance(workspaceId);
  }

  const balance = await getCreditsBalance(workspaceId);
  await applyBalanceDelta(workspaceId, amount);
  const balanceAfter = balance + amount;
  await insertCreditTransaction(workspaceId, amount, balanceAfter, meta);
  return balanceAfter;
}

/**
 * Deducts the configured cost for an operation or throws when balance is low.
 * @param {string} workspaceId Workspace row id.
 * @param {BillableOperation} operation Operation key.
 * @param {string} activityDescription Human-readable ledger label.
 * @return {Promise<{amount: number, balanceAfter: number}>} Deducted amount and new balance.
 */
export async function deductForOperation(
  workspaceId: string,
  operation: BillableOperation,
  activityDescription: string
): Promise<{amount: number; balanceAfter: number}> {
  const amount = getCreditCost(operation);
  const balanceAfter = await deductCredits(workspaceId, amount, {
    activityType: operation,
    activityDescription,
  });
  return {amount, balanceAfter};
}

/**
 * @param {string} workspaceId Workspace row id.
 * @param {BillableOperation} operation Operation key.
 * @return {Promise<void>} Resolves or throws InsufficientCreditsError.
 */
export async function assertSufficientCreditsForOperation(
  workspaceId: string,
  operation: BillableOperation
): Promise<void> {
  const required = getCreditCost(operation);
  const balance = await getCreditsBalance(workspaceId);
  if (balance < required) {
    throw new InsufficientCreditsError(balance, required);
  }
}

/**
 * @param {string} workspaceId Workspace row id.
 * @param {number} delta Signed balance change.
 * @return {Promise<void>}
 */
async function applyBalanceDelta(
  workspaceId: string,
  delta: number
): Promise<void> {
  await dc.executeGraphql<
    {workspace_update: unknown},
    {id: string; data: {creditsBalance_update: Array<{inc: number}>}}
  >(
    `mutation($id: UUID!, $data: Workspace_Data!) {
      workspace_update(id: $id, data: $data)
    }`,
    {
      variables: {
        id: workspaceId,
        data: {creditsBalance_update: [{inc: delta}]},
      },
    }
  );
}

/**
 * @param {string} workspaceId Workspace row id.
 * @param {number} creditsDelta Signed ledger delta.
 * @param {number} balanceAfter Balance after this mutation.
 * @param {CreditMutationMeta} meta Ledger metadata.
 * @return {Promise<void>}
 */
async function insertCreditTransaction(
  workspaceId: string,
  creditsDelta: number,
  balanceAfter: number,
  meta: CreditMutationMeta
): Promise<void> {
  await dc.executeGraphql<
    {creditTransaction_insert: unknown},
    {
      data: {
        workspaceId: string;
        date: string;
        activityType: string;
        activityDescription: string;
        creditsDelta: number;
        balanceAfter: number;
      };
    }
  >(
    `mutation($data: CreditTransaction_Data!) {
      creditTransaction_insert(data: $data)
    }`,
    {
      variables: {
        data: {
          workspaceId,
          date: new Date().toISOString(),
          activityType: meta.activityType,
          activityDescription: meta.activityDescription,
          creditsDelta,
          balanceAfter,
        },
      },
    }
  );
}

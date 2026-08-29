import {creditCostsJson} from "../config";

export type BillableOperation = "discovery" | "addCompetitor" | "getPosts";

export type LockableOperation = "discovery" | "addCompetitor";

const DEFAULT_COSTS: Record<BillableOperation, number> = {
  discovery: 20,
  addCompetitor: 20,
  getPosts: 15,
};

/**
 * @return {Record<BillableOperation, number>} Parsed per-operation credit costs.
 */
export function getCreditCosts(): Record<BillableOperation, number> {
  try {
    const parsed = JSON.parse(creditCostsJson.value()) as Record<string, unknown>;
    return {
      discovery: readCost(parsed, "discovery", DEFAULT_COSTS.discovery),
      addCompetitor: readCost(parsed, "addCompetitor", DEFAULT_COSTS.addCompetitor),
      getPosts: readCost(parsed, "getPosts", DEFAULT_COSTS.getPosts),
    };
  } catch {
    return {...DEFAULT_COSTS};
  }
}

/**
 * @param {BillableOperation} operation Operation key.
 * @return {number} Configured credit cost for the operation.
 */
export function getCreditCost(operation: BillableOperation): number {
  return getCreditCosts()[operation];
}

/**
 * @param {Record<string, unknown>} parsed Parsed JSON object.
 * @param {string} key Operation key.
 * @param {number} fallback Default when missing or invalid.
 * @return {number} Non-negative integer cost.
 */
function readCost(
  parsed: Record<string, unknown>,
  key: string,
  fallback: number
): number {
  const value = parsed[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return fallback;
  }
  return Math.floor(value);
}

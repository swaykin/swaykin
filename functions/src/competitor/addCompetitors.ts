import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import type {Request, Response} from "express";
import {applyCors} from "../shared/cors";
import {UPSTREAM_FAILURE_MESSAGE} from "../shared/clientErrors";
import {brightDataApiToken} from "../config";
import {
  extractBearerToken,
  verifyFirebaseIdToken,
  fetchUserByFirebaseUid,
} from "../auth/authHelpers";
import {normalizeInstagramAccount} from "./normalizeAccount";
import {
  findProfileByHandle,
  createProfile,
  isProfileStale,
  type ProfileRow,
} from "./profileRepo";
import {
  addCompetitorToWorkspace,
  setCompetitorFetchResult,
} from "./workspaceCompetitors";
import {fetchAndPersistCompetitor} from "./competitorFetchWorker";
import {acquireOperationLock} from "../billing/operationLock";
import {deductForOperation, refundCredits} from "../billing/credits";
import {getCreditCost} from "../billing/creditCosts";
import {sendBillingError} from "../billing/httpErrors";

interface AddCompetitorsBody {
  accounts: string[];
}

interface AccountResult {
  input: string;
  igHandle?: string;
  profileId?: string;
  followers?: number | null;
  status?: "active" | "error";
  error?: string;
  creditsDeducted?: number;
}

/**
 * @param {ProfileRow | null} existing Global profile row if found.
 * @return {boolean} Whether a Bright Data fetch will run for this account.
 */
function needsBrightDataFetch(existing: ProfileRow | null): boolean {
  if (!existing) return true;
  const hasRealData =
    existing.followers !== null || existing.postsCount !== null;
  if (!hasRealData) return true;
  return isProfileStale(existing);
}

/**
 * @param {unknown} body Parsed JSON request body.
 * @return {AddCompetitorsBody | null} The validated body, or null.
 */
function parseBody(body: unknown): AddCompetitorsBody | null {
  if (typeof body !== "object" || body === null) return null;
  const {accounts} = body as Record<string, unknown>;
  if (
    !Array.isArray(accounts) ||
    accounts.length === 0 ||
    !accounts.every((a) => typeof a === "string" && a.length > 0)
  ) {
    return null;
  }
  return {accounts};
}

/**
 * Adds one competitor account: reuses an existing global Profile if found,
 * otherwise creates one and fetches posts from Bright Data synchronously.
 * Stale profiles are refreshed in-place before returning.
 * @param {string} rawInput Raw account string (handle or URL).
 * @param {string} workspaceId Calling workspace's id.
 * @param {string} apiToken Bright Data API bearer token.
 * @return {Promise<AccountResult>} Outcome for this account.
 */
async function processAccount(
  rawInput: string,
  workspaceId: string,
  apiToken: string
): Promise<AccountResult> {
  const normalized = normalizeInstagramAccount(rawInput);
  if (!normalized) {
    return {input: rawInput, error: "Invalid Instagram handle or URL"};
  }
  const {igHandle, profileUrl} = normalized;

  const existing = await findProfileByHandle(igHandle);
  const hasRealData =
    existing && (existing.followers !== null || existing.postsCount !== null);
  const willFetch = needsBrightDataFetch(existing);
  let creditsDeducted = 0;

  if (willFetch) {
    const deducted = await deductForOperation(
      workspaceId,
      "addCompetitor",
      `Add competitor @${igHandle}`
    );
    creditsDeducted = deducted.amount;
  }

  if (existing && hasRealData && !isProfileStale(existing)) {
    await addCompetitorToWorkspace(workspaceId, existing.id, "active");
    return {
      input: rawInput,
      igHandle,
      profileId: existing.id,
      followers: existing.followers,
      status: "active",
      creditsDeducted,
    };
  }

  if (existing && hasRealData && isProfileStale(existing)) {
    await addCompetitorToWorkspace(workspaceId, existing.id, "active");
    try {
      await fetchAndPersistCompetitor({
        profileId: existing.id,
        igHandle,
        profileUrl,
        apiToken,
      });
      return {
        input: rawInput,
        igHandle,
        profileId: existing.id,
        followers: existing.followers,
        status: "active",
        creditsDeducted,
      };
    } catch (err) {
      if (creditsDeducted > 0) {
        await refundCredits(workspaceId, creditsDeducted, {
          activityType: "refund",
          activityDescription: `Refund: add competitor @${igHandle} failed`,
        });
      }
      logger.warn(`addCompetitors: stale refresh failed for ${igHandle}`, err);
      return {
        input: rawInput,
        igHandle,
        profileId: existing.id,
        followers: existing.followers,
        status: "active",
        error: UPSTREAM_FAILURE_MESSAGE,
        creditsDeducted: 0,
      };
    }
  }

  const profileId = existing ?
    existing.id :
    await createProfile({igHandle, type: "competitor", name: igHandle});

  await addCompetitorToWorkspace(workspaceId, profileId, "active");

  try {
    const result = await fetchAndPersistCompetitor({
      profileId,
      igHandle,
      profileUrl,
      apiToken,
    });
    await setCompetitorFetchResult(workspaceId, profileId, "active");
    return {
      input: rawInput,
      igHandle,
      profileId,
      followers: result.followers,
      status: "active",
      creditsDeducted,
    };
  } catch (err) {
    if (creditsDeducted > 0) {
      await refundCredits(workspaceId, creditsDeducted, {
        activityType: "refund",
        activityDescription: `Refund: add competitor @${igHandle} failed`,
      });
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.error(`addCompetitors: fetch failed for ${igHandle}`, err);
    await setCompetitorFetchResult(workspaceId, profileId, "error", message);
    return {
      input: rawInput,
      igHandle,
      profileId,
      error: UPSTREAM_FAILURE_MESSAGE,
      creditsDeducted: 0,
    };
  }
}

/**
 * Adds one or more Instagram accounts as competitors for the caller's
 * workspace. Fetches posts from Bright Data synchronously for new accounts
 * and returns "active" once data is stored. Stale existing profiles are
 * refreshed in-place before returning.
 * Route: POST /v1/competitors/add
 * POST body: `{ accounts: string[] }` — bare handles or full profile URLs.
 */
export const addCompetitors = onRequest(
  {
    invoker: "public",
    secrets: [brightDataApiToken],
    timeoutSeconds: 600,
  },
  async (request: Request, response: Response) => {
    if (applyCors(request, response)) return;

    if (request.method !== "POST") {
      response.status(405).json({error: "Use POST"});
      return;
    }

    const idToken = extractBearerToken(request.headers.authorization);
    if (!idToken) {
      response
        .status(401)
        .json({error: "Missing Authorization: Bearer <idToken>"});
      return;
    }

    let firebaseUid: string;
    try {
      firebaseUid = await verifyFirebaseIdToken(idToken);
    } catch (err) {
      logger.warn("addCompetitors: invalid or expired ID token", err);
      response.status(401).json({error: "Invalid or expired ID token"});
      return;
    }

    const user = await fetchUserByFirebaseUid(firebaseUid);
    if (!user) {
      response
        .status(404)
        .json({error: "No user record found for this account"});
      return;
    }

    const parsedBody = parseBody(request.body);
    if (!parsedBody) {
      response
        .status(400)
        .json({error: "Body must be { accounts: string[] (non-empty) }"});
      return;
    }

    let releaseLock: (() => Promise<void>) | null = null;
    try {
      releaseLock = await acquireOperationLock(user.workspaceId, "addCompetitor");
    } catch (err) {
      if (sendBillingError(response, err)) return;
      throw err;
    }

    const apiToken = brightDataApiToken.value();
    const results: AccountResult[] = [];
    let creditsDeducted = 0;

    try {
      for (const account of parsedBody.accounts) {
        try {
          const result = await processAccount(
            account,
            user.workspaceId,
            apiToken
          );
          creditsDeducted += result.creditsDeducted ?? 0;
          results.push(result);
        } catch (err) {
          if (sendBillingError(response, err)) return;
          logger.error(`addCompetitors: failed for "${account}"`, err);
          results.push({
            input: account,
            error: UPSTREAM_FAILURE_MESSAGE,
          });
        }
      }

      response.status(200).json({
        results,
        creditsDeducted,
        creditCostPerFetch: getCreditCost("addCompetitor"),
      });
    } finally {
      await releaseLock?.();
    }
  }
);

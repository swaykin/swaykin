import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import type {Request, Response} from "express";
import {getFunctions} from "firebase-admin/functions";
import {applyCors} from "../shared/cors";
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
} from "./profileRepo";
import {addCompetitorToWorkspace} from "./workspaceCompetitors";
import {CompetitorTaskPayload} from "./processCompetitorTask";

interface AddCompetitorsBody {
  accounts: string[];
}

interface AccountResult {
  input: string;
  igHandle?: string;
  profileId?: string;
  followers?: number | null;
  status?: "active" | "pending";
  error?: string;
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
 * Fast, synchronous half of adding a competitor. Never calls Bright Data
 * directly — Firebase Hosting's rewrite proxy caps requests at ~60s, well
 * under the 90-200s a real fetch takes, so that work is enqueued onto
 * {@link processCompetitorTask} instead and this returns immediately.
 * @param {string} rawInput Raw account string from the request.
 * @param {string} workspaceId Calling workspace's id.
 * @return {Promise<AccountResult>} Immediate outcome for this one account —
 *   "active" if an already-fetched global Profile was reused, "pending" if
 *   a background fetch was just enqueued for a brand-new one.
 */
async function processAccount(
  rawInput: string,
  workspaceId: string
): Promise<AccountResult> {
  const normalized = normalizeInstagramAccount(rawInput);
  if (!normalized) {
    return {input: rawInput, error: "Invalid Instagram handle or URL"};
  }
  const {igHandle, profileUrl} = normalized;

  const existing = await findProfileByHandle(igHandle);

  // A Profile with no followers AND no posts count has never actually been
  // fetched — e.g. a placeholder left behind by an enqueue that failed
  // (Cloud Tasks error, crash, etc.) before the worker could run. Its
  // `lastStatsUpdatedAt` looks "fresh" (set at creation), so staleness
  // alone can't distinguish it from a real fetch — check the data itself.
  const hasRealData =
    existing && (existing.followers !== null || existing.postsCount !== null);

  if (existing && hasRealData) {
    // Serve existing data immediately regardless of staleness — a stale
    // Profile still has real stats, just possibly outdated. Refresh it
    // silently in the background rather than blocking the caller on it.
    await addCompetitorToWorkspace(workspaceId, existing.id, "active");
    if (isProfileStale(existing)) {
      await enqueueFetch({
        workspaceId,
        profileId: existing.id,
        igHandle,
        profileUrl,
      });
    }
    return {
      input: rawInput,
      igHandle,
      profileId: existing.id,
      followers: existing.followers,
      status: "active",
    };
  }

  if (existing && !hasRealData) {
    // Placeholder from a previous failed enqueue — retry it, keyed by the
    // same Profile.id (no duplicate row).
    await addCompetitorToWorkspace(workspaceId, existing.id, "pending");
    await enqueueFetch({
      workspaceId,
      profileId: existing.id,
      igHandle,
      profileUrl,
    });
    return {
      input: rawInput,
      igHandle,
      profileId: existing.id,
      followers: null,
      status: "pending",
    };
  }

  // Brand new — create a placeholder Profile now (fast) so the workspace's
  // competitors map always points at a real row from the start, then hand
  // the slow Bright Data fetch off to the background task.
  const profileId = await createProfile({
    igHandle,
    type: "competitor",
    name: igHandle,
  });
  await addCompetitorToWorkspace(workspaceId, profileId, "pending");
  await enqueueFetch({workspaceId, profileId, igHandle, profileUrl});

  return {
    input: rawInput,
    igHandle,
    profileId,
    followers: null,
    status: "pending",
  };
}

/**
 * @param {CompetitorTaskPayload} payload Task payload for the background
 *   worker.
 * @return {Promise<void>}
 */
async function enqueueFetch(payload: CompetitorTaskPayload): Promise<void> {
  const queue = getFunctions().taskQueue(
    "locations/asia-south1/functions/processCompetitorTask"
  );
  await queue.enqueue(payload);
}

/**
 * Adds one or more Instagram accounts as competitors for the caller's
 * workspace. Returns immediately for every account: "active" if the
 * global Profile was already fetched (by this or any workspace) and is
 * reused as-is, or "pending" if a background fetch was just queued for a
 * brand-new account — poll `GET /v1/competitors` to see it flip to
 * "active" once that finishes.
 * POST body: `{ accounts: string[] }` — bare handles or full profile URLs.
 */
export const addCompetitors = onRequest(
  {invoker: "public"},
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

    const results: AccountResult[] = [];
    for (const account of parsedBody.accounts) {
      try {
        results.push(await processAccount(account, user.workspaceId));
      } catch (err) {
        logger.error(`addCompetitors: failed for "${account}"`, err);
        results.push({
          input: account,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    response.status(202).json({results});
  }
);

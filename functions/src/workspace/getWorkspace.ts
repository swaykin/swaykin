import {getDataConnect} from "firebase-admin/data-connect";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import {connectorConfig} from "../brightdata/dataConnectConfig";
import {
  extractBearerToken,
  verifyFirebaseIdToken,
  fetchUserByFirebaseUid,
} from "../auth/authHelpers";

interface WorkspaceRow {
  id: string;
  name: string;
  brandName: string | null;
  industry: string | null;
  website: string | null;
  instagramHandle: string | null;
  logoUrl: string | null;
  planTier: string;
  creditsBalance: number;
  creditsMonthlyAllowance: number;
  igFollowers: number | null;
  igPostsCount: number | null;
  igAvgEngagementRate: number | null;
}

/**
 * @param {string} workspaceId Workspace row id.
 * @return {Promise<WorkspaceRow | null>} The workspace, or null if it
 *   doesn't exist (shouldn't happen for a workspaceId taken off a valid
 *   User row, but guarded anyway).
 */
async function fetchWorkspace(
  workspaceId: string
): Promise<WorkspaceRow | null> {
  const dc = getDataConnect(connectorConfig);
  const query = `query($id: UUID!) {
    workspace(id: $id) {
      id
      name
      brandName
      industry
      website
      instagramHandle
      logoUrl
      planTier
      creditsBalance
      creditsMonthlyAllowance
      igFollowers
      igPostsCount
      igAvgEngagementRate
    }
  }`;
  const res = await dc.executeGraphqlRead<
    { workspace: WorkspaceRow | null },
    { id: string }
  >(query, {variables: {id: workspaceId}});
  return res.data.workspace ?? null;
}

/**
 * Returns the signed-in caller's own workspace. `workspaceId` is resolved
 * server-side from the caller's Firebase ID token (via their `User` row),
 * never trusted as client input — this is deliberately not `?workspaceId=`,
 * so one caller can't read another workspace's data by guessing an id.
 * Call with `Authorization: Bearer <Firebase ID token>`.
 */
export const getWorkspace = onRequest(
  {invoker: "public"},
  async (request, response) => {
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
      logger.warn("getWorkspace: invalid or expired ID token", err);
      response.status(401).json({error: "Invalid or expired ID token"});
      return;
    }

    try {
      const user = await fetchUserByFirebaseUid(firebaseUid);
      if (!user) {
        response
          .status(404)
          .json({error: "No user record found for this account"});
        return;
      }

      const workspace = await fetchWorkspace(user.workspaceId);
      if (!workspace) {
        response.status(404).json({error: "Workspace not found"});
        return;
      }

      response.status(200).json(workspace);
    } catch (err) {
      logger.error("getWorkspace: failed to fetch workspace", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      response.status(502).json({error: message});
    }
  }
);

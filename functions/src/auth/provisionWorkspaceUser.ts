import {getDataConnect} from "firebase-admin/data-connect";
import * as logger from "firebase-functions/logger";
import {connectorConfig} from "../brightdata/dataConnectConfig";
import {GoogleUserInfo} from "./googleOAuth";

const DEFAULT_PLAN_TIER = "free";
const DEFAULT_CREDITS = 1000;

interface WorkspaceInsertInput {
  name: string;
  planTier: string;
  creditsBalance: number;
  creditsMonthlyAllowance: number;
  createdAt: string;
}

interface UserInsertInput {
  workspaceId: string;
  firebaseUid: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  authProvider: string;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt: string;
}

/**
 * Creates a new Workspace + owning User row for a brand-new Google signup.
 * Only called once, right after the Firebase Auth user itself is created —
 * never on repeat logins, and never allowed to fail the sign-in redirect
 * (callers should catch and log, not propagate).
 * @param {GoogleUserInfo} googleUser Profile returned by Google's userinfo.
 * @param {string} firebaseUid The `google:<sub>` uid just created in
 *   Firebase Auth. Stored on the `User` row so `/me` can look it back up.
 * @return {Promise<{workspaceId: string, userId: string}>} The new rows'
 *   ids.
 */
export async function provisionWorkspaceAndUser(
  googleUser: GoogleUserInfo,
  firebaseUid: string
): Promise<{ workspaceId: string; userId: string }> {
  if (!googleUser.email) {
    throw new Error(
      `Cannot provision workspace/user for ${firebaseUid}: no email ` +
        "returned by Google"
    );
  }

  const dc = getDataConnect(connectorConfig);
  const now = new Date().toISOString();
  const displayName = googleUser.name ?? googleUser.email;

  const workspaceInput: WorkspaceInsertInput = {
    name: `${displayName}'s Workspace`,
    planTier: DEFAULT_PLAN_TIER,
    creditsBalance: DEFAULT_CREDITS,
    creditsMonthlyAllowance: DEFAULT_CREDITS,
    createdAt: now,
  };

  const workspaceRes = await dc.insert<
    { workspace_insert: { id: string } },
    WorkspaceInsertInput
  >("Workspace", workspaceInput);
  const workspaceId = workspaceRes.data.workspace_insert.id;

  const userInput: UserInsertInput = {
    workspaceId,
    firebaseUid,
    fullName: displayName,
    email: googleUser.email,
    role: "owner",
    status: "active",
    authProvider: "google",
    avatarUrl: googleUser.picture,
    createdAt: now,
    lastLoginAt: now,
  };

  const userRes = await dc.insert<
    { user_insert: { id: string } },
    UserInsertInput
  >("User", userInput);

  logger.info(`Provisioned workspace+user for new signup ${firebaseUid}`, {
    workspaceId,
    userId: userRes.data.user_insert.id,
  });

  return {workspaceId, userId: userRes.data.user_insert.id};
}

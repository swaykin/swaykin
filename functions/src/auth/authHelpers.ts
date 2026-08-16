import * as admin from "firebase-admin";
import {getDataConnect} from "firebase-admin/data-connect";
import {connectorConfig} from "../brightdata/dataConnectConfig";

export interface UserRow {
  id: string;
  workspaceId: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  phone: string | null;
}

/**
 * @param {string | undefined} authHeader Raw `Authorization` header value.
 * @return {string | null} The bearer token, or null if missing/malformed.
 */
export function extractBearerToken(
  authHeader: string | undefined
): string | null {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice("Bearer ".length).trim() || null;
}

/**
 * Verifies a Firebase ID token (not a custom token) server-side.
 * @param {string} idToken The bearer token from the request.
 * @return {Promise<string>} The verified Firebase uid.
 * @throws If the token is missing, malformed, or expired.
 */
export async function verifyFirebaseIdToken(idToken: string): Promise<string> {
  const decoded = await admin.auth().verifyIdToken(idToken);
  return decoded.uid;
}

const dc = getDataConnect(connectorConfig);

/**
 * @param {string} firebaseUid Firebase Auth uid to look up.
 * @return {Promise<UserRow | null>} The matching `User` row, or null.
 */
export async function fetchUserByFirebaseUid(
  firebaseUid: string
): Promise<UserRow | null> {
  const query = `query($firebaseUid: String!) {
    users(where: {firebaseUid: {eq: $firebaseUid}}, limit: 1) {
      id
      workspaceId
      fullName
      email
      role
      avatarUrl
      phone
    }
  }`;
  const res = await dc.executeGraphqlRead<
    { users: UserRow[] },
    { firebaseUid: string }
  >(query, {variables: {firebaseUid}});
  return res.data.users[0] ?? null;
}

export interface UserUpdateData {
  fullName?: string;
  avatarUrl?: string | null;
  phone?: string | null;
}

/**
 * @param {string} userId The `User` row id (UUID).
 * @param {UserUpdateData} data Fields to update (only provided fields change).
 */
export async function updateUserById(
  userId: string,
  data: UserUpdateData
): Promise<void> {
  const mutation = `mutation($id: UUID!, $data: User_Data!) {
    user_update(id: $id, data: $data)
  }`;
  await dc.executeGraphql<
    {user_update: unknown},
    {id: string; data: UserUpdateData}
  >(mutation, {variables: {id: userId, data}});
}

import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import {
  extractBearerToken,
  verifyFirebaseIdToken,
  fetchUserByFirebaseUid,
} from "./authHelpers";

/**
 * Returns the signed-in caller's `userId` + `workspaceId` (plus basic
 * profile), resolved from the Firebase ID token — not from any client-
 * supplied id. Call with `Authorization: Bearer <Firebase ID token>`
 * (the token from `signInWithCustomToken`/`getIdToken()`, not the custom
 * token itself).
 */
export const me = onRequest(
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
      logger.warn("me: invalid or expired ID token", err);
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

      response.status(200).json({
        userId: user.id,
        workspaceId: user.workspaceId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      });
    } catch (err) {
      logger.error("me: failed to fetch user record", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      response.status(502).json({error: message});
    }
  }
);

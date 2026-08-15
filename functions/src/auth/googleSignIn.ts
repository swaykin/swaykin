import * as crypto from "crypto";
import * as admin from "firebase-admin";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import {
  googleClientId,
  googleClientSecret,
  googleRedirectUri,
  allowedFrontendOrigins,
} from "../config";
import {
  buildGoogleAuthUrl,
  exchangeCodeForGoogleTokens,
  fetchGoogleUserInfo,
  GoogleUserInfo,
} from "./googleOAuth";
import {
  serializeOAuthSessionCookie,
  readOAuthSessionCookie,
  clearOAuthSessionCookieHeader,
} from "./cookies";
import {provisionWorkspaceAndUser} from "./provisionWorkspaceUser";

type AuthIntent = "login" | "signup";

/**
 * Thrown when the caller's declared intent doesn't match reality (e.g.
 * "signup" for an account that already exists). Caught separately from
 * other sign-in failures so the frontend gets a specific, actionable error.
 */
class IntentMismatchError extends Error {
  /**
   * @param {"account_exists" | "account_not_found"} errorCode Machine
   *   readable reason, sent back to the frontend as `#error=<code>`.
   */
  constructor(
    public readonly errorCode: "account_exists" | "account_not_found"
  ) {
    super(errorCode);
  }
}

/**
 * Reads `intent` off the frontend's own redirect URL. Missing/invalid
 * intent means "don't enforce" — keeps older callers (that don't declare
 * an intent) working exactly as before.
 * @param {string} frontendRedirectUri The caller's return URL.
 * @return {AuthIntent | null} The declared intent, or null if none/invalid.
 */
function parseIntent(frontendRedirectUri: string): AuthIntent | null {
  try {
    const intent = new URL(frontendRedirectUri).searchParams.get("intent");
    return intent === "login" || intent === "signup" ? intent : null;
  } catch {
    return null;
  }
}

/**
 * @param {string} uid Firebase uid to check.
 * @return {Promise<boolean>} Whether a user already exists for this uid.
 */
async function userExists(uid: string): Promise<boolean> {
  try {
    await admin.auth().getUser(uid);
    return true;
  } catch (err) {
    if ((err as { code?: string }).code === "auth/user-not-found") {
      return false;
    }
    throw err;
  }
}

/**
 * @param {string} redirectUri Frontend URL the caller wants to return to.
 * @return {boolean} Whether its origin is in ALLOWED_FRONTEND_ORIGINS.
 */
function isAllowedFrontendRedirect(redirectUri: string): boolean {
  let origin: string;
  try {
    origin = new URL(redirectUri).origin;
  } catch {
    return false;
  }
  const allowedOrigins = allowedFrontendOrigins
    .value()
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  return allowedOrigins.includes(origin);
}

/**
 * Creates the Firebase user on first sign-in, updates it on repeat
 * sign-ins. When `intent` is declared ("login" or "signup"), it must match
 * reality — an existing account can't "sign up" again, and a login attempt
 * can't silently create a new account.
 * @param {GoogleUserInfo} googleUser Profile returned by Google's userinfo.
 * @param {AuthIntent | null} intent Caller's declared intent, or null to
 *   skip the check entirely.
 * @return {Promise<{uid: string, isNewUser: boolean}>} The Firebase uid
 *   (`google:<sub>`) and whether this call created it (vs. an existing
 *   account logging back in).
 */
async function upsertFirebaseUserForGoogleAccount(
  googleUser: GoogleUserInfo,
  intent: AuthIntent | null
): Promise<{ uid: string; isNewUser: boolean }> {
  const uid = `google:${googleUser.sub}`;
  const userProperties = {
    email: googleUser.email,
    emailVerified: googleUser.email_verified ?? false,
    displayName: googleUser.name,
    photoURL: googleUser.picture,
  };

  const exists = await userExists(uid);

  if (intent === "signup" && exists) {
    throw new IntentMismatchError("account_exists");
  }
  if (intent === "login" && !exists) {
    throw new IntentMismatchError("account_not_found");
  }

  if (exists) {
    await admin.auth().updateUser(uid, userProperties);
  } else {
    await admin.auth().createUser({uid, ...userProperties});
  }

  return {uid, isNewUser: !exists};
}

/**
 * Step 1: browser navigates here (full page navigation, not a popup), we
 * stash a CSRF nonce + the caller's return URL in an httpOnly cookie, then
 * redirect to Google's real sign-in page.
 */
export const googleSignInStart = onRequest(
  {invoker: "public"},
  (request, response) => {
    const frontendRedirectUri = request.query.redirect_uri;

    if (
      typeof frontendRedirectUri !== "string" ||
      !isAllowedFrontendRedirect(frontendRedirectUri)
    ) {
      response.status(400).send("Missing or unauthorized redirect_uri");
      return;
    }

    const nonce = crypto.randomBytes(24).toString("base64url");
    const isSecure = request.protocol === "https";

    response.setHeader(
      "Set-Cookie",
      serializeOAuthSessionCookie({nonce, frontendRedirectUri}, isSecure)
    );

    const authUrl = buildGoogleAuthUrl({
      clientId: googleClientId.value(),
      redirectUri: googleRedirectUri.value(),
      state: nonce,
    });

    response.redirect(302, authUrl);
  }
);

/**
 * Step 2: Google redirects the browser back here with `code` + `state`. We
 * verify state against the cookie, exchange the code server-side (using the
 * client secret, which never touches the browser), upsert a Firebase user,
 * mint a custom token, then redirect to the frontend with the token in the
 * URL fragment (never sent to any server, unlike a query param).
 */
export const googleSignInCallback = onRequest(
  {secrets: [googleClientSecret], invoker: "public"},
  async (request, response) => {
    const isSecure = request.protocol === "https";
    const session = readOAuthSessionCookie(request.headers.cookie);
    response.setHeader("Set-Cookie", clearOAuthSessionCookieHeader(isSecure));

    if (!session) {
      logger.warn("Google sign-in callback: missing or expired session cookie");
      response.status(400).send("Missing or expired sign-in session. Retry.");
      return;
    }

    const {code, state, error} = request.query;

    if (error) {
      logger.warn("Google sign-in callback: Google returned an error", {error});
      const errorParam = encodeURIComponent(String(error));
      response.redirect(
        302,
        `${session.frontendRedirectUri}#error=${errorParam}`
      );
      return;
    }

    if (typeof code !== "string" || typeof state !== "string") {
      logger.warn("Google sign-in callback: missing code or state param");
      response.status(400).send("Invalid sign-in request.");
      return;
    }
    if (state !== session.nonce) {
      logger.warn("Google sign-in callback: state/nonce mismatch");
      response.status(400).send("Invalid sign-in request.");
      return;
    }

    const intent = parseIntent(session.frontendRedirectUri);

    try {
      const {accessToken} = await exchangeCodeForGoogleTokens({
        code,
        clientId: googleClientId.value(),
        clientSecret: googleClientSecret.value(),
        redirectUri: googleRedirectUri.value(),
      });

      const googleUser = await fetchGoogleUserInfo(accessToken);
      const {uid, isNewUser} = await upsertFirebaseUserForGoogleAccount(
        googleUser,
        intent
      );

      if (isNewUser) {
        try {
          await provisionWorkspaceAndUser(googleUser, uid);
        } catch (provisionErr) {
          // Login already succeeded (Firebase user exists); don't fail the
          // redirect over a Data Connect write failure. Logged for backfill.
          logger.error(
            "Failed to provision workspace/user for new signup",
            provisionErr
          );
        }
      }

      const customToken = await admin.auth().createCustomToken(uid);
      const tokenParam = encodeURIComponent(customToken);

      logger.info("Google sign-in callback: minted token", {uid, intent});
      response.redirect(
        302,
        `${session.frontendRedirectUri}#token=${tokenParam}`
      );
    } catch (err) {
      if (err instanceof IntentMismatchError) {
        response.redirect(
          302,
          `${session.frontendRedirectUri}#error=${err.errorCode}`
        );
        return;
      }
      logger.error("Google sign-in callback failed", err);
      response.redirect(
        302,
        `${session.frontendRedirectUri}#error=sign_in_failed`
      );
    }
  }
);

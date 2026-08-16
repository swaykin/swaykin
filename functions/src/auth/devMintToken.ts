import * as admin from "firebase-admin";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import {defineSecret} from "firebase-functions/params";

/**
 * Shared secret required to call `devMintToken`. Rotate/remove this
 * function entirely before any real customer-facing launch — it mints
 * login credentials for accounts, gated only by this secret + the
 * allowlist below, and exists purely to let manual API testing skip the
 * real Google OAuth flow.
 */
export const devTokenMintSecret = defineSecret("DEV_TOKEN_MINT_SECRET");

// Public by design — see "Why this is safe" in the integration guide.
const FIREBASE_WEB_API_KEY = "AIzaSyAQx4hgHmTbPgc-oOlWX3Kvu29D4gL5O54";

const IDENTITY_TOOLKIT_SIGN_IN_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken";

/**
 * Hard-coded, not config-driven: even with the shared secret, this
 * endpoint can only ever mint tokens for these known dev/test accounts —
 * never an arbitrary or real customer uid.
 */
const ALLOWED_TEST_UIDS = new Set([
  "google:100890076139615153435", // jineshj2800@gmail.com
  "google:102655111845271982064", // admin@swaykin.com
  "google:110813744996784185413", // developer@swaykin.com
]);

interface MintRequestBody {
  uid: string;
}

/**
 * @param {unknown} body Parsed JSON request body.
 * @return {MintRequestBody | null} The validated body, or null.
 */
function parseBody(body: unknown): MintRequestBody | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }
  const {uid} = body as Record<string, unknown>;
  if (typeof uid !== "string" || uid.length === 0) {
    return null;
  }
  return {uid};
}

/**
 * @param {string} customToken One-time custom token from
 *   `admin.auth().createCustomToken`.
 * @return {Promise<{idToken: string, expiresInSeconds: number}>} A real,
 *   ~1hr Firebase ID token — the same thing `signInWithCustomToken` would
 *   produce client-side.
 */
async function exchangeForIdToken(
  customToken: string
): Promise<{ idToken: string; expiresInSeconds: number }> {
  const res = await fetch(
    `${IDENTITY_TOOLKIT_SIGN_IN_URL}?key=${FIREBASE_WEB_API_KEY}`,
    {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({token: customToken, returnSecureToken: true}),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${body}`);
  }

  const data = (await res.json()) as { idToken: string; expiresIn: string };
  return {idToken: data.idToken, expiresInSeconds: Number(data.expiresIn)};
}

/**
 * DEV/TESTING ONLY. Mints a real ~1hr Firebase ID token for one of a
 * fixed set of known test accounts, skipping the real Google OAuth
 * redirect flow — so `/me`, `/getWorkspace`, `/competitor`, and
 * `/competitorComparison` can be exercised manually with `curl`.
 *
 * Requires header `x-dev-secret: <DEV_TOKEN_MINT_SECRET>`. Body:
 * `{ uid: string }`, where `uid` must be one of `ALLOWED_TEST_UIDS`.
 */
export const devMintToken = onRequest(
  {secrets: [devTokenMintSecret], invoker: "public"},
  async (request, response) => {
    if (request.method !== "POST") {
      response.status(405).json({error: "Use POST"});
      return;
    }

    const providedSecret = request.headers["x-dev-secret"];
    if (providedSecret !== devTokenMintSecret.value()) {
      response
        .status(401)
        .json({error: "Invalid or missing x-dev-secret header"});
      return;
    }

    const parsedBody = parseBody(request.body);
    if (!parsedBody) {
      response.status(400).json({error: "Body must be { uid: string }"});
      return;
    }

    if (!ALLOWED_TEST_UIDS.has(parsedBody.uid)) {
      response
        .status(403)
        .json({error: "uid is not in the dev/testing allowlist"});
      return;
    }

    try {
      const customToken = await admin
        .auth()
        .createCustomToken(parsedBody.uid);
      const {idToken, expiresInSeconds} = await exchangeForIdToken(
        customToken
      );
      response.status(200).json({idToken, expiresInSeconds});
    } catch (err) {
      logger.error("devMintToken: failed to mint/exchange token", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      response.status(502).json({error: message});
    }
  }
);

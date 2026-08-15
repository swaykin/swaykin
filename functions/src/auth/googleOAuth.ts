const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_ENDPOINT = "https://www.googleapis.com/oauth2/v3/userinfo";

export interface GoogleUserInfo {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

/**
 * @param {{clientId: string, redirectUri: string, state: string}} params
 *   OAuth client ID, our callback URL, and the CSRF nonce to round-trip.
 * @return {string} The Google consent-screen URL to redirect the user to.
 */
export function buildGoogleAuthUrl(params: {
  clientId: string;
  redirectUri: string;
  state: string;
}): string {
  const url = new URL(GOOGLE_AUTH_ENDPOINT);
  url.searchParams.set("client_id", params.clientId);
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", params.state);
  url.searchParams.set("access_type", "online");
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}

/**
 * Exchanges an authorization code for Google tokens. Server-side only: this
 * is the one call that uses the client secret.
 * @param {{code: string, clientId: string, clientSecret: string,
 *   redirectUri: string}} params Code from Google plus client credentials.
 * @return {Promise<{accessToken: string}>} The Google access token.
 */
export async function exchangeCodeForGoogleTokens(params: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}): Promise<{ accessToken: string }> {
  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: new URLSearchParams({
      code: params.code,
      client_id: params.clientId,
      client_secret: params.clientSecret,
      redirect_uri: params.redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google token exchange failed: ${response.status} ${body}`);
  }

  const data = (await response.json()) as { access_token: string };
  return {accessToken: data.access_token};
}

/**
 * @param {string} accessToken Google OAuth access token.
 * @return {Promise<GoogleUserInfo>} The signed-in Google account's profile.
 */
export async function fetchGoogleUserInfo(
  accessToken: string
): Promise<GoogleUserInfo> {
  const response = await fetch(GOOGLE_USERINFO_ENDPOINT, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });

  if (!response.ok) {
    const body = await response.text();
    const status = response.status;
    throw new Error(`Google userinfo request failed: ${status} ${body}`);
  }

  return (await response.json()) as GoogleUserInfo;
}

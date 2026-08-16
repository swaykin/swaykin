const OAUTH_COOKIE_NAME = "g_oauth_session";
const OAUTH_COOKIE_MAX_AGE_SECONDS = 5 * 60;

export interface OAuthSessionCookie {
  nonce: string;
  frontendRedirectUri: string;
}

/**
 * The nonce is echoed back by Google as `state` and compared against this
 * cookie on callback (double-submit pattern) to prevent login CSRF: without
 * it, an attacker could complete their own OAuth flow and trick a victim's
 * browser into finishing it, signing the victim into the attacker's account.
 * @param {OAuthSessionCookie} session Nonce + return URL to persist.
 * @param {boolean} isSecure Whether to mark the cookie Secure.
 * @return {string} A `Set-Cookie` header value.
 */
export function serializeOAuthSessionCookie(
  session: OAuthSessionCookie,
  isSecure: boolean
): string {
  const value = Buffer.from(JSON.stringify(session)).toString("base64url");
  const attributes = [
    `${OAUTH_COOKIE_NAME}=${value}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${OAUTH_COOKIE_MAX_AGE_SECONDS}`,
  ];
  if (isSecure) attributes.push("Secure");
  return attributes.join("; ");
}

/**
 * @param {string | undefined} cookieHeader Raw `Cookie` request header.
 * @return {OAuthSessionCookie | null} The parsed session, or null.
 */
export function readOAuthSessionCookie(
  cookieHeader: string | undefined
): OAuthSessionCookie | null {
  if (!cookieHeader) return null;

  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${OAUTH_COOKIE_NAME}=`));
  if (!match) return null;

  const rawValue = match.slice(OAUTH_COOKIE_NAME.length + 1);
  try {
    const parsed = JSON.parse(
      Buffer.from(rawValue, "base64url").toString("utf8")
    );
    if (
      typeof parsed.nonce === "string" &&
      typeof parsed.frontendRedirectUri === "string"
    ) {
      return parsed as OAuthSessionCookie;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * @param {boolean} isSecure Whether to mark the cookie Secure.
 * @return {string} A `Set-Cookie` header value that expires the cookie.
 */
export function clearOAuthSessionCookieHeader(isSecure: boolean): string {
  const attributes = [
    `${OAUTH_COOKIE_NAME}=`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (isSecure) attributes.push("Secure");
  return attributes.join("; ");
}

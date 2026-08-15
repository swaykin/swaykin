const INSTAGRAM_BASE_URL = "https://www.instagram.com";

export interface NormalizedAccount {
  igHandle: string;
  profileUrl: string;
}

/**
 * Accepts either a bare handle ("cetaphil_india") or a full Instagram
 * profile URL ("https://www.instagram.com/cetaphil_india/") and returns
 * both the canonical handle (dedup key) and a normalized profile URL to
 * pass to Bright Data.
 * @param {string} input Raw account input from the request body.
 * @return {NormalizedAccount | null} Normalized values, or null if the
 *   input doesn't resemble a valid handle/URL.
 */
export function normalizeInstagramAccount(
  input: string
): NormalizedAccount | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let handle: string;
  if (trimmed.includes("instagram.com/")) {
    const afterDomain = trimmed.split("instagram.com/")[1] ?? "";
    handle = afterDomain.split(/[/?#]/)[0];
  } else {
    handle = trimmed.replace(/^@/, "");
  }

  handle = handle.trim();
  if (!/^[A-Za-z0-9._]+$/.test(handle)) {
    return null;
  }

  return {
    igHandle: handle,
    profileUrl: `${INSTAGRAM_BASE_URL}/${handle}/`,
  };
}

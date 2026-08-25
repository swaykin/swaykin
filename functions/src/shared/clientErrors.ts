/** Generic message returned to clients when an upstream scrape/filter fails. */
export const UPSTREAM_FAILURE_MESSAGE = "Something went wrong";

/**
 * @param {unknown} err Caught error from a Bright Data poll or scrape.
 * @return {boolean} Whether the failure was a snapshot timeout.
 */
export function isUpstreamTimeout(err: unknown): boolean {
  const message = err instanceof Error ? err.message : "";
  return message.includes("was not ready after");
}

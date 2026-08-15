export type PollFetchResult<T> = { ready: true; data: T } | { ready: false };

/**
 * Repeatedly calls `fetchOnce` until it reports readiness or the timeout
 * budget elapses.
 * @param {object} params Poll parameters.
 * @param {Function} params.fetchOnce Single poll attempt.
 * @param {number} params.timeoutMs Overall timeout budget in milliseconds.
 * @param {number} params.intervalMs Delay between attempts, in ms.
 * @param {string} params.notReadyMessage Error message thrown on timeout.
 * @return {Promise<T>} The data once ready.
 */
export async function pollUntilReady<T>({
  fetchOnce,
  timeoutMs,
  intervalMs,
  notReadyMessage,
}: {
  fetchOnce: () => Promise<PollFetchResult<T>>;
  timeoutMs: number;
  intervalMs: number;
  notReadyMessage: string;
}): Promise<T> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const result = await fetchOnce();
    if (result.ready) {
      return result.data;
    }
    await sleep(intervalMs);
  }

  throw new Error(notReadyMessage);
}

/**
 * @param {number} ms Delay in milliseconds.
 * @return {Promise<void>} Resolves after the delay.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

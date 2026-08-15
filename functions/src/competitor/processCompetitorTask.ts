import {onTaskDispatched} from "firebase-functions/v2/tasks";
import * as logger from "firebase-functions/logger";
import {brightDataApiToken} from "../config";
import {fetchAndPersistCompetitor} from "./competitorFetchWorker";
import {setCompetitorFetchResult} from "./workspaceCompetitors";

export interface CompetitorTaskPayload {
  workspaceId: string;
  profileId: string;
  igHandle: string;
  profileUrl: string;
}

/**
 * Background worker invoked via Cloud Tasks (never behind Firebase
 * Hosting's ~60s rewrite timeout) to do the slow Bright Data fetch for one
 * newly-added competitor, then flip that workspace's pointer entry from
 * "pending" to "active" (or "error" on failure).
 */
export const processCompetitorTask = onTaskDispatched(
  {
    secrets: [brightDataApiToken],
    timeoutSeconds: 540,
    retryConfig: {maxAttempts: 2, minBackoffSeconds: 30},
    rateLimits: {maxConcurrentDispatches: 5},
    region: "asia-south1",
  },
  async (request) => {
    const {workspaceId, profileId, igHandle, profileUrl} =
      request.data as CompetitorTaskPayload;

    try {
      const result = await fetchAndPersistCompetitor({
        profileId,
        igHandle,
        profileUrl,
        apiToken: brightDataApiToken.value(),
      });
      await setCompetitorFetchResult(workspaceId, profileId, "active");
      logger.info(
        `processCompetitorTask: fetched ${igHandle} ` +
        `(${result.postsFetched} posts, ${result.followers} followers)`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      logger.error(`processCompetitorTask: failed for ${igHandle}`, err);
      await setCompetitorFetchResult(workspaceId, profileId, "error", message);
    }
  }
);

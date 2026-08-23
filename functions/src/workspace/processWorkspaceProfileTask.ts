import {onTaskDispatched} from "firebase-functions/v2/tasks";
import * as logger from "firebase-functions/logger";
import {brightDataApiToken} from "../config";
import {fetchAndPersistCompetitor} from "../competitor/competitorFetchWorker";

export interface WorkspaceProfileTaskPayload {
  profileId: string;
  igHandle: string;
  profileUrl: string;
}

/**
 * Background worker invoked via Cloud Tasks to fetch a workspace's own
 * brand Instagram profile and its latest posts from Bright Data. Runs
 * outside Firebase Hosting's ~60 s rewrite timeout. Triggered whenever a
 * workspace's `instagramHandle` field is set or changed.
 */
export const processWorkspaceProfileTask = onTaskDispatched(
  {
    secrets: [brightDataApiToken],
    timeoutSeconds: 540,
    retryConfig: {maxAttempts: 2, minBackoffSeconds: 30},
    rateLimits: {maxConcurrentDispatches: 3},
    region: "asia-south1",
  },
  async (request) => {
    const {profileId, igHandle, profileUrl} =
      request.data as WorkspaceProfileTaskPayload;

    try {
      const result = await fetchAndPersistCompetitor({
        profileId,
        igHandle,
        profileUrl,
        apiToken: brightDataApiToken.value(),
        profileType: "own",
      });
      logger.info(
        `processWorkspaceProfileTask: fetched ${igHandle} ` +
        `(${result.postsFetched} posts, ${result.followers} followers)`
      );
    } catch (err) {
      logger.error(`processWorkspaceProfileTask: failed for ${igHandle}`, err);
      // Re-throw so Cloud Tasks marks the attempt as failed and retries.
      throw err;
    }
  }
);

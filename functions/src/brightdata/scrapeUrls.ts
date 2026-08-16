import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import {brightDataApiToken, brightDataDatasetId} from "../config";
import {triggerScrape, pollSnapshotUntilReady} from "./brightDataClient";
import {saveScrapedInfluencers} from "./saveInfluencers";
import {
  SNAPSHOT_POLL_TIMEOUT_MS,
  SNAPSHOT_POLL_INTERVAL_MS,
} from "./constants";

interface ScrapeUrlsRequestBody {
  urls: string[];
  datasetId?: string;
  limitPerInput: number | null;
}

/**
 * @param {unknown} body Parsed JSON request body.
 * @return {ScrapeUrlsRequestBody | null} The validated body, or null.
 */
function parseRequestBody(body: unknown): ScrapeUrlsRequestBody | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }
  const {urls, datasetId, limitPerInput} = body as Record<string, unknown>;

  if (
    !Array.isArray(urls) ||
    urls.length === 0 ||
    !urls.every((url) => typeof url === "string" && url.length > 0)
  ) {
    return null;
  }
  if (datasetId !== undefined && typeof datasetId !== "string") {
    return null;
  }
  if (
    limitPerInput !== undefined &&
    limitPerInput !== null &&
    typeof limitPerInput !== "number"
  ) {
    return null;
  }

  return {urls, datasetId, limitPerInput: limitPerInput ?? null};
}

/**
 * Scrapes a batch of URLs via Bright Data. POST body: `{ urls: string[],
 * datasetId?: string, limitPerInput?: number }`. Returns the scraped data
 * once ready, polling internally (up to 10 minutes) when Bright Data hands
 * back a snapshot id instead of inline data.
 */
export const scrapeUrls = onRequest(
  {secrets: [brightDataApiToken], timeoutSeconds: 600, invoker: "public"},
  async (request, response) => {
    if (request.method !== "POST") {
      response.status(405).json({error: "Use POST"});
      return;
    }

    const parsedBody = parseRequestBody(request.body);
    if (!parsedBody) {
      response.status(400).json({
        error:
          "Body must be { urls: string[] (non-empty), datasetId?: " +
          "string, limitPerInput?: number }",
      });
      return;
    }

    const {urls, datasetId, limitPerInput} = parsedBody;
    const apiToken = brightDataApiToken.value();

    try {
      const triggerResult = await triggerScrape({
        urls,
        datasetId: datasetId ?? brightDataDatasetId.value(),
        apiToken,
        limitPerInput,
      });

      const data = triggerResult.ready ?
        triggerResult.data :
        await pollSnapshotUntilReady({
          snapshotId: triggerResult.snapshotId,
          apiToken,
          timeoutMs: SNAPSHOT_POLL_TIMEOUT_MS,
          intervalMs: SNAPSHOT_POLL_INTERVAL_MS,
        });

      let dbWrite: {insertedCount: number} | {error: string};
      try {
        const insertedCount = await saveScrapedInfluencers(data);
        dbWrite = {insertedCount};
      } catch (dbErr) {
        logger.error("Failed to write scraped data to database", dbErr);
        dbWrite = {
          error: dbErr instanceof Error ? dbErr.message : "Unknown error",
        };
      }

      response.status(200).json({data, dbWrite});
    } catch (err) {
      logger.error("Bright Data scrape failed", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      const isTimeout = message.includes("was not ready after");
      response.status(isTimeout ? 504 : 502).json({error: message});
    }
  }
);

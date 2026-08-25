import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import {brightDataApiToken, brightDataDatasetId} from "../config";
import {
  triggerDatasetFilter,
  pollDatasetSnapshotUntilReady,
  DatasetFilter,
} from "./instagramProfileFilterClient";
import {saveScrapedInfluencers} from "./saveInfluencers";
import {
  isUpstreamTimeout,
  UPSTREAM_FAILURE_MESSAGE,
} from "../shared/clientErrors";
import {
  SNAPSHOT_POLL_TIMEOUT_MS,
  SNAPSHOT_POLL_INTERVAL_MS,
} from "./constants";

interface FilterInstagramProfilesRequestBody {
  filter: DatasetFilter;
  datasetId?: string;
  recordsLimit?: number;
}

/**
 * @param {unknown} body Parsed JSON request body.
 * @return {FilterInstagramProfilesRequestBody | null} The validated body.
 */
function parseRequestBody(
  body: unknown
): FilterInstagramProfilesRequestBody | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }
  const {filter, datasetId, recordsLimit} = body as Record<string, unknown>;

  if (!isValidFilter(filter)) {
    return null;
  }
  if (datasetId !== undefined && typeof datasetId !== "string") {
    return null;
  }
  if (recordsLimit !== undefined && typeof recordsLimit !== "number") {
    return null;
  }

  return {filter, datasetId, recordsLimit};
}

/**
 * @param {unknown} filter Candidate filter value.
 * @return {boolean} Whether it matches Bright Data's filter shape.
 */
function isValidFilter(filter: unknown): filter is DatasetFilter {
  if (typeof filter !== "object" || filter === null) {
    return false;
  }
  const {operator, filters} = filter as Record<string, unknown>;
  return (
    (operator === "and" || operator === "or") &&
    Array.isArray(filters) &&
    filters.length > 0 &&
    filters.every((condition) => (
      typeof condition === "object" &&
      condition !== null &&
      typeof (condition as Record<string, unknown>).name === "string" &&
      typeof (condition as Record<string, unknown>).operator === "string" &&
      "value" in (condition as Record<string, unknown>)
    ))
  );
}

/**
 * Filters the Bright Data Instagram profiles dataset (gd_l1vikfch901nx3by4)
 * by field conditions. POST body: `{ filter: { operator: "and"|"or", filters:
 * [{ name, value, operator }] }, datasetId?: string, recordsLimit?: number }`.
 * Returns the filtered
 * data once ready, polling internally (up to 10 minutes) when Bright Data
 * hands back a snapshot id instead of inline data, and writes matched
 * profiles into the `Influencer` table.
 */
export const filterInstagramProfiles = onRequest(
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
          "Body must be { filter: { operator: \"and\"|\"or\", filters: " +
          "[{ name, value, operator }] }, datasetId?: string }",
      });
      return;
    }

    const {filter, datasetId, recordsLimit} = parsedBody;
    const apiToken = brightDataApiToken.value();

    try {
      const triggerResult = await triggerDatasetFilter({
        datasetId: datasetId ?? brightDataDatasetId.value(),
        filter,
        apiToken,
        recordsLimit,
      });

      const data = triggerResult.ready ?
        triggerResult.data :
        await pollDatasetSnapshotUntilReady({
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
        logger.error("Failed to write filtered profiles to database", dbErr);
        dbWrite = {
          error: dbErr instanceof Error ? dbErr.message : "Unknown error",
        };
      }

      response.status(200).json({data, dbWrite});
    } catch (err) {
      logger.error("Bright Data dataset filter failed", err);
      response.status(isUpstreamTimeout(err) ? 504 : 502).json({
        error: UPSTREAM_FAILURE_MESSAGE,
      });
    }
  }
);

import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import {brightDataApiToken, brightDataDatasetId} from "../config";
import {
  triggerDatasetFilter,
  pollDatasetSnapshotUntilReady,
} from "./instagramProfileFilterClient";
import {saveDiscoveryProfiles} from "./saveDiscoveryProfiles";
import {
  SNAPSHOT_POLL_TIMEOUT_MS,
  SNAPSHOT_POLL_INTERVAL_MS,
  MAX_RECORDS_LIMIT,
} from "./constants";
import {buildDatasetFilter, DiscoveryFilterInput} from "./discoveryFilters";
import {
  queryDiscoveryProfiles,
} from "./influencerRepo";
import {
  extractBearerToken,
  verifyFirebaseIdToken,
  fetchUserByFirebaseUid,
} from "../auth/authHelpers";
import {applyCors} from "../shared/cors";
import {trackDiscoveryJob} from "./discoveryJobRepo";

interface DiscoveryRequestBody {
  filters: DiscoveryFilterInput[];
  datasetId?: string;
  recordsLimit?: number;
}

/**
 * @param {unknown} body Parsed JSON request body.
 * @return {DiscoveryRequestBody | null} The validated body, or null.
 */
function parseRequestBody(body: unknown): DiscoveryRequestBody | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }
  const {filters, datasetId, recordsLimit} = body as Record<string, unknown>;

  if (!Array.isArray(filters) || filters.length === 0) {
    return null;
  }
  if (datasetId !== undefined && typeof datasetId !== "string") {
    return null;
  }
  if (recordsLimit !== undefined && typeof recordsLimit !== "number") {
    return null;
  }

  return {filters: filters as DiscoveryFilterInput[], datasetId, recordsLimit};
}

/**
 * Discovers Instagram profiles from the Bright Data dataset
 * (gd_l1vikfch901nx3by4) matching app-level filters. POST body:
 * `{ filters: [{ type: "followers"|"following"|"postsCount"|
 * "avgEngagement", value: { min?, max? } } | { type: "location"|"field",
 * field?, operator, value }], datasetId?: string, recordsLimit?: number }`.
 * Translates those filters into Bright Data's filter shape, polls for the
 * snapshot (up to 10 minutes) if needed, and writes matched profiles into
 * `Influencer`.
 */
export const discovery = onRequest(
  {
    secrets: [brightDataApiToken],
    timeoutSeconds: 3600,
    memory: "512MiB",
    invoker: "public",
  },
  async (request, response) => {
    if (applyCors(request, response)) return;

    if (request.method !== "POST") {
      response.status(405).json({error: "Use POST"});
      return;
    }

    const idToken = extractBearerToken(request.headers.authorization);
    if (!idToken) {
      response.status(401).json({error: "Missing Authorization: Bearer <idToken>"});
      return;
    }

    let workspaceId: string;
    try {
      const firebaseUid = await verifyFirebaseIdToken(idToken);
      const user = await fetchUserByFirebaseUid(firebaseUid);
      if (!user) {
        response.status(404).json({error: "No user record found for this account"});
        return;
      }
      workspaceId = user.workspaceId;
    } catch (err) {
      logger.warn("discovery: invalid or expired ID token", err);
      response.status(401).json({error: "Invalid or expired ID token"});
      return;
    }

    logger.info("discovery: request from workspace", {workspaceId});

    const parsedBody = parseRequestBody(request.body);
    if (!parsedBody) {
      response.status(400).json({
        error: "Body must be { filters: DiscoveryFilterInput[], " +
          "datasetId?: string }",
      });
      return;
    }

    let datasetFilter;
    try {
      datasetFilter = buildDatasetFilter(parsedBody.filters);
    } catch (err) {
      response.status(400).json({
        error: err instanceof Error ? err.message : "Invalid filters",
      });
      return;
    }

    const clientLimit = Math.min(parsedBody.recordsLimit ?? MAX_RECORDS_LIMIT, MAX_RECORDS_LIMIT);

    // Step 1: query DB up to clientLimit (same filter semantics as Bright Data)
    let dbResults: unknown[] = [];
    try {
      dbResults = await queryDiscoveryProfiles(parsedBody.filters, clientLimit);
      logger.info("discovery: DB query returned", {workspaceId, count: dbResults.length});
    } catch (dbErr) {
      logger.warn("discovery: DB query failed, will use Brightdata only", dbErr);
    }

    // Step 2: DB satisfied the full request → return immediately
    if (dbResults.length >= clientLimit) {
      trackDiscoveryJob(
        workspaceId, null,
        JSON.stringify(parsedBody.filters), clientLimit, dbResults.length
      );
      response.status(200).json({data: dbResults});
      return;
    }

    // Step 3: DB partial or empty → fetch remaining from Brightdata
    const remaining = clientLimit - dbResults.length;
    const apiToken = brightDataApiToken.value();

    try {
      const triggerResult = await triggerDatasetFilter({
        datasetId: parsedBody.datasetId ?? brightDataDatasetId.value(),
        filter: datasetFilter,
        apiToken,
        recordsLimit: remaining,
      });

      let bdData: unknown;
      let job: ReturnType<typeof trackDiscoveryJob> | null = null;

      if (triggerResult.ready) {
        bdData = triggerResult.data;
      } else {
        const snapshotId = triggerResult.snapshotId;
        job = trackDiscoveryJob(
          workspaceId, snapshotId,
          JSON.stringify(parsedBody.filters), remaining, dbResults.length
        );
        logger.info("discovery: snapshot pending", {snapshotId, workspaceId});

        try {
          bdData = await pollDatasetSnapshotUntilReady({
            snapshotId,
            apiToken,
            timeoutMs: SNAPSHOT_POLL_TIMEOUT_MS,
            intervalMs: SNAPSHOT_POLL_INTERVAL_MS,
          });
        } catch (pollErr) {
          const msg = pollErr instanceof Error ? pollErr.message : "Unknown";
          job.fail(msg.includes("was not ready after") ? "timeout" : "failed", msg);
          throw pollErr;
        }
      }

      let profilesUpserted = 0;
      let postsUpserted = 0;
      const snapshotId = !triggerResult.ready ? triggerResult.snapshotId : null;
      try {
        ({profilesUpserted, postsUpserted} =
          await saveDiscoveryProfiles(bdData, snapshotId));
      } catch (dbErr) {
        logger.error("Failed to write discovered profiles to database", dbErr);
      }

      const bdArray = Array.isArray(bdData) ? bdData : [bdData];
      if (job) job.complete(bdArray.length, profilesUpserted);
      response.status(200).json({
        data: [...dbResults, ...bdArray],
        profilesUpserted,
        postsUpserted,
      });
    } catch (err) {
      logger.error("Discovery filter failed", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      const isTimeout = message.includes("was not ready after");
      response.status(isTimeout ? 504 : 502).json({error: message});
    }
  }
);

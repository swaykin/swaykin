import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import {applyCors} from "../shared/cors";
import {
  extractBearerToken,
  verifyFirebaseIdToken,
  fetchUserByFirebaseUid,
} from "../auth/authHelpers";
import {getWorkspaceCompetitorMap} from "./workspaceCompetitors";
import {findProfilesByIds} from "./profileRepo";

/**
 * Lists the calling workspace's tracked competitors (name, verified,
 * lastStatsUpdatedAt only).
 * Query param: `?status=active|inactive|archived` (default: active).
 */
export const listCompetitors = onRequest(
  {invoker: "public"},
  async (request, response) => {
    if (applyCors(request, response)) return;

    if (request.method !== "GET") {
      response.status(405).json({error: "Use GET"});
      return;
    }

    const idToken = extractBearerToken(request.headers.authorization);
    if (!idToken) {
      response
        .status(401)
        .json({error: "Missing Authorization: Bearer <idToken>"});
      return;
    }

    let firebaseUid: string;
    try {
      firebaseUid = await verifyFirebaseIdToken(idToken);
    } catch (err) {
      logger.warn("listCompetitors: invalid or expired ID token", err);
      response.status(401).json({error: "Invalid or expired ID token"});
      return;
    }

    const user = await fetchUserByFirebaseUid(firebaseUid);
    if (!user) {
      response
        .status(404)
        .json({error: "No user record found for this account"});
      return;
    }

    const statusFilter = (request.query.status as string) ?? "active";

    try {
      const competitorMap = await getWorkspaceCompetitorMap(user.workspaceId);
      const matchingIds = Object.entries(competitorMap)
        .filter(([, meta]) => meta.status === statusFilter)
        .map(([profileId]) => profileId);

      const profiles = await findProfilesByIds(matchingIds);

      const results = profiles.map((profile) => ({
        profileId: profile.id,
        igUsername: profile.igHandle,
        name: profile.name,
        verified: profile.verified,
        lastStatsUpdatedAt: profile.lastStatsUpdatedAt,
      }));

      response.status(200).json({competitors: results});
    } catch (err) {
      logger.error("listCompetitors: failed to fetch competitors", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      response.status(502).json({error: message});
    }
  }
);

import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import {applyCors} from "../shared/cors";
import {
  extractBearerToken,
  verifyFirebaseIdToken,
  fetchUserByFirebaseUid,
} from "../auth/authHelpers";
import {findProfileByHandle} from "./profileRepo";
import {findPostsByProfileId} from "./postRepo";
import {getWorkspaceCompetitorMap} from "./workspaceCompetitors";
import {fetchAndPersistCompetitor} from "./competitorFetchWorker";
import {brightDataApiToken} from "../config";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

/**
 * GET /getPosts?username=<igHandle>&page=<n>&limit=<n>
 *
 * Returns paginated posts for a competitor profile. If the requested page
 * cannot be fully satisfied from the DB (i.e. the DB is exhausted), a fresh
 * Bright Data fetch is triggered, posts are persisted, and the page is
 * re-queried before responding.
 */
export const getPosts = onRequest(
  {
    invoker: "public",
    secrets: [brightDataApiToken],
    timeoutSeconds: 300,
  },
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
      logger.warn("getPosts: invalid or expired ID token", err);
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

    const username = (request.query.username as string | undefined)?.trim();
    if (!username) {
      response
        .status(400)
        .json({error: "Missing required query param: username"});
      return;
    }

    const rawPage = Number(request.query.page ?? DEFAULT_PAGE);
    const rawLimit = Number(request.query.limit ?? DEFAULT_LIMIT);
    const page =
      Number.isFinite(rawPage) && rawPage >= 1 ?
        Math.floor(rawPage) :
        DEFAULT_PAGE;
    const limit =
      Number.isFinite(rawLimit) && rawLimit >= 1 ?
        Math.min(Math.floor(rawLimit), MAX_LIMIT) :
        DEFAULT_LIMIT;
    const offset = (page - 1) * limit;

    try {
      const profile = await findProfileByHandle(username);
      if (!profile) {
        response
          .status(404)
          .json({error: `No profile found for username: ${username}`});
        return;
      }

      const competitorMap = await getWorkspaceCompetitorMap(user.workspaceId);
      if (!competitorMap[profile.id]) {
        response
          .status(403)
          .json({error: "This profile is not tracked by your workspace"});
        return;
      }

      let posts = await findPostsByProfileId(profile.id, limit, offset);

      if (posts.length < limit) {
        logger.info(
          `getPosts: DB exhausted at page=${page} for ${username}, ` +
          "triggering BrightData refresh"
        );
        try {
          await fetchAndPersistCompetitor({
            profileId: profile.id,
            igHandle: username,
            profileUrl: `https://www.instagram.com/${username}/`,
            apiToken: brightDataApiToken.value(),
          });
          posts = await findPostsByProfileId(profile.id, limit, offset);
        } catch (fetchErr) {
          logger.warn(
            "getPosts: BrightData refresh failed, returning cached results",
            fetchErr
          );
        }
      }

      response.status(200).json({posts, page, limit, username});
    } catch (err) {
      logger.error("getPosts: failed", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      response.status(502).json({error: message});
    }
  }
);

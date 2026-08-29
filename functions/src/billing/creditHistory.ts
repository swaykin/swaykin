import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import {getDataConnect} from "firebase-admin/data-connect";
import {applyCors} from "../shared/cors";
import {connectorConfig} from "../brightdata/dataConnectConfig";
import {
  extractBearerToken,
  verifyFirebaseIdToken,
  fetchUserByFirebaseUid,
} from "../auth/authHelpers";

const dc = getDataConnect(connectorConfig);

interface CreditTransactionRow {
  date: string;
  activityDescription: string | null;
  activityType: string | null;
  creditsDelta: number;
  balanceAfter: number;
}

/**
 * Returns recent credit ledger rows for the caller's workspace.
 * Route: GET /v1/credits/history
 */
export const creditHistory = onRequest(
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

    let workspaceId: string;
    try {
      const firebaseUid = await verifyFirebaseIdToken(idToken);
      const user = await fetchUserByFirebaseUid(firebaseUid);
      if (!user) {
        response
          .status(404)
          .json({error: "No user record found for this account"});
        return;
      }
      workspaceId = user.workspaceId;
    } catch (err) {
      logger.warn("creditHistory: invalid or expired ID token", err);
      response.status(401).json({error: "Invalid or expired ID token"});
      return;
    }

    try {
      const res = await dc.executeGraphqlRead<
        {creditTransactions: CreditTransactionRow[]},
        {workspaceId: string}
      >(
        `query($workspaceId: UUID!) {
          creditTransactions(
            where: {workspaceId: {eq: $workspaceId}}
            orderBy: [{date: DESC}]
            limit: 50
          ) {
            date
            activityDescription
            activityType
            creditsDelta
            balanceAfter
          }
        }`,
        {variables: {workspaceId}}
      );

      const history = (res.data.creditTransactions ?? []).map((row) => ({
        date: row.date,
        activity: row.activityDescription ?? row.activityType ?? "Activity",
        delta: row.creditsDelta,
        balance: row.balanceAfter,
      }));

      response.status(200).json({history});
    } catch (err) {
      logger.error("creditHistory: failed", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      response.status(502).json({error: message});
    }
  }
);

import {defineSecret, defineString} from "firebase-functions/params";

/** Google OAuth2 client ID from Google Cloud Console (Web app type). */
export const googleClientId = defineString("GOOGLE_CLIENT_ID");

/** Google OAuth2 client secret. Stored in Secret Manager, never in source. */
export const googleClientSecret = defineSecret("GOOGLE_CLIENT_SECRET");

/**
 * Must exactly match one of the "Authorized redirect URIs" configured on
 * the Google OAuth client, and point at the googleSignInCallback URL.
 */
export const googleRedirectUri = defineString("GOOGLE_REDIRECT_URI");

/** Comma-separated allowed frontend origins (scheme+host+port, no path). */
export const allowedFrontendOrigins = defineString("ALLOWED_FRONTEND_ORIGINS");

/** Bright Data API bearer token. Stored in Secret Manager, never in source. */
export const brightDataApiToken = defineSecret("BRIGHTDATA_API_TOKEN");

/** Default Bright Data dataset id, overridable per-request. */
export const brightDataDatasetId = defineString("BRIGHTDATA_DATASET_ID", {
  default: "gd_l1vikfch901nx3by4",
});

/** JSON map of billable operation → credit cost. */
export const creditCostsJson = defineString("CREDIT_COSTS", {
  default: '{"discovery":20,"addCompetitor":20,"getPosts":15}',
});

/** Milliseconds before an in-flight operation lock is treated as stale. */
export const operationLockStaleMs = defineString("OPERATION_LOCK_STALE_MS", {
  default: "300000",
});

/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as fs from "fs";
import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

// The emulator overwrites GOOGLE_APPLICATION_CREDENTIALS with the Firebase
// CLI's own cached login, so local custom-token signing needs a distinct env
// var name to avoid being clobbered. Unset in production, where the
// metadata-server-backed default credential works normally.
const localKeyPath = process.env.LOCAL_SERVICE_ACCOUNT_KEY_PATH;
admin.initializeApp(
  localKeyPath ?
    {
      credential: admin.credential.cert(
        JSON.parse(fs.readFileSync(localKeyPath, "utf8"))
      ),
    } :
    undefined
);

// Must run before any `export {X} from "./module"` lines below — those
// compile to `require()` calls that execute in file order and call
// `onRequest()` internally, which reads global options at call time. If
// setGlobalOptions ran after them, they'd already be bound to the default
// region.
setGlobalOptions({maxInstances: 10, region: "asia-south1"});

export {googleSignInStart, googleSignInCallback} from "./auth/googleSignIn";
export {user} from "./user/user";
export {workspace} from "./workspace/workspace";
export {devMintToken} from "./auth/devMintToken";
export {competitor} from "./brightdata/competitor";
export {discovery} from "./brightdata/discovery";
export {
  refreshWorkspaceInstagramStats,
} from "./brightdata/refreshWorkspaceInstagramStats";
export {competitorComparison} from "./brightdata/competitorComparison";
export {addCompetitors} from "./competitor/addCompetitors";
export {listCompetitors} from "./competitor/listCompetitors";
export {processCompetitorTask} from "./competitor/processCompetitorTask";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

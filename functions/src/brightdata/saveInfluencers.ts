import {getDataConnect} from "firebase-admin/data-connect";
import * as logger from "firebase-functions/logger";
import {connectorConfig} from "./dataConnectConfig";
import {pickField, asString} from "./pickField";

type ScrapedProfile = Record<string, unknown>;

interface InfluencerRow {
  name: string;
  handle: string;
  igUrl?: string;
  platform: string;
  verified?: boolean;
  followers?: number;
  avatarUrl?: string;
  bio?: string;
}

/**
 * Maps a raw Bright Data Instagram profile record onto the `Influencer`
 * table's columns. Field names are best-effort guesses at Bright Data's
 * dataset shape (gd_l1vikfch901nx3by4) — check logs on the first real run
 * and adjust the candidate keys below if any column comes out empty.
 * @param {ScrapedProfile} item One scraped profile record.
 * @return {InfluencerRow | null} The row to insert, or null if unusable.
 */
function toInfluencerRow(item: ScrapedProfile): InfluencerRow | null {
  const handle = pickField(item, ["account", "username", "handle"]);
  if (typeof handle !== "string" || handle.length === 0) {
    return null;
  }

  const name = pickField(item, ["full_name", "profile_name", "name"]);
  const followers = pickField(item, ["followers", "followers_count"]);
  const verified = pickField(item, ["is_verified", "verified"]);

  return {
    name: typeof name === "string" && name.length > 0 ? name : handle,
    handle,
    igUrl: asString(pickField(item, ["url", "profile_url", "input"])),
    platform: "instagram",
    verified: typeof verified === "boolean" ? verified : undefined,
    followers: typeof followers === "number" ? followers : undefined,
    avatarUrl: asString(
      pickField(item, ["profile_image_link", "avatar", "profile_pic_url"])
    ),
    bio: asString(pickField(item, ["biography", "bio"])),
  };
}

/**
 * Writes scraped Bright Data profiles into the `Influencer` table via the
 * Data Connect Admin SDK. Uses the built-in `insertMany` helper, which talks
 * to the service's auto-generated mutations directly — no connector
 * operation needs to be defined or deployed for this.
 * @param {unknown} data Raw Bright Data response (array or single object).
 * @return {Promise<number>} The number of rows inserted.
 */
export async function saveScrapedInfluencers(data: unknown): Promise<number> {
  const items = Array.isArray(data) ? data : [data];
  const rows = items
    .filter((item): item is ScrapedProfile => (
      typeof item === "object" && item !== null
    ))
    .map(toInfluencerRow)
    .filter((row): row is InfluencerRow => row !== null);

  if (rows.length === 0) {
    logger.warn("No mappable influencer rows in Bright Data response", {
      sampleKeys: Object.keys((items[0] as ScrapedProfile) ?? {}),
    });
    return 0;
  }

  const dc = getDataConnect(connectorConfig);
  await dc.insertMany("Influencer", rows);
  logger.info(`Inserted ${rows.length} influencer row(s)`);
  return rows.length;
}

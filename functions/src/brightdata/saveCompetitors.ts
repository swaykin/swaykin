import {getDataConnect, DataConnect} from "firebase-admin/data-connect";
import * as logger from "firebase-functions/logger";
import {connectorConfig} from "./dataConnectConfig";
import {pickField, asString, asNumber} from "./pickField";

type ScrapedProfile = Record<string, unknown>;

interface CompetitorInput {
  workspaceId: string;
  name: string;
  igHandle: string;
  avatarUrl?: string;
  followers?: number;
  avgEngagementRate?: number;
}

interface CompetitorPostInput {
  competitorId: string;
  postUrl?: string;
  thumbnailUrl?: string;
  postedAt: string;
  likes?: number;
  comments?: number;
  type?: string;
}

/**
 * Maps a raw Bright Data Instagram profile record onto the `Competitor`
 * table's columns.
 * @param {ScrapedProfile} item One scraped profile record.
 * @param {string} workspaceId Workspace this competitor is tracked under.
 * @return {CompetitorInput | null} The row to save, or null if unusable.
 */
function toCompetitorInput(
  item: ScrapedProfile,
  workspaceId: string
): CompetitorInput | null {
  const igHandle = pickField(item, ["account", "username", "handle"]);
  if (typeof igHandle !== "string" || igHandle.length === 0) {
    return null;
  }

  const name = pickField(item, ["full_name", "profile_name", "name"]);

  return {
    workspaceId,
    name: typeof name === "string" && name.length > 0 ? name : igHandle,
    igHandle,
    avatarUrl: asString(
      pickField(item, ["profile_image_link", "avatar", "profile_pic_url"])
    ),
    followers: asNumber(pickField(item, ["followers", "followers_count"])),
    avgEngagementRate: asNumber(pickField(item, ["avg_engagement"])),
  };
}

/**
 * Maps a raw Bright Data `posts[]` entry onto the `CompetitorContent`
 * table's columns.
 * @param {unknown} post One raw post record.
 * @param {string} competitorId The owning competitor's row id.
 * @return {CompetitorPostInput | null} The row to save, or null if unusable.
 */
function toPostInput(
  post: unknown,
  competitorId: string
): CompetitorPostInput | null {
  if (typeof post !== "object" || post === null) {
    return null;
  }
  const postRecord = post as Record<string, unknown>;
  const postedAt = pickField(postRecord, ["datetime"]);
  if (typeof postedAt !== "string") {
    return null;
  }

  return {
    competitorId,
    postUrl: asString(pickField(postRecord, ["url"])),
    thumbnailUrl: asString(pickField(postRecord, ["image_url"])),
    postedAt,
    likes: asNumber(pickField(postRecord, ["likes"])),
    comments: asNumber(pickField(postRecord, ["comments"])),
    type: asString(pickField(postRecord, ["content_type"])),
  };
}

/**
 * @param {DataConnect} dc Data Connect client.
 * @param {string} workspaceId Workspace to scope the lookup to.
 * @param {string} igHandle Instagram handle to look up.
 * @return {Promise<{id: string, addedAt: string} | null>} The existing row's
 *   id and `addedAt` (needed to satisfy the NOT NULL column on upsert), or
 *   null if this competitor hasn't been tracked yet.
 */
async function findExistingCompetitor(
  dc: DataConnect,
  workspaceId: string,
  igHandle: string
): Promise<{ id: string; addedAt: string } | null> {
  const query = `query($workspaceId: UUID!, $igHandle: String!) {
    competitors(
      where: {workspaceId: {eq: $workspaceId}, igHandle: {eq: $igHandle}}
      limit: 1
    ) {
      id
      addedAt
    }
  }`;
  const res = await dc.executeGraphqlRead<
    { competitors: { id: string; addedAt: string }[] },
    { workspaceId: string; igHandle: string }
  >(query, {variables: {workspaceId, igHandle}});
  return res.data.competitors[0] ?? null;
}

/**
 * Inserts a new competitor, or updates the existing one for this
 * workspace+igHandle in place.
 * @param {DataConnect} dc Data Connect client.
 * @param {CompetitorInput} row Mapped competitor fields.
 * @return {Promise<string>} The competitor row's id.
 */
async function upsertCompetitor(
  dc: DataConnect,
  row: CompetitorInput
): Promise<string> {
  const existing = await findExistingCompetitor(
    dc,
    row.workspaceId,
    row.igHandle
  );

  if (existing) {
    await dc.upsert("Competitor", {
      id: existing.id,
      addedAt: existing.addedAt,
      ...row,
    });
    return existing.id;
  }

  const res = await dc.insert<
    { competitor_insert: { id: string } },
    CompetitorInput & { addedAt: string }
  >("Competitor", {...row, addedAt: new Date().toISOString()});
  return res.data.competitor_insert.id;
}

/**
 * @param {DataConnect} dc Data Connect client.
 * @param {string} competitorId Owning competitor's row id.
 * @param {string} postUrl Post URL to look up.
 * @return {Promise<string | null>} The existing row's id, or null.
 */
async function findExistingPostId(
  dc: DataConnect,
  competitorId: string,
  postUrl: string
): Promise<string | null> {
  const query = `query($competitorId: UUID!, $postUrl: String!) {
    competitorContents(
      where: {competitorId: {eq: $competitorId}, postUrl: {eq: $postUrl}}
      limit: 1
    ) {
      id
    }
  }`;
  const res = await dc.executeGraphqlRead<
    { competitorContents: { id: string }[] },
    { competitorId: string; postUrl: string }
  >(query, {variables: {competitorId, postUrl}});
  return res.data.competitorContents[0]?.id ?? null;
}

/**
 * Inserts a new competitor post, or updates the existing one (matched by
 * competitor+postUrl) in place — posts without a `postUrl` can't be
 * deduped, so those are always inserted fresh.
 * @param {DataConnect} dc Data Connect client.
 * @param {CompetitorPostInput} row Mapped post fields.
 * @return {Promise<void>}
 */
async function upsertPost(
  dc: DataConnect,
  row: CompetitorPostInput
): Promise<void> {
  if (!row.postUrl) {
    await dc.insert("CompetitorContent", row);
    return;
  }

  const existingId = await findExistingPostId(
    dc,
    row.competitorId,
    row.postUrl
  );

  if (existingId) {
    await dc.upsert("CompetitorContent", {id: existingId, ...row});
  } else {
    await dc.insert("CompetitorContent", row);
  }
}

/**
 * Writes scraped Bright Data Instagram profiles (and their posts) into the
 * `Competitor`/`CompetitorContent` tables, scoped to one workspace. Existing
 * rows (matched by workspace+igHandle, and competitor+postUrl for posts) are
 * updated in place rather than duplicated.
 * @param {unknown} data Raw Bright Data response (array or single object).
 * @param {string} workspaceId Workspace these competitors belong to.
 * @return {Promise<{competitorCount: number, postCount: number}>} Counts of
 *   competitor and post rows written.
 */
export async function saveScrapedCompetitors(
  data: unknown,
  workspaceId: string
): Promise<{ competitorCount: number; postCount: number }> {
  const items = Array.isArray(data) ? data : [data];
  const profiles = items.filter(
    (item): item is ScrapedProfile =>
      typeof item === "object" && item !== null
  );

  const dc = getDataConnect(connectorConfig);
  let competitorCount = 0;
  let postCount = 0;

  for (const item of profiles) {
    const competitorInput = toCompetitorInput(item, workspaceId);
    if (!competitorInput) {
      logger.warn("Skipping unmappable competitor row", {
        sampleKeys: Object.keys(item),
      });
      continue;
    }

    const competitorId = await upsertCompetitor(dc, competitorInput);
    competitorCount++;

    const posts = Array.isArray(item.posts) ? item.posts : [];
    for (const post of posts) {
      const postInput = toPostInput(post, competitorId);
      if (!postInput) continue;
      await upsertPost(dc, postInput);
      postCount++;
    }
  }

  logger.info(
    `Saved ${competitorCount} competitor(s) and ${postCount} post(s)`
  );
  return {competitorCount, postCount};
}

import {getDataConnect} from "firebase-admin/data-connect";
import {connectorConfig} from "../brightdata/dataConnectConfig";

export interface PostUpsertData {
  profileId: string;
  postUrl: string;
  postId: string;
  shortcode: string;
  caption?: string | null;
  type: string; // "Reel" | "Carousel" | "Image"
  thumbnailUrl?: string | null;
  mediaUrls?: string[];
  likes?: number | null;
  comments?: number | null;
  hashtags?: string[];
  videoPlayCount?: number | null;
  estimatedViews?: number | null;
  engagementRatePercent?: number | null;
  estimatedReach?: number | null;
  postedAt: string;
  source: string;
}

const dc = getDataConnect(connectorConfig);

/**
 * @param {string} postId Instagram post id (global unique key) to look up.
 * @return {Promise<string | null>} The existing Post row's id, or null.
 */
async function findExistingPostRowId(postId: string): Promise<string | null> {
  const query = `query($postId: String!) {
    posts(where: {postId: {eq: $postId}}, limit: 1) {
      id
    }
  }`;
  const res = await dc.executeGraphqlRead<
    { posts: { id: string }[] },
    { postId: string }
  >(query, {variables: {postId}});
  return res.data.posts[0]?.id ?? null;
}

/**
 * Inserts a new Post row, or updates the existing one (matched by the
 * Instagram `postId`, which is unique globally) in place. Posts are global
 * — shared by every workspace tracking the owning Profile — so this must
 * never blind-insert, or concurrent adds from two workspaces would create
 * duplicate rows for the same real post.
 * @param {PostUpsertData} data Mapped post fields.
 * @return {Promise<void>}
 */
export async function upsertPost(data: PostUpsertData): Promise<void> {
  const fetchedAt = new Date().toISOString();
  const existingId = await findExistingPostRowId(data.postId);

  if (existingId) {
    // post_update returns Post_KeyOutput — a scalar in the schema, but its
    // JSON value is an object `{id: "<uuid>"}` (see profileRepo.ts note).
    // Unused here, but typed correctly for anyone extending this later.
    await dc.executeGraphql<
      { post_update: { id: string } | null },
      { id: string; data: PostUpsertData & { fetchedAt: string } }
    >(
      `mutation($id: UUID!, $data: Post_Data!) {
        post_update(id: $id, data: $data)
      }`,
      {variables: {id: existingId, data: {...data, fetchedAt}}}
    );
    return;
  }

  await dc.executeGraphql<
    { post_insert: { id: string } },
    { data: PostUpsertData & { fetchedAt: string } }
  >(
    `mutation($data: Post_Data!) {
      post_insert(data: $data)
    }`,
    {variables: {data: {...data, fetchedAt}}}
  );
}

/**
 * Upserts a batch of posts sequentially (Data Connect has no batch-upsert
 * mutation that dedupes by a non-PK unique key, so each row needs its own
 * existence check).
 * @param {PostUpsertData[]} posts Mapped post rows to upsert.
 * @return {Promise<number>} Count of posts written.
 */
export async function upsertPosts(posts: PostUpsertData[]): Promise<number> {
  let count = 0;
  for (const post of posts) {
    await upsertPost(post);
    count++;
  }
  return count;
}

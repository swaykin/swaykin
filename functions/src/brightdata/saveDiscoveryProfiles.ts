import {getDataConnect} from "firebase-admin/data-connect";
import * as logger from "firebase-functions/logger";
import {connectorConfig} from "./dataConnectConfig";
import {findProfileByHandle} from "../competitor/profileRepo";
import {upsertPost} from "../competitor/postRepo";
import {
  BrightDataDiscoveryPost,
  mapDiscoveryPost,
} from "./discoveryPostMapper";

const dc = getDataConnect(connectorConfig);

interface BrightDataProfile {
  account: string;
  full_name?: string | null;
  profile_name?: string | null;
  biography?: string | null;
  profile_image_link?: string | null;
  followers?: number | null;
  following?: number | null;
  posts_count?: number | null;
  avg_engagement?: number | null;
  is_verified?: boolean | null;
  email_address?: string | null;
  external_url?: string | null;
  post_hashtags?: string[] | null;
  bio_hashtags?: string[] | null;
  category_name?: string | null;
  business_category_name?: string | null;
  posts?: BrightDataDiscoveryPost[];
}

interface DiscoveryProfileInsertData {
  igHandle: string;
  type: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  followers: number | null;
  followings: number | null;
  postsCount: number | null;
  avgEngagementRate: number | null;
  verified: boolean | null;
  email: string | null;
  website: string | null;
  postHashtags: string[] | null;
  bioHashtags: string[] | null;
  categoryName: string | null;
  brightDataSnapshotId: string | null;
  createdAt: string;
  lastStatsUpdatedAt: string;
}

type DiscoveryProfileUpdateData = Omit<DiscoveryProfileInsertData, "igHandle" | "createdAt">;

/** Union profile-level + nested-post hashtags so DB cache can match BD filters. */
function mergedPostHashtags(profile: BrightDataProfile): string[] | null {
  const tags = new Set<string>();
  if (Array.isArray(profile.post_hashtags)) {
    for (const tag of profile.post_hashtags) tags.add(tag);
  }
  for (const post of profile.posts ?? []) {
    if (!Array.isArray(post.post_hashtags)) continue;
    for (const tag of post.post_hashtags) tags.add(tag);
  }
  return tags.size > 0 ? [...tags] : null;
}

function toProfileData(
  p: BrightDataProfile,
  snapshotId: string | null,
  now: string
): DiscoveryProfileInsertData {
  return {
    igHandle: p.account,
    type: "influencer",
    name: p.full_name || p.profile_name || p.account,
    bio: p.biography ?? null,
    avatarUrl: p.profile_image_link ?? null,
    followers: p.followers ?? null,
    followings: p.following ?? null,
    postsCount: p.posts_count ?? null,
    avgEngagementRate: typeof p.avg_engagement === "number" ?
      p.avg_engagement : null,
    verified: p.is_verified ?? null,
    email: p.email_address ?? null,
    website: typeof p.external_url === "string" ? p.external_url : null,
    postHashtags: mergedPostHashtags(p),
    bioHashtags: Array.isArray(p.bio_hashtags) ? p.bio_hashtags : null,
    categoryName: p.category_name || p.business_category_name || null,
    brightDataSnapshotId: snapshotId,
    createdAt: now,
    lastStatsUpdatedAt: now,
  };
}

async function insertDiscoveryProfile(
  data: DiscoveryProfileInsertData
): Promise<string> {
  const res = await dc.executeGraphql<
    {profile_insert: {id: string}},
    {data: DiscoveryProfileInsertData}
  >(
    `mutation($data: Profile_Data!) { profile_insert(data: $data) }`,
    {variables: {data}}
  );
  return res.data.profile_insert.id;
}

async function updateDiscoveryProfile(
  id: string,
  data: DiscoveryProfileUpdateData
): Promise<void> {
  await dc.executeGraphql<
    {profile_update: {id: string} | null},
    {id: string; data: DiscoveryProfileUpdateData}
  >(
    `mutation($id: UUID!, $data: Profile_Data!) { profile_update(id: $id, data: $data) }`,
    {variables: {id, data}}
  );
}

/**
 * Saves Brightdata discovery results to Profile + Post tables.
 * Upserts by igHandle (profile) and postId (post) — safe to call repeatedly.
 * @param {unknown} data Raw Brightdata response (array of profile objects).
 * @param {string | null} snapshotId Brightdata snapshot id for tracking.
 * @return {Promise<{profilesUpserted: number; postsUpserted: number}>}
 */
export async function saveDiscoveryProfiles(
  data: unknown,
  snapshotId: string | null
): Promise<{profilesUpserted: number; postsUpserted: number}> {
  const items = Array.isArray(data) ? data : [data];
  const profiles = items.filter(
    (item): item is BrightDataProfile =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as BrightDataProfile).account === "string"
  );

  let profilesUpserted = 0;
  let postsUpserted = 0;
  const now = new Date().toISOString();

  for (const profile of profiles) {
    try {
      const profileData = toProfileData(profile, snapshotId, now);
      const existing = await findProfileByHandle(profile.account);

      let profileId: string;
      if (existing) {
        const {createdAt: _c, igHandle: _h, ...updateData} = profileData;
        await updateDiscoveryProfile(existing.id, updateData);
        profileId = existing.id;
      } else {
        profileId = await insertDiscoveryProfile(profileData);
      }
      profilesUpserted++;

      const posts = Array.isArray(profile.posts) ? profile.posts : [];
      for (const post of posts) {
        const row = mapDiscoveryPost(post, profileId, now);
        if (!row) continue;
        try {
          await upsertPost(row);
          postsUpserted++;
        } catch (postErr) {
          logger.warn(
            `saveDiscoveryProfiles: post ${post.id} for @${profile.account} failed`,
            postErr
          );
        }
      }
    } catch (profileErr) {
      logger.warn(
        `saveDiscoveryProfiles: profile @${profile.account} failed`,
        profileErr
      );
    }
  }

  logger.info("saveDiscoveryProfiles complete", {profilesUpserted, postsUpserted});
  return {profilesUpserted, postsUpserted};
}

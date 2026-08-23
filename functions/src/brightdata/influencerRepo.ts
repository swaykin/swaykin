import {getDataConnect} from "firebase-admin/data-connect";
import {connectorConfig} from "./dataConnectConfig";
import type {DiscoveryFilterInput, DiscoveryTermBlock} from "./discoveryFilters";
import {extractTermBlocks} from "./discoveryFilters";

const dc = getDataConnect(connectorConfig);

export interface DiscoveryDBResult {
  id: string;
  name: string;
  handle: string;
  igUrl: string | null;
  verified: boolean | null;
  followers: number | null;
  engagementRate: number | null;
  avatarUrl: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  niche: string | null;
}

const SCALAR_FILTER_TYPES = new Set(["followers", "isVerified", "hasEmail"]);

/** Keeps only Profile-table-queryable scalar filters. */
export function extractDBFilters(
  filters: DiscoveryFilterInput[]
): DiscoveryFilterInput[] {
  return filters.filter((f) => SCALAR_FILTER_TYPES.has(f.type));
}

const PROFILE_RESULT_FIELDS = `
  id name igHandle avatarUrl bio verified followers
  avgEngagementRate email phone country niche
`;

function mapProfile(p: {
  id: string; name: string; igHandle: string; avatarUrl: string | null;
  bio: string | null; verified: boolean | null; followers: number | null;
  avgEngagementRate: number | null; email: string | null; phone: string | null;
  country: string | null; niche: string | null;
}): DiscoveryDBResult {
  return {
    id: p.id,
    name: p.name,
    handle: p.igHandle,
    igUrl: `https://instagram.com/${p.igHandle}`,
    verified: p.verified,
    followers: p.followers,
    engagementRate: p.avgEngagementRate,
    avatarUrl: p.avatarUrl,
    bio: p.bio,
    email: p.email,
    phone: p.phone,
    country: p.country,
    niche: p.niche,
  };
}

function escapeLike(term: string): string {
  return term.replace(/[%_\\]/g, "\\$&");
}

function gqlIContains(field: string, term: string): string {
  const like = `%${escapeLike(term)}%`;
  return `{ ${field}: { pattern: { like: ${JSON.stringify(like)}, ignoreCase: true } } }`;
}

function gqlArrayIncludes(field: string, term: string): string {
  return `{ ${field}: { includes: ${JSON.stringify(term)} } }`;
}

/** Profile-level OR conditions for one term block (mirrors discoveryFilters.ts). */
function profileOrConditionsForBlock(block: DiscoveryTermBlock): string[] {
  const term = block.value;
  if (block.kind === "category") {
    return [
      gqlIContains("bio", term),
      gqlArrayIncludes("postHashtags", term),
    ];
  }
  if (block.kind === "location") {
    return [gqlIContains("bio", term)];
  }
  return [
    gqlArrayIncludes("bioHashtags", term),
    gqlArrayIncludes("postHashtags", term),
  ];
}

/** Post-level OR conditions for one term block (mirrors discoveryFilters.ts). */
function postOrConditionsForBlock(block: DiscoveryTermBlock): string[] {
  const term = block.value;
  if (block.kind === "category" || block.kind === "location") {
    const clauses = [gqlIContains("caption", term)];
    if (block.kind === "location") {
      clauses.push(gqlArrayIncludes("hashtags", term));
    }
    return clauses;
  }
  return [gqlArrayIncludes("hashtags", term)];
}

function buildProfileWhere(
  filters: DiscoveryFilterInput[],
  variables: Record<string, unknown>
): string {
  const clauses: string[] = [];

  for (const filter of filters) {
    if (filter.type === "followers") {
      const parts: string[] = [];
      if (filter.value.min !== undefined) {
        parts.push("ge: $followersMin");
        variables.followersMin = filter.value.min;
      }
      if (filter.value.max !== undefined) {
        parts.push("le: $followersMax");
        variables.followersMax = filter.value.max;
      }
      if (parts.length > 0) clauses.push(`followers: { ${parts.join(", ")} }`);
    } else if (filter.type === "isVerified") {
      clauses.push("verified: { eq: $verified }");
      variables.verified = filter.value;
    } else if (filter.type === "hasEmail" && filter.value) {
      clauses.push("email: { isNull: false }");
    }
  }

  return clauses.join(", ");
}

function scalarVarDecl(variables: Record<string, unknown>): string {
  return [
    variables.followersMin !== undefined ? ", $followersMin: Int" : "",
    variables.followersMax !== undefined ? ", $followersMax: Int" : "",
    variables.verified !== undefined ? ", $verified: Boolean" : "",
    variables.ids !== undefined ? ", $ids: [UUID!]" : "",
  ].join("");
}

async function profileIdsFromProfiles(
  orConditions: string[],
  limit: number
): Promise<Set<string>> {
  const query = `query($limit: Int!) {
    profiles(where: { _or: [${orConditions.join(", ")}] }, limit: $limit) { id }
  }`;
  const res = await dc.executeGraphqlRead<
    {profiles: {id: string}[]},
    {limit: number}
  >(query, {variables: {limit}});
  return new Set(res.data.profiles.map((p) => p.id));
}

async function profileIdsFromPosts(
  orConditions: string[],
  limit: number
): Promise<Set<string>> {
  const query = `query($limit: Int!) {
    posts(where: { _or: [${orConditions.join(", ")}] }, limit: $limit) {
      profile { id }
    }
  }`;
  const res = await dc.executeGraphqlRead<
    {posts: {profile: {id: string}}[]},
    {limit: number}
  >(query, {variables: {limit}});
  return new Set(res.data.posts.map((p) => p.profile.id));
}

async function profileIdsForTermBlock(block: DiscoveryTermBlock): Promise<Set<string>> {
  const scanLimit = 1000;
  const [fromProfiles, fromPosts] = await Promise.all([
    profileIdsFromProfiles(profileOrConditionsForBlock(block), scanLimit),
    profileIdsFromPosts(postOrConditionsForBlock(block), scanLimit),
  ]);
  return new Set([...fromProfiles, ...fromPosts]);
}

function intersectSets(a: Set<string>, b: Set<string>): Set<string> {
  const out = new Set<string>();
  for (const id of a) {
    if (b.has(id)) out.add(id);
  }
  return out;
}

/**
 * Queries Profile table with scalar filters only (no term blocks).
 */
export async function queryInfluencers(
  filters: DiscoveryFilterInput[],
  limit: number
): Promise<DiscoveryDBResult[]> {
  const variables: Record<string, unknown> = {limit};
  const whereClause = buildProfileWhere(filters, variables);
  const whereBlock = whereClause ? `where: { ${whereClause} }` : "";

  const query = `query(
    $limit: Int!
    ${scalarVarDecl(variables)}
  ) {
    profiles(${whereBlock}, limit: $limit) { ${PROFILE_RESULT_FIELDS} }
  }`;

  const res = await dc.executeGraphqlRead<
    {profiles: Parameters<typeof mapProfile>[0][]},
    Record<string, unknown>
  >(query, {variables});

  return res.data.profiles.map(mapProfile);
}

/**
 * Discovery DB cache: AND scalar filters with each category/location/hashtag
 * block (OR within block on profile + post fields), matching Bright Data.
 */
export async function queryDiscoveryProfiles(
  filters: DiscoveryFilterInput[],
  limit: number
): Promise<DiscoveryDBResult[]> {
  const termBlocks = extractTermBlocks(filters);
  const scalarFilters = extractDBFilters(filters);

  if (termBlocks.length === 0) {
    return queryInfluencers(scalarFilters, limit);
  }

  let candidateIds: Set<string> | null = null;
  for (const block of termBlocks) {
    const blockIds = await profileIdsForTermBlock(block);
    if (blockIds.size === 0) return [];
    candidateIds = candidateIds === null ?
      blockIds :
      intersectSets(candidateIds, blockIds);
    if (candidateIds.size === 0) return [];
  }

  const variables: Record<string, unknown> = {
    limit,
    ids: [...candidateIds!],
  };
  const scalarWhere = buildProfileWhere(scalarFilters, variables);
  const idClause = "id: { in: $ids }";
  const whereClause = scalarWhere ?
    `${idClause}, ${scalarWhere}` :
    idClause;

  const query = `query(
    $limit: Int!
    $ids: [UUID!]!
    ${scalarVarDecl(variables)}
  ) {
    profiles(where: { ${whereClause} }, limit: $limit) {
      ${PROFILE_RESULT_FIELDS}
    }
  }`;

  const res = await dc.executeGraphqlRead<
    {profiles: Parameters<typeof mapProfile>[0][]},
    Record<string, unknown>
  >(query, {variables});

  return res.data.profiles.map(mapProfile);
}

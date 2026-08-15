import {getDataConnect} from "firebase-admin/data-connect";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import type {Request, Response} from "express";
import {connectorConfig} from "../brightdata/dataConnectConfig";
import {applyCors} from "../shared/cors";
import {
  extractBearerToken,
  verifyFirebaseIdToken,
  fetchUserByFirebaseUid,
} from "../auth/authHelpers";

const dc = getDataConnect(connectorConfig);

interface WorkspaceRow {
  id: string;
  name: string;
  brandDescription: string | null;
  industry: string | null;
  website: string | null;
  instagramHandle: string | null;
  logoUrl: string | null;
  planTier: string;
  creditsBalance: number;
  targetAudience: string | null;
  brandVoice: string | null;
}

interface WorkspaceResponse {
  id: string;
  name: string;
  creditBalance: number;
  details: {
    description: string | null;
    igUsername: string | null;
    website: string | null;
    audience: string | null;
    voice: string | null;
    industry: string | null;
  };
  planTier: string;
  logoUrl: string | null;
}

interface UpdateBody {
  name?: string;
  description?: string;
  igUsername?: string;
  website?: string;
  audience?: string;
  voice?: string;
  industry?: string;
  logoUrl?: string;
}

const WORKSPACE_QUERY = `query($id: UUID!) {
  workspace(id: $id) {
    id
    name
    brandDescription
    industry
    website
    instagramHandle
    logoUrl
    planTier
    creditsBalance
    targetAudience
    brandVoice
  }
}`;

/**
 * @param {string} workspaceId Workspace UUID to fetch.
 * @return {Promise<WorkspaceRow | null>} The workspace row or null.
 */
async function fetchWorkspace(
  workspaceId: string
): Promise<WorkspaceRow | null> {
  const res = await dc.executeGraphqlRead<
    {workspace: WorkspaceRow | null},
    {id: string}
  >(WORKSPACE_QUERY, {variables: {id: workspaceId}});
  return res.data.workspace ?? null;
}

/**
 * @param {WorkspaceRow} row DB row to map to API response shape.
 * @return {WorkspaceResponse} Mapped response object.
 */
function toResponse(row: WorkspaceRow): WorkspaceResponse {
  return {
    id: row.id,
    name: row.name,
    creditBalance: row.creditsBalance,
    details: {
      description: row.brandDescription,
      igUsername: row.instagramHandle,
      website: row.website,
      audience: row.targetAudience,
      voice: row.brandVoice,
      industry: row.industry,
    },
    planTier: row.planTier,
    logoUrl: row.logoUrl,
  };
}

/**
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @return {Promise<string | null>} Workspace id or null on auth failure.
 */
async function resolveWorkspaceId(
  req: Request,
  res: Response
): Promise<string | null> {
  const idToken = extractBearerToken(req.headers.authorization);
  if (!idToken) {
    res.status(401).json({error: "Missing Authorization: Bearer <idToken>"});
    return null;
  }

  let firebaseUid: string;
  try {
    firebaseUid = await verifyFirebaseIdToken(idToken);
  } catch (err) {
    logger.warn("workspace: invalid or expired ID token", err);
    res.status(401).json({error: "Invalid or expired ID token"});
    return null;
  }

  const user = await fetchUserByFirebaseUid(firebaseUid);
  if (!user) {
    res.status(404).json({error: "No user record found for this account"});
    return null;
  }

  return user.workspaceId;
}

/**
 * @param {string} workspaceId Workspace UUID.
 * @param {Response} res Express response.
 */
async function handleGet(workspaceId: string, res: Response): Promise<void> {
  const row = await fetchWorkspace(workspaceId);
  if (!row) {
    res.status(404).json({error: "Workspace not found"});
    return;
  }
  res.status(200).json(toResponse(row));
}

/**
 * @param {string} workspaceId Workspace UUID.
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 */
async function handlePost(
  workspaceId: string,
  req: Request,
  res: Response
): Promise<void> {
  const body = req.body as UpdateBody;

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.description !== undefined) data.brandDescription = body.description;
  if (body.igUsername !== undefined) data.instagramHandle = body.igUsername;
  if (body.website !== undefined) data.website = body.website;
  if (body.audience !== undefined) data.targetAudience = body.audience;
  if (body.voice !== undefined) data.brandVoice = body.voice;
  if (body.industry !== undefined) data.industry = body.industry;
  if (body.logoUrl !== undefined) data.logoUrl = body.logoUrl;

  if (Object.keys(data).length === 0) {
    res
      .status(400)
      .json({error: "Request body must include at least one field to update"});
    return;
  }

  const mutation = `mutation($id: UUID!, $data: Workspace_Data!) {
    workspace_update(id: $id, data: $data)
  }`;

  await dc.executeGraphql<
    {workspace_update: unknown},
    {id: string; data: Record<string, unknown>}
  >(mutation, {variables: {id: workspaceId, data}});

  const updated = await fetchWorkspace(workspaceId);
  if (!updated) {
    res.status(404).json({error: "Workspace not found after update"});
    return;
  }
  res.status(200).json(toResponse(updated));
}

export const workspace = onRequest(
  {invoker: "public"},
  async (request, response) => {
    if (applyCors(request, response)) return;

    if (request.method !== "GET" && request.method !== "POST") {
      response.status(405).json({error: "Method not allowed"});
      return;
    }

    let workspaceId: string | null;
    try {
      workspaceId = await resolveWorkspaceId(request, response);
    } catch (err) {
      logger.error("workspace: auth resolution failed", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      response.status(502).json({error: message});
      return;
    }

    if (!workspaceId) return;

    try {
      if (request.method === "GET") {
        await handleGet(workspaceId, response);
      } else {
        await handlePost(workspaceId, request, response);
      }
    } catch (err) {
      logger.error("workspace: handler failed", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      response.status(502).json({error: message});
    }
  }
);

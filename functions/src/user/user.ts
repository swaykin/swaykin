import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import type {Request, Response} from "express";
import {applyCors} from "../shared/cors";
import {
  extractBearerToken,
  verifyFirebaseIdToken,
  fetchUserByFirebaseUid,
  updateUserById,
  type UserRow,
} from "../auth/authHelpers";

// E.164: + followed by 7–15 digits, first digit non-zero
const E164_RE = /^\+[1-9]\d{6,14}$/;

interface UserResponse {
  userId: string;
  workspaceId: string;
  name: string;
  email: string;
  photoUrl: string | null;
  phoneNumber: string | null;
}

interface UpdateBody {
  name?: string;
  photoUrl?: string | null;
  phoneNumber?: string | null;
}

/**
 * @param {UserRow} row DB row to map to API response shape.
 * @return {UserResponse} Mapped response object.
 */
function toResponse(row: UserRow): UserResponse {
  return {
    userId: row.id,
    workspaceId: row.workspaceId,
    name: row.fullName,
    email: row.email,
    photoUrl: row.avatarUrl,
    phoneNumber: row.phone,
  };
}

/**
 * Verifies the bearer token and returns the matching UserRow, or writes an
 * error response and returns null.
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @return {Promise<UserRow | null>} Authenticated user row or null.
 */
async function resolveUser(
  req: Request,
  res: Response
): Promise<UserRow | null> {
  const idToken = extractBearerToken(req.headers.authorization);
  if (!idToken) {
    res.status(401).json({error: "Missing Authorization: Bearer <idToken>"});
    return null;
  }

  let firebaseUid: string;
  try {
    firebaseUid = await verifyFirebaseIdToken(idToken);
  } catch (err) {
    logger.warn("user: invalid or expired ID token", err);
    res.status(401).json({error: "Invalid or expired ID token"});
    return null;
  }

  const userRow = await fetchUserByFirebaseUid(firebaseUid);
  if (!userRow) {
    res.status(404).json({error: "User not found"});
    return null;
  }

  return userRow;
}

/**
 * @param {UserRow} userRow Authenticated user row.
 * @param {Response} res Express response.
 */
async function handleGet(userRow: UserRow, res: Response): Promise<void> {
  res.status(200).json(toResponse(userRow));
}

/**
 * @param {UserRow} userRow Authenticated user row.
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 */
async function handlePost(
  userRow: UserRow,
  req: Request,
  res: Response
): Promise<void> {
  const body = req.body as UpdateBody;

  const data: {
    fullName?: string;
    avatarUrl?: string | null;
    phone?: string | null;
  } = {};

  if (body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim() === "") {
      res.status(400).json({error: "name must be a non-empty string"});
      return;
    }
    data.fullName = body.name.trim();
  }

  if (body.photoUrl !== undefined) {
    data.avatarUrl = body.photoUrl;
  }

  if (body.phoneNumber !== undefined) {
    if (body.phoneNumber !== null && !E164_RE.test(body.phoneNumber)) {
      res.status(400).json({
        error: "phoneNumber must be E.164 format (e.g. +14155550123) or null",
      });
      return;
    }
    data.phone = body.phoneNumber;
  }

  if (Object.keys(data).length === 0) {
    res.status(400).json({
      error: "Provide at least one field: name, photoUrl, phoneNumber",
    });
    return;
  }

  await updateUserById(userRow.id, data);

  const merged: UserRow = {
    ...userRow,
    fullName: data.fullName ?? userRow.fullName,
    avatarUrl: "avatarUrl" in data ?
      (data.avatarUrl ?? null) :
      userRow.avatarUrl,
    phone: "phone" in data ? (data.phone ?? null) : userRow.phone,
  };
  res.status(200).json(toResponse(merged));
}

export const user = onRequest(
  {invoker: "public"},
  async (request, response) => {
    if (applyCors(request, response)) return;

    if (request.method !== "GET" && request.method !== "POST") {
      response.status(405).json({error: "Method not allowed"});
      return;
    }

    let userRow: UserRow | null;
    try {
      userRow = await resolveUser(request, response);
    } catch (err) {
      logger.error("user: auth resolution failed", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      response.status(502).json({error: message});
      return;
    }

    if (!userRow) return;

    try {
      if (request.method === "GET") {
        await handleGet(userRow, response);
      } else {
        await handlePost(userRow, request, response);
      }
    } catch (err) {
      logger.error("user: handler failed", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      response.status(502).json({error: message});
    }
  }
);

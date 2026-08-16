import type {Request, Response} from "express";

/**
 * Sets CORS headers and handles OPTIONS preflight.
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @return {boolean} True if preflight — caller should return immediately.
 */
export function applyCors(req: Request, res: Response): boolean {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.set("Access-Control-Max-Age", "3600");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return true;
  }
  return false;
}

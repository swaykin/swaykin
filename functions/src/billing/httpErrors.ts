import type {Response} from "express";
import {
  InsufficientCreditsError,
  OperationInProgressError,
} from "./creditErrors";

/**
 * Maps billing errors to HTTP responses.
 * @param {Response} response Express response.
 * @param {unknown} err Caught error.
 * @return {boolean} Whether a billing error response was sent.
 */
export function sendBillingError(response: Response, err: unknown): boolean {
  if (err instanceof InsufficientCreditsError) {
    response.status(402).json({
      error: err.message,
      balance: err.balance,
      required: err.required,
    });
    return true;
  }
  if (err instanceof OperationInProgressError) {
    response.status(409).json({error: err.message});
    return true;
  }
  return false;
}

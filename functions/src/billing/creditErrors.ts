/** Returned to clients when workspace balance is too low for a paid operation. */
export const INSUFFICIENT_CREDITS_MESSAGE = "Insufficient credits";

/** Returned when the same operation type is already in-flight for the workspace. */
export const OPERATION_IN_PROGRESS_MESSAGE =
  "The older request is still processing";

/** Thrown when a workspace cannot afford a billable operation. */
export class InsufficientCreditsError extends Error {
  readonly balance: number;
  readonly required: number;

  /**
   * @param {number} balance Current credits balance.
   * @param {number} required Credits required for the operation.
   */
  constructor(balance: number, required: number) {
    super(INSUFFICIENT_CREDITS_MESSAGE);
    this.name = "InsufficientCreditsError";
    this.balance = balance;
    this.required = required;
  }
}

/** Thrown when an operation lock cannot be acquired. */
export class OperationInProgressError extends Error {
  constructor() {
    super(OPERATION_IN_PROGRESS_MESSAGE);
    this.name = "OperationInProgressError";
  }
}

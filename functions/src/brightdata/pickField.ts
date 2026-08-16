/**
 * @param {Record<string, unknown>} item Object to read from.
 * @param {string[]} keys Candidate field names, checked in order.
 * @return {unknown} The first defined, non-null value found.
 */
export function pickField(
  item: Record<string, unknown>,
  keys: string[]
): unknown {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null) {
      return item[key];
    }
  }
  return undefined;
}

/**
 * @param {unknown} value Candidate value.
 * @return {string | undefined} The value if it's a string, else undefined.
 */
export function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/**
 * @param {unknown} value Candidate value.
 * @return {number | undefined} The value if it's a number, else undefined.
 */
export function asNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

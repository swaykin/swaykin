export type EntityColor = {
  color: string;
  tint: string;
};

/**
 * 15 genuinely distinct hues, then 6 more reusing a subset of those hues at a `-900` (deep)
 * shade — far enough from their `-500` counterpart to read as a different identity, rather
 * than adjacent shades like 500/600 which look too similar side by side. Deliberately skips
 * red (reserved for errors/destructive actions elsewhere in the app) so an entity's identity
 * color never gets misread as that meaning.
 *
 * The first 4 entries (pink, teal, orange, violet) intentionally match the original design's
 * brand colors for its first 4 competitors (Mamaearth, Plum Goodness, Minimalist, WOW Skin
 * Science, in that order) — everything after that is ours to fill in.
 */
// Ordered so that ADJACENT entries sit far apart on the hue wheel (not sorted by hue angle) —
// sequential/nearby palette indices are what actually end up next to each other in the UI
// (adjacent competitors, adjacent avatars), so it's adjacency in this array that needs to be
// visually distinct, not just distinctness of the set as a whole.
const PALETTE: EntityColor[] = [
  { color: "var(--pink-500)", tint: "var(--pink-50)" },
  { color: "var(--teal-500)", tint: "var(--teal-50)" },
  { color: "var(--yellow-500)", tint: "var(--orange-50)" },
  { color: "var(--violet-500)", tint: "var(--violet-50)" },
  { color: "var(--amber-500)", tint: "var(--amber-50)" },
  { color: "var(--sky-500)", tint: "var(--sky-50)" },
  { color: "var(--orange-500)", tint: "var(--yellow-50)" },
  { color: "var(--blue-500)", tint: "var(--blue-50)" },
  { color: "var(--lime-500)", tint: "var(--lime-50)" },
  { color: "var(--indigo-500)", tint: "var(--indigo-50)" },
  { color: "var(--green-500)", tint: "var(--green-50)" },
  { color: "var(--purple-500)", tint: "var(--purple-50)" },
  { color: "var(--emerald-500)", tint: "var(--emerald-50)" },
  { color: "var(--fuchsia-500)", tint: "var(--fuchsia-50)" },
  { color: "var(--cyan-500)", tint: "var(--cyan-50)" },
  // Deep-shade extensions (16-21) — same spread-out-adjacency logic
  { color: "var(--orange-900)", tint: "var(--orange-50)" },
  { color: "var(--blue-900)", tint: "var(--blue-50)" },
  { color: "var(--green-900)", tint: "var(--green-50)" },
  { color: "var(--violet-900)", tint: "var(--violet-50)" },
  { color: "var(--cyan-900)", tint: "var(--cyan-50)" },
  { color: "var(--pink-900)", tint: "var(--pink-50)" },
];

/**
 * Deterministic identity color for a backend-sourced entity, by its stable position in the
 * canonical list (not a hash of its id) — guarantees zero repetition up to PALETTE.length,
 * and repeats predictably (cycling) beyond that, which is fine for larger, order-agnostic
 * sets like creator avatars.
 */
export const getEntityColor = (index: number): EntityColor =>
  PALETTE[index % PALETTE.length];

// Content-type colors — semantic (same 3 for every brand, not an identity color from PALETTE
// above), so fixed rather than assigned. Lighter (-400) shades so they read as a softer,
// different *role* than the bold -500 identity dots, even where a hue is shared with a
// competitor's own color. Skips teal specifically since that's `--sk-accent`.
export const REEL = "#E1306C";
export const STATIC = "#0074D9";
export const CAROUSEL = "#FF851B";

const AVATAR_HUE_ORDER = [
  "orange",
  "sky",
  "lime",
  "violet",
  "amber",
  "blue",
  "emerald",
  "fuchsia",
  "yellow",
  "indigo",
  "green",
  "purple",
  "cyan",
  "pink",
  "teal",
  "red",
];
const AVATAR_SHADES = [500, 400, 600, 700];
const AVATAR_PALETTE: string[] = AVATAR_SHADES.flatMap((shade) =>
  AVATAR_HUE_ORDER.map((hue) => `var(--${hue}-${shade})`),
);

const hashString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

/**
 * Avatar background color, picked by hashing a name/label instead of a list position — there's
 * no stable index to key off (just whatever string is being initialed), and a repeat between
 * two unrelated people is fine at this count (56 colors).
 */
export const getEntityColorByName = (name: string): string =>
  AVATAR_PALETTE[hashString(name) % AVATAR_PALETTE.length];

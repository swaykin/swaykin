export type EntityColor = {
  color: string;
  tint: string;
};

// Content-type colors — semantic (same 3 for every brand, not an identity color from PALETTE
// below), so fixed rather than assigned. Lighter (-400) shades so they read as a softer,
// different *role* than the bold identity dots, even where a hue is shared with an entity's
// own color. Skips teal specifically since that's `--sk-accent`.
export const REEL = "#E1306C";
export const STATIC = "#0074D9";
export const CAROUSEL = "#FF851B";

// All 16 hues this app's design tokens define, minus `red` (reserved for errors/destructive
// actions elsewhere in the app) so an entity's identity color never gets misread as that
// meaning — 15 usable hues. Ordered so ADJACENT entries sit far apart on the hue wheel —
// sequential palette indices are what actually end up next to each other in the UI (adjacent
// competitors, adjacent avatars), so it's adjacency in this array that needs to be distinct.
const HUE_ORDER = [
  "pink",
  "teal",
  "orange",
  "violet",
  "amber",
  "sky",
  "blue",
  "lime",
  "indigo",
  "green",
  "purple",
  "emerald",
  "fuchsia",
  "cyan",
  "yellow",
];

// Multiple shades per hue for more variety across large sets (e.g. a 50-row Discovery grid)
// without needing more hues — adjacent shades of the same hue (500/600) still read as related,
// so shades are the outer loop: cycling through every hue once per shade before repeating a
// hue, rather than exhausting one hue's shades before moving on.
const SHADES = [500, 700, 600, 400];

const TINT_MIX_PERCENT = 10;

/**
 * Every {color, tint} pair this app needs for entity identity, built from one hue×shade grid
 * instead of separately-curated color and tint palettes. Tint is derived from color via
 * `color-mix()` rather than a fixed `-50` token — those tokens have no dark-mode override (they
 * stay light-pastel even in dark mode), whereas a color-mix'd tint is automatically theme-safe
 * since it blends with whatever's actually behind it. Same pattern this app's own
 * `--sk-accent-subtle` already uses in dark mode (`rgba(accent, 0.16)`).
 */
const PALETTE: EntityColor[] = SHADES.flatMap((shade) =>
  HUE_ORDER.map((hue) => {
    const color = `var(--${hue}-${shade})`;
    return {
      color,
      tint: `color-mix(in srgb, ${color} ${TINT_MIX_PERCENT}%, transparent)`,
    };
  }),
);

const hashString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

/**
 * Deterministic {color, tint} identity for an entity, by hashing its name/handle — there's no
 * stable list position to key off (backend order isn't stable across requests), and a repeat
 * among unrelated entities is fine at this palette size. The single seam for entity identity
 * color anywhere in the app: an avatar fill, a competitor chip's border+background, a post-tile
 * background — all pull from the same coordinated pair, so a color always matches its own tint.
 */
export const getEntityColor = (name: string): EntityColor =>
  PALETTE[hashString(name) % PALETTE.length];

/** Compacts large counts for display, e.g. 284000 -> "284K", 1500000 -> "1.5M". */
export const formatCompactNumber = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(value);
};

/** "Today"/"1d ago" for anything under 2 days old, the actual date otherwise — a bare "2d ago"
 * starts reading ambiguous (2 days? this week?) in a way "Today"/"1d ago" don't. */
export const formatPostDate = (iso: string): string => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "1d ago";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

import type { CSSProperties } from "react";

type IconWeight = "regular" | "bold" | "fill";

const WEIGHT_CLASS: Record<IconWeight, string> = {
  regular: "ph",
  bold: "ph-bold",
  fill: "ph-fill",
};

/**
 * Thin wrapper over the Phosphor web font.
 * Accepts either a phosphor name (e.g. "ph-flag") + weight, or a full
 * pre-composed class string (e.g. "ph-fill ph-flag") via `className`.
 */
export function Icon({
  name,
  weight = "regular",
  size = 16,
  color,
  className,
  style,
}: {
  name?: string;
  weight?: IconWeight;
  size?: number | string;
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const cls = className ?? `${WEIGHT_CLASS[weight]} ${name ?? ""}`.trim();
  return (
    <i
      className={cls}
      aria-hidden="true"
      style={{ fontSize: typeof size === "number" ? `${size}px` : size, color, ...style }}
    />
  );
}

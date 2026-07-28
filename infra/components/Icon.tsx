type IconWeight = "regular" | "bold" | "fill";

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  weight?: IconWeight;
  className?: string;
};

const WEIGHT_CLASS: Record<IconWeight, string> = {
  regular: "ph",
  bold: "ph-bold",
  fill: "ph-fill",
};

/** Phosphor icon-font glyph (see @phosphor-icons/web import in app/globals.css). */
export const Icon = ({ name, size = 16, color, weight = "regular", className }: IconProps) => {
  return (
    <i
      className={`${WEIGHT_CLASS[weight]} ${name} ${className ?? ""}`}
      style={{ fontSize: size, color, lineHeight: 1 }}
      aria-hidden="true"
    />
  );
};

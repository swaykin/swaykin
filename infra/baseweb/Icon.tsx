import { Box } from "./Box";

type IconWeight = "regular" | "bold" | "fill";

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  weight?: IconWeight;
  backgroundColor?: string;
  className?: string;
};

const WEIGHT_CLASS: Record<IconWeight, string> = {
  regular: "ph",
  bold: "ph-bold",
  fill: "ph-fill",
};

/** Phosphor icon-font glyph (see @phosphor-icons/web import in app/globals.css). */
export const Icon = ({
  name,
  size = 16,
  color,
  weight = "regular",
  backgroundColor,
  className,
}: IconProps) => {
  const iconEl = (
    <i
      className={`${WEIGHT_CLASS[weight]} ${name} ${className ?? ""}`}
      style={{ fontSize: size, color, lineHeight: 1 }}
      aria-hidden="true"
    />
  );
  return backgroundColor ? (
    <Box
      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
      style={{ background: backgroundColor }}
    >
      {iconEl}
    </Box>
  ) : (
    iconEl
  );
};

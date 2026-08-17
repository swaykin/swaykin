import type { ReactNode } from "react";
import { Box } from "@/infra/baseweb/Box";

type TruncateProps = {
  width?: string;
  children: ReactNode;
};

/** Truncates overflowing text with an ellipsis. `width` caps the element; inside a flex
 * container it also shrinks correctly since `min-w-0` overrides the default flex-item
 * content-based minimum width. */
export const Truncate = ({ width, children }: TruncateProps) => (
  <Box
    as="span"
    className="min-w-0 flex-1 truncate"
    style={width ? { width } : undefined}
  >
    {children}
  </Box>
);
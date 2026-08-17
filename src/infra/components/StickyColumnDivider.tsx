import { Box } from "@/infra/baseweb/Box";

// Neither `border-collapse`'s shared gridline border nor a `box-shadow` render reliably on a
// `<td>`/`<th>` (table-cell painting skips both under collapse in most browsers), so the
// divider is a plain absolutely-positioned `div` instead — `position: sticky` on the cell
// already makes it a containing block for this, no extra positioning needed on the cell itself.
export const StickyColumnDivider = () => (
  <Box className="pointer-events-none absolute inset-y-0 right-0 w-px bg-border" />
);

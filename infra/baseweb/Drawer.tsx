import { mergeOverrides } from "baseui";
import { Drawer as BaseDrawer, type DrawerProps } from "baseui/drawer";

// Above the topbar's z-20 and the popover menus' z-30 — Drawer's Root has no z-index at
// all by default (fixed positioning, z-index: auto), so it loses to any explicitly
// z-indexed element it overlaps, same underlying gap as StatefulPopover's z-30 fix.
const DRAWER_Z_INDEX = 40;

export const Drawer = ({ overrides, ...props }: DrawerProps) => (
  <BaseDrawer
    overrides={mergeOverrides(
      {
        Root: { style: { zIndex: DRAWER_Z_INDEX } },
        // Base Web's default DrawerBody margin (theme.sizing.scale900) is meant for
        // un-styled drawer content — our drawers always bring their own header/padding, so
        // it only compounds with that and pushes content away from the real edges.
        DrawerBody: {
          style: {
            marginTop: "0px",
            marginRight: "0px",
            marginBottom: "0px",
            marginLeft: "0px",
          },
        },
      },
      overrides,
    )}
    {...props}
  />
);

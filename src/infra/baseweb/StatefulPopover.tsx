import { mergeOverrides } from "baseui";
import {
  StatefulPopover as BaseStatefulPopover,
  type StatefulPopoverProps,
} from "baseui/popover";

// Matches the design's dropdown z-index (AppTopBar.dc.html) — must clear the
// sticky topbar's z-20 so menus anchored in it never render underneath it.
const POPOVER_Z_INDEX = 40;

export const StatefulPopover = ({
  overrides,
  ...props
}: StatefulPopoverProps) => {
  return (
    <BaseStatefulPopover
      overrides={mergeOverrides(
        { Body: { style: { zIndex: POPOVER_Z_INDEX } } },
        overrides,
      )}
      {...props}
    />
  );
};

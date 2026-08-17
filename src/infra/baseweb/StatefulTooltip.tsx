import { mergeOverrides } from "baseui";
import {
  StatefulTooltip as BaseStatefulTooltip,
  type StatefulTooltipProps,
} from "baseui/tooltip";

// Matches StatefulPopover's fix — Base Web's popover layer has no z-index of its own, so it
// renders underneath the sticky topbar's z-20 unless raised above it here.
const TOOLTIP_Z_INDEX = 30;

export const StatefulTooltip = ({
  overrides,
  ...props
}: StatefulTooltipProps) => (
  <BaseStatefulTooltip
    overrides={mergeOverrides(
      { Body: { style: { zIndex: TOOLTIP_Z_INDEX } } },
      overrides,
    )}
    {...props}
  />
);
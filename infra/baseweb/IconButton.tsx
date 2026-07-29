"use client";

import { mergeOverrides } from "baseui";
import { Button as BaseButton, type ButtonProps, SIZE } from "baseui/button";
import { getButtonOverrides } from "./buttonKindOverrides";

export const IconButton = ({
  kind,
  size,
  overrides,
  ...props
}: ButtonProps) => (
  <BaseButton
    kind={kind}
    shape="square"
    size={size}
    overrides={mergeOverrides(getButtonOverrides(kind, size), overrides)}
    {...props}
  />
);

export { SIZE };

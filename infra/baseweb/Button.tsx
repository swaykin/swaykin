"use client";

import { mergeOverrides } from "baseui";
import { Button as BaseButton, SIZE, type ButtonProps } from "baseui/button";
import { getButtonOverrides } from "./buttonKindOverrides";

export const Button = ({ kind, size, overrides, ...props }: ButtonProps) => (
  <BaseButton
    kind={kind}
    size={size}
    overrides={mergeOverrides(getButtonOverrides(kind, size), overrides)}
    {...props}
  />
);

export { SIZE };

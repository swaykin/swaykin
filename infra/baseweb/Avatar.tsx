"use client";

import { mergeOverrides } from "baseui";
import {
  Avatar as BaseAvatar,
  type AvatarOverrides,
  type AvatarProps,
} from "baseui/avatar";

type AvatarOwnProps = AvatarProps & {
  fillColor?: string;
  fontSize?: string;
};

export const Avatar = ({
  fillColor,
  fontSize,
  overrides,
  ...props
}: AvatarOwnProps) => {
  const defaultOverrides: AvatarOverrides = {
    Initials: {
      style: {
        fontWeight: 700,
        ...(fontSize ? { fontSize } : undefined),
      },
    },
    ...(fillColor ? { Root: { style: { backgroundColor: fillColor } } } : undefined),
  };

  return (
    <BaseAvatar overrides={mergeOverrides(defaultOverrides, overrides)} {...props} />
  );
};

import { mergeOverrides } from "baseui";
import {
  Avatar as BaseAvatar,
  type AvatarOverrides,
  type AvatarProps,
} from "baseui/avatar";
import { getEntityColorByName } from "@/lib/entityColor";

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
  // No caller-supplied color — pick one deterministically from the entity's own name, rather
  // than every caller having to compute and pass one down (see lib/entityColor.ts).
  const backgroundColor = fillColor ?? getEntityColorByName(props.name ?? "");

  const defaultOverrides: AvatarOverrides = {
    Root: { style: { backgroundColor } },
    Initials: {
      style: {
        fontWeight: 700,
        color: "#fff",
        ...(fontSize ? { fontSize } : undefined),
      },
    },
  };

  return (
    <BaseAvatar
      overrides={mergeOverrides(defaultOverrides, overrides)}
      {...props}
    />
  );
};

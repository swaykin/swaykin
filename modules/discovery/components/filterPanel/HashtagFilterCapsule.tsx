import { StatefulPopover } from "@/infra/baseweb/StatefulPopover";
import { FilterTriggerButton } from "./FilterTriggerButton";
import { HashtagFilterMenu } from "./HashtagFilterMenu";

type HashtagFilterCapsuleProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
};

const displayLabel = (tags: string[]) => {
  if (tags.length === 0) return "Hashtags";
  if (tags.length <= 2) return tags.map((t) => `#${t}`).join(", ");
  return `#${tags[0]} +${tags.length - 1}`;
};

export const HashtagFilterCapsule = ({
  tags,
  onChange,
}: HashtagFilterCapsuleProps) => (
  <StatefulPopover
    placement="bottomLeft"
    content={<HashtagFilterMenu tags={tags} onChange={onChange} />}
  >
    <FilterTriggerButton
      icon="ph-hash"
      label={displayLabel(tags)}
      active={tags.length > 0}
    />
  </StatefulPopover>
);

import { useState } from "react";
import { Box } from "@/infra/baseweb/Box";
import { Input } from "@/infra/baseweb/Input";
import { Tag } from "@/infra/components/Tag";

type HashtagFilterMenuProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
};

const HASHTAG_INPUT_OVERRIDES = {
  Input: {
    style: {
      paddingTop: "0px",
      paddingBottom: "0px",
      paddingLeft: "8px",
      paddingRight: "8px",
    },
  },
};

const normalizeTag = (raw: string) =>
  raw.trim().replace(/^#/, "").toLowerCase();

export const HashtagFilterMenu = ({
  tags,
  onChange,
}: HashtagFilterMenuProps) => {
  const [input, setInput] = useState("");

  const addTag = () => {
    const tag = normalizeTag(input);
    if (!tag || tags.includes(tag)) return;
    onChange([...tags, tag]);
    setInput("");
  };

  return (
    <Box className="w-[250px] rounded-xl border border-border bg-surface p-2.5 shadow-overlay">
      {tags.length > 0 && (
        <Box className="mb-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Tag
              key={tag}
              label={`#${tag}`}
              tone="accent"
              size="md"
              closable
              onClose={() => onChange(tags.filter((t) => t !== tag))}
            />
          ))}
        </Box>
      )}
      <Input
        value={input}
        onChange={(e) => setInput(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") addTag();
        }}
        placeholder="type a hashtag and hit enter"
        height="32px"
        borderRadius="7px"
        fontSize="12px"
        overrides={HASHTAG_INPUT_OVERRIDES}
      />
    </Box>
  );
};

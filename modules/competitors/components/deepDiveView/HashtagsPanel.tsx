import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import type { CompetitorHashtag } from "@/mocks/competitors";

type HashtagsPanelProps = {
  hashtags: CompetitorHashtag[];
  hashtagNote: string;
};

const HashtagRow = ({ hashtag }: { hashtag: CompetitorHashtag }) => (
  <Box>
    <Box className="mb-1 flex justify-between text-xs">
      <Box as="span" className="font-semibold text-link">
        #{hashtag.tag}
      </Box>
      <Box as="span" className="text-text-tertiary">
        {hashtag.uses} uses · {hashtag.eng} eng.
      </Box>
    </Box>
    <Box className="h-1.5 overflow-hidden rounded-[3px] bg-sunken">
      <Box className="h-full bg-accent" style={{ width: `${hashtag.pct}%` }} />
    </Box>
  </Box>
);

export const HashtagsPanel = ({
  hashtags,
  hashtagNote,
}: HashtagsPanelProps) => (
  <Box className="rounded-2xl border border-border bg-surface p-5 shadow-card">
    <Box className="mb-3 text-sm font-bold text-text">Top hashtags</Box>
    <Box className="flex flex-col gap-[9px]">
      {hashtags.map((hashtag) => (
        <HashtagRow key={hashtag.tag} hashtag={hashtag} />
      ))}
    </Box>
    <Box className="mt-3 flex items-start gap-1 text-[11px] leading-snug text-text-tertiary">
      <Icon name="ph-info" size={12} className="mt-px flex-shrink-0" />
      {hashtagNote}
    </Box>
  </Box>
);

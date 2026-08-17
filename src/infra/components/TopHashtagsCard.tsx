import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";

export type Hashtag = {
  tag: string;
  uses: number;
  /** Per-hashtag engagement rate — optional, shown when present in either domain. */
  eng?: string;
};

type TopHashtagsCardProps = {
  hashtags: Hashtag[];
  /** Panel-level insight text (not per-hashtag) — optional, shown when present in either domain. */
  note?: string;
};

const HashtagRow = ({ hashtag, maxUses }: { hashtag: Hashtag; maxUses: number }) => (
  <Box className="flex items-center gap-2.5">
    <Box
      as="span"
      className="w-[120px] flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] font-semibold text-link"
    >
      #{hashtag.tag}
    </Box>
    <Box className="h-1.5 flex-1 overflow-hidden rounded bg-sunken">
      <Box
        className="h-full rounded bg-accent"
        style={{ width: `${(hashtag.uses / maxUses) * 100}%` }}
      />
    </Box>
    <Box
      as="span"
      className="flex-shrink-0 whitespace-nowrap text-right text-[11.5px] font-semibold text-text-tertiary"
    >
      {hashtag.uses}
      {hashtag.eng && ` · ${hashtag.eng} eng.`}
    </Box>
  </Box>
);

export const TopHashtagsCard = ({ hashtags, note }: TopHashtagsCardProps) => {
  const maxUses = Math.max(...hashtags.map((hashtag) => hashtag.uses));

  return (
    <Box className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <Box className="mb-3.5 flex items-center gap-2">
        <Icon name="ph-hash" weight="fill" size={16} color="var(--sk-accent-strong)" />
        <Box as="span" className="text-[14.5px] font-bold text-text">
          Top hashtags
        </Box>
      </Box>
      <Box className="flex flex-col gap-2">
        {hashtags.map((hashtag) => (
          <HashtagRow key={hashtag.tag} hashtag={hashtag} maxUses={maxUses} />
        ))}
      </Box>
      {note && (
        <Box className="mt-3 flex items-start gap-1 text-[11px] leading-snug text-text-tertiary">
          <Icon name="ph-info" size={12} className="mt-px flex-shrink-0" />
          {note}
        </Box>
      )}
    </Box>
  );
};

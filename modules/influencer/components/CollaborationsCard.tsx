import { formatCompactNumber } from "@/lib/format";
import { Avatar } from "@/infra/baseweb/Avatar";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import type { BrandCollaboration } from "@/mocks/discovery";

type CollaborationsCardProps = {
  collabs: BrandCollaboration[] | undefined;
};

type SummaryStatProps = {
  label: string;
  value: string;
  valueColor?: string;
};

const SummaryStat = ({ label, value, valueColor }: SummaryStatProps) => (
  <Box>
    <Box className="mb-1 text-[10px] font-bold uppercase tracking-[0.03em] text-text-tertiary">
      {label}
    </Box>
    <Box
      className="text-[15px] font-bold"
      style={{ color: valueColor ?? "var(--sk-text)" }}
    >
      {value}
    </Box>
  </Box>
);

const CollabRow = ({ collab }: { collab: BrandCollaboration }) => (
  <Box className="flex cursor-pointer min-w-[600px]  items-center gap-4 border-b border-border bg-surface px-6 py-3 last:border-b-0 hover:bg-sunken">
    <Avatar
      name={collab.brand}
      fillColor={collab.logoColor}
      size="32px"
      fontSize="12px"
    />
    <Box className="min-w-0 flex-1">
      <Box className="text-[13px] font-bold text-text">{collab.brand}</Box>
      <Box className="text-[11.5px] text-text-tertiary">
        {collab.date} · {collab.via}
      </Box>
    </Box>
    <Box className="flex gap-10 items-center">
      <Box className="flex flex-shrink-0 items-center gap-10 text-[12.5px] font-semibold text-text-secondary">
        <Box className="flex items-center gap-1">
          <Icon
            name="ph-heart"
            weight="fill"
            size={13}
            color="var(--pink-600)"
          />
          {formatCompactNumber(collab.likes)}
        </Box>
        <Box className="flex items-center gap-1">
          <Icon name="ph-chat-circle" size={13} />
          {formatCompactNumber(collab.comments)}
        </Box>
      </Box>
      <Box className="flex-shrink-0 text-right">
        <Box className="text-[12.5px] font-bold text-text">
          {formatCompactNumber(collab.reach)}
        </Box>
        <Box className="text-[12px] text-text-tertiary">Reach</Box>
      </Box>
      <Box className="flex-shrink-0 text-right">
        <Box
          className="text-[12.5px] font-bold"
          style={{ color: "var(--green-700)" }}
        >
          ₹{formatCompactNumber(collab.emv)}
        </Box>
        <Box className="text-[11.5px] text-text-tertiary">EMV</Box>
      </Box>
      <Icon
        name="ph-arrow-right"
        weight="bold"
        size={13}
        color="var(--sk-text-tertiary)"
      />
    </Box>
  </Box>
);

export const CollaborationsCard = ({ collabs }: CollaborationsCardProps) => {
  const hasCollabs = !!collabs?.length;
  const totalReach = hasCollabs
    ? collabs.reduce((sum, collab) => sum + collab.reach, 0)
    : 0;
  const totalEmv = hasCollabs
    ? collabs.reduce((sum, collab) => sum + collab.emv, 0)
    : 0;

  return (
    <Box className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <Box className="mb-3.5 flex items-center gap-2">
        <Icon
          name="ph-handshake"
          weight="fill"
          size={16}
          color="var(--sk-accent-strong)"
        />
        <Box as="span" className="text-[14.5px] font-bold text-text">
          Brand collaborations
        </Box>
        <Box as="span" className="text-xs font-medium text-text-tertiary">
          detected from public posts
        </Box>
      </Box>
      {hasCollabs && (
        <Box className="mb-4 flex gap-6 rounded-xl bg-sunken px-4 py-3">
          <SummaryStat
            label="Total est. reach"
            value={formatCompactNumber(totalReach)}
          />
          <SummaryStat
            label="Total est. EMV"
            value={`₹${formatCompactNumber(totalEmv)}`}
            valueColor="var(--green-700)"
          />
          <SummaryStat label="Collaborations" value={String(collabs.length)} />
        </Box>
      )}
      {hasCollabs ? (
        <Box className="max-h-[260px] overflow-y-auto overflow-x-auto rounded-xl border border-border">
          {collabs.map((collab, i) => (
            <CollabRow key={`${collab.brand}-${i}`} collab={collab} />
          ))}
        </Box>
      ) : (
        <Box className="text-[12.5px] text-text-tertiary">
          No paid partnership tags or brand mentions detected recently.
        </Box>
      )}
    </Box>
  );
};

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import type { Influencer } from "./types";

const STAT_TILE_STYLE = {
  background: "var(--sk-surface-sunken)",
  borderRadius: 9,
  padding: "8px 10px",
};

export function InfluencerCard({
  influencer,
  onToggleSelect,
}: {
  influencer: Influencer;
  onToggleSelect: (id: number) => void;
}) {
  const inf = influencer;
  const profileHref = `/profile/${inf.handle.replace(/^@/, "")}`;

  return (
    <div
      className="sk-row-hover"
      style={{
        background: "var(--sk-surface)",
        border: `1px solid ${inf.selected ? "var(--sk-accent)" : "var(--sk-border)"}`,
        borderRadius: 16,
        padding: 18,
        boxShadow: inf.selected ? "var(--sk-shadow-raised)" : "var(--sk-shadow-card)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
        <input
          type="checkbox"
          checked={inf.selected}
          onChange={() => onToggleSelect(inf.id)}
          style={{ width: 16, height: 16, marginTop: 5, accentColor: "var(--sk-accent)", cursor: "pointer" }}
        />
        <Avatar initials={inf.initials} bg={inf.avatarBg} size={46} fontSize={14.5} ring={inf.selected} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--sk-text)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {inf.name}
            </span>
            {inf.verified && <Icon name="ph-seal-check" weight="fill" size={13.5} color="var(--sk-accent-strong)" />}
          </div>
          <div style={{ fontSize: 11.5, color: "var(--sk-text-tertiary)", marginBottom: 5 }}>@{inf.handle}</div>
          <span
            style={{
              display: "inline-block",
              fontSize: 10.5,
              fontWeight: 600,
              color: "var(--sk-text-secondary)",
              background: "var(--sk-surface-sunken)",
              borderRadius: 6,
              padding: "2px 7px",
            }}
          >
            {inf.niche}
          </span>
        </div>
        <button
          style={{ background: "transparent", border: "none", color: "var(--sk-text-tertiary)", cursor: "pointer", flexShrink: 0 }}
        >
          <Icon name="ph-bookmark-simple" size={17} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={STAT_TILE_STYLE}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--sk-text)" }}>{inf.followers}</div>
          <div style={{ fontSize: 10.5, color: "var(--sk-text-tertiary)" }}>Followers</div>
        </div>
        <div style={STAT_TILE_STYLE}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--green-700)" }}>{inf.er}</div>
          <div style={{ fontSize: 10.5, color: "var(--sk-text-tertiary)" }}>Engagement</div>
        </div>
        <div style={STAT_TILE_STYLE}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--sk-text)" }}>{inf.avgViews}</div>
          <div style={{ fontSize: 10.5, color: "var(--sk-text-tertiary)" }}>Avg. views</div>
        </div>
        <div style={STAT_TILE_STYLE}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--sk-text)" }}>{inf.postsWeek}</div>
          <div style={{ fontSize: 10.5, color: "var(--sk-text-tertiary)" }}>Posts / week</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <a
          href={inf.igUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            height: 37,
            flex: "0 0 44px",
            borderRadius: 9,
            background: "var(--sk-surface-sunken)",
            border: "1px solid var(--sk-border)",
            textDecoration: "none",
          }}
        >
          <Icon name="ph-instagram-logo" weight="fill" size={17} color="#E1306C" />
        </a>
        <Link
          href={profileHref}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            height: 37,
            borderRadius: 9,
            background: "var(--sk-accent-subtle)",
            color: "var(--sk-accent-strong)",
            fontSize: 12.5,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          View full profile
          <Icon name="ph-arrow-right" weight="bold" size={13} />
        </Link>
      </div>
    </div>
  );
}

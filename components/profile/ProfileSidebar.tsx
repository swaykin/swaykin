import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { profileMock } from "./mock-data";

const CORE_STATS = [
  { key: "followers", label: "Followers", color: "var(--sk-text)" },
  { key: "engagement", label: "Engagement", color: "var(--green-700)" },
  { key: "avgViews", label: "Avg. views", color: "var(--sk-text)" },
  { key: "postsPerWeek", label: "Posts / week", color: "var(--sk-text)" },
] as const;

function TagPill({ children, kind }: { children: string; kind: "hashtag" | "mention" }) {
  return (
    <span
      style={{
        fontSize: 10.5,
        fontWeight: 600,
        color: kind === "hashtag" ? "var(--sk-accent-strong)" : "var(--sk-text-secondary)",
        background: kind === "hashtag" ? "var(--sk-accent-subtle)" : "var(--sk-surface-sunken)",
        borderRadius: 6,
        padding: "3px 8px",
      }}
    >
      {kind === "hashtag" ? `#${children}` : `@${children}`}
    </span>
  );
}

export function ProfileSidebar() {
  const { name, handle, initials, avatarBg, stats, email, brandAffinity, hashtags, mentions } =
    profileMock;

  return (
    <Card padding={20}>
      <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
        <Avatar initials={initials} bg={avatarBg} size={56} fontSize={18} />
        <div>
          <div className="flex items-center gap-[5px]">
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--sk-text)" }}>{name}</span>
            <Icon name="ph-seal-check" weight="fill" size={14} color="var(--blue-600)" />
          </div>
          <div style={{ fontSize: 12, color: "var(--sk-text-tertiary)" }}>@{handle}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[10px]" style={{ marginBottom: 16 }}>
        {CORE_STATS.map((s) => (
          <div
            key={s.key}
            style={{ background: "var(--sk-surface-sunken)", borderRadius: 10, padding: "8px 10px" }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{stats[s.key]}</div>
            <div style={{ fontSize: 11, color: "var(--sk-text-tertiary)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: "var(--sk-border)", marginBottom: 14 }} />

      {email && (
        <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
          <Icon name="ph-envelope-simple" size={14} color="var(--sk-text-tertiary)" style={{ flexShrink: 0 }} />
          <a
            href={`mailto:${email}`}
            style={{ fontSize: 12.5, color: "var(--sk-link)", textDecoration: "none", wordBreak: "break-all" }}
          >
            {email}
          </a>
        </div>
      )}

      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "var(--sk-text-tertiary)",
          textTransform: "uppercase",
          letterSpacing: ".03em",
          marginBottom: 8,
        }}
      >
        Brand affinity
      </div>
      <div className="flex flex-wrap gap-[6px]" style={{ marginBottom: 16 }}>
        {brandAffinity.map((b) => (
          <span
            key={b}
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              color: "var(--sk-accent-strong)",
              background: "var(--sk-accent-subtle)",
              borderRadius: 6,
              padding: "3px 8px",
            }}
          >
            {b}
          </span>
        ))}
      </div>

      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "var(--sk-text-tertiary)",
          textTransform: "uppercase",
          letterSpacing: ".03em",
          marginBottom: 8,
        }}
      >
        Hashtags &amp; mentions
      </div>
      <div className="flex flex-wrap gap-[6px]">
        {hashtags.map((h) => (
          <TagPill key={`h-${h}`} kind="hashtag">
            {h}
          </TagPill>
        ))}
        {mentions.map((m) => (
          <TagPill key={`m-${m}`} kind="mention">
            {m}
          </TagPill>
        ))}
      </div>
    </Card>
  );
}

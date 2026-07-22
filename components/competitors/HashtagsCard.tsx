import { Card, SectionHeader } from "@/components/ui/Card";
import { HASHTAGS, THEMES } from "./data";

export function HashtagsCard() {
  return (
    <Card>
      <SectionHeader title="Top hashtags & content themes" />
      <div className="flex flex-wrap gap-2" style={{ marginBottom: 14 }}>
        {HASHTAGS.map((h) => (
          <span
            key={h}
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: "var(--sk-link)",
              background: "var(--sk-accent-subtle)",
              borderRadius: 8,
              padding: "5px 10px",
            }}
          >
            #{h}
          </span>
        ))}
      </div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "var(--sk-text-tertiary)",
          textTransform: "uppercase",
          letterSpacing: "0.03em",
          marginBottom: 8,
        }}
      >
        Content themes
      </div>
      <div className="flex flex-wrap gap-2">
        {THEMES.map((t) => (
          <span
            key={t}
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: "var(--sk-text-secondary)",
              background: "var(--sk-surface-sunken)",
              borderRadius: 8,
              padding: "5px 10px",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </Card>
  );
}

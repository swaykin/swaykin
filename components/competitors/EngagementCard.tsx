import { Card, SectionHeader } from "@/components/ui/Card";
import { ENGAGEMENT_COMPARE, type BrandKey } from "./data";

export function EngagementCard({ activeMap }: { activeMap: Record<BrandKey, boolean> }) {
  const rows = ENGAGEMENT_COMPARE.filter((e) => activeMap[e.key]);

  return (
    <Card>
      <SectionHeader title="Average engagement rate" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {rows.map((e) => (
          <div key={e.key}>
            <div className="flex items-center justify-between" style={{ fontSize: 12.5, marginBottom: 6 }}>
              <span className="flex items-center gap-2" style={{ color: "var(--sk-text-secondary)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: e.color }} />
                {e.name}
              </span>
              <span style={{ fontWeight: 700, color: "var(--sk-text)" }}>{e.value}</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "var(--sk-surface-sunken)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${e.pct}%`, background: e.color }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

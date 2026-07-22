import { Card, SectionHeader } from "@/components/ui/Card";
import { TIMELINE } from "./data";

function parseDate(date: string): number {
  return new Date(date).getTime();
}

export function TimelineCard() {
  const sorted = [...TIMELINE].sort((a, b) => parseDate(b.date) - parseDate(a.date));

  return (
    <Card>
      <SectionHeader title="Competitor timeline" />
      <div className="flex flex-col gap-3">
        {sorted.map((t, i) => (
          <div key={i} className="flex gap-2">
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: t.color,
                marginTop: 5,
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontSize: 12, color: "var(--sk-text)" }}>
                <strong>{t.brand}</strong> {t.event}
              </div>
              <div style={{ fontSize: 11, color: "var(--sk-text-tertiary)" }}>{t.date}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

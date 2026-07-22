import { Card, SectionHeader } from "@/components/ui/Card";
import { DAY_LABELS, HEATMAP } from "./data";

export function HeatmapCard() {
  return (
    <Card>
      <SectionHeader title="Posting pattern (posts / day)" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {HEATMAP.map((cell, i) => (
          <div key={i} style={{ aspectRatio: "1", borderRadius: 5, background: cell.color }} />
        ))}
      </div>
      <div className="flex justify-between" style={{ marginTop: 8, fontSize: 10.5, color: "var(--sk-text-tertiary)" }}>
        {DAY_LABELS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </Card>
  );
}

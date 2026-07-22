import { Card } from "@/components/ui/Card";

const GROUPS = [
  { label: "Price range", value: "₹15K – ₹1.5L per post" },
  { label: "Creator type", value: "Micro, Mid-tier" },
  { label: "Growth rate", value: "5%+ / month" },
  { label: "Account type", value: "Verified · Business" },
  { label: "Brand affinity", value: "Beauty, Skincare" },
];

/** Static detail panel — informational only, no wiring (per handoff README). */
export function MoreFiltersPanel() {
  return (
    <Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
        {GROUPS.map((g) => (
          <div key={g.label}>
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
              {g.label}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--sk-text-secondary)" }}>{g.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

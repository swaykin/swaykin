import { Card, SectionHeader } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { COMPETITOR_CONTENT } from "./data";

export function ContentGrid() {
  return (
    <Card>
      <SectionHeader title="Recent competitor Reels & Posts" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
        {COMPETITOR_CONTENT.map((p, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1",
              borderRadius: 10,
              background: p.bg,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={p.icon} weight="fill" size={20} color={p.iconColor} style={{ opacity: 0.85 }} />
            <span
              style={{
                position: "absolute",
                top: 6,
                left: 6,
                fontSize: 9.5,
                fontWeight: 700,
                color: "#fff",
                background: "rgba(0,0,0,.35)",
                borderRadius: 5,
                padding: "1px 6px",
              }}
            >
              {p.brand}
            </span>
            <div
              className="flex items-center justify-between"
              style={{
                position: "absolute",
                bottom: 6,
                left: 6,
                right: 6,
                fontSize: 10,
                color: "#fff",
                fontWeight: 700,
                textShadow: "0 1px 2px rgba(0,0,0,.4)",
              }}
            >
              <span className="flex items-center gap-1">
                <Icon name="ph-heart" weight="fill" size={10} color="#fff" /> {p.likes}
              </span>
              <span>{p.type}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

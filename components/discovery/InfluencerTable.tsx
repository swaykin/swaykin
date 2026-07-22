import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { Influencer } from "./types";

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  fontSize: 11,
  fontWeight: 600,
  color: "var(--sk-text-tertiary)",
  textTransform: "uppercase",
  borderBottom: "1px solid var(--sk-border)",
};
const thRight: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = { padding: "10px 12px", borderBottom: "1px solid var(--sk-border)" };
const tdRight: React.CSSProperties = { ...td, textAlign: "right", fontSize: 12.5, color: "var(--sk-text)" };

export function InfluencerTable({
  influencers,
  onToggleSelect,
}: {
  influencers: Influencer[];
  onToggleSelect: (id: number) => void;
}) {
  return (
    <Card padding={0} style={{ overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ width: 36, padding: "10px 16px", borderBottom: "1px solid var(--sk-border)" }} />
            <th style={th}>Creator</th>
            <th style={thRight}>Followers</th>
            <th style={thRight}>Engagement</th>
            <th style={thRight}>Avg. views</th>
            <th style={thRight}>Posts / week</th>
            <th style={{ width: 36, padding: "10px 16px", borderBottom: "1px solid var(--sk-border)" }} />
          </tr>
        </thead>
        <tbody>
          {influencers.map((inf) => (
            <tr key={inf.id} className="sk-row-hover">
              <td style={{ padding: "10px 16px", borderBottom: "1px solid var(--sk-border)" }}>
                <input
                  type="checkbox"
                  checked={inf.selected}
                  onChange={() => onToggleSelect(inf.id)}
                  style={{ accentColor: "var(--sk-accent)", cursor: "pointer" }}
                />
              </td>
              <td style={td}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: inf.avatarBg,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {inf.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--sk-text)" }}>{inf.name}</div>
                    <div style={{ fontSize: 11, color: "var(--sk-text-tertiary)" }}>@{inf.handle}</div>
                  </div>
                </div>
              </td>
              <td style={tdRight}>{inf.followers}</td>
              <td style={{ ...tdRight, fontWeight: 700, color: "var(--green-700)" }}>{inf.er}</td>
              <td style={{ ...tdRight, color: "var(--sk-text-secondary)" }}>{inf.avgViews}</td>
              <td style={{ ...tdRight, color: "var(--sk-text-secondary)" }}>{inf.postsWeek}</td>
              <td style={{ padding: "10px 16px", borderBottom: "1px solid var(--sk-border)", textAlign: "right" }}>
                <Link
                  href={`/profile/${inf.handle.replace(/^@/, "")}`}
                  style={{ fontSize: 12, fontWeight: 700, color: "var(--sk-link)" }}
                >
                  View →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

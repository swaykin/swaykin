import { Card } from "@/components/ui/Card";
import type { Collaboration } from "./mock-data";

const TH_STYLE: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 14px",
  fontSize: 11,
  fontWeight: 600,
  color: "var(--sk-text-tertiary)",
  textTransform: "uppercase",
  borderBottom: "1px solid var(--sk-border)",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const TD_STYLE: React.CSSProperties = {
  padding: "11px 14px",
  borderBottom: "1px solid var(--sk-border)",
  fontSize: 12.5,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export function CollaborationsTable({ collaborations }: { collaborations: Collaboration[] }) {
  return (
    <Card padding={0} style={{ overflow: "hidden" }}>
      <div style={{ padding: "16px 20px 10px", fontSize: 14, fontWeight: 700, color: "var(--sk-text)" }}>
        Past collaborations &amp; sponsored posts
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ ...TH_STYLE, width: "34%" }}>Brand</th>
            <th style={{ ...TH_STYLE, width: "32%", padding: "8px 8px" }}>Format</th>
            <th style={{ ...TH_STYLE, width: "17%", padding: "8px 8px", textAlign: "right" }}>Reach</th>
            <th style={{ ...TH_STYLE, width: "17%", textAlign: "right" }}>Eng.</th>
          </tr>
        </thead>
        <tbody>
          {collaborations.map((c) => (
            <tr key={c.brand} className="sk-row-hover">
              <td style={{ ...TD_STYLE, fontWeight: 600, color: "var(--sk-text)" }}>{c.brand}</td>
              <td style={{ ...TD_STYLE, padding: "11px 8px", color: "var(--sk-text-secondary)" }}>
                {c.format}
              </td>
              <td
                style={{
                  ...TD_STYLE,
                  padding: "11px 8px",
                  color: "var(--sk-text-secondary)",
                  textAlign: "right",
                  whiteSpace: "normal",
                }}
              >
                {c.reach}
              </td>
              <td
                style={{
                  ...TD_STYLE,
                  fontWeight: 700,
                  color: "var(--green-700)",
                  textAlign: "right",
                  whiteSpace: "normal",
                }}
              >
                {c.engagement}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

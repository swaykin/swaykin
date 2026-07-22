import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { CampaignStatus, ProfileCampaign } from "./mock-data";

const GROUP_DEFS: { status: CampaignStatus; label: string; dot: string; accent: string }[] = [
  { status: "Active", label: "Active", dot: "var(--green-600)", accent: "var(--green-700)" },
  { status: "Upcoming", label: "Upcoming", dot: "var(--blue-600)", accent: "var(--blue-600)" },
  { status: "Completed", label: "Completed", dot: "var(--sk-text-tertiary)", accent: "var(--sk-text-secondary)" },
];

export function CampaignRelationshipStrip({
  name,
  campaigns,
}: {
  name: string;
  campaigns: ProfileCampaign[];
}) {
  return (
    <div
      style={{
        background: "var(--sk-surface)",
        border: "1px solid var(--sk-border)",
        borderRadius: 16,
        padding: "16px 20px",
        boxShadow: "var(--sk-shadow-card)",
        marginBottom: 16,
      }}
    >
      <div className="flex items-center gap-2" style={{ marginBottom: 14 }}>
        <Icon name="ph-flag" weight="fill" size={15} color="var(--sk-accent-strong)" />
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--sk-text)" }}>
          Campaigns with {name}
        </span>
      </div>
      <div className="flex">
        {GROUP_DEFS.map((g, i) => {
          const items = campaigns.filter((c) => c.status === g.status);
          return (
            <div
              key={g.status}
              style={{
                flex: 1,
                padding: "2px 20px",
                borderLeft: i > 0 ? "1px solid var(--sk-border)" : "none",
              }}
            >
              <div className="flex items-center gap-[7px]" style={{ marginBottom: 10 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: g.dot,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--sk-text)" }}>{g.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: g.accent, marginLeft: "auto" }}>
                  {items.length}
                </span>
              </div>
              {items.length === 0 ? (
                <div style={{ fontSize: 12, color: "var(--sk-text-tertiary)" }}>None</div>
              ) : (
                <div className="flex flex-col gap-[6px]">
                  {items.map((c) => (
                    <Link
                      key={c.name}
                      href={c.href}
                      className="sk-row-hover"
                      style={{
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: "var(--sk-text)",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                      }}
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

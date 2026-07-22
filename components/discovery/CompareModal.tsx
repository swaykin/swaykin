import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Influencer } from "./types";

export function CompareModal({
  open,
  onClose,
  influencers,
}: {
  open: boolean;
  onClose: () => void;
  influencers: Influencer[];
}) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,22,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--sk-surface)",
          borderRadius: 16,
          padding: 24,
          width: "min(90vw, 860px)",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "var(--sk-shadow-overlay)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--sk-text)" }}>Compare creators</div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: "1px solid var(--sk-border)",
              background: "var(--sk-surface)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="ph-x" size={14} color="var(--sk-text-secondary)" />
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(influencers.length, 1)}, 1fr)`, gap: 14 }}>
          {influencers.map((cc) => (
            <div key={cc.id} style={{ border: "1px solid var(--sk-border)", borderRadius: 14, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: cc.avatarBg,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {cc.initials}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--sk-text)" }}>{cc.name}</div>
                  <div style={{ fontSize: 11, color: "var(--sk-text-tertiary)" }}>@{cc.handle}</div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "7px 0",
                  borderBottom: "1px solid var(--sk-border)",
                  fontSize: 12.5,
                }}
              >
                <span style={{ color: "var(--sk-text-secondary)" }}>Followers</span>
                <span style={{ fontWeight: 700, color: "var(--sk-text)" }}>{cc.followers}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "7px 0",
                  borderBottom: "1px solid var(--sk-border)",
                  fontSize: 12.5,
                }}
              >
                <span style={{ color: "var(--sk-text-secondary)" }}>Engagement</span>
                <span style={{ fontWeight: 700, color: "var(--green-700)" }}>{cc.er}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "7px 0",
                  borderBottom: "1px solid var(--sk-border)",
                  fontSize: 12.5,
                }}
              >
                <span style={{ color: "var(--sk-text-secondary)" }}>Avg. views</span>
                <span style={{ fontWeight: 700, color: "var(--sk-text)" }}>{cc.avgViews}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 12.5 }}>
                <span style={{ color: "var(--sk-text-secondary)" }}>Posts / week</span>
                <span style={{ fontWeight: 700, color: "var(--sk-text)" }}>{cc.postsWeek}</span>
              </div>
              <Link
                href={`/profile/${cc.handle.replace(/^@/, "")}`}
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: 12,
                  height: 32,
                  lineHeight: "32px",
                  borderRadius: 8,
                  background: "var(--sk-accent-subtle)",
                  color: "var(--sk-accent-strong)",
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                View profile
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

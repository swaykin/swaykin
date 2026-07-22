"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/ui/Toast";

type Status = "Shortlisted" | "In discussion" | "Contracted" | "Campaign ended";

type Influencer = {
  id: number;
  name: string;
  handle: string;
  initials: string;
  avatarBg: string;
  niche: string;
  followers: string;
  er: string;
  status: Status;
  convo: string;
  campaign: string;
  outcome: string;
  igUrl: string;
};

const INFLUENCERS: Influencer[] = [
  { id: 1, name: "Priya Nair", handle: "priya.glowup", initials: "PN", avatarBg: "var(--violet-600)", niche: "Skincare", followers: "118K", er: "6.2%", status: "Shortlisted", convo: "Cold outreach", campaign: "—", outcome: "—", igUrl: "https://instagram.com/priya.glowup" },
  { id: 2, name: "Simran Kaur", handle: "simran.beauty", initials: "SK", avatarBg: "var(--blue-600)", niche: "Makeup", followers: "89K", er: "5.8%", status: "In discussion", convo: "Replied · 2 days ago", campaign: "Diwali Radiance Edit", outcome: "Negotiating", igUrl: "https://instagram.com/simran.beauty" },
  { id: 3, name: "Tara Joshi", handle: "tara.naturals", initials: "TJ", avatarBg: "var(--green-700)", niche: "Organic beauty", followers: "54K", er: "8.4%", status: "Contracted", convo: "Deal closed", campaign: "Monsoon Glow Launch", outcome: "In progress", igUrl: "https://instagram.com/tara.naturals" },
  { id: 4, name: "Divya Menon", handle: "divya.skindiaries", initials: "DM", avatarBg: "var(--pink-600)", niche: "Skincare", followers: "142K", er: "5.1%", status: "Campaign ended", convo: "Completed", campaign: "Summer Skin Reset", outcome: "₹4.2L · 5.1x ROI", igUrl: "https://instagram.com/divya.skindiaries" },
  { id: 5, name: "Arjun Seth", handle: "arjun.grooming", initials: "AS", avatarBg: "var(--orange-600)", niche: "Men's grooming", followers: "61K", er: "7.9%", status: "Campaign ended", convo: "Completed", campaign: "Micro-Creator Trial", outcome: "₹1.1L · 2.3x ROI", igUrl: "https://instagram.com/arjun.grooming" },
  { id: 6, name: "Nadia Iyer", handle: "nadia.glowjourney", initials: "NI", avatarBg: "var(--teal-600)", niche: "Wellness", followers: "77K", er: "6.6%", status: "Shortlisted", convo: "Not contacted", campaign: "—", outcome: "—", igUrl: "https://instagram.com/nadia.glowjourney" },
];

const STATUSES: (Status | "All")[] = ["All", "Shortlisted", "In discussion", "Contracted", "Campaign ended"];

function statusMeta(status: Status): { bg: string; color: string } {
  if (status === "Shortlisted") return { bg: "var(--sk-accent-subtle)", color: "var(--sk-accent-strong)" };
  if (status === "In discussion") return { bg: "var(--orange-100)", color: "var(--orange-700)" };
  if (status === "Contracted") return { bg: "var(--blue-50)", color: "var(--blue-600)" };
  return { bg: "var(--green-50)", color: "var(--green-700)" };
}

function convoColor(convo: string): string {
  if (convo.includes("Completed") || convo.includes("closed")) return "var(--green-700)";
  if (convo.includes("Replied") || convo.includes("Negotiating")) return "var(--orange-700)";
  return "var(--sk-text-secondary)";
}

function outcomeColor(outcome: string): string {
  if (outcome.includes("ROI")) return "var(--green-700)";
  if (outcome === "In progress") return "var(--blue-600)";
  if (outcome === "Negotiating") return "var(--orange-700)";
  return "var(--sk-text-tertiary)";
}

const th: CSSProperties = {
  textAlign: "left",
  padding: "10px 20px",
  fontSize: 11,
  fontWeight: 600,
  color: "var(--sk-text-tertiary)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  borderBottom: "1px solid var(--sk-border)",
};
const thRight: CSSProperties = { ...th, textAlign: "right", padding: "10px 12px" };
const thCenter: CSSProperties = { ...th, textAlign: "center", padding: "10px 20px" };
const thMid: CSSProperties = { ...th, padding: "10px 12px" };
const td: CSSProperties = {
  padding: "12px 20px",
  borderBottom: "1px solid var(--sk-border)",
  fontSize: 12.5,
  color: "var(--sk-text)",
};
const tdMid: CSSProperties = { ...td, padding: "12px", fontSize: 12 };
const tdRight: CSSProperties = { ...tdMid, textAlign: "right" };

function Th({ children, align = "left" }: { children: ReactNode; align?: "left" | "right" | "center" }) {
  const style = align === "right" ? thRight : align === "center" ? thCenter : th;
  return <th style={style}>{children}</th>;
}

export default function SavedInfluencers() {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<Status | "All">("All");

  const counts = useMemo(
    () => ({
      Shortlisted: INFLUENCERS.filter((i) => i.status === "Shortlisted").length,
      "In discussion": INFLUENCERS.filter((i) => i.status === "In discussion").length,
      Contracted: INFLUENCERS.filter((i) => i.status === "Contracted").length,
      "Campaign ended": INFLUENCERS.filter((i) => i.status === "Campaign ended").length,
    }),
    []
  );

  const kpis = [
    { label: "Shortlisted", value: counts.Shortlisted, icon: "ph-bookmark-simple", color: "var(--sk-accent)", tint: "var(--sk-accent-subtle)" },
    { label: "In discussion", value: counts["In discussion"], icon: "ph-chat-circle-dots", color: "var(--orange-600)", tint: "var(--orange-100)" },
    { label: "Contracted", value: counts.Contracted, icon: "ph-file-text", color: "var(--blue-600)", tint: "var(--blue-50)" },
    { label: "Campaign ended", value: counts["Campaign ended"], icon: "ph-flag-checkered", color: "var(--green-700)", tint: "var(--green-50)" },
  ];

  const filtered = filter === "All" ? INFLUENCERS : INFLUENCERS.filter((i) => i.status === filter);

  return (
    <div style={{ padding: "18px 28px 44px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <PageHeader
          breadcrumb="SwayKin AI · Saved Influencers"
          title="Saved Influencers"
          subtitle="Track shortlisted creators, conversation progress and campaign outcomes."
          actions={
            <Button
              variant="primary"
              icon={<Icon name="ph-bookmark-simple" weight="bold" size={14} />}
              onClick={() => showToast("Go to Discovery to save influencers…")}
            >
              Save influencer
            </Button>
          }
        />

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {kpis.map((k) => (
            <Card key={k.label} padding={"14px 16px"}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    background: k.tint,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name={k.icon} weight="fill" size={15} color={k.color} />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--sk-text)", letterSpacing: "-0.02em" }}>
                    {k.value}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--sk-text-tertiary)" }}>{k.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filter chips */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {STATUSES.map((s) => {
            const active = s === filter;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  height: 32,
                  padding: "0 14px",
                  borderRadius: 9,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: `1px solid ${active ? "var(--sk-accent)" : "var(--sk-border)"}`,
                  background: active ? "var(--sk-accent-subtle)" : "var(--sk-surface)",
                  color: active ? "var(--sk-accent-strong)" : "var(--sk-text-secondary)",
                }}
              >
                {s}
              </button>
            );
          })}
        </div>

        {/* Table */}
        <Card padding={0} style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>Creator</Th>
                <Th align="right">Followers</Th>
                <Th align="right">Engagement</Th>
                <th style={thMid}>Status</th>
                <th style={thMid}>Conversation</th>
                <th style={thMid}>Campaign</th>
                <Th align="right">Outcome</Th>
                <Th align="center">Links</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const sm = statusMeta(r.status);
                return (
                  <tr key={r.id} className="sk-row-hover">
                    <td style={td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar initials={r.initials} bg={r.avatarBg} size={34} fontSize={12} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--sk-text)" }}>{r.name}</div>
                          <div style={{ fontSize: 11, color: "var(--sk-text-tertiary)" }}>
                            @{r.handle} · {r.niche}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={tdRight}>{r.followers}</td>
                    <td style={{ ...tdRight, fontWeight: 600, color: "var(--sk-text)" }}>{r.er}</td>
                    <td style={tdMid}>
                      <Badge bg={sm.bg} color={sm.color}>
                        {r.status}
                      </Badge>
                    </td>
                    <td style={{ ...tdMid, color: convoColor(r.convo) }}>{r.convo}</td>
                    <td style={{ ...tdMid, color: "var(--sk-text-secondary)" }}>{r.campaign}</td>
                    <td style={{ ...tdRight, fontWeight: 600, color: outcomeColor(r.outcome) }}>{r.outcome}</td>
                    <td style={{ ...td, textAlign: "center", padding: "12px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <a
                          href={r.igUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Open Instagram"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 28,
                            height: 28,
                            borderRadius: 7,
                            background: "var(--sk-surface-sunken)",
                            border: "1px solid var(--sk-border)",
                            textDecoration: "none",
                          }}
                        >
                          <Icon name="ph-instagram-logo" weight="fill" size={14} color="#E1306C" />
                        </a>
                        <button
                          onClick={() => showToast("Removed from saved")}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 28,
                            height: 28,
                            borderRadius: 7,
                            background: "var(--sk-surface-sunken)",
                            border: "1px solid var(--sk-border)",
                            cursor: "pointer",
                          }}
                        >
                          <Icon name="ph-x" size={13} color="var(--sk-text-tertiary)" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: "56px 20px", textAlign: "center" }}>
              <Icon
                name="ph-bookmark-simple"
                size={40}
                color="var(--sk-text-tertiary)"
                style={{ opacity: 0.4, display: "block", margin: "0 auto 10px" }}
              />
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--sk-text)", marginBottom: 4 }}>
                No saved influencers match this filter
              </div>
              <div style={{ fontSize: 13, color: "var(--sk-text-secondary)" }}>
                Try a different status or clear the filter.
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

"use client";

import type { CSSProperties, ReactNode } from "react";
import { Card, SectionHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/ui/Toast";

const th: CSSProperties = {
  textAlign: "left",
  padding: "8px 20px",
  fontSize: 11,
  fontWeight: 600,
  color: "var(--sk-text-tertiary)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  borderBottom: "1px solid var(--sk-border)",
};

const thRight: CSSProperties = { ...th, textAlign: "right" };
const td: CSSProperties = {
  padding: "12px 20px",
  borderBottom: "1px solid var(--sk-border)",
  fontSize: 12.5,
  color: "var(--sk-text)",
};
const tdRight: CSSProperties = { ...td, textAlign: "right", color: "var(--sk-text-secondary)" };

const kpis = [
  { label: "Total influencers", value: "1,284", icon: "ph-users-three", color: "var(--sk-accent)", tint: "var(--sk-accent-subtle)" },
  { label: "Active campaigns", value: "14", icon: "ph-flag", color: "var(--blue-600)", tint: "var(--blue-50)" },
  { label: "Total spend", value: "₹42.6L", icon: "ph-wallet", color: "var(--orange-600)", tint: "var(--orange-100)" },
  { label: "Revenue generated", value: "₹1.94Cr", icon: "ph-trend-up", color: "var(--green-700)", tint: "var(--green-50)" },
  { label: "Blended ROI", value: "4.6x", icon: "ph-chart-line-up", color: "var(--sk-accent)", tint: "var(--sk-accent-subtle)" },
];

const campaigns = [
  { name: "Monsoon Glow Launch", status: "Running", statusBg: "var(--green-50)", statusColor: "var(--green-700)", spend: "₹8.4L", roi: "4.8x", creators: 18 },
  { name: "Diwali Radiance Edit", status: "Draft", statusBg: "var(--neutral-light-solid-100)", statusColor: "var(--sk-text-secondary)", spend: "₹0", roi: "—", creators: 6 },
  { name: "Summer Skin Reset", status: "Completed", statusBg: "var(--sk-accent-subtle)", statusColor: "var(--sk-accent-strong)", spend: "₹6.1L", roi: "5.2x", creators: 22 },
  { name: "Micro-Creator Trial", status: "Paused", statusBg: "var(--orange-100)", statusColor: "var(--orange-700)", spend: "₹1.2L", roi: "2.1x", creators: 9 },
  { name: "New Mom Skincare Push", status: "Running", statusBg: "var(--green-50)", statusColor: "var(--green-700)", spend: "₹3.9L", roi: "3.7x", creators: 12 },
];

const deliverables = [
  { title: "Reel — Serum launch teaser", creator: "@ananya.skincare", due: "Tomorrow", dotColor: "var(--red-600)" },
  { title: "Static post — Product review", creator: "@glow.with.meher", due: "in 3 days", dotColor: "var(--orange-600)" },
  { title: "Story series — Unboxing", creator: "@thebeautyfile", due: "in 6 days", dotColor: "var(--sk-accent)" },
  { title: "Reel — Festive edit", creator: "@zara.beautyedit", due: "in 9 days", dotColor: "var(--sk-accent)" },
];

const contentMix = [
  { label: "Reels", pct: 41, icon: "ph-play", color: "var(--sk-accent)" },
  { label: "Static posts", pct: 35, icon: "ph-image", color: "var(--blue-600)" },
  { label: "Stories", pct: 24, icon: "ph-circles-three", color: "var(--orange-600)" },
];

const comparisonRows = [
  { name: "Summer Skin Reset", er: "6.4%", cpm: "₹28", roi: "5.2x" },
  { name: "Monsoon Glow Launch", er: "5.8%", cpm: "₹34", roi: "4.8x" },
  { name: "Festive Combo Sets", er: "5.1%", cpm: "₹41", roi: "4.1x" },
  { name: "Micro-Creator Trial", er: "4.2%", cpm: "₹52", roi: "2.1x" },
];

const topCreators = [
  { name: "Ananya Kapoor", initials: "AK", avatarBg: "var(--violet-600)", niche: "Skincare", followers: "284K", er: "6.8%", revenue: "₹9.2L" },
  { name: "Meher Chhabra", initials: "MC", avatarBg: "var(--blue-600)", niche: "Beauty & Lifestyle", followers: "156K", er: "7.4%", revenue: "₹7.8L" },
  { name: "Rhea Sundaram", initials: "RS", avatarBg: "var(--teal-600)", niche: "Wellness", followers: "412K", er: "4.9%", revenue: "₹6.5L" },
  { name: "Ishaan Verma", initials: "IV", avatarBg: "var(--pink-600)", niche: "Grooming", followers: "98K", er: "8.1%", revenue: "₹5.1L" },
];

function Th({ children, right = false }: { children: ReactNode; right?: boolean }) {
  return <th style={right ? thRight : th}>{children}</th>;
}

export default function Dashboard() {
  const { showToast } = useToast();

  return (
    <div style={{ padding: "18px 28px 44px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <PageHeader
          breadcrumb="SwayKin AI · Dashboard"
          title="Dashboard"
          subtitle="Here's how your campaigns are performing."
          actions={
            <>
              <Button variant="secondary" icon={<Icon name="ph-export" size={14} />} onClick={() => showToast("Exporting dashboard as PDF…")}>
                Export
              </Button>
              <Button variant="primary" icon={<Icon name="ph-plus" weight="bold" size={14} />} onClick={() => showToast("Campaign draft created…")}>
                New Campaign
              </Button>
            </>
          }
        />

        {/* KPI strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {kpis.map((k) => (
            <Card key={k.label} padding={16}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: k.tint,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Icon name={k.icon} weight="fill" size={14} color={k.color} />
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--sk-text)", letterSpacing: "-0.02em", marginBottom: 3 }}>
                {k.value}
              </div>
              <div style={{ fontSize: 12, color: "var(--sk-text-tertiary)" }}>{k.label}</div>
            </Card>
          ))}
        </div>

        {/* Campaigns + deliverables */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, alignItems: "start" }}>
          <Card padding={0}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 10px" }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--sk-text)", margin: 0 }}>Active campaigns</h2>
              <a href="#" style={{ fontSize: 12, fontWeight: 600, color: "var(--sk-link)" }}>
                View all
              </a>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Campaign</Th>
                  <th style={{ ...th, padding: "8px 12px" }}>Status</th>
                  <th style={{ ...thRight, padding: "8px 12px" }}>Spend</th>
                  <th style={{ ...thRight, padding: "8px 12px" }}>ROI</th>
                  <Th right>Creators</Th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.name} className="sk-row-hover" style={{ cursor: "pointer" }}>
                    <td style={{ ...td, fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid var(--sk-border)" }}>
                      <Badge bg={c.statusBg} color={c.statusColor}>
                        {c.status}
                      </Badge>
                    </td>
                    <td style={{ ...tdRight, padding: "12px" }}>{c.spend}</td>
                    <td style={{ ...tdRight, padding: "12px", fontWeight: 700, color: "var(--green-700)" }}>{c.roi}</td>
                    <td style={tdRight}>{c.creators}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card padding={"16px 18px"}>
            <SectionHeader title="Upcoming deliverables" />
            {deliverables.map((d) => (
              <div
                key={d.title}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid var(--sk-border)" }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.dotColor, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "var(--sk-text)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {d.title}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--sk-text-tertiary)" }}>{d.creator}</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--sk-text-tertiary)", flexShrink: 0 }}>{d.due}</div>
              </div>
            ))}
          </Card>
        </div>

        {/* Content mix + comparison */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
          <Card padding={"18px 20px"}>
            <SectionHeader title="Content mix" />
            {contentMix.map((m) => (
              <div key={m.label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
                  <span style={{ color: "var(--sk-text)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name={m.icon} weight="fill" size={13} color={m.color} />
                    {m.label}
                  </span>
                  <span style={{ color: "var(--sk-text-secondary)", fontWeight: 700 }}>{m.pct}%</span>
                </div>
                <div style={{ height: 7, borderRadius: 4, background: "var(--sk-surface-sunken)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${m.pct}%`, background: m.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </Card>

          <Card padding={"18px 20px"}>
            <SectionHeader title="Campaign comparison" />
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ ...th, padding: "6px 0" }}>Campaign</th>
                  <th style={{ ...thRight, padding: "6px 8px" }}>Eng. rate</th>
                  <th style={{ ...thRight, padding: "6px 8px" }}>CPM</th>
                  <th style={{ ...thRight, padding: "6px 0" }}>ROI</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((r) => (
                  <tr key={r.name} className="sk-row-hover">
                    <td style={{ padding: "9px 0", borderBottom: "1px solid var(--sk-border)", fontSize: 12, fontWeight: 600, color: "var(--sk-text)" }}>
                      {r.name}
                    </td>
                    <td style={{ padding: "9px 8px", borderBottom: "1px solid var(--sk-border)", fontSize: 12, color: "var(--sk-text-secondary)", textAlign: "right" }}>
                      {r.er}
                    </td>
                    <td style={{ padding: "9px 8px", borderBottom: "1px solid var(--sk-border)", fontSize: 12, color: "var(--sk-text-secondary)", textAlign: "right" }}>
                      {r.cpm}
                    </td>
                    <td style={{ padding: "9px 0", borderBottom: "1px solid var(--sk-border)", fontSize: 12, fontWeight: 700, color: "var(--green-700)", textAlign: "right" }}>
                      {r.roi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Top performing creators */}
        <Card padding={0} style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 10px" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--sk-text)", margin: 0 }}>Top performing creators</h2>
            <a href="#" style={{ fontSize: 12, fontWeight: 600, color: "var(--sk-link)" }}>
              Discovery
            </a>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>Creator</Th>
                <th style={{ ...thRight, padding: "8px 12px" }}>Followers</th>
                <th style={{ ...thRight, padding: "8px 12px" }}>Engagement</th>
                <Th right>Revenue driven</Th>
              </tr>
            </thead>
            <tbody>
              {topCreators.map((c) => (
                <tr key={c.name} className="sk-row-hover" style={{ cursor: "pointer" }}>
                  <td style={td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar initials={c.initials} bg={c.avatarBg} size={34} fontSize={12} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--sk-text)" }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: "var(--sk-text-tertiary)" }}>{c.niche}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...tdRight, padding: "12px" }}>{c.followers}</td>
                  <td style={{ ...tdRight, padding: "12px", fontWeight: 600, color: "var(--sk-text)" }}>{c.er}</td>
                  <td style={{ ...tdRight, fontWeight: 700, color: "var(--green-700)" }}>{c.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

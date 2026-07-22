"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

type NavItem = { key: string; label: string; icon: string; href: string; match: (p: string) => boolean };

const NAV: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: "ph-squares-four", href: "/", match: (p) => p === "/" },
  { key: "discovery", label: "Discovery", icon: "ph-magnifying-glass", href: "/discovery", match: (p) => p.startsWith("/discovery") || p.startsWith("/profile") },
  { key: "saved", label: "Saved Influencers", icon: "ph-bookmark-simple", href: "/saved", match: (p) => p.startsWith("/saved") },
  { key: "campaigns", label: "Campaigns", icon: "ph-flag", href: "/campaigns", match: (p) => p.startsWith("/campaigns") },
  { key: "competitive", label: "Competitors", icon: "ph-scales", href: "/competitors", match: (p) => p.startsWith("/competitors") },
  { key: "gmail", label: "Outreach", icon: "ph-envelope-simple", href: "/outreach", match: (p) => p.startsWith("/outreach") },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        width: 248,
        minWidth: 248,
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        background: "var(--sk-sidebar-bg)",
        borderRight: "1px solid var(--sk-sidebar-border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2" style={{ padding: "16px 20px 10px" }}>
        <div
          className="flex items-center justify-center"
          style={{ width: 18, height: 18, borderRadius: 5, background: "var(--sk-accent)", flexShrink: 0 }}
        >
          <Icon name="ph-sparkle" weight="fill" size={11} color="#fff" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 13, color: "var(--sk-text)", letterSpacing: "-0.01em" }}>
          SwayKin AI
        </span>
      </div>

      {/* Workspace card (static) */}
      <div
        className="flex items-center gap-[9px]"
        style={{
          margin: "0 12px 10px",
          padding: "8px 10px",
          borderRadius: 10,
          background: "var(--sk-surface-sunken)",
          border: "1px solid var(--sk-border)",
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{ width: 28, height: 28, borderRadius: 8, background: "var(--sk-accent)", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}
        >
          NB
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--sk-text)", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Nova Beauty Co.
          </div>
          <div style={{ fontSize: 10.5, color: "var(--sk-text-tertiary)", lineHeight: 1.3 }}>
            D2C Brand · 1 workspace
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 10px 10px" }}>
        {NAV.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.key}
              href={item.href}
              className="sk-nav-item"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 8,
                marginBottom: 2,
                fontSize: 13.5,
                fontWeight: active ? 700 : 600,
                textDecoration: "none",
                color: active ? "var(--sk-sidebar-text-active)" : "var(--sk-text)",
                background: active ? "var(--sk-sidebar-bg-active)" : "transparent",
              }}
            >
              <Icon
                name={item.icon}
                weight={active ? "fill" : "bold"}
                size={16.5}
                color={active ? "var(--sk-sidebar-text-active)" : "var(--sk-text-secondary)"}
                style={{ width: 16.5, flexShrink: 0 }}
              />
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.label}
              </span>
              {active && (
                <span
                  style={{ position: "absolute", left: 0, top: 6, bottom: 6, width: 2.5, borderRadius: 2, background: "var(--sk-accent)" }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Settings (static) */}
      <div style={{ borderTop: "1px solid var(--sk-sidebar-border)", padding: 10 }}>
        <a
          href="#"
          className="sk-nav-item"
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, fontSize: 13.5, fontWeight: 600, color: "var(--sk-text)" }}
        >
          <Icon name="ph-gear" weight="bold" size={16.5} color="var(--sk-text-secondary)" style={{ width: 16.5, flexShrink: 0 }} />
          <span style={{ flex: 1 }}>Settings</span>
        </a>
      </div>
    </nav>
  );
}

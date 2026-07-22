"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useOutsideClick } from "@/lib/useOutsideClick";

type Notification = { text: string; time: string; icon: string; iconColor: string; tint: string };

const NOTIFICATIONS: Notification[] = [
  { text: 'Priya Malhotra accepted your collaboration invite for "Monsoon Glow Launch".', time: "12m ago", icon: "ph-fill ph-check-circle", iconColor: "var(--green-700)", tint: "var(--green-50)" },
  { text: "Ananya Kapoor submitted her Reel for review.", time: "2h ago", icon: "ph-fill ph-film-strip", iconColor: "var(--sk-accent)", tint: "var(--sk-accent-subtle)" },
  { text: 'Campaign "Summer Skin Reset" has been marked as completed.', time: "5h ago", icon: "ph-fill ph-flag", iconColor: "var(--blue-600)", tint: "var(--blue-50)" },
];

export function AppTopBar() {
  const [open, setOpen] = useState<"notif" | "profile" | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useOutsideClick(notifRef, open === "notif", () => setOpen(null));
  useOutsideClick(profileRef, open === "profile", () => setOpen(null));

  const toggle = (which: "notif" | "profile") => setOpen((cur) => (cur === which ? null : which));

  return (
    <header
      className="flex items-center gap-[14px]"
      style={{
        height: 56,
        flexShrink: 0,
        padding: "0 20px",
        background: "var(--sk-surface)",
        borderBottom: "1px solid var(--sk-border)",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <div style={{ flex: 1 }} />

      {/* Credits chip */}
      <div
        className="flex items-center gap-[6px]"
        style={{ height: 32, padding: "0 10px", borderRadius: 8, border: "1px solid var(--sk-border)", background: "var(--sk-surface-sunken)" }}
      >
        <Icon name="ph-coin" weight="fill" size={14} color="var(--sk-accent-strong)" />
        <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--sk-text)" }}>1,240</span>
        <span style={{ fontSize: 11.5, color: "var(--sk-text-tertiary)" }}>credits</span>
      </div>

      {/* Notifications */}
      <div ref={notifRef} style={{ position: "relative" }}>
        <button
          onClick={() => toggle("notif")}
          aria-label="Notifications"
          className="flex items-center justify-center"
          style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--sk-border)", background: "var(--sk-surface)", color: "var(--sk-text-secondary)", cursor: "pointer", position: "relative" }}
        >
          <Icon name="ph-bell" size={15} />
          <span style={{ position: "absolute", top: 5, right: 6, width: 6, height: 6, borderRadius: "50%", background: "var(--red-600)" }} />
        </button>
        {open === "notif" && (
          <div
            style={{ position: "absolute", right: 0, top: 40, width: 320, background: "var(--sk-surface)", border: "1px solid var(--sk-border)", borderRadius: 12, boxShadow: "var(--sk-shadow-overlay)", padding: 8, zIndex: 30, animation: "sk-fade-in .15s ease" }}
          >
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--sk-text)", padding: "6px 8px 8px" }}>Notifications</div>
            {NOTIFICATIONS.map((n, i) => (
              <div key={i} className="flex gap-[10px]" style={{ padding: 8, borderRadius: 8 }}>
                <div className="flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 8, background: n.tint, flexShrink: 0 }}>
                  <Icon className={n.icon} size={13} color={n.iconColor} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: "var(--sk-text)", lineHeight: 1.4 }}>{n.text}</div>
                  <div style={{ fontSize: 11, color: "var(--sk-text-tertiary)", marginTop: 2 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ width: 1, height: 22, background: "var(--sk-border)" }} />

      {/* Profile */}
      <div ref={profileRef} style={{ position: "relative" }}>
        <button
          onClick={() => toggle("profile")}
          className="flex items-center gap-2"
          style={{ background: "transparent", border: "none", cursor: "pointer", padding: 2 }}
        >
          <div className="flex items-center justify-center" style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--sk-accent-strong)", color: "var(--sk-accent-on)", fontSize: 12, fontWeight: 700 }}>
            RA
          </div>
          <Icon name="ph-caret-down" size={11} color="var(--sk-text-tertiary)" />
        </button>
        {open === "profile" && (
          <div style={{ position: "absolute", right: 0, top: 40, width: 210, background: "var(--sk-surface)", border: "1px solid var(--sk-border)", borderRadius: 12, boxShadow: "var(--sk-shadow-overlay)", padding: 6, zIndex: 30, animation: "sk-fade-in .15s ease" }}>
            <div style={{ padding: "8px 10px" }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--sk-text)" }}>Riya Anand</div>
              <div style={{ fontSize: 11.5, color: "var(--sk-text-tertiary)" }}>riya@novabeauty.co</div>
            </div>
            <div style={{ height: 1, background: "var(--sk-border)", margin: "4px 0" }} />
            <MenuRow icon="ph-gear" label="Workspace settings" />
            <MenuRow icon="ph-users" label="Team members" />
            <div style={{ height: 1, background: "var(--sk-border)", margin: "4px 0" }} />
            <MenuRow icon="ph-sign-out" label="Sign out" danger />
          </div>
        )}
      </div>
    </header>
  );
}

function MenuRow({ icon, label, danger = false }: { icon: string; label: string; danger?: boolean }) {
  return (
    <div
      className="sk-row-hover flex items-center gap-2"
      style={{ padding: "7px 10px", borderRadius: 7, fontSize: 12.5, color: danger ? "var(--red-600)" : "var(--sk-text-secondary)", cursor: "pointer" }}
    >
      <Icon name={icon} size={14} />
      {label}
    </div>
  );
}

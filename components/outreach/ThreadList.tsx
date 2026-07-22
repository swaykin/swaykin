import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { statusFilters, type StatusFilter, type Thread } from "./data";

export function ThreadList({
  threads,
  statusFilter,
  onStatusFilterChange,
  selectedId,
  onSelect,
}: {
  threads: Thread[];
  statusFilter: StatusFilter;
  onStatusFilterChange: (f: StatusFilter) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const visible = statusFilter === "All" ? threads : threads.filter((t) => t.status === statusFilter);

  return (
    <div
      style={{
        width: 360,
        minWidth: 320,
        background: "#fff",
        borderRight: "1px solid #e3e3e3",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "10px 14px 8px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: "1px solid #e3e3e3",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#EAF1FB",
            borderRadius: 24,
            padding: "6px 14px",
          }}
        >
          <Icon name="ph-magnifying-glass" size={14} color="#5f6368" />
          <span style={{ fontSize: 13, color: "#5f6368" }}>Search outreach</span>
        </div>
      </div>

      <div
        style={{
          padding: "6px 14px 4px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexWrap: "wrap",
          borderBottom: "1px solid #f1f3f4",
        }}
      >
        {statusFilters.map((o) => {
          const active = o === statusFilter;
          return (
            <button
              key={o}
              onClick={() => onStatusFilterChange(o)}
              style={{
                height: 26,
                padding: "0 12px",
                borderRadius: 13,
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
                border: `1px solid ${active ? "var(--sk-accent)" : "var(--sk-border)"}`,
                background: active ? "var(--sk-accent-subtle)" : "var(--sk-surface)",
                color: active ? "var(--sk-accent-strong)" : "var(--sk-text-secondary)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {o}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {visible.map((t) => (
              <tr
                key={t.id}
                onClick={() => onSelect(t.id)}
                style={{ background: t.id === selectedId ? "#E8F0FE" : "#fff", cursor: "pointer" }}
                className="gm-row"
              >
                <td style={{ padding: "10px 12px 10px 14px", verticalAlign: "top", width: 44 }}>
                  <Avatar initials={t.initials} bg={t.avatarBg} size={36} fontSize={12} />
                </td>
                <td style={{ padding: "10px 14px 10px 0", verticalAlign: "top" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontSize: 13.5, color: t.unread ? "#202124" : "#444746", fontWeight: t.unread ? 700 : 400 }}>
                      {t.name}
                    </span>
                    <span style={{ fontSize: 11, color: "#5f6368", whiteSpace: "nowrap", marginLeft: 8 }}>
                      {t.lastActivity}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: t.unread ? "#202124" : "#444746",
                      fontWeight: t.unread ? 700 : 400,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginBottom: 2,
                      maxWidth: 240,
                    }}
                  >
                    {t.subject}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span
                      style={{
                        fontSize: 12,
                        color: "#5f6368",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 160,
                      }}
                    >
                      {t.preview}
                    </span>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: 5,
                        background: t.statusBg,
                        color: t.statusColor,
                        flexShrink: 0,
                        marginLeft: 6,
                      }}
                    >
                      {t.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

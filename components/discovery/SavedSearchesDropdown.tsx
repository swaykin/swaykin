import { Icon } from "@/components/ui/Icon";
import type { SavedSearch } from "./types";

export function SavedSearchesDropdown({
  open,
  onToggle,
  savedSearches,
  onApply,
  onDelete,
}: {
  open: boolean;
  onToggle: () => void;
  savedSearches: SavedSearch[];
  onApply: (sv: SavedSearch) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={onToggle}
        style={{
          height: 32,
          padding: "0 10px",
          borderRadius: 8,
          border: `1px solid ${open ? "var(--sk-accent)" : "transparent"}`,
          background: open ? "var(--sk-accent-subtle)" : "transparent",
          color: open ? "var(--sk-accent-strong)" : "var(--sk-text-tertiary)",
          fontSize: 11.5,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <Icon name="ph-bookmark-simple" size={13} />
        {savedSearches.length} saved searches
        <Icon name="ph-caret-down" size={9} />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 38,
            width: 260,
            background: "var(--sk-surface)",
            border: "1px solid var(--sk-border)",
            borderRadius: 12,
            boxShadow: "var(--sk-shadow-overlay)",
            padding: 6,
            zIndex: 30,
          }}
        >
          {savedSearches.map((sv) => (
            <div key={sv.id} style={{ display: "flex", alignItems: "center", gap: 4 }} className="sk-row-hover">
              <button
                onClick={() => onApply(sv)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 2,
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--sk-text)" }}>{sv.name}</span>
                <span style={{ fontSize: 11, color: "var(--sk-text-tertiary)" }}>{sv.desc}</span>
              </button>
              <button
                onClick={() => onDelete(sv.id)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 7,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name="ph-x" size={12} color="var(--sk-text-tertiary)" />
              </button>
            </div>
          ))}
          {savedSearches.length === 0 && (
            <div style={{ padding: "14px 10px", fontSize: 12, color: "var(--sk-text-tertiary)", textAlign: "center" }}>
              No saved searches yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}

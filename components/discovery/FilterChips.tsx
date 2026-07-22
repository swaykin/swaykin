import { Icon } from "@/components/ui/Icon";
import { FILTER_DEFS } from "./data";
import type { FilterKey, FilterState } from "./types";

export function FilterChips({
  filters,
  onToggle,
}: {
  filters: FilterState;
  onToggle: (key: FilterKey) => void;
}) {
  return (
    <>
      {FILTER_DEFS.map((f) => {
        const active = filters[f.key];
        return (
          <button
            key={f.key}
            onClick={() => onToggle(f.key)}
            style={{
              height: 32,
              padding: "0 12px",
              borderRadius: 9,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              border: `1px solid ${active ? "var(--sk-accent)" : "var(--sk-border)"}`,
              background: active ? "var(--sk-accent-subtle)" : "var(--sk-surface)",
              color: active ? "var(--sk-accent-strong)" : "var(--sk-text-secondary)",
            }}
          >
            <Icon name={f.icon} weight="bold" size={12.5} />
            {f.label}
            <Icon name="ph-caret-down" size={10} />
          </button>
        );
      })}
    </>
  );
}

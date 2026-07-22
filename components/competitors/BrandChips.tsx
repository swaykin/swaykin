import { Icon } from "@/components/ui/Icon";
import { BRANDS, type BrandKey } from "./data";

export function BrandChips({
  activeMap,
  onToggle,
  onAddBrand,
}: {
  activeMap: Record<BrandKey, boolean>;
  onToggle: (key: BrandKey) => void;
  onAddBrand: () => void;
}) {
  return (
    <div className="flex items-center flex-wrap gap-2" style={{ marginBottom: 0 }}>
      <span style={{ fontSize: 11.5, color: "var(--sk-text-tertiary)", marginRight: 2 }}>Comparing:</span>
      {BRANDS.map((b) => {
        const active = activeMap[b.key];
        return (
          <button
            key={b.key}
            onClick={() => onToggle(b.key)}
            className="flex items-center gap-2"
            style={{
              height: 32,
              padding: "0 12px",
              borderRadius: 9,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              border: `1px solid ${active ? b.color : "var(--sk-border)"}`,
              background: active ? b.tint : "var(--sk-surface)",
              color: active ? b.color : "var(--sk-text-tertiary)",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: b.color }} />
            {b.name}
          </button>
        );
      })}
      <button
        onClick={onAddBrand}
        className="flex items-center gap-1"
        style={{
          height: 32,
          padding: "0 12px",
          borderRadius: 9,
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          border: "1px dashed var(--sk-border-strong)",
          background: "transparent",
          color: "var(--sk-text-secondary)",
        }}
      >
        <Icon name="ph-plus" size={11} /> Add brand
      </button>
    </div>
  );
}

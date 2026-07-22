export function BulkSelectionBar({
  selectedCount,
  onAddToCampaign,
  onCompare,
  onClear,
}: {
  selectedCount: number;
  onAddToCampaign: () => void;
  onCompare: () => void;
  onClear: () => void;
}) {
  if (selectedCount === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "var(--sk-accent-subtle)",
        border: "1px solid var(--sk-accent-subtle-strong)",
        borderRadius: 12,
        padding: "10px 16px",
      }}
    >
      <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--sk-accent-strong)" }}>
        {selectedCount} selected
      </span>
      <div style={{ flex: 1 }} />
      <button
        onClick={onAddToCampaign}
        style={{
          height: 30,
          padding: "0 12px",
          borderRadius: 8,
          border: "none",
          background: "var(--sk-accent)",
          color: "var(--sk-accent-on)",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Add to campaign
      </button>
      <button
        onClick={onCompare}
        style={{
          height: 30,
          padding: "0 12px",
          borderRadius: 8,
          border: "1px solid var(--sk-accent-subtle-strong)",
          background: "transparent",
          color: "var(--sk-accent-strong)",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Compare
      </button>
      <button
        onClick={onClear}
        style={{
          height: 30,
          padding: "0 10px",
          borderRadius: 8,
          border: "none",
          background: "transparent",
          color: "var(--sk-text-tertiary)",
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        Clear
      </button>
    </div>
  );
}

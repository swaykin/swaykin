import { Icon } from "@/components/ui/Icon";
import { folders, labels } from "./data";

export function LeftRail({
  activeFolder,
  onFolderChange,
  onCompose,
}: {
  activeFolder: string;
  onFolderChange: (key: string) => void;
  onCompose: () => void;
}) {
  return (
    <div
      style={{
        width: 210,
        minWidth: 210,
        background: "#fff",
        borderRight: "1px solid #e3e3e3",
        display: "flex",
        flexDirection: "column",
        padding: "8px 0",
      }}
    >
      <div style={{ padding: "8px 12px 12px" }}>
        <button
          onClick={onCompose}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            height: 46,
            padding: "0 18px",
            borderRadius: 24,
            background: "#C2E7FF",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            color: "#001D35",
            boxShadow: "0 1px 3px rgba(0,0,0,.15)",
          }}
        >
          <Icon name="ph-pencil-simple" weight="bold" size={15} />
          <span>Compose</span>
        </button>
      </div>

      {folders.map((f) => {
        const active = f.key === activeFolder;
        return (
          <button
            key={f.key}
            onClick={() => onFolderChange(f.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              height: 34,
              padding: "0 16px",
              border: "none",
              cursor: "pointer",
              fontSize: 13.5,
              fontWeight: active ? 700 : 400,
              color: active ? "#041E49" : "#202124",
              background: active ? "#D3E3FD" : "transparent",
              borderRadius: "0 24px 24px 0",
              marginRight: 16,
              textAlign: "left",
            }}
          >
            <Icon name={f.icon} size={18} color={active ? "#041E49" : "#444746"} />
            <span style={{ flex: 1 }}>{f.label}</span>
            {f.count ? <span style={{ fontSize: 12, fontWeight: 700, color: "#444746" }}>{f.count}</span> : null}
          </button>
        );
      })}

      <div style={{ height: 1, background: "#e3e3e3", margin: "6px 0" }} />
      <div
        style={{
          padding: "4px 16px 4px",
          fontSize: 11,
          fontWeight: 700,
          color: "#5f6368",
          textTransform: "uppercase",
          letterSpacing: ".04em",
        }}
      >
        SwayKin Labels
      </div>
      {labels.map((l) => (
        <button
          key={l.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            height: 30,
            padding: "0 16px",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            color: "#202124",
            background: "transparent",
            borderRadius: "0 24px 24px 0",
            textAlign: "left",
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
          <span>{l.label}</span>
        </button>
      ))}

      <div style={{ flex: 1 }} />
      <div
        style={{
          padding: "10px 14px",
          borderTop: "1px solid #e3e3e3",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Icon name="ph-envelope-simple" weight="fill" size={16} color="#EA4335" />
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#202124" }}>hello@novabeautyco.com</div>
          <div
            style={{
              fontSize: 10.5,
              color: "var(--green-700)",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Icon name="ph-check-circle" weight="fill" size={11} />
            Connected
          </div>
        </div>
      </div>
    </div>
  );
}

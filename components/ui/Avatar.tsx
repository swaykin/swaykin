/** Circular initials avatar (design-time placeholder for real profile photos). */
export function Avatar({
  initials,
  bg,
  size = 40,
  ring = false,
  fontSize,
}: {
  initials: string;
  bg: string;
  size?: number;
  ring?: boolean;
  fontSize?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: fontSize ?? Math.round(size * 0.36),
        fontWeight: 700,
        flexShrink: 0,
        boxShadow: ring ? "0 0 0 2px var(--sk-surface), 0 0 0 4px var(--sk-accent)" : undefined,
      }}
    >
      {initials}
    </div>
  );
}

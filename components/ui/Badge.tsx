import type { ReactNode } from "react";

/** Status pill. Caller supplies bg + color (design-system status palette). */
export function Badge({
  children,
  bg,
  color,
}: {
  children: ReactNode;
  bg: string;
  color: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 8px",
        borderRadius: 7,
        fontSize: 11.5,
        fontWeight: 600,
        lineHeight: 1.2,
        background: bg,
        color,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

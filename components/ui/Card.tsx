import type { CSSProperties, ReactNode } from "react";

/** Resting surface card: 14px radius, 1px border, card shadow. */
export function Card({
  children,
  className = "",
  style,
  padding = 18,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  padding?: number | string;
}) {
  return (
    <div
      className={className}
      style={{
        background: "var(--sk-surface)",
        border: "1px solid var(--sk-border)",
        borderRadius: 14,
        boxShadow: "var(--sk-shadow-card)",
        padding: typeof padding === "number" ? `${padding}px` : padding,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** 14px/700 section header used inside cards. */
export function SectionHeader({
  title,
  action,
}: {
  title: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
      <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--sk-text)", margin: 0 }}>
        {title}
      </h2>
      {action}
    </div>
  );
}

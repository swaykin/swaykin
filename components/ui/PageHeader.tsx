import type { ReactNode } from "react";

/**
 * Per-page header: thin breadcrumb, then title + subtitle on the left with
 * right-aligned action buttons. Built inline on each page per the handoff.
 */
export function PageHeader({
  breadcrumb,
  title,
  subtitle,
  actions,
}: {
  breadcrumb: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div>
      <div style={{ fontSize: 11.5, color: "var(--sk-text-tertiary)", marginBottom: 8 }}>
        {breadcrumb}
      </div>
      <div className="flex items-start justify-between gap-4" style={{ flexWrap: "wrap" }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.015em", color: "var(--sk-text)", margin: 0 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: 13, color: "var(--sk-text-secondary)", margin: "4px 0 0" }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>{actions}</div>}
      </div>
    </div>
  );
}

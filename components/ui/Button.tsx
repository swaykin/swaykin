import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const BASE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  height: 38,
  padding: "0 14px",
  borderRadius: 9,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  whiteSpace: "nowrap",
  transition: "background .15s ease, box-shadow .15s ease, border-color .15s ease",
};

const VARIANTS: Record<Variant, React.CSSProperties> = {
  primary: {
    background: "var(--sk-accent)",
    color: "var(--sk-accent-on)",
    border: "1px solid var(--sk-accent)",
    boxShadow: "var(--sk-shadow-raised)",
  },
  secondary: {
    background: "var(--sk-surface)",
    color: "var(--sk-text)",
    border: "1px solid var(--sk-border-strong)",
  },
  ghost: {
    background: "transparent",
    color: "var(--sk-text-secondary)",
    border: "1px solid transparent",
  },
};

export function Button({
  variant = "secondary",
  icon,
  children,
  style,
  ...rest
}: {
  variant?: Variant;
  icon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button style={{ ...BASE, ...VARIANTS[variant], ...style }} {...rest}>
      {icon}
      {children}
    </button>
  );
}

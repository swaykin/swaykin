"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { Icon } from "./Icon";

type ToastContextValue = { showToast: (message: string) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 2400;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(msg);
    timerRef.current = setTimeout(() => setMessage(null), TOAST_DURATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 16px",
            borderRadius: 10,
            background: "#0f172a",
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
            boxShadow: "var(--sk-shadow-overlay)",
            zIndex: 100,
            animation: "sk-fade-in .15s ease",
          }}
        >
          <Icon name="ph-check-circle" weight="fill" size={16} color="#34d399" />
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

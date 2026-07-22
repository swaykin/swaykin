"use client";

import { useEffect, type RefObject } from "react";

/** Calls `onOutside` when a pointerdown lands outside `ref` (and while active). */
export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onOutside: () => void
) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, active, onOutside]);
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Detects when a sticky element is in its "docked" (stuck) state.
 * Returns true when the element's top has reached the sticky offset.
 */
export function useIsStickyDocked<T extends HTMLElement>(
  stickyTopPx: number
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [isDocked, setIsDocked] = useState(false);

  const check = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const tolerance = 2;
    const docked = rect.top <= stickyTopPx + tolerance;
    setIsDocked(docked);
  }, [stickyTopPx]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    check();
    const scrollTarget = document.scrollingElement ?? document.documentElement;
    scrollTarget.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(check)
        : null;
    if (observer) observer.observe(el);
    return () => {
      scrollTarget.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      observer?.disconnect();
    };
  }, [check]);

  return [ref, isDocked];
}

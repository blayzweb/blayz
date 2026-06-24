"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";
import { navSurfaceAtPoint, type NavSurface } from "@/lib/navSurface";

/**
 * Tracks the scrolling background surface beneath a fixed nav element,
 * sampling at its visual center as the user scrolls.
 */
export function useNavSurface(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
): NavSurface {
  const [surface, setSurface] = useState<NavSurface>("light");

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const next = navSurfaceAtPoint(x, y);

    setSurface((prev) => (prev === next ? prev : next));
  }, [ref]);

  useEffect(() => {
    if (!enabled) return;

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [enabled, measure]);

  return surface;
}

"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";
import { navSurfaceAtPoint } from "@/lib/navSurface";
import type { SidebarSurface } from "@/lib/sections";

function toSidebarSurface(surface: ReturnType<typeof navSurfaceAtPoint>): SidebarSurface {
  return surface === "dark" ? "dark" : "light";
}

/**
 * Tracks whether the fixed sidebar sits over a light or dark section background,
 * sampling at the nav's vertical center as the user scrolls.
 */
export function useSidebarSurface(
  navRef: RefObject<HTMLElement | null>,
  enabled: boolean,
): SidebarSurface {
  const [surface, setSurface] = useState<SidebarSurface>("light");

  const measure = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;

    const rect = nav.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const sampleY = rect.top + rect.height / 2;
    const next = toSidebarSurface(navSurfaceAtPoint(x, sampleY));

    setSurface((prev) => (prev === next ? prev : next));
  }, [navRef]);

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

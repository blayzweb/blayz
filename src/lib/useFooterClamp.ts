"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

interface FooterClampInsets {
  top: number;
  bottom: number;
}

/**
 * Returns fixed-position top/bottom insets so a sidebar rail stops above #footer.
 */
export function useFooterClamp(
  enabled: boolean,
  { headerOffset = 72, gap = 12 }: { headerOffset?: number; gap?: number } = {},
): FooterClampInsets {
  const [inset, setInset] = useState<FooterClampInsets>({
    top: headerOffset,
    bottom: 24,
  });

  useEffect(() => {
    if (!enabled) return;

    const update = () => {
      const footer = document.getElementById("footer");
      let bottom = 24;

      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        if (footerTop < window.innerHeight) {
          bottom = Math.max(24, window.innerHeight - footerTop + gap);
        }
      }

      setInset({ top: headerOffset, bottom });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [enabled, headerOffset, gap]);

  return inset;
}

/**
 * Keeps a compact sidebar vertically centered until the footer would overlap it,
 * then shifts up only as much as needed — no shrinking flex box re-centering.
 */
export function useSidebarTop(
  navRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  { headerOffset = 72, gap = 12 }: { headerOffset?: number; gap?: number } = {},
): number {
  const [top, setTop] = useState(headerOffset);

  const measure = useCallback(() => {
    const nav = navRef.current;
    const navHeight = nav?.offsetHeight ?? 0;
    const viewportH = window.innerHeight;

    if (navHeight === 0) return;

    const centeredTop = (viewportH - navHeight) / 2;
    let nextTop = centeredTop;

    const footer = document.getElementById("footer");
    if (footer) {
      const footerTop = footer.getBoundingClientRect().top;
      const maxTop = footerTop - gap - navHeight;
      if (nextTop > maxTop) nextTop = maxTop;
    }

    nextTop = Math.max(headerOffset, nextTop);
    setTop((prev) => (prev === nextTop ? prev : nextTop));
  }, [navRef, headerOffset, gap]);

  useEffect(() => {
    if (!enabled) return;

    measure();

    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });

    const nav = navRef.current;
    const resizeObserver =
      nav && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;
    if (nav && resizeObserver) resizeObserver.observe(nav);

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      resizeObserver?.disconnect();
    };
  }, [enabled, measure, navRef]);

  return top;
}

/** Scroll progress 0–1 for content above the footer. */
export function useContentScrollProgress(enabled: boolean): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const update = () => {
      const footer = document.getElementById("footer");
      const scrollEnd = footer
        ? footer.offsetTop
        : document.documentElement.scrollHeight;
      const max = scrollEnd - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [enabled]);

  return progress;
}

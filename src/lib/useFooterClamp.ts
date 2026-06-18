"use client";

import { useEffect, useState } from "react";

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

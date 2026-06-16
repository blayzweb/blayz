"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";
import { AsciiFlames } from "@/components/ui/AsciiFlames";

/**
 * Footer component (PRD §7.5). Hosts the closing </blayz> wordmark and the
 * ASCII fire animation, separate from the Contact section.
 */
export function Footer() {
  const reduced = useReducedMotion();

  return (
    <footer className="relative h-[24rem] overflow-hidden bg-blayz-ink">
      {/* ASCII flame fire effect */}
      <div className="pointer-events-none absolute inset-0">
        <AsciiFlames className="h-full w-full" />
      </div>

      {/* closing wordmark */}
      <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-16 text-center">
        <div className="relative flex flex-col items-center gap-3">
          {/* soft radial scrim wrapped around the brand so it always tracks
              the text and reads cleanly over the flames */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-44 w-[40rem] max-w-[94vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(26,26,26,0.72)_0%,rgba(26,26,26,0.4)_46%,transparent_78%)]" />
          <span
            className={`wordmark text-5xl text-blayz-cream sm:text-6xl ${
              reduced ? "" : "transition-colors hover:text-blayz-orange"
            }`}
            style={{ textShadow: "0 2px 24px rgba(26,26,26,0.92)" }}
          >
            &lt;/blayz&gt;
          </span>
          <p
            className="font-mono text-xs text-blayz-cream/55"
            style={{ textShadow: "0 1px 12px rgba(26,26,26,0.95)" }}
          >
            © {new Date().getFullYear()}{" "}Blayz — crafted with code &amp; culture
          </p>
        </div>
      </div>
    </footer>
  );
}

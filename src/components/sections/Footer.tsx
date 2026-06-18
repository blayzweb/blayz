"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { AsciiFlames } from "@/components/ui/AsciiFlames";
import { FooterLegalLinks } from "@/components/ui/footer-legal-links";
import { FooterSocialLinks } from "@/components/ui/footer-social-links";
import { LegalDocumentModal } from "@/components/legal/LegalDocumentModal";
import { legalDocuments } from "@/content/legal-documents";
import type { LegalDocumentId } from "@/content/legal-types";

/**
 * Footer component (PRD §7.5). Hosts the closing </blayz> wordmark and the
 * ASCII fire animation, separate from the Contact section.
 */
export function Footer() {
  const reduced = useReducedMotion();
  const [legalOpen, setLegalOpen] = useState<LegalDocumentId | null>(null);

  return (
    <footer id="footer" className="relative min-h-[16rem] overflow-hidden bg-blayz-ink sm:min-h-[18rem]">
      {/* ASCII flame fire effect */}
      <div className="pointer-events-none absolute inset-0">
        <AsciiFlames className="h-full w-full" />
      </div>

      {/* closing wordmark */}
      <div className="relative z-10 flex min-h-[16rem] flex-col items-center justify-end px-6 pb-10 text-center sm:min-h-[18rem] sm:pb-12">
        <div className="relative flex w-full max-w-2xl flex-col items-center gap-4">
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
          <FooterSocialLinks />
          <p
            className="font-mono text-xs text-blayz-cream/55"
            style={{ textShadow: "0 1px 12px rgba(26,26,26,0.95)" }}
          >
            © {new Date().getFullYear()}{" "}Blayz — crafted with code &amp; culture
          </p>
          <FooterLegalLinks onLegalOpen={setLegalOpen} />
        </div>
      </div>

      <AnimatePresence>
        {legalOpen ? (
          <LegalDocumentModal
            legal={legalDocuments[legalOpen]}
            onClose={() => setLegalOpen(null)}
          />
        ) : null}
      </AnimatePresence>
    </footer>
  );
}

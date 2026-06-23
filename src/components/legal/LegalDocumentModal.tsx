"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useSite } from "@/components/providers/SiteProvider";
import { LegalSectionBlock } from "@/components/legal/LegalSectionBlock";
import type { LegalDocument } from "@/content/legal-types";

export function LegalDocumentModal({
  legal,
  onClose,
}: {
  legal: LegalDocument;
  onClose: () => void;
}) {
  const { lockScroll } = useSite();
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [lockScroll, onClose]);

  if (!mounted) return null;

  const { sections } = legal;

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-blayz-ink/65 p-2 backdrop-blur-sm sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex h-[98dvh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-blayz-orange/25 bg-blayz-cream shadow-[0_32px_80px_-24px_rgba(255,56,0,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="pointer-events-none absolute -top-16 right-0 h-40 w-40 rounded-full bg-blayz-orange/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-10 left-0 h-32 w-32 rounded-full bg-blayz-peach/30 blur-3xl"
          aria-hidden
        />

        <div className="relative shrink-0 border-b border-blayz-orange/20 bg-blayz-cream-deep/40 px-6 py-5 sm:px-10">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:gap-8">
              <div>
                <p className="font-mono text-sm text-blayz-orange">
                  &lt; {legal.tag} /&gt;
                </p>
                <h2
                  id={titleId}
                  className="font-display text-2xl font-bold tracking-tight text-blayz-ink sm:text-3xl"
                >
                  {legal.title}
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-blayz-ink/70 sm:pb-0.5 sm:text-base">
                {legal.subtitle}{" "}
                <span className="font-sans font-bold text-blayz-orange">{legal.accent}</span>
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-blayz-orange/25 px-3 py-1.5 text-sm text-blayz-orange transition-colors hover:border-blayz-orange hover:bg-blayz-orange/10"
                aria-label={`Close ${legal.title.toLowerCase()}`}
              >
                Close
              </button>
              <p className="font-sans text-xs text-blayz-orange/70">
                last updated · {legal.lastUpdated}
              </p>
            </div>
          </div>
        </div>

        <div
          data-lenis-prevent
          className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5 sm:px-10 sm:py-6"
        >
          <article className="grid gap-x-12 lg:grid-cols-2">
            {sections.map((section, i) => (
              <LegalSectionBlock
                key={section.id}
                section={section}
                isLast={i === sections.length - 1}
              />
            ))}
          </article>

          <p className="mt-8 border-t border-blayz-orange/15 pt-6 text-sm text-blayz-ink/60">
            Questions?{" "}
            <a
              href="mailto:hello@blayz.studio"
              className="font-medium text-blayz-orange underline-offset-2 transition-colors hover:underline"
            >
              hello@blayz.studio
            </a>
          </p>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

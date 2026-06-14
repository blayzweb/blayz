"use client";

import { motion } from "framer-motion";
import { clsx } from "@/lib/clsx";
import { useReducedMotion } from "@/lib/useReducedMotion";
import {
  TatreezBorder,
  TatreezDiamondPattern,
  TatreezFloralPattern,
  TATREEZ_PALETTE,
  type PatternType,
} from "@/components/ui/tatreez-patterns";

export interface AnimatedPricingCardProps {
  /** Tier / plan name shown above the price. */
  heading: string;
  /** Large headline figure, e.g. "$4k" or "Let's talk". */
  price: string;
  /** Billing period / cadence under the price, e.g. "/ project". */
  period?: string;
  /** Short supporting copy. */
  description: string;
  /** Contact CTA destination (ignored when `onContact` is provided). */
  contactHref?: string;
  /** Label for the full-width contact button. */
  contactLabel?: string;
  /** Optional click handler — turns the CTA into a button instead of a link. */
  onContact?: () => void;
  /** Which embroidery motif set to weave into the card. */
  pattern?: PatternType;
  /** Emphasise this card (raised, accented). */
  featured?: boolean;
  className?: string;
}

/** Resolves the top/bottom band variants and large medallion for a pattern. */
function resolvePattern(pattern: PatternType) {
  switch (pattern) {
    case "floral":
      return {
        top: "floral" as const,
        bottom: "floral" as const,
        Medallion: TatreezFloralPattern,
      };
    case "mixed":
      return {
        top: "diamonds" as const,
        bottom: "floral" as const,
        Medallion: TatreezFloralPattern,
      };
    case "diamonds":
    default:
      return {
        top: "diamonds" as const,
        bottom: "diamonds" as const,
        Medallion: TatreezDiamondPattern,
      };
  }
}

/**
 * A premium pricing card themed as Levantine / Palestinian tatreez embroidery:
 * a stitched band across the top, a readable ivory content panel layered over a
 * large geometric medallion, a mirrored band near the bottom, and a full-width
 * contact CTA. Heading, price, period and description over woven cross-stitch.
 */
export function AnimatedPricingCard({
  heading,
  price,
  period,
  description,
  contactHref = "#contact",
  contactLabel = "Get in touch",
  onContact,
  pattern = "diamonds",
  featured = false,
  className,
}: AnimatedPricingCardProps) {
  const reduced = useReducedMotion();
  const { top, bottom, Medallion } = resolvePattern(pattern);
  const isMixed = pattern === "mixed";

  const ctaClasses = clsx(
    "group relative flex w-full items-center justify-center gap-3 overflow-hidden",
    "rounded-lg px-5 py-3.5 text-sm font-medium tracking-[0.18em] uppercase",
    "text-[#F4EFE7] transition-colors duration-300",
    "ring-1 ring-inset ring-[#C8B9A5]/30 focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-[#C8B9A5]",
  );

  const ctaInner = (
    <>
      {/* base + hover wash from deep red to oxblood */}
      <span
        aria-hidden
        className="absolute inset-0 bg-[#7A1118] transition-colors duration-300 group-hover:bg-[#4A090D]"
      />
      {/* corner stitches */}
      {[
        "left-1.5 top-1.5",
        "right-1.5 top-1.5",
        "left-1.5 bottom-1.5",
        "right-1.5 bottom-1.5",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={clsx("absolute size-1 bg-[#C8B9A5]/70", pos)}
        />
      ))}
      <span aria-hidden className="relative text-[#C8B9A5]">
        ✦
      </span>
      <span className="relative">{contactLabel}</span>
      <span aria-hidden className="relative text-[#C8B9A5]">
        ✦
      </span>
    </>
  );

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ backgroundColor: TATREEZ_PALETTE.ivory }}
      className={clsx(
        "relative flex w-full max-w-sm flex-col overflow-hidden rounded-2xl",
        "border",
        featured
          ? "border-[#7A1118] shadow-[0_40px_90px_-50px_rgba(122,17,24,0.65)]"
          : "border-[#4A090D]/25 shadow-[0_30px_70px_-50px_rgba(23,19,19,0.6)]",
        className,
      )}
    >
      {/* 1 — top embroidered band */}
      <TatreezBorder variant={top} height={26} />

      {/* 2 + 3 — content area layered over a large tatreez medallion */}
      <div className="relative flex-1 overflow-hidden px-7 pt-8 pb-7">
        {/* large geometric medallion, woven behind the copy */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-10 -bottom-8 select-none"
          initial={reduced ? false : { opacity: 0, scale: 0.94 }}
          whileInView={reduced ? undefined : { opacity: 0.16, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          style={reduced ? { opacity: 0.16 } : undefined}
        >
          <motion.div
            animate={reduced ? undefined : { y: [0, -6, 0] }}
            transition={
              reduced
                ? undefined
                : { duration: 9, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <Medallion className="h-64 w-64" />
          </motion.div>
        </motion.div>

        {/* secondary accent medallion for the "mixed" variant */}
        {isMixed && (
          <div
            aria-hidden
            className="pointer-events-none absolute -top-6 -left-8 select-none opacity-[0.10]"
          >
            <TatreezDiamondPattern className="h-32 w-32" />
          </div>
        )}

        {/* ivory masking gradient keeps the left-aligned copy fully legible */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#F4EFE7] via-[#F4EFE7]/85 to-transparent"
        />

        {/* readable content */}
        <div className="relative">
          <p className="text-xs font-medium tracking-[0.22em] text-[#7A1118] uppercase">
            {heading}
          </p>

          <div className="mt-3 flex items-end gap-2">
            <span className="text-5xl leading-none font-semibold tracking-tight text-[#171313]">
              {price}
            </span>
            {period && (
              <span className="pb-1 text-sm font-medium text-[#4A090D]/70">
                {period}
              </span>
            )}
          </div>

          {/* thin stitched rule under the price */}
          <span
            aria-hidden
            className="mt-5 flex h-2 w-20 items-center gap-1"
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className={clsx(
                  "size-1.5 rotate-45",
                  i % 2 === 0 ? "bg-[#7A1118]" : "bg-[#31496B]",
                )}
              />
            ))}
          </span>

          <p className="mt-5 max-w-[18rem] text-sm leading-relaxed text-[#171313]/75">
            {description}
          </p>
        </div>
      </div>

      {/* 4 — bottom embroidered band (mirror of the top) */}
      <TatreezBorder variant={bottom} height={26} flip />

      {/* 5 — full-width contact CTA */}
      <div className="p-5 pt-4">
        {onContact ? (
          <button type="button" onClick={onContact} className={ctaClasses}>
            {ctaInner}
          </button>
        ) : (
          <a href={contactHref} className={ctaClasses}>
            {ctaInner}
          </a>
        )}
      </div>
    </motion.article>
  );
}

export default AnimatedPricingCard;

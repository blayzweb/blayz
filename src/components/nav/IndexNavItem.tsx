"use client";

import { motion, type Transition } from "framer-motion";
import type { SectionMeta } from "@/lib/sections";
import { clsx } from "@/lib/clsx";

const spring: Transition = { type: "spring", stiffness: 220, damping: 26 };

interface IndexNavItemProps {
  section: SectionMeta;
  active?: boolean;
  variant: "hero" | "sidebar";
  layoutId: string;
  onClick: () => void;
  /** Stagger index for hero entrance only. */
  staggerIndex?: number;
  introDone?: boolean;
}

/**
 * One Index entry (PRD §6.4). Shared between the centered Hero list and the
 * docked sidebar so bracket notation, typography, and active treatment stay
 * consistent through the Stage B FLIP transition.
 */
export function IndexNavItem({
  section,
  active = false,
  variant,
  layoutId,
  onClick,
  staggerIndex = 0,
  introDone = true,
}: IndexNavItemProps) {
  const isHero = variant === "hero";

  return (
    <motion.button
      layoutId={layoutId}
      onClick={onClick}
      initial={isHero && !introDone ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        layout: spring,
        delay: isHero && !introDone ? 0.05 * staggerIndex : 0,
      }}
      aria-current={active ? "true" : undefined}
      className={clsx(
        "group text-left",
        isHero
          ? "flex items-baseline gap-3"
          : "flex w-[4.25rem] flex-col gap-0.5",
      )}
    >
      <span
        className={clsx(
          "font-mono tabular-nums transition-colors",
          isHero
            ? "text-sm text-blayz-orange"
            : clsx(
                "text-[11px] tracking-wide",
                active
                  ? "text-blayz-orange"
                  : "text-blayz-ink/35 group-hover:text-blayz-ink/55",
              ),
        )}
      >
        [ {section.index} ]
      </span>

      <span
        className={clsx(
          "transition-colors",
          isHero
            ? "font-display text-xl text-blayz-ink group-hover:text-blayz-orange sm:text-2xl"
            : clsx(
                "font-mono text-[11px] leading-tight tracking-tight",
                active
                  ? "text-blayz-orange"
                  : "text-blayz-ink/50 group-hover:text-blayz-ink",
              ),
        )}
      >
        {isHero || !active ? section.label : `[ ${section.label} ]`}
      </span>
    </motion.button>
  );
}

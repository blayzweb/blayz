"use client";

import { motion } from "framer-motion";
import type { SectionMeta } from "@/lib/sections";
import { clsx } from "@/lib/clsx";
import { navDockTransition } from "@/lib/nav-motion";

interface IndexNavItemProps {
  section: SectionMeta;
  active?: boolean;
  variant: "hero" | "sidebar";
  layoutId: string;
  onClick: () => void;
  staggerIndex?: number;
  introDone?: boolean;
}

/**
 * One Index entry (PRD §6.4). Shared between Hero and docked sidebar
 * via layoutId for the Stage B FLIP transition.
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
      layout
      layoutId={layoutId}
      onClick={onClick}
      initial={isHero && !introDone ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        layout: navDockTransition,
        opacity: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        y: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        delay: isHero && !introDone ? 0.05 * staggerIndex : 0,
      }}
      aria-current={active ? "true" : undefined}
      className={clsx(
        "group text-left",
        isHero
          ? "flex items-baseline gap-3"
          : "relative flex w-[4.25rem] flex-col gap-0.5",
      )}
    >
      {!isHero && active && (
        <motion.span
          layoutId="sidebar-active-marker"
          className="pointer-events-none absolute -left-4 top-1/2 h-6 w-px -translate-y-1/2 bg-blayz-orange/80"
          transition={navDockTransition}
        />
      )}

      <motion.span
        layout="position"
        className={clsx(
          "font-mono tabular-nums transition-colors duration-300 ease-out",
          isHero
            ? "text-sm text-blayz-orange"
            : active
              ? "text-blayz-orange"
              : "text-blayz-ink/35 group-hover:text-blayz-ink/55",
        )}
      >
        [ {section.index} ]
      </motion.span>

      <span className="relative font-mono text-[11px] leading-tight tracking-tight sm:text-inherit">
        {!isHero && (
          <>
            <motion.span
              className={clsx(
                "block",
                !active && "font-mono text-[11px] text-blayz-ink/50 group-hover:text-blayz-ink",
              )}
              animate={{ opacity: active ? 0 : 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              aria-hidden={active}
            >
              {section.label}
            </motion.span>
            <motion.span
              className="absolute inset-0 text-blayz-orange"
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              aria-hidden={!active}
            >
              [ {section.label} ]
            </motion.span>
          </>
        )}
        {isHero && (
          <span className="font-display text-xl text-blayz-ink transition-colors duration-300 ease-out group-hover:text-blayz-orange sm:text-2xl">
            {section.label}
          </span>
        )}
      </span>
    </motion.button>
  );
}

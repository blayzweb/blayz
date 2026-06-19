"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSite } from "@/components/providers/SiteProvider";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { navFadeTransition } from "@/lib/nav-motion";

interface ScrollIndicatorProps {
  /** Wait until hero assets are ready before showing. */
  ready?: boolean;
}

const CHEVRON = "M6 4 L24 20 L42 4";

/**
 * Bottom-of-hero scroll cue. Visible at the top of the page, hides on scroll,
 * and returns when the user scrolls back to the beginning.
 */
export function ScrollIndicator({ ready = true }: ScrollIndicatorProps) {
  const { introDone, atHeroStart } = useSite();
  const reduced = useReducedMotion();
  const visible = introDone && ready && atHeroStart;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={navFadeTransition}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex justify-center sm:bottom-12"
        >
          <motion.svg
            width="56"
            height="56"
            viewBox="0 0 48 48"
            fill="none"
            className="drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]"
            animate={reduced ? undefined : { y: [0, 3, 0] }}
            transition={
              reduced
                ? undefined
                : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <motion.path
              d={CHEVRON}
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={
                reduced ? { opacity: 1 } : { opacity: [0.85, 0.5, 0.85] }
              }
              transition={
                reduced
                  ? undefined
                  : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
              }
            />
            <motion.path
              d="M6 22 L24 38 L42 22"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={
                reduced ? { opacity: 0.5 } : { opacity: [0.45, 0.8, 0.45] }
              }
              transition={
                reduced
                  ? undefined
                  : {
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.25,
                    }
              }
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

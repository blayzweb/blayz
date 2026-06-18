import type { Transition } from "framer-motion";

/** Shared layout transition for Index + logo Stage B dock (PRD §6.2). */
export const navDockTransition: Transition = {
  type: "spring",
  stiffness: 128,
  damping: 34,
  mass: 0.85,
};

/** Fade for nav chrome — no competing motion with layoutId FLIP. */
export const navFadeTransition: Transition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1],
};

export const INTRO_FAILSAFE_MS = 8000;
/** Seconds the logo sits still before the zoom-through begins. */
export const INTRO_HOLD_BEFORE_ZOOM_S = 1.5;

const INTRO_ACTIVE_CLASS = "intro-active";

export function setIntroPageBackground(active: boolean) {
  document.documentElement.classList.toggle(INTRO_ACTIVE_CLASS, active);
}

export function lockPageScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
  document.body.style.overflow = locked ? "hidden" : "";
  document.body.style.touchAction = locked ? "none" : "";
}

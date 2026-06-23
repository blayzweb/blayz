export const INTRO_FAILSAFE_MS = 8000;

export function lockPageScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
  document.body.style.overflow = locked ? "hidden" : "";
  document.body.style.touchAction = locked ? "none" : "";
}

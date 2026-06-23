export const INTRO_FAILSAFE_MS = 8000;

export function lockPageScroll(locked: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.style.overflow = locked ? "hidden" : "";
  document.body.style.overflow = locked ? "hidden" : "";
  document.body.style.touchAction = locked ? "none" : "";
}

import { LOGO_PATH } from "./logoPath";

/** Wordmark-only mask layer (used with mask-composite exclude on the backdrop). */
export const INTRO_LOGO_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1448 724"><path fill="white" d="${LOGO_PATH}"/></svg>`,
)}")`;

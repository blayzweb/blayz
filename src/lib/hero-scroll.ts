/** Total hero section height in viewport units (drives pin scroll distance). */
export const HERO_HEIGHT_VH = 350;

/** Pixel scroll distance before the hero unpins. */
export function heroScrollEndPx(viewportHeight: number): number {
  return viewportHeight * ((HERO_HEIGHT_VH - 100) / 100);
}

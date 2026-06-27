/** PDF-safe font families (built into @react-pdf/renderer). */
export const PDF_FONTS = {
  regular: "Helvetica",
  bold: "Helvetica-Bold",
} as const;

/** No custom font registration — variable WOFF2 fonts fail silently in react-pdf. */
export function registerProposalFonts(): typeof PDF_FONTS {
  return PDF_FONTS;
}

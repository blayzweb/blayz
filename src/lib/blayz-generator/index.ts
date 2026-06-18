import type { SectionId } from "@/lib/sections";
import { generateShapes } from "./engine";
import { createGeneratorState } from "./presets";
import type { DrawableShape, GeneratorState } from "./types";

export { generateShapes, generateSVG } from "./engine";
export { createGeneratorState, DEFAULT_STATE, PRESETS } from "./presets";
export type {
  DrawableShape,
  GeneratorPresetName,
  GeneratorState,
  PetalStyle,
} from "./types";

const SPINE_W = 72;
/** Default band height — each flex band stretches via SVG preserveAspectRatio. */
const SPINE_BAND_H = 140;
const GLYPH_SIZE = 28;

export const SPINE_DIMENSIONS = { width: SPINE_W, bandHeight: SPINE_BAND_H };

/** Spine segment configs derived from generator presets (PRD §6.5). */
export function spineStateFor(
  section: SectionId,
  width = SPINE_W,
  height = SPINE_BAND_H,
): GeneratorState {
  switch (section) {
    case "hero":
      return createGeneratorState("medallion", {
        canvasWidth: width,
        canvasHeight: height,
        colorBg: "transparent",
        borderEnable: false,
        ornamentEnable: true,
        ornamentSymmetry: 6,
        ornamentScale: 30,
        ornamentGridEnable: true,
        layer1Enable: true,
        layer1Style: "floral",
        layer1Scale: 55,
        layer2Enable: true,
        layer2Style: "arabesque",
        layer2Scale: 85,
        layer2Double: true,
        layer3Enable: false,
        particlesEnable: false,
      });
    case "about":
      return createGeneratorState("medallion", {
        canvasWidth: width,
        canvasHeight: height,
        colorBg: "transparent",
        borderEnable: false,
        ornamentEnable: true,
        ornamentSymmetry: 6,
        ornamentScale: 34,
        ornamentGridEnable: true,
        layer1Enable: true,
        layer1Style: "floral",
        layer1Scale: 50,
        layer2Enable: true,
        layer2Style: "arabesque",
        layer2Scale: 90,
        layer2Double: true,
        layer3Enable: true,
        layer3Style: "geometric",
        layer3Scale: 115,
        layer3Rotate: 30,
        particlesEnable: true,
        particlesDist: 38,
      });
    case "services":
      return createGeneratorState("terminal-frame", {
        canvasWidth: width,
        canvasHeight: height,
        colorBg: "transparent",
        borderPadding: 6,
        cornerSize: 14,
        borderStroke: 1,
        doubleOffset: 8,
        ornamentEnable: false,
      });
    case "pricing":
      return createGeneratorState("divider", {
        canvasWidth: width,
        canvasHeight: height,
        colorBg: "transparent",
        borderPadding: 4,
        borderStyle: "ornamental",
        cornerSize: 12,
        borderStroke: 1,
        colorPrimary: "#E2C07A",
      });
    case "contact":
      return createGeneratorState("medallion", {
        canvasWidth: width,
        canvasHeight: height,
        colorBg: "transparent",
        borderEnable: true,
        borderPadding: 8,
        cornerStyle: "diamond-open",
        cornerSize: 10,
        borderStroke: 1,
        ornamentEnable: true,
        ornamentSymmetry: 6,
        ornamentScale: 28,
        layer1Enable: true,
        layer1Style: "geometric",
        layer1Scale: 45,
        layer2Enable: true,
        layer2Style: "arabesque",
        layer2Scale: 75,
        layer2Double: true,
        layer3Enable: true,
        layer3Style: "floral",
        layer3Scale: 100,
        layer3Rotate: 15,
        particlesEnable: true,
        particlesDist: 34,
      });
  }
}

export function glyphStateFor(section: SectionId): GeneratorState {
  const size = GLYPH_SIZE;
  switch (section) {
    case "hero":
      return createGeneratorState("component-box", {
        canvasWidth: size,
        canvasHeight: size,
        colorBg: "transparent",
        borderPadding: 2,
        borderStroke: 1,
        cornerSize: 6,
        ornamentEnable: true,
        ornamentSymmetry: 4,
        ornamentScale: 10,
        layer1Enable: true,
        layer1Style: "minimalist",
        layer1Scale: 70,
        layer2Enable: false,
        layer3Enable: false,
        particlesEnable: false,
        sideNodesEnable: false,
        doubleSidesEnable: false,
      });
    case "about":
      return createGeneratorState("medallion", {
        canvasWidth: size,
        canvasHeight: size,
        colorBg: "transparent",
        borderEnable: false,
        ornamentEnable: true,
        ornamentSymmetry: 6,
        ornamentScale: 11,
        ornamentGridEnable: false,
        layer1Enable: true,
        layer1Scale: 50,
        layer2Enable: true,
        layer2Scale: 85,
        layer2Double: true,
        layer3Enable: false,
        particlesEnable: false,
      });
    case "services":
      return createGeneratorState("terminal-frame", {
        canvasWidth: size,
        canvasHeight: size,
        colorBg: "transparent",
        borderPadding: 2,
        borderStroke: 0.9,
        cornerSize: 5,
        doubleOffset: 4,
        sideNodesEnable: false,
        ornamentEnable: false,
        colorPrimary: "#FFB69A",
      });
    case "pricing":
      return createGeneratorState("divider", {
        canvasWidth: size,
        canvasHeight: size,
        colorBg: "transparent",
        borderPadding: 1,
        borderStyle: "ornamental",
        cornerSize: 5,
        borderStroke: 0.9,
        sideNodesEnable: false,
        colorPrimary: "#E2C07A",
      });
    case "contact":
      return createGeneratorState("medallion", {
        canvasWidth: size,
        canvasHeight: size,
        colorBg: "transparent",
        borderEnable: false,
        ornamentEnable: true,
        ornamentSymmetry: 4,
        ornamentScale: 10,
        layer1Enable: true,
        layer1Style: "geometric",
        layer1Scale: 55,
        layer2Enable: true,
        layer2Style: "arabesque",
        layer2Scale: 80,
        layer2Double: true,
        layer3Enable: false,
        particlesEnable: true,
        particlesDist: 12,
      });
  }
}

export function spineShapesFor(
  section: SectionId,
  width = SPINE_W,
  height = SPINE_BAND_H,
): DrawableShape[] {
  return generateShapes(spineStateFor(section, width, height));
}

/** Closing band for the footer zone. */
export function footerSpineShapes(
  width = SPINE_W,
  height = SPINE_BAND_H,
): DrawableShape[] {
  return generateShapes(
    createGeneratorState("medallion", {
      canvasWidth: width,
      canvasHeight: height,
      colorBg: "transparent",
      borderEnable: false,
      ornamentEnable: true,
      ornamentSymmetry: 4,
      ornamentScale: height * 0.22,
      ornamentGridEnable: false,
      layer1Enable: true,
      layer1Style: "minimalist",
      layer1Scale: 55,
      layer2Enable: false,
      layer3Enable: false,
      particlesEnable: false,
      colorPrimary: "#FF3800",
    }),
  );
}

export function glyphShapesFor(section: SectionId): DrawableShape[] {
  return generateShapes(glyphStateFor(section));
}

/** Large medallion for About / Contact centerpieces. */
export function medallionState(size = 600): GeneratorState {
  return createGeneratorState("medallion", {
    canvasWidth: size,
    canvasHeight: size,
    colorBg: "transparent",
    borderEnable: false,
    ornamentEnable: true,
    ornamentSymmetry: 6,
    ornamentScale: size * 0.38,
    ornamentGridEnable: true,
    layer1Enable: true,
    layer1Style: "floral",
    layer1Scale: 45,
    layer2Enable: true,
    layer2Style: "arabesque",
    layer2Scale: 72,
    layer2Double: true,
    layer3Enable: true,
    layer3Style: "geometric",
    layer3Scale: 100,
    layer3Rotate: 30,
    particlesEnable: true,
    particlesDist: size * 0.24,
  });
}

export function medallionShapes(size = 600): DrawableShape[] {
  return generateShapes(medallionState(size));
}

export const GLYPH_DIMENSIONS = { size: GLYPH_SIZE };

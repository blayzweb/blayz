import {
  SECTIONS,
  SECTION_SIDEBAR_SURFACE,
  type SectionId,
  type SidebarSurface,
} from "@/lib/sections";

/** Surfaces that can sit behind fixed nav chrome. */
export type NavSurface = SidebarSurface | "pattern";

const NAV_SURFACE_VALUES = new Set<NavSurface>(["light", "dark", "pattern"]);

const FIXED_NAV_SELECTORS = "header, nav[aria-label='Sections']";

function isSectionId(id: string): id is SectionId {
  return SECTIONS.some((s) => s.id === id);
}

/**
 * Resolves the background surface at a viewport point, skipping fixed nav
 * chrome so the sample reads the scrolling content beneath.
 */
export function navSurfaceAtPoint(x: number, y: number): NavSurface {
  const stack = document.elementsFromPoint(x, y);

  for (const el of stack) {
    if (el.closest(FIXED_NAV_SELECTORS)) continue;

    const marked = el.closest("[data-nav-surface]");
    if (marked) {
      const value = marked.getAttribute("data-nav-surface");
      if (value && NAV_SURFACE_VALUES.has(value as NavSurface)) {
        return value as NavSurface;
      }
    }

    const section = el.closest<HTMLElement>("section[id]");
    if (section?.id && isSectionId(section.id)) {
      return SECTION_SIDEBAR_SURFACE[section.id];
    }
  }

  return "light";
}

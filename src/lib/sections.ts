export type SectionId =
  | "hero"
  | "about"
  | "services"
  | "pricing"
  | "contact";

/** Whether the section background behind the sidebar is light or dark. */
export type SidebarSurface = "light" | "dark";

export interface SectionMeta {
  id: SectionId;
  index: string; // "01" .. "05"
  label: string;
}

export const SECTIONS: SectionMeta[] = [
  { id: "hero", index: "01", label: "Hero" },
  { id: "about", index: "02", label: "About" },
  { id: "services", index: "03", label: "Services" },
  { id: "pricing", index: "04", label: "Pricing" },
  { id: "contact", index: "05", label: "Contact" },
];

export const SECTION_SIDEBAR_SURFACE: Record<SectionId, SidebarSurface> = {
  hero: "light",
  about: "light",
  services: "dark",
  pricing: "light",
  contact: "light",
};

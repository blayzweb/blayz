"use client";

import { SECTIONS } from "@/lib/sections";
import { useSite } from "@/components/providers/SiteProvider";
import { IndexNavItem } from "@/components/nav/IndexNavItem";

/**
 * The Index in its Hero state (PRD §6.4 / §7.1): centered list, larger type.
 * Each item shares `layoutId` with its SidebarIndex counterpart for the
 * Stage B dock animation.
 */
export function HeroIndex() {
  const { scrolled, introDone, scrollTo } = useSite();
  if (scrolled) return null;

  return (
    <nav
      aria-label="Sections"
      className="mx-auto grid w-fit grid-cols-2 gap-x-12 gap-y-4 sm:gap-x-20"
    >
      {SECTIONS.map((s, i) => (
        <IndexNavItem
          key={s.id}
          section={s}
          variant="hero"
          layoutId={`idx-${s.id}`}
          onClick={() => scrollTo(s.id)}
          staggerIndex={i}
          introDone={introDone}
        />
      ))}
    </nav>
  );
}

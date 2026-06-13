import { clsx } from "@/lib/clsx";

/**
 * Renders a brand ASCII tag like `< build />`, `{ rebrand }`, `[ design ]`
 * in JetBrains Mono (PRD §2.3 / §7.3).
 */
export function AsciiTag({
  children,
  className,
  as: Tag = "span",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "div";
}) {
  return (
    <Tag
      className={clsx(
        "font-mono text-sm tracking-tight whitespace-nowrap",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

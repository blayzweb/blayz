import { clsx } from "@/lib/clsx";

/**
 * Persistent terminal window chrome (PRD §7.3): border + corner glyphs from
 * §2.3, optional traffic-light dots in brand colours. Content inside uses
 * normal UI styling.
 */
export function TerminalFrame({
  title = "blayz@studio: ~/services",
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "relative rounded-xl border border-white/15 bg-blayz-ink-soft/60 backdrop-blur-sm",
        "shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <span className="flex gap-2" aria-hidden>
          <span className="size-3 rounded-full bg-blayz-orange" />
          <span className="size-3 rounded-full bg-blayz-gold" />
          <span className="size-3 rounded-full bg-blayz-sage" />
        </span>
        <span className="font-mono text-xs text-white/50">{title}</span>
      </div>

      {/* Corner glyphs */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-2 -left-2 font-mono text-white/30 select-none"
      >
        ┌
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute -top-2 -right-2 font-mono text-white/30 select-none"
      >
        ┐
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-2 -left-2 font-mono text-white/30 select-none"
      >
        └
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-2 -right-2 font-mono text-white/30 select-none"
      >
        ┘
      </span>

      <div className="p-5 sm:p-8">{children}</div>
    </div>
  );
}

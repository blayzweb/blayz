import Link from "next/link";

const legalLinks = [
  { title: "Licence", href: "#" },
  { title: "Privacy", href: "#" },
  { title: "Cookies", href: "#" },
] as const;

export function FooterLegalLinks({ className }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-4 sm:gap-5 ${className ?? ""}`}>
      {legalLinks.map((link) => (
        <Link
          key={link.title}
          href={link.href}
          className="block text-sm text-blayz-cream/55 transition-colors duration-150 hover:text-blayz-orange"
        >
          {link.title}
        </Link>
      ))}
    </div>
  );
}

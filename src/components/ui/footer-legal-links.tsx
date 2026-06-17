import type { LegalDocumentId } from "@/content/legal-types";

const legalLinks: { title: string; id: LegalDocumentId }[] = [
  { title: "Licence", id: "licence" },
  { title: "Privacy", id: "privacy" },
  { title: "Cookies", id: "cookies" },
];

export function FooterLegalLinks({
  className,
  onLegalOpen,
}: {
  className?: string;
  onLegalOpen: (id: LegalDocumentId) => void;
}) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-4 sm:gap-5 ${className ?? ""}`}>
      {legalLinks.map((link) => (
        <button
          key={link.id}
          type="button"
          onClick={() => onLegalOpen(link.id)}
          className="block text-sm text-blayz-cream/55 transition-colors duration-150 hover:text-blayz-orange"
        >
          {link.title}
        </button>
      ))}
    </div>
  );
}

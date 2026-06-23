import type { LegalSection as LegalSectionType } from "@/content/legal-types";

export function LegalSectionBlock({
  section,
  isLast,
}: {
  section: LegalSectionType;
  isLast?: boolean;
}) {
  return (
    <section
      className={`border-l-2 border-blayz-orange/50 py-4 pl-5 ${
        isLast ? "" : "border-b border-blayz-peach/35 lg:border-b-0"
      }`}
    >
      <p className="font-sans font-bold text-xs text-blayz-orange">[ {section.index} ]</p>
      <h3 className="mt-1 font-display text-lg font-bold text-blayz-ink">
        {section.title}
      </h3>

      <div className="mt-3 space-y-3">
        {section.paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="text-sm leading-relaxed text-blayz-ink/75 sm:text-base"
          >
            {paragraph}
          </p>
        ))}

        {section.bullets ? (
          <ul className="space-y-2.5">
            {section.bullets.map((item) => (
              <li
                key={item}
                className="flex gap-2.5 text-sm leading-relaxed text-blayz-ink/75 sm:text-base"
              >
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blayz-orange" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

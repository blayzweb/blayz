export type LegalSection = {
  id: string;
  index: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LegalDocumentId = "privacy" | "cookies" | "licence";

export type LegalDocument = {
  id: LegalDocumentId;
  tag: string;
  title: string;
  subtitle: string;
  accent: string;
  lastUpdated: string;
  sections: LegalSection[];
};

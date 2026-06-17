import type { LegalDocument, LegalDocumentId } from "@/content/legal-types";
import { cookiesMeta, cookiesSections } from "@/content/cookies";
import { licenceMeta, licenceSections } from "@/content/licence";
import { privacyMeta, privacySections } from "@/content/privacy";

export const legalDocuments: Record<LegalDocumentId, LegalDocument> = {
  privacy: {
    id: "privacy",
    tag: "privacy",
    ...privacyMeta,
    accent: "crafted with care",
    sections: privacySections,
  },
  cookies: {
    id: "cookies",
    tag: "cookies",
    ...cookiesMeta,
    sections: cookiesSections,
  },
  licence: {
    id: "licence",
    tag: "licence",
    ...licenceMeta,
    sections: licenceSections,
  },
};

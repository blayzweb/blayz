/** Readable charset — omits 0/O and 1/I to avoid confusion. */
const SUFFIX_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const PROPOSAL_ID_RE = /^B-\d{6}-[A-Z2-9]{6}$/;

/** Date segment of a proposal id, e.g. 260627. */
export function formatProposalDatePart(date = new Date()): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}${mm}${dd}`;
}

function randomSuffix(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(
    bytes,
    (b) => SUFFIX_ALPHABET[b % SUFFIX_ALPHABET.length],
  ).join("");
}

/** Unique proposal reference, e.g. B-260627-K7M4N2. */
export function createProposalId(date = new Date()): string {
  return `B-${formatProposalDatePart(date)}-${randomSuffix(6)}`;
}

export function isValidProposalId(id: string): boolean {
  return PROPOSAL_ID_RE.test(id);
}

/** Filename for a proposal download / email attachment. */
export function proposalFilename(proposalId: string): string {
  return `blayz-proposal-${proposalId}.pdf`;
}

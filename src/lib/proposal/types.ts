import type { TierId } from "@/content/pricing";

export interface ProposalInput {
  tierId: TierId;
  selectedAddons: string[];
  /** Unique reference printed on the PDF, e.g. B-260627-K7M4N2. */
  proposalId: string;
  clientName?: string;
  clientEmail?: string;
  proposalDate?: Date;
}

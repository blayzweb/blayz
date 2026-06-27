import { renderToBuffer } from "@react-pdf/renderer";
import { ProposalDocument } from "@/lib/proposal/ProposalDocument";
import { proposalFilename } from "@/lib/proposal/id";
import type { ProposalInput } from "@/lib/proposal/types";

export { proposalFilename };

/** Render the proposal PDF to a Node.js Buffer. */
export async function renderProposalPdf(input: ProposalInput): Promise<Buffer> {
  const buffer = await renderToBuffer(<ProposalDocument {...input} />);
  return Buffer.from(buffer);
}

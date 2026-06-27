import { NextResponse } from "next/server";
import type { TierId } from "@/content/pricing";
import { renderProposalPdf, proposalFilename } from "@/lib/proposal/generate";
import { createProposalId, isValidProposalId } from "@/lib/proposal/id";

export const runtime = "nodejs";

const VALID_TIERS = new Set<TierId>(["starter", "business", "premium"]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tierId = searchParams.get("tierId") as TierId | null;
  const addonsParam = searchParams.get("addons") ?? "";
  const name = searchParams.get("name")?.trim() || undefined;
  const email = searchParams.get("email")?.trim() || undefined;
  const proposalIdParam = searchParams.get("proposalId")?.trim();
  const proposalId =
    proposalIdParam && isValidProposalId(proposalIdParam)
      ? proposalIdParam
      : createProposalId();

  if (!tierId || !VALID_TIERS.has(tierId)) {
    return NextResponse.json({ error: "Invalid tier." }, { status: 400 });
  }

  const selectedAddons = addonsParam
    ? addonsParam.split(",").map((id) => id.trim()).filter(Boolean)
    : [];

  try {
    const pdf = await renderProposalPdf({
      tierId,
      selectedAddons,
      proposalId,
      clientName: name,
      clientEmail: email,
    });

    const filename = proposalFilename(proposalId, name);

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "X-Proposal-Id": proposalId,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[proposal] PDF generation failed:", err);
    return NextResponse.json(
      { error: "Could not generate proposal." },
      { status: 500 },
    );
  }
}

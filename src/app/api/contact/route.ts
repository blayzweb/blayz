import { NextResponse } from "next/server";
import { Resend } from "resend";
import type { TierId } from "@/content/pricing";
import { renderProposalPdf, proposalFilename } from "@/lib/proposal/generate";
import { createProposalId, isValidProposalId } from "@/lib/proposal/id";

export const runtime = "nodejs";

interface ContactPayload {
  name?: string;
  email?: string;
  projectType?: string;
  message?: string;
  tierId?: TierId;
  selectedAddons?: string[];
  proposalId?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_TIERS = new Set<TierId>(["starter", "business", "premium"]);

export async function POST(req: Request) {
  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const projectType = body.projectType?.trim() || "Unspecified";
  const message = body.message?.trim();
  const hasProposal =
    body.tierId &&
    VALID_TIERS.has(body.tierId) &&
    Array.isArray(body.selectedAddons);

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 },
    );
  }
  if (!message && !hasProposal) {
    return NextResponse.json(
      { error: "Please add a message." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Blayz <onboarding@resend.dev>";

  // Not configured yet: log and succeed so the UI works during development.
  if (!apiKey || !to) {
    console.warn(
      "[contact] RESEND_API_KEY / CONTACT_TO_EMAIL not set: skipping email delivery.",
      { name, email, projectType },
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(apiKey);

    let attachments:
      | { filename: string; content: Buffer }[]
      | undefined;

    if (hasProposal) {
      const proposalId =
        body.proposalId && isValidProposalId(body.proposalId)
          ? body.proposalId
          : createProposalId();

      try {
        const pdf = await renderProposalPdf({
          tierId: body.tierId!,
          selectedAddons: body.selectedAddons!,
          proposalId,
          clientName: name,
          clientEmail: email,
        });
        attachments = [
          {
            filename: proposalFilename(proposalId),
            content: pdf,
          },
        ];
      } catch (pdfErr) {
        console.error("[contact] Proposal PDF generation failed:", pdfErr);
      }
    }

    const bodyText = message
      ? message
      : hasProposal
        ? "(Build configuration attached as proposal PDF.)"
        : "";

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New project enquiry: ${name} (${projectType})`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Project type: ${projectType}`,
        "",
        bodyText,
      ].join("\n"),
      attachments,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json(
        { error: "Could not send your message. Please email us directly." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

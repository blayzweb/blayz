"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useSite } from "@/components/providers/SiteProvider";
import { bloomMedallion } from "@/lib/patterns";
import { createProposalId, proposalFilename } from "@/lib/proposal/id";

type Status = "idle" | "submitting" | "success" | "error";

const PROJECT_TYPES = [
  "New website",
  "Rebrand / website refresh",
  "Other",
];

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/blayzae/",
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
        />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/blayz-⠀-bb1b8b418",
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
        />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "#",
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
        />
      </svg>
    ),
  },
] as const;

function ProposalAttachment({
  filename,
  downloading,
  onDownload,
}: {
  filename: string;
  downloading: boolean;
  onDownload: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onDownload}
      disabled={downloading}
      aria-label={`Download ${filename}`}
      className="flex w-full items-center gap-3 rounded-lg border border-blayz-ink/12 bg-blayz-cream/70 px-3 py-2.5 text-left transition-colors hover:border-blayz-orange/35 hover:bg-blayz-orange/5 disabled:opacity-60"
    >
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-md bg-blayz-orange/10 text-blayz-orange"
      >
        <svg className="size-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
            fill="currentColor"
            fillOpacity={0.15}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M14 2v6h6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M8 13h8M8 16.5h5.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="min-w-0 flex-1 truncate font-sans text-sm font-medium text-blayz-ink">
        {filename}
      </span>
      <span className="shrink-0 font-sans text-xs font-bold text-blayz-orange">
        {downloading ? "generating…" : "download"}
      </span>
    </button>
  );
}

/**
 * Contact (PRD §7.5). Synthesis of every prior motif: arabesque watermark base,
 * terminal-framed form, process cards, and cultural accent — closing the page
 * before the footer </blayz> wordmark.
 */
export function Contact() {
  const reduced = useReducedMotion();
  const { quote } = useSite();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [projectType, setProjectType] = useState("");
  const [message, setMessage] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [proposalId, setProposalId] = useState<string | null>(null);

  const fadeUp = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5 },
      };

  // Prefill from a configurator build whenever a new quote arrives.
  useEffect(() => {
    if (!quote) {
      setProposalId(null);
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProjectType(quote.projectType === "Website" ? "New website" : quote.projectType);
    setMessage("");
    setStatus("idle");
    setProposalId(createProposalId());
  }, [quote]);

  const proposalAttachmentName =
    quote && proposalId ? proposalFilename(proposalId, clientName) : "";

  function proposalUrl() {
    if (!quote || !proposalId) return "";
    const params = new URLSearchParams({
      tierId: quote.tierId,
      addons: quote.selectedAddons.join(","),
      proposalId,
    });
    if (clientName.trim()) params.set("name", clientName.trim());
    if (clientEmail.trim()) params.set("email", clientEmail.trim());
    return `/api/proposal?${params.toString()}`;
  }

  async function downloadProposal() {
    if (!quote) return;
    setDownloading(true);
    try {
      const res = await fetch(proposalUrl());
      if (!res.ok) throw new Error("Could not generate proposal.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      const headerFilename = res.headers
        .get("Content-Disposition")
        ?.match(/filename="(.+)"/)?.[1];
      anchor.download =
        headerFilename || proposalAttachmentName || "blayz-proposal.pdf";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Could not download the proposal. Please try again.");
      setStatus("error");
    } finally {
      setDownloading(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          ...(quote && proposalId
            ? {
                tierId: quote.tierId,
                selectedAddons: quote.selectedAddons,
                proposalId,
              }
            : {}),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong.");
      }
      setStatus("success");
      form.reset();
      setProjectType("");
      setMessage("");
      setClientName("");
      setClientEmail("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gradient-to-b from-blayz-cream-deep via-blayz-cream to-blayz-cream px-6 md:px-28 lg:px-36 pt-32 pb-28 sm:pb-36"
    >
      <div className="arabesque-watermark pointer-events-none absolute inset-0 opacity-[0.07]" />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 -left-24 h-80 w-80 rounded-full bg-blayz-sky/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        <p className="mb-4 font-sans text-sm text-blayz-orange">[ 05 ] Contact</p>
        <h2 className="max-w-2xl font-display text-4xl leading-tight font-bold tracking-tight text-blayz-ink sm:text-5xl">
          Let&rsquo;s build something{" "}
          <span className="text-blayz-orange">crafted</span>.
        </h2>
        <p className="mt-6 mb-14 max-w-xl font-sans text-base leading-relaxed text-blayz-ink/65 sm:text-lg">
          Share a brief, a half-formed idea, or a full configurator build. We
          read every message and reply with something useful, not a template.
        </p>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <motion.div {...fadeUp}>
            <div className="overflow-hidden rounded-2xl border border-blayz-ink/10 bg-white/55 shadow-[0_32px_90px_-48px_rgba(26,26,26,0.45)] backdrop-blur-sm">
              <div className="flex items-center gap-3 border-b border-blayz-ink/8 bg-blayz-cream/70 px-5 py-3.5">
                <span className="flex gap-2" aria-hidden>
                  <span className="size-3 rounded-full bg-blayz-orange" />
                  <span className="size-3 rounded-full bg-blayz-gold" />
                  <span className="size-3 rounded-full bg-blayz-sage" />
                </span>
                <span className="font-mono text-xs text-blayz-ink/45">
                  blayz@studio: ~/contact
                </span>
              </div>

              <div className="p-7 sm:p-9">
                {status === "success" ? (
                  <div className="flex min-h-72 flex-col items-center justify-center gap-4 text-center">
                    <span className="grid size-12 place-items-center rounded-full bg-blayz-orange/10 font-sans text-blayz-orange">
                      ✓
                    </span>
                    <p className="font-sans text-sm text-blayz-orange">
                      message sent
                    </p>
                    <p className="max-w-sm font-display text-2xl leading-snug text-blayz-ink sm:text-3xl">
                      Thanks, we&rsquo;ll be in touch shortly.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-2 font-sans font-bold text-sm text-blayz-ink/60 transition-colors hover:text-blayz-orange"
                    >
                      <span className="text-blayz-orange/70">&lt;</span> send
                      another <span className="text-blayz-orange/70">/&gt;</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="flex flex-col gap-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="name" required>
                        <input
                          name="name"
                          required
                          autoComplete="name"
                          className={inputCls}
                          placeholder="Your name"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                        />
                      </Field>

                      <Field label="email" required>
                        <input
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          className={inputCls}
                          placeholder="you@studio.com"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                        />
                      </Field>
                    </div>

                    <Field label="project type">
                      <select
                        name="projectType"
                        className={inputCls}
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                      >
                        <option value="" disabled>
                          Select one…
                        </option>
                        {PROJECT_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label="message" required={!quote}>
                      <div className="flex flex-col gap-2">
                        {quote && proposalId && (
                          <ProposalAttachment
                            filename={proposalAttachmentName}
                            downloading={downloading}
                            onDownload={downloadProposal}
                          />
                        )}
                        <textarea
                          name="message"
                          required={!quote}
                          rows={quote ? 4 : 5}
                          className={`${inputCls} resize-none overflow-y-auto`}
                          data-lenis-prevent
                          placeholder={
                            quote
                              ? "Anything else we should know? (optional)"
                              : "Tell us about your project, including goals, timeline, and references…"
                          }
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </div>
                    </Field>

                    {status === "error" && (
                      <p className="font-sans font-semibold text-sm text-blayz-orange">
                        ! {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="mt-1 rounded-lg bg-blayz-orange py-3.5 font-sans font-bold text-base text-blayz-cream transition-colors hover:bg-blayz-ink disabled:opacity-60"
                    >
                      {status === "submitting" ? (
                        "sending…"
                      ) : (
                        <>
                          <span className="text-blayz-cream/60">&lt;</span> send
                          message{" "}
                          <span className="text-blayz-cream/60">/&gt;</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>

          <ContactAside reduced={reduced} fadeUp={fadeUp} />
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-lg border border-blayz-ink/12 bg-white/80 px-4 py-3.5 font-sans text-base text-blayz-ink outline-none transition-colors placeholder:text-blayz-ink/30 focus:border-blayz-orange";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-sans font-semibold text-xs text-blayz-ink/50">
        {label}
        {required && <span className="text-blayz-orange"> *</span>}
      </span>
      {children}
    </label>
  );
}

type FadeUpProps = {
  initial?: { opacity: number; y: number };
  whileInView?: { opacity: number; y: number };
  viewport?: { once: boolean; margin: string };
  transition?: { duration: number };
};

/** Sidebar as a single vertical thread — no stacked cards. */
function ContactAside({
  reduced,
  fadeUp,
}: {
  reduced: boolean;
  fadeUp: FadeUpProps;
}) {
  return (
    <motion.aside
      {...fadeUp}
      transition={{ duration: 0.5, delay: reduced ? 0 : 0.1 }}
      className="relative lg:sticky lg:top-28 lg:self-start"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-3 bottom-3 left-[9px] w-px bg-gradient-to-b from-blayz-orange/45 via-blayz-orange/12 to-blayz-orange/35"
      />

      <div className="flex flex-col gap-11 sm:gap-12">
        <ThreadBlock label="direct">
          <a
            href="mailto:blayzweb@gmail.com"
            className="mt-2 block font-display text-2xl leading-tight text-blayz-ink transition-colors hover:text-blayz-orange sm:text-[1.85rem]"
          >
            blayzweb@gmail.com
          </a>
          <p className="mt-2 max-w-xs font-sans text-sm leading-relaxed text-blayz-ink/55">
            Or use the form; configurator builds arrive with a proposal PDF
            attached.
          </p>
        </ThreadBlock>

        <ThreadBlock label="elsewhere">
          <nav
            aria-label="Social links"
            className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-2 font-sans text-sm font-bold"
          >
            {SOCIAL_LINKS.map((link, i) => (
              <span key={link.label} className="inline-flex items-center">
                {i > 0 && (
                  <span aria-hidden className="mx-2 text-blayz-ink/25">
                    ·
                  </span>
                )}
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blayz-ink/55 transition-colors hover:text-blayz-orange"
                >
                  <span className="text-blayz-orange/80">{link.icon}</span>
                  {link.label.toLowerCase()}
                </Link>
              </span>
            ))}
          </nav>
        </ThreadBlock>
      </div>

      <BloomMark className="pointer-events-none absolute -right-1 bottom-0 size-[4.75rem] opacity-85 sm:-right-3 sm:size-[5.5rem]" />
    </motion.aside>
  );
}

function ThreadBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative pl-9">
      <ThreadNode />
      <p className="font-sans font-bold text-xs tracking-wide text-blayz-orange/75 uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

function ThreadNode() {
  return (
    <span
      aria-hidden
      className="absolute top-0.5 left-0 grid size-[19px] place-items-center"
    >
      <span className="absolute size-[19px] rounded-full border border-blayz-orange/20 bg-blayz-cream/80" />
      <span className="relative size-1.5 rounded-full bg-blayz-orange" />
    </span>
  );
}

/** Compact static bloom — echoes the About medallion at contact-card scale. */
function BloomMark({ className }: { className?: string }) {
  const paths = useMemo(() => bloomMedallion(120, 3), []);

  return (
    <div className={className}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-blayz-peach/35 blur-xl"
      />
      <svg
        viewBox="0 0 120 120"
        className="relative h-full w-full"
        aria-hidden
      >
        {paths.map((p, i) => {
          const isGuide = p.layer === "guides";
          const isCore = p.layer === "core";
          let fill = "none";
          if (isCore) {
            fill = p.d.includes("7")
              ? "var(--blayz-cream)"
              : "var(--blayz-orange)";
          }

          return (
            <path
              key={i}
              d={p.d}
              transform={p.transform}
              fill={fill}
              stroke={
                isGuide
                  ? "var(--blayz-orange)"
                  : i % 2 === 0
                    ? "var(--blayz-orange)"
                    : "var(--blayz-peach)"
              }
              strokeWidth={isGuide ? 0.6 : 1}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={isGuide ? 0.22 : 0.9}
            />
          );
        })}
      </svg>
    </div>
  );
}

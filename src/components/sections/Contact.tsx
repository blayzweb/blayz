"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useSite } from "@/components/providers/SiteProvider";
type Status = "idle" | "submitting" | "success" | "error";

const PROJECT_TYPES = [
  "Brand / identity",
  "Website",
  "Web app",
  "Rebrand",
  "Other",
];

/**
 * Contact (PRD §7.5). Synthesis of every prior motif: arabesque watermark base,
 * ASCII-bordered form frame, Sadu footer band, and the closing </blayz> that
 * echoes the brand cover's <blayz> opening.
 */
export function Contact() {
  const reduced = useReducedMotion();
  const { quote } = useSite();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [projectType, setProjectType] = useState("");
  const [message, setMessage] = useState("");

  // Prefill from a configurator build whenever a new quote arrives.
  useEffect(() => {
    if (!quote) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProjectType(quote.projectType);
    setMessage(quote.message);
    setStatus("idle");
  }, [quote]);

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
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong.");
      }
      setStatus("success");
      form.reset();
      setProjectType("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-blayz-cream px-6 pt-32 pb-16"
    >
      {/* arabesque watermark base layer */}
      <div className="arabesque-watermark pointer-events-none absolute inset-0 opacity-[0.05]" />

      <div className="relative mx-auto max-w-5xl">
        <p className="mb-4 font-mono text-sm text-blayz-orange">
          [ 05 ] Contact
        </p>
        <h2 className="mb-12 max-w-2xl font-display text-4xl leading-tight font-bold tracking-tight text-blayz-ink sm:text-5xl">
          Let&rsquo;s build something{" "}
          <span className="text-blayz-orange">crafted</span>.
        </h2>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          {/* ASCII-bordered form frame */}
          <div className="relative rounded-xl border border-blayz-ink/15 bg-white/50 p-7 sm:p-9">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-3 -left-2 font-mono text-blayz-orange/50"
            >
              ◇
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute -right-2 -bottom-3 font-mono text-blayz-orange/50"
            >
              ◇
            </span>

            {status === "success" ? (
              <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
                <p className="font-mono text-sm text-blayz-orange">
                  ✓ message sent
                </p>
                <p className="font-display text-2xl text-blayz-ink">
                  Thanks — we&rsquo;ll be in touch shortly.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-2 font-mono text-sm text-blayz-ink/60 hover:text-blayz-orange"
                >
                  &lt; send another /&gt;
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-5">
                <Field label="name" required>
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    className={inputCls}
                    placeholder="Your name"
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
                  />
                </Field>

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

                <Field label="message" required>
                  <textarea
                    name="message"
                    required
                    rows={message ? 8 : 4}
                    className={`${inputCls} resize-none`}
                    placeholder="Tell us about your project…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Field>

                {status === "error" && (
                  <p className="font-mono text-sm text-blayz-orange">
                    ! {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-2 rounded-lg bg-blayz-orange py-3.5 font-mono text-sm text-blayz-cream transition-colors hover:bg-blayz-ink disabled:opacity-60"
                >
                  {status === "submitting"
                    ? "sending…"
                    : "< send message />"}
                </button>
              </form>
            )}
          </div>

          {/* Direct links */}
          <div className="flex flex-col justify-between gap-10">
            <div className="flex flex-col gap-5">
              <p className="font-mono text-xs text-blayz-ink/40">
                ┌ direct
              </p>
              <a
                href="mailto:hello@blayz.studio"
                className="font-display text-2xl text-blayz-ink transition-colors hover:text-blayz-orange"
              >
                hello@blayz.studio
              </a>
              <div className="flex gap-4 font-mono text-sm text-blayz-ink/60">
                <a href="#" className="hover:text-blayz-orange">
                  instagram
                </a>
                <a href="#" className="hover:text-blayz-orange">
                  twitter
                </a>
                <a href="#" className="hover:text-blayz-orange">
                  linkedin
                </a>
              </div>
            </div>

            <p className="font-kufi text-lg text-blayz-orange" dir="rtl">
              صُنع بالشغف
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-lg border border-blayz-ink/15 bg-white/70 px-4 py-3 font-sans text-blayz-ink outline-none transition-colors placeholder:text-blayz-ink/30 focus:border-blayz-orange";

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
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-xs text-blayz-ink/50">
        {label}
        {required && <span className="text-blayz-orange"> *</span>}
      </span>
      {children}
    </label>
  );
}

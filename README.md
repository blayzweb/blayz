# Blayz — Landing Page

A single continuous-scroll landing experience for the Blayz studio:
**Hero → About → Services → Pricing → Contact**, fusing Arabic geometric
ornament with code culture — _crafted with code & culture_.

Built to the spec in `blayz-landing-page-prd.md`.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 (brand tokens in `globals.css`) |
| Scroll-linked animation | GSAP + ScrollTrigger |
| Discrete UI transitions | Framer Motion (`layoutId` dock animation) |
| Smooth scroll | Lenis (bridged to ScrollTrigger) |
| Contact form | Next.js Route Handler + Resend |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Resend keys (optional for dev)
npm run dev                  # http://localhost:3000
```

`npm run build` for a production build, `npm run lint` for linting.

## What's implemented

- **Stage A intro** (`components/intro/`) — wordmark-masked flash sequence
  (craft → code → brand) using `background-clip: text`, with `prefers-reduced-motion`
  fallback and ink → cream handoff.
- **Stage B dock** (`components/nav/`) — the wordmark and Index FLIP from the
  centered Hero state to the header + left sidebar via Framer Motion `layoutId`.
- **The Spine** (`components/spine/`) — fixed right rail with per-section,
  scroll-scrubbed SVG segments (bloom → terminal → Sadu → synthesis).
- **Sections** (`components/sections/`) — Hero, About (scroll-drawn bloom
  medallion), Services (terminal boot sequence → grid morph), Pricing (Sadu
  bands), Contact (synthesis + working form).
- **Accessibility** — reduced-motion variants throughout; Spine/Sidebar hidden
  on mobile.

## ⚠️ Asset slots (to be replaced by hand-produced assets — PRD §8)

Everything visual currently uses **procedural placeholders** so the page works
end-to-end. Swap these for the real assets when ready:

| Placeholder | File | Replace with |
|---|---|---|
| Intro texture frames (tatreez, sketch, collage, halftone, ascii, arabesque) | `components/intro/frames.ts` | PNG @2x textures (`/public/intro/01-tatreez.png` …) |
| Bloom medallion + vine | `lib/patterns.ts` (`bloomMedallion`, `bloomVine`) | Generator SVG output |
| Sadu / terminal / synthesis segments | `lib/patterns.ts` | Generator SVG output (if extensible) or custom |
| Arabesque watermark | `globals.css` (`--watermark-src`) | Tiling SVG/PNG |
| `blayz` display font | `app/layout.tsx` (currently Space Grotesk) | Custom blayz font via `next/font/local` |
| Satoshi body font | `app/layout.tsx` (currently Manrope) | Satoshi via `next/font/local` |

## Open content decisions (PRD §12)

Reasonable defaults are in place; adjust copy/data in:
`content/services.ts`, `content/pricing.ts`, and the section components.

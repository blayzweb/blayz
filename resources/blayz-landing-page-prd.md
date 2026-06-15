# Blayz — Landing Page PRD
*Draft v0.1 — single-page scroll experience for handoff to coding agent*

---

## 1. Purpose & Scope

This document specifies the structure, navigation system, and animation behavior for the Blayz studio landing page: a single continuous scroll through five sections — **Hero → About Us → Services → Pricing → Contact**.

The site's core idea is the fusion already established in the brand guide: Arabic/Islamic geometric ornament (arabesque, Sadu, Tatreez) meeting ASCII/code culture — *"crafted with code & culture."* Every animation and layout decision below is chosen to make that fusion feel like one coherent journey rather than a set of disconnected effects.

This PRD is meant to be built in phases (Section 10). Wherever a visual asset is something Anas will hand-produce (textures, pattern variants), the spec calls it out explicitly as a **slot** rather than something the agent should generate.

---

## 2. Brand Foundation Reference

### 2.1 Color tokens

| Token | Hex | Brand role | Landing page role |
|---|---|---|---|
| `--blayz-orange` | `#FF3800` | Primary mark color | The *only* accent for CTAs, links, active nav state, hover states — constant across every section |
| `--blayz-peach` | `#FFB69A` | Accent | About Us secondary tone |
| `--blayz-cream` | `#FFF2E2` | Light background | Default page background (Hero, base) |
| `--blayz-sky` | `#DCE8F6` | Accent | Cool accent, sparingly |
| `--blayz-sage` | `#CBD6C1` | Accent | Muted accent, sparingly |
| `--blayz-gold` | `#E2C07A` | Accent | Pricing / Sadu warm tone |
| `--blayz-ink` | `#1A1A1A` *(new, suggested)* | — | Intro background, Services section dark mode |

> Note: `#FF38OO` in the guide is read here as `#FF3800` (the display font renders 0 as O).
> `--blayz-ink` doesn't exist in the current palette — it's a practical addition for the two places the design needs true dark contrast (Stage A intro, Services terminal). Flagged in Section 12.

### 2.2 Typography

| Typeface | Role on this site |
|---|---|
| **blayz (custom display)** | Logo only — intro animation, header, hero wordmark |
| **Satoshi** | All body copy, paragraph text, UI labels |
| **JetBrains Mono** | Section numbering (`[ 01 ]`), nav labels, ASCII tags, terminal sequence, pricing figures |
| **Reem Kufi** | Sparse cultural accents — e.g. a small Arabic word/phrase near the footer or About Us, never body text |

### 2.3 Existing ASCII / pattern vocabulary (reuse, don't reinvent)

- Service/process tags: `< build />`, `{ rebrand }`, `[ design ]`, `// optimize`, `< launch />`, `/* iterate */`
- Border glyphs: `◇ ◆ ✦ ✧ ⊕ — | ┌ ┐ └ ┘` etc., used as frame corners and dividers
- Section-numbering convention from the guide itself: `01. PRIMARY LOGO`, `02. LOGO VARIATIONS` → becomes `[ 01 ]`, `[ 02 ]` for the Index
- The cover page's `<blayz> ... </blayz>` opening/closing tag framing

---

## 3. Narrative Arc & Design System

### 3.1 The throughline

Two arcs run through the whole experience, and every section spec below ties back to one of them:

- **Intro arc (Stage A):** craft → analog → print → digital → code → **brand**. The logo's fill cycles through a Tatreez/textile pattern, a hand-sketch, a poster/collage texture, a halftone/bitmap, and ASCII — i.e., it visually re-enacts "culture meets code," landing on the brand mark as the synthesis of both.
- **Section arc:** bloom (Hero/About) → terminal (Services) → textile (Pricing) → **synthesis** (Contact), mirrored by the Spine. Contact closes the loop with `</blayz>`, echoing the cover page's opening `<blayz>`.

### 3.2 Constants vs. section variables

To let each section feel distinct while staying recognizably Blayz:

**Constants (every section):**
- `--blayz-orange` as the only interactive/accent color
- Satoshi for body, JetBrains Mono for labels/numbering/tags, Reem Kufi reserved for rare accents
- ASCII corner/border glyphs as section dividers
- The Spine (right edge)
- `[ 0X ]` numbering convention for the Index

**Variables (per section):**
- Background color/texture
- Secondary palette color
- Pattern family (bloom / terminal lines / Sadu geometry / synthesis)
- Layout density and rhythm

---

## 4. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript + Tailwind | Matches existing Blayz business stack |
| Scroll-linked animation | **GSAP + ScrollTrigger** | Best fit for scrubbed timelines — Spine drawing, section-pinning, Services boot sequence |
| Discrete UI transitions | **Framer Motion** | Index/logo dock-to-header (`layoutId` shared layout animation), hover/active states |
| Smooth scroll | **Lenis** | Pairs cleanly with ScrollTrigger via `scrollerProxy`; gives the page the "premium scroll" feel of the Shopify reference |
| SVG patterns | Anas's generator output as React components | Bloom medallion, Spine segments where applicable |
| Fonts | `next/font/local` for blayz display + Reem Kufi; `next/font` for Satoshi/JetBrains Mono | Self-hosted, no FOUC |
| Contact form | Next.js API route + **Resend** | Per existing business stack |

---

## 5. Page Layout Overview

```
INTRO (full-bleed overlay, plays once on load)
┌──────────────────────────────────────────────┐
│                                                │  bg: --blayz-ink
│             [ blayz — flashing fills ]        │
│                                                │
└──────────────────────────────────────────────┘
        │  logo lands on brand orange,
        │  bg crossfades ink → cream
        ▼
HERO  (Stage A end-state — nothing scrolled yet)
┌──────────────────────────────────────────────┐
│                                          ░ ░ ░ │
│                  b l a y z                ░ ░ │ ← Spine: bloom forms
│                                          ░ ░ ░ │   (load-triggered)
│         [01] Hero      [02] About         ░ ░ │
│         [03] Services  [04] Pricing     ░ ░ ░ │ ← the Index (centered)
│         [05] Contact                      ░ ░ │
│                                          ░ ░ ░ │
│           tagline · < start a project >       │
└──────────────────────────────────────────────┘
        │  scroll past Hero → Stage B fires
        ▼
SCROLLED LAYOUT (About / Services / Pricing / Contact)
┌────┬───────────────────────────────────┬─────┐
│blyz│                                    │     │ ← Header (logo docked, small)
├────┼───────────────────────────────────┼─────┤
│[01]│                                    │ ▓▓▓ │
│Hero│            ABOUT US                │ ▓▓▓ │ ← Spine: arabesque-ASCII
│[02]│      (bloom continues + draws      │ ▓▓▓ │   (scroll-scrubbed)
│Abt │       in further on scroll)        │     │
│[03]├───────────────────────────────────┼─────┤
│Srv │                                    │ ### │
│[04]│            SERVICES                │ ### │ ← Spine: terminal lines
│Prc │         (terminal frame)           │ ### │   (scroll-scrubbed)
│[05]├───────────────────────────────────┼─────┤
│Cnt │                                    │ ▒▒▒ │
│    │            PRICING                 │ ▒▒▒ │ ← Spine: Sadu geometry
│    │         (Sadu patterns)            │ ▒▒▒ │   (scroll-scrubbed)
│    ├───────────────────────────────────┼─────┤
│    │                                    │ ░░░ │
│    │            CONTACT                 │ ░░░ │ ← Spine: bloom reprise
│    │           (synthesis)              │ ░░░ │   (scroll-scrubbed)
└────┴───────────────────────────────────┴─────┘
 Sidebar          main content              Spine
 Index            (per-section styling)    (fixed right)
 (fixed left)
```

---

## 6. Global Navigation & Loading System

### 6.1 Stage A — Intro Loading Sequence

**Concept:** the existing Blayz wordmark SVG acts as a **clip-path / mask** ("a window"). Behind it sits a stack of full-bleed fills that cycle, while the whole composition scales up slowly. The logo's *shape* never distorts (respecting the brand guide's "don't stretch / don't rotate" rules) — only what's visible *through* it changes.

```tsx
// LogoIntro.tsx — conceptual structure
const frames = [
  { id: "white",     type: "color", value: "#FFFFFF" },
  { id: "tatreez",   type: "image", src: "/intro/01-tatreez.png" },
  { id: "sketch",    type: "image", src: "/intro/02-sketch.png" },
  { id: "collage",   type: "image", src: "/intro/03-collage.png" },
  { id: "halftone",  type: "image", src: "/intro/04-halftone.png" },
  { id: "ascii",     type: "image", src: "/intro/05-ascii.png" },
  { id: "arabesque", type: "svg",   src: "/intro/06-arabesque.svg" }, // generator output, optional
  { id: "brand",     type: "color", value: "var(--blayz-orange)" },
];

<svg viewBox="0 0 600 200" aria-hidden>
  <defs>
    <clipPath id="logoMask">
      <path d="..." /> {/* paste blayz wordmark path data here */}
    </clipPath>
  </defs>
  <g clipPath="url(#logoMask)">
    {frames.map((f, i) => <FrameLayer key={f.id} frame={f} index={i} />)}
  </g>
</svg>
```

A GSAP timeline crossfades each `FrameLayer`'s opacity in sequence while the outer `<g>` scales continuously via `transform`.

**Sequence — your five examples, reordered into the craft→code→brand arc, plus one optional addition:**

| # | Frame | Theme | Window | Asset needed? |
|---|---|---|---|---|
| 0 | Solid white | start | 0.00–0.35s | — (CSS color) |
| 1 | Tatreez / Sadu cross-stitch | craft | 0.35–0.70s | ✅ texture |
| 2 | Sketch / pencil linework | analog | 0.70–1.05s | ✅ texture |
| 3 | Poster / collage cut-paper | print | 1.05–1.40s | ✅ texture |
| 4 | Halftone / bitmap dots | digital | 1.40–1.75s | ✅ texture |
| 5 | ASCII character mosaic | code | 1.75–2.10s | ✅ texture |
| 6 | *(optional)* Arabesque line pattern (your generator) | culture, full circle | 2.10–2.45s | Generator-produced — cheapest to add |
| 7 | Solid `--blayz-orange` | brand = code + culture | 2.45–3.00s, holds | — (CSS color) |
| — | *(handoff)* | — | 3.00–3.80s | logo scales/translates toward Hero position; bg crossfades ink → cream; tagline/Index fade in |

This gives you **5–6 frames to produce** — exactly the count you were already planning, with an optional 6th that's the *least* work since it comes straight out of your existing tool. The reordering also gives the sequence a story: it ends on "code" (ASCII) and then "culture" (arabesque) right before resolving into the brand mark itself — a visual *"crafted with code & culture."*

**Transition style:** 150ms crossfades between frames 0–6 (not hard cuts), 250ms crossfade into the final brand-orange hold. Each frame window is ~350ms.

> ⚠️ **Accessibility flag (WCAG 2.3.1):** rapid hard-cut flashing between high-contrast frames can cross the seizure-risk flash threshold (3 flashes/sec). The 350ms-window + 150ms-crossfade timing above keeps the effective flash rate well under that, but this is worth visually testing once real assets are in. Under `prefers-reduced-motion`, skip straight to a single 400ms white → brand-orange crossfade (see Section 11).

**Asset specs:** each texture should be prepared at the wordmark's aspect ratio (~5:2), exported as PNG @2x (or SVG for frame 6). They don't need to be "readable" individually — they're seen for ~350ms each through a letterform mask, so bold, high-contrast patterns read best.

---

### 6.2 Stage B — Hero → Scrolled Transition

Triggered once the user scrolls past the Hero (suggested threshold: `scrollY > heroHeight * 0.9` — confirm in Section 12).

Two elements "detach" from the Hero and dock elsewhere; everything else in the Hero (tagline, CTA, Hero's Spine segment) scrolls away normally.

| Element | Hero state | Scrolled state | Technique |
|---|---|---|---|
| Logo | Large, centered, solid orange | Small, top-left, header-docked | Framer Motion `layoutId="blayz-logo"` (FLIP-style shared layout) |
| The Index | Centered list, `[01]–[05]`, larger type | Compact vertical list, fixed left, smaller type | Same `layoutId` technique per item, or GSAP Flip plugin |

Both stay in roughly the same vertical-list orientation in both states (matching the Shopify reference) — only position/scale change, avoiding a horizontal↔vertical reflow.

---

### 6.3 Persistent Header

- Fixed/sticky, top-left: docked Blayz logo (small, brand orange)
- On mobile: doubles as the toggle for a collapsed Index (see Section 11)

### 6.4 Sidebar Index

- Post Stage-B: fixed left edge, vertical list of `[ 01 ] Hero` … `[ 05 ] Contact`
- Active section highlights in `--blayz-orange` (color shift, or an ASCII bracket marker appears: `[ About ]`)
- Click → smooth-scroll (Lenis) to that section
- Scrolling back to the top of Hero reverses Stage B (Index/logo return to centered Hero state) — recommend testing whether this reversal should be instant or animated; flagged in Section 12

### 6.5 The Spine (right edge rail)

**Concept:** a thin constant vertical line ("the rail," `--blayz-orange` at low opacity) runs the height of the scrolled content. Each section owns one **segment** — its own pattern, growing from the rail — so the Spine reads as one continuous element whose *character* changes as you pass through it.

| Section | Segment pattern | Trigger |
|---|---|---|
| Hero | Arabesque-ASCII **bloom forms** | Plays once, on load (tail of Stage A / Hero entrance) — not scroll-tied |
| About | Same bloom **continues drawing** further | Scroll-scrubbed within section bounds |
| Services | Terminal/ASCII line pattern (reuse border glyphs from §2.3) | Scroll-scrubbed |
| Pricing | Sadu geometric zigzag/diamond pattern | Scroll-scrubbed |
| Contact | **Bloom reprise** — ideally a "collected" bloom whose petals echo the terminal, Sadu, and arabesque motifs from the other three segments | Scroll-scrubbed |

Hero's and About's segments should share the same base pattern/asset so the transition feels like *one bloom expanding*, not a restart.

```ts
// Per-section segment, scroll-scrubbed
gsap.to(segmentPathRef.current, {
  strokeDashoffset: 0, // fully drawn
  ease: "none",
  scrollTrigger: {
    trigger: sectionRef.current,
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
});
```

> Open question: does your generator currently produce *only* arabesque-bloom variants, or can it be parameterized toward Sadu/terminal-line styles too? This determines whether segments for Services/Pricing come from the generator or need separate assets — flagged in Section 12.

---

## 7. Section Specifications

### 7.1 Hero

- **Receives:** Stage A's landed logo (large, centered, solid orange) and the centered Index
- **Content:** tagline + CTA, drawing on existing brand-guide copy (`"We build websites that build brands"` / `"Aesthetic websites. Stronger brands."` style) — final copy TBD
- **CTA:** `< start a project >`, styled per the brand guide's bracket convention
- **Background:** `--blayz-cream`, very faint full-bleed arabesque watermark (low opacity)
- **Spine:** bloom forms on load (§6.5)

### 7.2 About Us

- **Theme:** the core ASCII-arabesque bloom — this section *is* the brand identity at full expression
- **Centerpiece:** generator-produced medallion, drawn progressively via scroll (`stroke-dashoffset` scrub), each "petal"/ring appearing as the user scrolls through
- **Content:** studio philosophy + founder intro, presented as short text blocks that appear alongside/within the bloom as it completes (could land in the medallion's negative space, or as 3 ASCII-framed founder cards once the bloom finishes)
- **Color:** leans into `--blayz-peach`
- **Spine:** bloom continues drawing (§6.5)

### 7.3 Services

- **Theme:** pseudo-terminal — but **chrome only**, not full terminal text (per your note on readability)
- **Entry animation** (plays once on first viewport entry, ~1.5–2.5s):

```
$ npm install @blayz/brand-system
  ⠋ resolving arabesque-patterns@2.6.0
  ⠙ resolving ascii-grid@1.0.4
  ⠹ resolving reem-kufi-accent@latest
  ✓ 3 packages installed

$ npm run blayz -- --build

  [ design ]     ready
  < build />     ready
  { rebrand }    ready
  // optimize    ready
  < launch />    ready
  /* iterate */  ready

✓ build complete
```

- **Resolution:** the terminal output area morphs into the actual services grid — the 6 ASCII tags above become the 6 service/process cards, directly reusing the brand guide's existing "06. ASCII WEBDEV ELEMENTS" vocabulary (no new categories invented)
- **Persistent chrome:** terminal window frame (border + corner glyphs from §2.3, optional traffic-light dots in brand colors) frames the section; *inside*, cards use normal Satoshi/UI styling — only labels stay JetBrains Mono
- **Color:** `--blayz-ink` background for contrast — the one deliberately dark section
- **Spine:** terminal/ASCII line pattern, scroll-scrubbed

### 7.4 Pricing

- **Theme:** Sadu textile — simpler layout than About/Services
- **Structure:** 2–3 pricing tiers as cards, each framed top/bottom by a Sadu-style geometric band (triangles/zigzags) from the generator or a custom asset
- **Color:** warm earth tones — `--blayz-gold`, `--blayz-orange` as the woven "band" colors, echoing real Sadu color logic
- **Content:** tier names/copy/pricing TBD (Section 12)
- **Spine:** Sadu geometric pattern, scroll-scrubbed

### 7.5 Contact

- **Theme:** synthesis of everything before it
- **Composition:**
  - Faint full-bleed arabesque watermark (from About), very low opacity, as base layer
  - Thin ASCII-bordered frame around the contact form itself (from Services chrome)
  - Sadu band as a footer divider (from Pricing)
  - `</blayz>` as a typographic flourish near the footer — the closing half of the brand guide cover's `<blayz> ... </blayz>` framing
- **Content:** contact form (Name, Email, Project type, Message) + direct contact links + final CTA
- **Spine:** bloom reprise — the "collected" bloom referencing all prior segment motifs (§6.5)

---

## 8. Asset Production Checklist

| # | Asset | For | Format / specs | Notes |
|---|---|---|---|---|
| 1 | Tatreez/Sadu cross-stitch texture | Intro frame 1 | PNG @2x, ~5:2 ratio | |
| 2 | Sketch/pencil linework texture | Intro frame 2 | PNG @2x | |
| 3 | Poster/collage cut-paper texture | Intro frame 3 | PNG @2x | |
| 4 | Halftone/bitmap dot texture | Intro frame 4 | PNG @2x | |
| 5 | ASCII character mosaic texture | Intro frame 5 | PNG @2x | |
| 6 | Arabesque line pattern | Intro frame 6 (optional) | SVG | From generator |
| 7 | Bloom medallion — base | Hero + About Spine segments, About centerpiece | SVG, scroll-scrubbable (`stroke-dashoffset`) | From generator |
| 8 | Terminal-line Spine segment | Services Spine | SVG | Generator if extensible, else custom |
| 9 | Sadu geometric Spine segment | Pricing Spine | SVG | Generator if extensible, else custom |
| 10 | "Collected" bloom — synthesis | Contact Spine segment | SVG | Combines motifs from #7–9 |
| 11 | Sadu border/divider patterns | Pricing cards | SVG or PNG | |
| 12 | Services boot sequence copy | Services section | Text/JSON content | Sample provided in §7.3 |

---

## 9. Suggested Component Structure

```
src/
├─ app/
│  ├─ layout.tsx              # fonts, html shell, Lenis provider
│  ├─ page.tsx                # composes Intro + Header + Sidebar + Spine + sections
│  ├─ globals.css             # Tailwind base + brand CSS variables
│  └─ api/
│     └─ contact/route.ts     # Resend integration
├─ components/
│  ├─ intro/
│  │  ├─ LogoIntro.tsx
│  │  └─ frames/               # 01-tatreez.png ... 06-arabesque.svg
│  ├─ nav/
│  │  ├─ Header.tsx
│  │  ├─ HeroIndex.tsx
│  │  └─ SidebarIndex.tsx
│  ├─ spine/
│  │  ├─ Spine.tsx              # rail + segment switcher
│  │  └─ segments/
│  │     ├─ BloomSegment.tsx
│  │     ├─ TerminalSegment.tsx
│  │     ├─ SaduSegment.tsx
│  │     └─ SynthesisSegment.tsx
│  ├─ sections/
│  │  ├─ Hero.tsx
│  │  ├─ AboutUs.tsx
│  │  ├─ Services.tsx
│  │  ├─ Pricing.tsx
│  │  └─ Contact.tsx
│  ├─ patterns/
│  │  └─ GeneratedPattern.tsx   # wrapper around your SVG generator output
│  └─ ui/
│     ├─ TerminalFrame.tsx
│     └─ AsciiTag.tsx           # <build/>, {rebrand}, [design]...
├─ lib/
│  └─ gsap.ts                   # registers ScrollTrigger + Lenis bridge
└─ content/
   └─ services.ts               # the 6 ASCII-tag service entries
```

---

## 10. Build Sequence (Phased)

1. **Skeleton & tokens** — Next.js setup, Tailwind config with brand CSS variables (incl. `--blayz-ink`), fonts loaded, 5 sections as static full-height blocks with placeholder colors. *Goal: confirm scroll order/heights feel right.*
2. **Navigation shell (static)** — Header, HeroIndex, SidebarIndex built as separate components, shown/hidden via simple scroll-position state, no animated transition yet. *Goal: confirm Index content and jump-links work.*
3. **Section visual styling** — apply each section's distinct look from Section 7 using placeholder patterns where generator assets aren't ready yet. *Goal: the page reads as Blayz even with stand-ins.*
4. **Stage B transition** — animate logo + Index docking via Framer Motion `layoutId`. *Goal: the signature dock-to-header/sidebar moment works smoothly.*
5. **The Spine** — build rail + segment components, wire ScrollTrigger scrub for About/Services/Pricing/Contact and load-based animation for Hero's bloom. Placeholder patterns first.
6. **Section animations** — About bloom-on-scroll (swap in real generator output here), Services boot sequence + reveal, Contact synthesis reveal.
7. **Stage A intro** — build the flash-through sequence last, since its handoff target depends on the Header logo position from Phase 4. Swap in real intro textures as they're produced.
8. **Polish** — reduced-motion variants, mobile layout, performance pass, cross-browser/device QA.

---

## 11. Accessibility, Performance & Responsive Notes

- **`prefers-reduced-motion`:** Stage A collapses to a single 400ms white→brand-orange crossfade (no frame cycling); Stage B docking becomes instant (no FLIP animation); Spine segments render fully drawn (no scrub); Services boot sequence shows its final state immediately.
- **Flash-rate:** see the WCAG note in §6.1 — verify once real intro assets are in.
- **Contrast:** double-check `--blayz-gold` / `--blayz-peach` / `--blayz-sky` text-on-cream combinations against WCAG AA, especially for the Index and body copy.
- **Mobile:**
  - Spine: likely hidden, or reduced to a single-line color/pattern indicator per section
  - Sidebar Index: collapses behind the header logo as a toggle, or becomes a bottom bar
  - Stage A: shorten frame windows (~250ms) to keep total intro under ~2.5s on small screens
- **Performance:** lazy-load below-fold Spine segments and section assets; keep the bloom medallion's path count within a "detail level" param the generator can scale down for mobile; use `next/image` for the raster intro textures.

---

## 12. Open Questions for Anas

1. Confirm the intro sequence order/selection (5 confirmed + optional 6th) before producing assets — happy to swap order if a different arc feels better.
2. Hero copy: reuse brand-guide mockup lines (`"We build websites that build brands"`, `"Aesthetic websites. Stronger brands."`) or write fresh?
3. About Us: studio philosophy, founder bios, or both?
4. Confirm the 6 ASCII tags (`<build/>`, `{rebrand}`, `[design]`, `//optimize`, `<launch/>`, `/*iterate*/`) as the Services breakdown — or different grouping?
5. Pricing: tier count, names, and whether figures are public or "contact for quote."
6. Contact form fields + destination inbox for Resend.
7. Does the SVG generator support non-arabesque modes (Sadu zigzag, terminal-line) for Spine segments 8–9, or do those need separate assets?
8. Mobile treatment for Sidebar Index and Spine — hide, simplify, or relocate?
9. Exact Stage B scroll threshold, and whether scrolling back to Hero top should *reverse* the dock animation or just snap.

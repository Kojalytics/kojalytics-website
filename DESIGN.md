# Kojalytics design system: "Instrument"

How every marketing page on kojalytics.com is built. The reference implementation is
`src/app/software/page.tsx`: when in doubt, copy its patterns.

The direction: a precise, technical "measuring instrument" look on **white paper**. Many quiet,
coordinated details instead of one loud effect: hairline rules, numbered sections, mono uppercase
labels, crosshair ticks, a scroll ruler, staggered entrances. Square corners. One blue accent.
It is our own implementation; never copy code, text or images from other websites.

## Tokens (src/app/globals.css)

| Token | Value | Use |
|---|---|---|
| `background` | `#ffffff` | Every page background. Always white, no tinted or dark sections. |
| `foreground` | `#0e0e10` | Text, primary buttons, filled tags |
| `muted` | `#5a5a60` | Body copy, secondary text |
| `faint` | `#6a6a70` | Index numbers, crosshairs (AA contrast on white and on the window frame) |
| `border` / `border-strong` | `#e3e3e1` / `#c9c9c6` | Hairlines / outlines of buttons, tags, icon boxes |
| `surface` | `#f6f6f5` | Small wells only (image backgrounds, the checkout confirmation box, table highlight) |
| `accent` | `#2a66d8` | One highlighted word per headline (`.text-highlight`), links. Nothing else is blue. |

App colours come from `APPS[].color`; for text use `appInk(app.color)` (darkened to AA contrast).

Fonts: headlines `.display` (Archivo, stretched wide, bold), body Geist (`font-sans`), labels
Geist Mono (`font-mono`, `.hud`).

## Classes and components

- `.rail`: the 1280px page column with hairline borders left/right (md+). Every section is a
  `<section className="rail crosshairs">`. `crosshairs` draws "+" ticks at the section's top corners.
- `<SectionBar index="03" label="Warum Leute wechseln" meta="…" />` (`src/components/instrument/SectionBar.tsx`):
  the first child of every section. Index numbers run 01, 02, 03… down the page; the meta text on the
  right is a short mono phrase (hidden on phones).
- `.hud`: mono uppercase micro-label (11px, tracking 0.16em, muted). Use for index numbers, meta lines,
  captions of data ("3 Min. Lesezeit"), column headers, small annotations.
- `.display` + `text-[clamp(…)]`: headlines. Sizes used on /software:
  - h1 hero `text-[clamp(2.1rem,5.4vw,4.6rem)]`
  - section h2 `text-[clamp(2rem,4.2vw,3.6rem)]`
  - sub h2 `text-[clamp(1.8rem,3.4vw,2.8rem)]`
  - card h3 `text-[1.35rem]`–`text-[1.55rem]`
  Each section headline gets **one** word wrapped in `<span className="text-highlight">`.
  Keep phrases together with `whitespace-nowrap` where a break would look bad (prices, "im Monat").
- Buttons: `.btn-primary` (black), `.btn-secondary` (white, outline). Square, mono uppercase label,
  48px tall. `<DownloadButton />` already uses `.btn-primary`. Never add `rounded-*`, `text-base`/`text-lg`
  or padding utilities to buttons.
- `.link-hud`: mono uppercase text link with `<ArrowUpRight size={14} />` ("Mehr zu PhotoKoja ↗").
- `.tag`: small bordered mono tag ("Alpha", "macOS"); colour it with `style={{ color, borderColor }}`.
- `.cells`: a grid whose children share 1px hairlines (gap-px over a border-coloured background). Use it
  for card grids, feature grids, footers: `className="cells border-y border-border md:grid-cols-3"`.
  Children need no own border. Pad cells with `p-6 md:p-8`.
- `.icon-box`: 40px square outlined box for a lucide icon (`size={18}`), top-left of a feature cell,
  with the cell's index (`.hud text-faint`, "01") top-right.
- `<MacWindow label="PhotoKoja" />`: screenshots in a square hairline window frame.
- App card pictures (`app.card`, `public/apps/<slug>/karte.webp`): illustrations from `scripts/app-cards`
  (`node scripts/app-cards/render.mjs`). One rule for all: the same light window on graph paper in the app
  colour, same layout and type, the app colour as the only accent; only the canvas motif differs. Change
  the template, not single pictures. App order everywhere = order of `BASE` in src/lib/apps.ts.
- `<AppIcon />`: the only rounded element on the site (app icons are squircles by nature).
- `<Faq items />`: numbered accordion with hairlines.
- `<PricingCards source="…" />`: the two plans in a `.cells` grid; do not restyle per page.

## Layout patterns

- Page: `<main className="pt-12">` (the fixed header is 48px), then sections. No outer max-w wrappers:
  the `.rail` sections are the column.
- Section inner padding: horizontal `px-5 md:px-10`, vertical `py-14 md:py-20`. Hero top section the same.
- Section anatomy: `SectionBar` → padded block with h2 (+ optional lead paragraph) → content. Content
  that is a grid of cells spans the full rail width (no horizontal padding) with `border-y border-border`.
- Two-column blocks: `grid gap-10 lg:grid-cols-2 lg:items-center` (or `lg:grid-cols-[1.15fr_0.85fr]`).
- Final CTA section: centred, `.hud` line, big `.display` headline, one `DownloadButton`.
- Lists with checkmarks: lucide `Check` in `text-success`, `size={18} strokeWidth={2.4}`.
- Tables: hairline grid (`border border-border`, cells `border-l border-border`), headers as `.hud`.
  On phones render each row as a bordered card (see /software price comparison).
- Prose (Ratgeber, legal): keep `.prose-de`, inside a rail section with a readable max width (`max-w-3xl`).

## Motion

- Hero lines: `className="rise-in"` with `[--i:1]`, `[--i:2]`… (CSS only, plays on load).
- Everything below the hero: add `data-reveal` (and `style={{ ["--i" as string]: i }}` for stagger in grids).
  The `RevealManager` in the navigation fades them in on scroll; with JS off or reduced motion they are simply visible.
- First-visit intro (`IntroLogo` in Navigation.tsx, `.kj-intro-*` in globals.css): the K mark turns once,
  the wordmark slides out and back, the mark flies onto the header logo. 2 s, CSS only, once per visit
  (inline script in layout.tsx). Never delay page content behind it (LCP); keep it under 2 s.
- No other animation libraries. No parallax, no autoplaying video, no carousels except the mobile swipe row.

## Don'ts

- No rounded corners (`rounded-*`) except `AppIcon` and the tiny traffic-light dots / status dots.
- No drop shadows except the one built into `MacWindow` and the cookie banner.
- No grey or coloured section backgrounds (`bg-surface` sections are gone): white everywhere.
- No gradients, glass, blur effects (the header's backdrop blur is the only one).
- Do not change copy, prices, claims, legal text, metadata, JSON-LD or links when restyling. Legal
  wording ("jederzeit online kündbar", Alpha status) is deliberate.
- Never name the upstream project, its team, website or repositories anywhere on the site (owner decision,
  Nov 2026). The origin sentence names only the licences: "basieren auf quelloffener Software unter den
  Lizenzen Apache 2.0 und MIT".

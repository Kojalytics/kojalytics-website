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
| offer yellow | `#ffd84d` | Only the "−50 %" offer tag (`.offer-tag`), the one carry-over from the ads. No other yellow outside /office. |

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
  - h1 hero `text-[clamp(1.75rem,3.6vw,2.9rem)]`; on /software its first line is the wordmark "Koja Office" (`.sw-hero-mark`)
  - section h2 `text-[clamp(2rem,4.2vw,3.6rem)]`
  - sub h2 `text-[clamp(1.8rem,3.4vw,2.8rem)]`
  - card h3 `text-[1.35rem]`–`text-[1.55rem]`
  Each section headline gets **one** word wrapped in `<span className="text-highlight">`.
  Keep phrases together with `whitespace-nowrap` where a break would look bad (prices, "im Monat").
- Buttons: `.btn-primary` (black), `.btn-secondary` (white, outline). Square, mono uppercase label,
  48px tall. `<DownloadButton />` already uses `.btn-primary`. Never add `rounded-*`, `text-base`/`text-lg`
  or padding utilities to buttons.
- `.link-hud`: mono uppercase text link with `<ArrowUpRight size={14} />` ("Mehr zu PhotoKoja ↗").
- `.tag`: small bordered mono tag ("macOS", "Windows"); colour it with `style={{ color, borderColor }}`.
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

- Header menu (Navigation.tsx): the first item is "Koja Office" (links to /software, the product page), then Lizenzen,
  Leistungen, Projekte, Ratgeber, Kontakt.
- Header offer (Navigation.tsx, `.offer-btn`): the right side is one ink button with the yellow `.offer-tag` "−50 %", "Koja Office",
  from xl the code in a solid hairline `.offer-code` (the word "Code" from 1400px) and "bis 30. November 2026", linking to the offer link
  of `src/lib/offer.ts` (no "Preise", no trial button); on the Koja pages it swaps in place for the green `<BuyButton>` once a discount is
  active. The phone menu opens with the offer row (end date and code as 16px text) instead of a "Koja Office" item.
- Koja pages (/software, app pages) apply the offer by default while it runs (`<OfferDiscount>`): every price and buy button shows the
  offer price from the first paint; a code from a link or the price section replaces it.
- Koja Office band (`<OfferBand />`, built into `<Footer />`, off with `offer={false}` on /software and below, /office and legal pages):
  the resting box on graph paper, tag with the end date, one headline, price with code, green "Koja Office ansehen" plus `<DownloadButton>`,
  56px buttons. Offer facts on phones are 16px text, never 11px `.hud`.
  Everything offer-related comes from `src/lib/offer.ts` and switches to the regular price by itself at the end date (`.offer-live`/`.offer-over`).
- /software hero (`.sw-hero` in globals.css): one h1 with two lines, the wordmark "Koja Office" and "13 Apps für Mac und
  Windows. Einmal 79 €, kein Abo." (price from `<LifetimePrice />`), then the buttons; beside it (lg+) or between h1 and buttons
  (phones, tablets) the solar system on its own stage (`<SolarSystem />`, `.solar`): the resting 3D box (`<OfficeBoxStatic />`) as
  the sun above a tilted orbital plane, the 13 app icons on three orbits (3/4/6, laps 40/80/120 s), larger at the front and smaller
  at the back, passing below the box in front and behind it at the back. CSS only (transform/opacity), sizes in multiples of `--u`
  (front icon size); the start angles keep every two icons ≥ 1.15 icon sizes apart (`.office-landing/solar-check.mjs`). No icon or
  orbit line ever reaches the type. /software/partner keeps the K mark (`<OrbitField />`).
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
- No other animation libraries. No parallax, no carousels except the mobile swipe row and the customer-voices row.
- Swipe rows get `<EdgeArrows target="…" />` (src/components/instrument/EdgeArrows.tsx) in a `relative` wrapper: square,
  translucent prev/next buttons on the picture's edges (centred on the first card's `[data-row-anchor]`), shown only
  while the row scrolls; "next" nudges twice on first view (not with reduced motion). The counter row below stays.
- Video only as the app demo loops (`<AppDemo />`, section "In Aktion" after the hero of each app page; owner
  request, Nov 2026): silent, never in the hero (LCP stays the screenshot), `preload="none"` with a poster,
  plays only while on screen, and not at all with reduced motion (poster plus player controls instead).
  The loops are rendered from our own screenshots: stops in `src/content/demos.json`,
  `node scripts/app-demos/render.mjs [slug]`. One continuous camera move over the app's windows on graph
  paper, a sliding blue focus frame and a pointer that clicks; no cuts, no fades to white, and no words in
  the picture (only numbers and the app name), so the video works in every language and the feature names
  stay translatable page text.
- Customer voices (`<VideoTestimonials />`, homepage section "Kundenstimmen" before the reviews; owner request, Nov 2026):
  a sideways `.cells` row of 7-second vertical clips (`src/content/testimonial-videos.json`, files in `public/stimmen`,
  540x960 H.264 under ~750 KB each, versioned names, cached a year via next.config headers). They are AI re-enactments
  of real, shortened customer quotes and always say so (section lead, card note, JSON-LD description); never mark them
  up as reviews. Nothing loads until a card is near the screen (no poster, no bytes), clips play silently while 60 %
  visible, one sound button per card, captions are page text (German on /, English on /en), the full quote sits below
  the clip. Reduced motion or data saver: no autoplay, player controls instead. No other autoplaying video.

## Don'ts

- No rounded corners (`rounded-*`) except `AppIcon`, the tiny traffic-light dots / status dots and the cookie dialog
  (`Consent.tsx`: centred, rounded card with pill buttons, built after Facebook's cookie dialog on owner request).
- No drop shadows except the one built into `MacWindow` and the cookie banner.
- No grey or coloured section backgrounds (`bg-surface` sections are gone): white everywhere.
  The one exception is `/office`, the landing page for the Meta ads: it continues the dark ads with dark stages (near-black,
  44px grid, blue glow, yellow prices, the 3D box) between white sections and uses large plain-type buttons (`.ko-btn`,
  60px, 18px bold) for an older audience on phones. Its styles live in `src/app/office/office.css` (prefix `ko-`); the box's own
  styles in `src/components/office/kbox.css` (imported by `OfficeBox` and `OfficeBoxStatic`).
- No gradients, glass, blur effects (the header's backdrop blur is the only one).
- Do not change copy, prices, claims, legal text, metadata, JSON-LD or links when restyling. Legal
  wording ("jederzeit online kündbar") is deliberate.
- No Alpha, Pre-Alpha or "frühe Version" wording and no maturity estimates anywhere (owner decision, Nov 2026).
  Say instead that the apps are continuously developed and that updates and new features are free
  ("werden laufend weiterentwickelt", "Updates und neue Funktionen bekommst du automatisch und kostenlos").
- Never mention open source, licences of the underlying code, or the upstream project, its team, website or
  repositories anywhere on the site (owner decision, Nov 2026). Where the origin needs a sentence, use:
  "Kojalytics entwickelt, prüft und signiert die Koja-Apps und liefert sie mit Launcher, Aktivierung und
  automatischen Updates aus."

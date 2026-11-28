# Daily Ratgeber article: rules

One German guide per day for kojalytics.com/ratgeber, aimed at one long-tail search query from `queue.json`.
Published automatically (owner decision, 28 Nov 2026): the article must be right the first time.

## Format
- One JSON file `src/content/ratgeber/<slug>.json` with exactly the fields of `Article` in `src/lib/ratgeber.ts`
  (slug, navTitle, h1, metaTitle ≤ 60 chars, metaDescription 140–160 chars, primaryKeyword, updated = today's ISO date,
  readingMinutes, intro[2], sections[5–8] with blocks of the `Block` types, faq[4–6], apps (slugs from src/lib/apps.ts),
  sources[3–8] with real URLs).
- Import it in `src/content/ratgeber/index.ts` and add it to `ARTICLE_FILES` (newest first, right after the imports' list start).
- Copy the tone and structure of the existing articles (read two of them first): "du", short sentences, a direct answer in
  the first paragraph, a comparison table, step-by-step lists, one `tip`, one `app` block for the matching Koja app.
- Primary keyword in h1, metaTitle, first sentence and one h2; related terms naturally, no keyword stuffing.

## Facts (most important)
- Every price and product claim about other companies is checked on the vendor's official page **today**; the source goes
  into `sources` and the table caption says "Stand: <date>". Prices in euros incl. VAT for Germany.
- Koja prices: 79 € one-time or 19,99 € a month, all 13 apps, up to 3 devices (Mac or Windows PC), updates free, 3-day
  free trial. Never mention discount codes or offers.
- No "#1", "beste", "besser als Adobe/Microsoft", no claims of full compatibility: file formats open, "Layout und Umbrüche
  können abweichen". Name free alternatives honestly (macOS tools, LibreOffice, GIMP, etc.); Koja is one option.
- Feature claims about Koja apps only from `src/content/apps/<slug>.json` and the app pages. If unsure, leave it out.
- No invented quotes, reviews, statistics or test results.

## Publish
1. `npm run build` and `npm test` must pass; validate the JSON against the type (the build does).
2. Branch `ratgeber/<slug>`, commit "Ratgeber: <navTitle>", PR, squash-merge, wait for the Vercel deployment, check that
   https://www.kojalytics.com/ratgeber/<slug> returns 200 and shows the h1.
3. In `queue.json` set done=true and published=<date> for the entry (same PR).
4. If anything fails or a fact can't be verified: do not merge; leave the PR open and report why.

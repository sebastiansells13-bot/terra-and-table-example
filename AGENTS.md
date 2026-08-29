# AGENTS.md

Instructions for AI coding assistants (Claude Code, Copilot, etc.) working in this repo.
This file describes **this specific client site**, adapted from `client-site-starter`
with a different styling approach. Keep it up to date as the site changes.

## Commands

- **Dev**: `npm start` (Eleventy with hot reload at http://localhost:8080/;
  writes generated pages to `dev/`, cleans `dev/` and `docs/` on startup and shutdown)
- **Build**: `npm run build` (cleans output, builds the Eleventy site into `docs/`)
- **CI build**: `npm run build:ci` (GitHub Actions only — runs `npm run build`, then
  `scripts/optimize-media.mjs`, which no-ops here since this site has no raster images)

## Architecture

- **SSG**: Eleventy (11ty) v3, static output, no server runtime
- **Input**: `src/` — Markdown and Nunjucks (`.njk`) templates
- **Styling**: **Tailwind CDN**, not the template's Sass build — `tailwind.config` is
  inlined in `src/_includes/layouts/base.njk`. There is no compiled/content-hashed
  stylesheet; `src/_includes/css/site.css` only holds the handful of things Tailwind
  utilities can't (SVG icon strokes, keyframe animation). This is the main way this
  repo diverges from `client-site-starter` — see README.md.
- **No CMS.** No `.pages.yml`, no Pages CMS. Content lives in `src/_data/` and is
  edited by changing files directly.
- **Data**: `src/_data/business.json` (contact info, box settings), `src/_data/produce.json`
  (the box-builder item catalog).
- **Feature**: `src/boxes.njk` + `src/_includes/js/box-builder.js` — a same-session
  weight/price calculator, not a persistent cart.
- **Deployment**: pushes to `main` build and deploy to GitHub Pages via
  `.github/workflows/build-deploy.yml`.

## Code style

- 2-space indentation, LF line endings, UTF-8 (per `.editorconfig`)
- Prefer Tailwind utility classes in templates over adding to `site.css`; only add
  there when Tailwind genuinely can't express it
- Dates: UTC, Luxon filters `readableDate` (display) / `htmlDateString` (machine-readable)

## Adding a new page

1. Create `src/<page-name>.njk` with front matter `layout: layouts/page.njk`
2. Add it to `src/_data/navigation.json` if it belongs in the nav
3. Style with Tailwind utility classes directly — see any existing page for the
   established palette (`moss`, `clay`, `cream` — defined in `base.njk`'s
   `tailwind.config`)

## What NOT to do

- Don't add a Sass build back in — if this site needs more custom CSS than Tailwind
  utilities comfortably express, that's a sign to reconsider the Tailwind CDN choice
  entirely, not to bolt on a second styling system
- Don't add a runtime backend/server — this is a static site by design
- Don't turn the box builder into a persistent cart without deciding that's actually
  wanted — it's deliberately a lighter-weight, same-session tool

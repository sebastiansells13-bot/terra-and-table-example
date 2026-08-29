# terra-and-table-example

A live example site for a fictional CSA/vegetable farm — **Terra & Table**.

**Live site:** https://sebastiansells13-bot.github.io/terra-and-table-example/

## How this differs from the template and the other examples

Still built on Eleventy (the same SSG as client-site-starter and its other
descendants), but the styling approach is completely different:

- **Tailwind CDN instead of Sass.** No `src/_includes/css/*.scss`, no
  content-hashed compiled stylesheet, no Sass build step in `package.json` at
  all — `tailwind.config` is inlined in `base.njk` and utility classes are
  written directly in the templates. Compare `eleventy.config.cjs` here
  (no `assetFiles`/`contentHash` stylesheet logic) to the other examples'.
- **No product/cart infrastructure.** The "Build a Box" tool (`src/boxes.njk`
  + `src/_includes/js/box-builder.js`) is a same-session preview calculator,
  not a persistent cart — no localStorage, nothing survives a page reload.
  Server-rendered quantity inputs, not JS-injected DOM, which sidesteps the
  pathPrefix/asset-URL issue the ecommerce examples had to solve for
  JS-inserted images.
- **All-original SVG icons** (`src/_includes/components/veg-icon.njk`) instead
  of photography — no image sourcing at all for this one.
- **No CMS.** Not every client site needs one; this demonstrates the plainer
  end of that decision.
- **Different type system entirely** — serif display face (Fraunces) for
  headings against a warm cream/moss-green palette, vs. the other examples'
  system-font, corporate-clean look.

## Feature: Build Your Box

A live weight/price calculator across 8 produce items, with a capacity meter
that turns red past the box's weight limit — genuinely computed client-side,
same honesty pattern as the shipping calculators on the ecommerce examples
(explicitly a preview, not a binding order).

## Local development

```bash
npm install
npm start
```

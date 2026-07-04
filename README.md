# Atelier Vermeil — luxury painting studio demo

Single-file demo website for a **fictional** boutique architectural painting
company. Editorial aesthetic: plaster ground, espresso ink, burnished bronze
accent; Fraunces + Hanken Grotesk (both OFL, embedded as data URIs); slow
scroll-triggered reveals, parallax hero, cursor-aware hovers, masonry gallery
with lightbox, and a demo consultation form.

## Structure
- `src/design-system.css` — shared tokens, primitives, reveal system
- `src/shared.js` — reveal observer, scroll driver, custom cursor, magnetic hover
- `src/sections/*.html` — self-contained section fragments (markup + scoped CSS/JS)
- `assets/img` — 17 color-graded CC BY 2.0 photographs + `manifest.json` (full attribution)
- `assets/fonts` — OFL webfonts (latin subsets)
- `build.mjs` — inlines everything into `dist/index.html` (standalone) and
  `dist/artifact.html` (body-only build)
- `shot.mjs` / `interact.mjs` — Playwright verification (screenshots, overflow,
  entrance/lightbox/menu/form checks)

## Build & verify
```sh
node build.mjs
node shot.mjs      # full-page desktop + mobile screenshots, overflow + console checks
node interact.mjs  # entrance, lightbox, form validation/success, credits, mobile menu
```

## Licensing
All photography CC BY 2.0 via the Open Images Dataset (Flickr originals);
per-image author, source URL, and modification notes in
`assets/img/manifest.json` and in the site footer's "Photography credits &
licenses" section. Fonts: SIL OFL. Atelier Vermeil, its projects, clients and
contact details are fictional.

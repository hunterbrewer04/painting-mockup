# ATELIER VERMEIL — build spec (shared contract for all section builders)

Fictional demo site for a boutique luxury painting studio. Aesthetic:
architectural-digest-meets-boutique-studio. Muted, editorial, unhurried.
Nothing bouncy, nothing gimmicky. Generous whitespace, large confident type.

## Brand
- Name: **Atelier Vermeil** (wordmark: ATELIER VERMEIL, letterspaced)
- Descriptor: *Fine Architectural Painting* — Est. 2009, New York
- Voice: quiet, assured, few words. Craft language (pigment, substrate, finish
  schedule, coats, sheen). Never salesy. No exclamation marks. No emoji.
- Contact (fictional): inquiries@ateliervermeil.com · (212) 555-0184 ·
  Studio, 220 Grand Street, New York

## Tokens (already defined in design-system.css — USE THEM, never restate)
Colors: `--plaster #EFEAE3` ground · `--bone #E5DED2` raised surface ·
`--ink #211E1A` text · `--char #1C1916` dark chapter bg · `--char-2 #262119` ·
`--taupe #837868` secondary text · `--bronze #9C7B4A` accent ·
`--bronze-2 #C5A468` accent on dark · `--line` hairlines.
Type: `--serif` Fraunces 300 (display; italic for emphasis) · `--sans` Hanken
Grotesk (body/UI). Sizes: `--fs-display`, `--fs-h2`, `--fs-h3`, `--fs-body`,
`--fs-small`, `--fs-eyebrow`.
Motion: `--ease-out cubic-bezier(0.16,1,0.3,1)` · `--dur-slow 1.1s` ·
`--dur-med .7s` · `--dur-fast .35s`. All animation slow + restrained.
Rhythm: section padding `var(--sect-pad)`; horizontal container class
`.av-container`; gutters `var(--gut)`.

## Shared primitives (use, don't reinvent)
- `.av-container`, `.av-eyebrow` (bronze uppercase label w/ dash),
  `.av-rule` hairline, `.av-btn` / `.av-btn--solid` (bronze sweep hover),
  `.av-link` (underline-draw hover), `.av-frame` (overflow-hidden figure;
  child img slow-zooms on hover), `.av-serif-i` italic serif accent.
- Dark sections: add class `av-dark` on the `<section>` (remaps tokens).
- Reveals: add `data-reveal` (rise), or `data-reveal="fade|left|right|mask|line"`.
  Parent `data-reveal-group` auto-staggers descendants (default 0.09s; override
  with `data-reveal-stagger="0.12"`). Runtime adds `.is-revealed`. DO NOT write
  your own IntersectionObserver.
- `window.AV.onScroll(fn)` — rAF-batched scroll hook (for parallax).
  `window.AV.reduced` — prefers-reduced-motion boolean: gate any custom JS motion.
- `data-cursor="View"` on an element makes the site cursor ring expand with that
  label. `data-magnetic` gives subtle magnetic pull on hover. Use sparingly.

## Hard rules
1. Deliver ONE file: `<section id="…" class="…">…</section>` followed by ONE
   `<style>` block and (only if needed) ONE `<script>` block (IIFE, no globals,
   assume DOM already parsed — script runs after your section exists; shared.js
   runs last).
2. Every class you invent must carry your section prefix (given per task).
   Never style bare tags (except inside your `#id` scope) — scope EVERY rule
   under your section's `#id`.
3. No external requests of any kind. No libraries. Images ONLY via the
   placeholder tokens below (`src="{{IMG:name}}"`); the build inlines them as
   data URIs. They are real licensed photos — never add other media.
4. Responsive: mobile-first sanity at 360px, refined at 768/1100/1440. No
   horizontal scroll ever. Type must use tokens (fluid).
5. Respect `prefers-reduced-motion` for ANY animation you add beyond the shared
   reveal system.
6. Real copy only (write it in brand voice) — no lorem, no placeholders.
7. Accessible: semantic landmarks, alt text (supplied below), labeled controls,
   focus-visible states, aria where warranted.

## Image inventory (token → content, w×h)
- `hero` — bright Parisian apartment, herringbone parquet, tall windows (1500×999)
- `vault` — cream gothic vaulted plaster ceiling, upward view (1300×860)
- `brush` — flat brush resting on wet oxblood lacquer, mirror reflection (1200×900)
- `svc-interior` — white kitchen, lantern pendant, marble island (1200×900)
- `svc-exterior` — French brick château, flower boxes, lawn (1100×733)
- `svc-finishes` — ornate sage-green plasterwork ceiling panel (1100×825)
- `svc-color` — artist brushes in a pale blue cup, plaster background, portrait (1000×1332)
- `g-mansard` — pale-blue mansard-roof mansion, storm sky (1100×825)
- `g-neoclassical` — white neoclassical stone house portico (1100×825)
- `g-victorian` — black-and-cream Victorian with turret, portrait (900×1200)
- `g-banister` — oak staircase banister close-up (1100×825)
- `g-lobby` — grand hotel lobby, chandeliers, fountain (1100×825)
- `g-door` — carved oak door, verdigris eagle knocker, portrait (900×1200)
- `g-spiral` — spiral staircase from above, monochrome (1100×825)
- `g-chardoor` — weathered charcoal door, iron scrollwork, portrait (900×1199)
- `proc-ladder` — monochrome stepladder in empty room, portrait (900×1199)
- `proc-painter` — monochrome painter on ladder painting siding (1100×825)

All photos: CC BY 2.0 via Open Images/Flickr, graded for cohesion. Credits are
rendered in the footer (contact/footer builder handles it).

## Page order (anchor ids fixed)
`#hero` → `#philosophy` → `#services` → `#portfolio` (dark) → `#process` →
`#testimonials` (dark) → `#contact` + `<footer>`.
Nav links: The Studio (#philosophy), Services (#services), Work (#portfolio),
Process (#process), Contact (#contact).

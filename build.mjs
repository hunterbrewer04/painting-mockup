// Assembles the single-file site: inlines sections, fonts, and images as data URIs.
// Outputs dist/artifact.html (body content only, for the Artifact tool)
// and dist/index.html (standalone page for local preview / the repo).
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';

const SECTION_ORDER = [
  '10-hero.html',
  '20-philosophy.html',
  '30-services.html',
  '40-portfolio.html',
  '50-process.html',
  '60-testimonials.html',
  '70-contact.html',
];

const css = readFileSync('src/design-system.css', 'utf8');
const js = readFileSync('src/shared.js', 'utf8');

let body = '';
for (const f of SECTION_ORDER) {
  body += `\n<!-- ══════════ ${f} ══════════ -->\n` + readFileSync(`src/sections/${f}`, 'utf8');
}

let page =
  `<style>\n${css}\n</style>\n` +
  body +
  `\n<script>\n${js}\n</script>\n`;

// inline assets
const b64 = (p) => readFileSync(p).toString('base64');
page = page.replace(/\{\{FONT:([\w-]+)\}\}/g, (_, name) =>
  `data:font/woff2;base64,${b64(`assets/fonts/${name}.woff2`)}`);
page = page.replace(/\{\{IMG:([\w-]+)\}\}/g, (_, name) =>
  `data:image/jpeg;base64,${b64(`assets/img/${name}.jpg`)}`);

const leftover = page.match(/\{\{(IMG|FONT):[\w-]+\}\}/g);
if (leftover) throw new Error('Unresolved asset tokens: ' + [...new Set(leftover)].join(', '));

writeFileSync('dist/artifact.html', `<title>Atelier Vermeil — Fine Architectural Painting</title>\n` + page);

writeFileSync('dist/index.html',
`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Atelier Vermeil — Fine Architectural Painting</title>
<meta name="description" content="Demo site for a fictional boutique luxury painting studio.">
</head>
<body>
${page}
</body>
</html>`);

console.log('dist/artifact.html', (statSync('dist/artifact.html').size / 1e6).toFixed(2), 'MB');
console.log('dist/index.html', (statSync('dist/index.html').size / 1e6).toFixed(2), 'MB');

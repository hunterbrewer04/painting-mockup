// Screenshot harness: full-page desktop + mobile captures of dist/index.html
// Usage: node shot.mjs [outdir]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const out = process.argv[2] || 'shots';
mkdirSync(out, { recursive: true });
const url = 'file://' + resolve('dist/index.html');

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

async function capture(name, viewport, opts = {}) {
  const page = await browser.newPage({ viewport, ...opts });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(2600); // let entrance sequence finish
  // force all reveals for the full-page shot
  await page.evaluate(() => {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-revealed'));
  });
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
  // hero-only crisp shot
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/${name}-hero.png` });
  const hscroll = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(name, 'h-overflow(px):', hscroll, 'errors:', errors.length ? errors : 'none');
  await page.close();
}

await capture('desktop', { width: 1440, height: 900 });
await capture('mobile', { width: 390, height: 844 }, { isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await browser.close();

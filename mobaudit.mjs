import { chromium } from 'playwright';
import { resolve } from 'node:path';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await page.goto('file://' + resolve('dist/index.html'), { waitUntil: 'load' });
await page.waitForTimeout(3000);
await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-revealed')));
await page.waitForTimeout(900);
await page.screenshot({ path: 'shots/m0-hero.png' });
const stops = ['#philosophy', '#services', '#portfolio', '#process', '#testimonials', '#contact', '#footer'];
for (const sel of stops) {
  await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'start' }), sel);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `shots/m-${sel.slice(1)}-a.png` });
  await page.evaluate(() => window.scrollBy(0, 780));
  await page.waitForTimeout(700);
  await page.screenshot({ path: `shots/m-${sel.slice(1)}-b.png` });
}
// touch target audit
const targets = await page.evaluate(() => {
  const bad = [];
  document.querySelectorAll('a, button, input, select, textarea, [tabindex="0"]').forEach(el => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || r.width === 0) return;
    if ((r.height < 40 || r.width < 40) && el.closest('#footer') === null)
      bad.push(`${el.tagName}${el.className ? '.' + String(el.className).split(' ')[0] : ''} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 24)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
  });
  return bad;
});
// form font sizes (iOS zoom trigger <16px)
const inputs = await page.evaluate(() =>
  [...document.querySelectorAll('#contact input, #contact select, #contact textarea')].map(i =>
    `${i.tagName}${i.name ? ':' + i.name : ''} font=${getComputedStyle(i).fontSize} h=${Math.round(i.getBoundingClientRect().height)}`));
console.log('SMALL TOUCH TARGETS (outside footer):\n' + targets.join('\n'));
console.log('\nFORM CONTROLS:\n' + inputs.join('\n'));
await browser.close();

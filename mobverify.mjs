import { chromium } from 'playwright';
import { resolve } from 'node:path';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await page.goto('file://' + resolve('dist/index.html'), { waitUntil: 'load' });
await page.waitForTimeout(3000);
await page.screenshot({ path: 'shots/v-hero.png' });
await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-revealed')));
await page.evaluate(() => document.querySelector('#philosophy .phi-collage').scrollIntoView({ block: 'center' }));
await page.waitForTimeout(1400);
await page.screenshot({ path: 'shots/v-collage.png' });
// open lightbox, swipe left, swipe down to close
await page.evaluate(() => document.querySelector('#portfolio .pf-figure').scrollIntoView({ block: 'center' }));
await page.waitForTimeout(800);
await page.locator('#portfolio .pf-figure').first().tap();
await page.waitForTimeout(1400);
const idx0 = await page.evaluate(() => document.querySelector('.pf-lb-index').textContent);
await page.touchscreen.tap(195, 400); // no-op tap on image area shouldn't close
const swipe = async (x1, y1, x2, y2) => {
  await page.evaluate(async ([a, b, c, d]) => {
    const t = (x, y, type) => {
      const touch = new Touch({ identifier: 1, target: document.querySelector('.pf-lightbox'), clientX: x, clientY: y });
      document.querySelector('.pf-lightbox').dispatchEvent(new TouchEvent(type, { touches: type === 'touchend' ? [] : [touch], changedTouches: [touch], bubbles: true }));
    };
    t(a, b, 'touchstart'); await new Promise(r => setTimeout(r, 90)); t(c, d, 'touchend');
  }, [x1, y1, x2, y2]);
};
await swipe(300, 400, 120, 410);   // swipe left -> next
await page.waitForTimeout(1300);
const idx1 = await page.evaluate(() => document.querySelector('.pf-lb-index').textContent);
await page.screenshot({ path: 'shots/v-lightbox.png' });
await swipe(200, 300, 210, 520);   // swipe down -> close
await page.waitForTimeout(1100);
const closed = await page.evaluate(() => document.querySelector('.pf-lightbox').hidden);
console.log('lightbox index:', idx0, '→', idx1, '| swipe-down closed =', closed);
await browser.close();

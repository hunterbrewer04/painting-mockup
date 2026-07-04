// Interaction verification: entrance, lightbox, mobile menu, form states.
import { chromium } from 'playwright';
import { resolve } from 'node:path';

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const url = 'file://' + resolve('dist/index.html');
const log = (...a) => console.log('•', ...a);

// -- entrance sequence frame (early capture)
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url);
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'shots/x-entrance.png' });
  const entered = await page.evaluate(() => document.body.classList.contains('av-entered'));
  await page.waitForTimeout(2200);
  const enteredAfter = await page.evaluate(() => document.body.classList.contains('av-entered'));
  const scrollUnlocked = await page.evaluate(() => getComputedStyle(document.body).overflow !== 'hidden');
  log('entrance: mid-sequence entered =', entered, '| after =', enteredAfter, '| scroll unlocked =', scrollUnlocked);

  // -- lightbox
  await page.locator('#portfolio figure').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await page.locator('#portfolio figure').first().click();
  await page.waitForTimeout(1300);
  await page.screenshot({ path: 'shots/x-lightbox.png' });
  const dlgVisible = await page.evaluate(() => {
    const d = document.querySelector('#portfolio [role="dialog"]');
    return d && getComputedStyle(d).display !== 'none' && d.querySelector('img')?.naturalWidth > 0;
  });
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(900);
  const idx = await page.evaluate(() => document.querySelector('#portfolio [role="dialog"]')?.textContent.match(/\d\s*\/\s*\d/)?.[0]);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1100);
  const dlgClosed = await page.evaluate(() => {
    const d = document.querySelector('#portfolio [role="dialog"]');
    return !d || getComputedStyle(d).display === 'none' || d.getAttribute('aria-hidden') === 'true' || !d.checkVisibility();
  });
  log('lightbox: opens =', dlgVisible, '| arrow →', idx, '| Esc closes =', dlgClosed);

  // -- form: invalid submit then valid submit
  await page.locator('#contact form button[type="submit"], #contact form .av-btn--solid').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.locator('#contact form button[type="submit"], #contact form .av-btn--solid').first().click();
  await page.waitForTimeout(700);
  const errCount = await page.locator('#contact [role="alert"]:visible, #contact .ct-error:visible').count();
  await page.screenshot({ path: 'shots/x-form-errors.png' });
  await page.fill('#contact input[type="text"], #contact input[name*="name" i]', 'Test Reviewer');
  await page.fill('#contact input[type="email"]', 'review@example.com');
  await page.fill('#contact textarea', 'A note about a townhouse with tired walls.');
  await page.locator('#contact form button[type="submit"], #contact form .av-btn--solid').first().click();
  await page.waitForTimeout(1400);
  await page.screenshot({ path: 'shots/x-form-success.png' });
  const success = await page.evaluate(() => /thank you/i.test(document.querySelector('#contact').textContent));
  log('form: errors on empty submit =', errCount, '| success state =', success);

  // -- footer credits details
  await page.locator('#footer details summary').scrollIntoViewIfNeeded();
  await page.locator('#footer details summary').click();
  await page.waitForTimeout(500);
  const credits = await page.locator('#footer details a').count();
  await page.screenshot({ path: 'shots/x-credits.png' });
  log('footer credits links =', credits);
  await page.close();
}

// -- mobile menu
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto(url);
  await page.waitForTimeout(2900);
  const burger = page.locator('header button[aria-expanded]');
  await burger.click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'shots/x-mobile-menu.png' });
  const expanded = await burger.getAttribute('aria-expanded');
  await page.locator('a[href="#services"]:visible').last().click();
  await page.waitForTimeout(1600);
  const y = await page.evaluate(() => window.scrollY);
  await page.screenshot({ path: 'shots/x-mobile-services.png' });
  log('mobile menu: expanded =', expanded, '| link scrolled to y =', y);
  await page.close();
}
await browser.close();
console.log('done');

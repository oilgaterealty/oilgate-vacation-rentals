// Verifies every design sample in a real browser: required content, no phone numbers, images load,
// booking search is first and works end to end (pick dates, submit, checkout link appears, compare box updates).
// Usage: node scripts/samples/verify.mjs
import { readdir, readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import { serve } from './shoot.mjs';

const dir = new URL('../../samples/', import.meta.url);
const files = (await readdir(dir)).filter(f => /^0\d-.*\.html$/.test(f)).sort();
const PHONE = /(?:\+?1[\s().-]*)?\(?\d{3}\)?[\s().-]*\d{3}[\s.-]*\d{4}/;
const must = [/No cleaning fees, ever/i, /unless house rules are broken/i, /Compare booking options/i, /Live quote unavailable/i, /at least 18/, /except as required by law/, /oilgaterealty@gmail\.com/];
const banned = [/Prices in USD/i, /call your host/i, /tel:/i, /deposit/i, /lorem|ipsum/i, /\$\s?\d/];
const srv = serve(), port = srv.address().port;
const browser = await chromium.launch();
let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.log('  FAIL', msg); } };
for (const f of files) {
  console.log(f);
  const html = await readFile(new URL(f, dir), 'utf8');
  for (const re of banned) check(!re.test(html), `banned ${re}`);
  check((html.match(/class="primary/g) || []).length === 1, 'exactly one primary CTA');
  check(/Oilgate-Vacation-Rentals|ovr-(primary|secondary|alt)/.test(html), 'official OVR logo used');
  check(!/ogr-logo/.test(html), 'no Oilgate Realty logo');
  check((html.match(/<h1[ >]/g) || []).length === 1, 'one h1');
  const refs = (html.match(/<!-- Design references[\s\S]*?-->/) || [''])[0].match(/https:\/\//g) || [];
  check(refs.length >= 3 && refs.length <= 6, `3-5 reference URLs in footer comment (found ${refs.length})`);
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(String(e))); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(`http://localhost:${port}/samples/${f}`, { waitUntil: 'networkidle' });
  const text = await p.evaluate(() => document.body.innerText + ' ' + [...document.querySelectorAll('[alt],[title],[aria-label]')].map(e => (e.alt || '') + (e.title || '') + (e.getAttribute('aria-label') || '')).join(' '));
  for (const re of must) check(re.test(text), `missing ${re}`);
  check(!PHONE.test(text.normalize('NFKC')), 'phone-like number in visible text');
  check(await p.evaluate(() => document.querySelector('main').firstElementChild.id === 'availability'), 'booking is first in main');
  const top = await p.evaluate(() => document.querySelector('#availability').getBoundingClientRect().top);
  check(top < 300, `booking starts high on the phone screen (top ${Math.round(top)}px)`);
  check(/Parkgate[\s\S]{0,400}2 bedrooms · 2 beds/i.test(text) && !/Parkgate[^.]{0,60}two units/i.test(text), 'Parkgate shown as 2 bedrooms / 2 beds, never two units');
  // Booking flow: open calendar, pick two future days, submit.
  await p.click('#bk-in');
  check(await p.isVisible('#bk-cal'), 'calendar opens');
  await p.click('.bk-nav[data-m="1"]');
  const days = p.locator('.bk-day:not([disabled])');
  await days.nth(3).click(); await days.nth(2).click();
  await p.click('.bk-go');
  check(await p.isVisible('#bk-checkout'), 'checkout link shown after search');
  check(/3 nights/.test(await p.textContent('#bk-status')), 'status shows 3 nights');
  check(/3 nights/.test(await p.textContent('#cmp-context')), 'compare box picks up dates');
  const h1 = await p.getAttribute('#bk-checkout', 'href');
  check(/arrival=\d{4}-\d\d-\d\d&departure=\d{4}-\d\d-\d\d&adults=2/.test(h1), 'checkout link carries dates and guests');
  const inBefore = await p.textContent('#bk-in');
  await p.click('#bk-out');
  check(await p.locator('.bk-day.is-on').first().isDisabled(), 'check-in day and earlier are disabled while picking check-out');
  await p.locator('.bk-day.is-on').first().click({ force: true }).catch(() => {});
  check((await p.textContent('#bk-in')) === inBefore, 'invalid check-out tap keeps check-in');
  await p.click('#bk-out');
  await p.click('#bk-out'); await days.nth(4).click();
  check((await p.textContent('#bk-in')) === inBefore, 'editing check-out keeps check-in');
  check(!(await p.isVisible('#bk-checkout')), 'stale checkout link hidden after an edit');
  check(/5 nights/.test(await p.textContent('#bk-status')), 'edited range is 5 nights');
  check(await p.evaluate(() => document.activeElement?.classList.contains('bk-day')), 'focus stays on the picked day');
  await p.click('.bk-go');
  check(await p.isVisible('#bk-checkout'), 'checkout link back after re-search');
  await p.selectOption('#bk-stay', '728474');
  check(/728474/.test(await p.getAttribute('#bk-checkout', 'href')), 'checkout link follows stay');
  check(/Not listed for Parkgate/.test(await p.textContent('#compare')), 'Parkgate Airbnb row');
  await p.click('.bk-pm[data-d="1"]');
  check((await p.textContent('#bk-g')).trim() === '3', 'guest stepper');
  for (let y = 0; y < 30000; y += 500) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(40); }
  await p.waitForTimeout(600);
  const bad = await p.evaluate(() => [...document.images].filter(i => !(i.complete && i.naturalWidth > 0) || i.getBoundingClientRect().height < 2).map(i => i.getAttribute('src')));
  check(bad.length === 0, `images not loaded: ${bad.join(', ')}`);
  check(errs.length === 0, `console errors: ${errs.join(' | ')}`);
  await ctx.close();
}
await browser.close(); srv.close();
console.log(fails ? `verify FAILED: ${fails}` : `verify PASS: ${files.length} samples`);
process.exitCode = fails ? 1 : 0;

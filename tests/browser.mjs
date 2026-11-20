import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';
import assert from 'node:assert/strict';
const remote = process.env.PEPPER_SITE;
const server = remote ? null : createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (path.includes('..')) { res.writeHead(400).end(); return; }
  try { const data = await readFile(new URL('..' + (path === '/' ? '/index.html' : path), import.meta.url)); res.setHeader('Content-Type', { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' }[extname(path)] || 'application/octet-stream'); res.end(data); } catch { res.writeHead(404).end(); }
});
if (server) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = remote || `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.route('https://pepper.oilgateai.com/**', r => r.abort());
  for (const file of ['unit-1-at-oilgate-at-oakdale.html', 'unit-2-at-oilgate-at-oakdale.html', 'oilgate-at-parkgate.html']) {
    const errors = []; page.removeAllListeners('pageerror'); page.on('pageerror', e => errors.push(e.stack));
    await page.goto(new URL(file, base).href, { waitUntil: 'domcontentloaded' });
    await page.locator('.pepper-panel summary').click();
    for (const [label, expected] of [['Parking?', /parking/i], ['Pets?', /host/], ['Check-in time?', /3 PM/], ['House rules', /Quiet hours/], ['Contact host', /330-333-1425/]]) {
      await page.getByRole('button', { name: label, exact: true }).click();
      assert.match(await page.locator('.pepper-reply').innerText(), expected);
    }
    await page.locator('[name=arrival]').fill('2027-03-08'); await page.locator('[name=departure]').fill('2027-03-11');
    await page.getByRole('button', { name: 'Check my dates', exact: true }).click();
    await page.waitForFunction(() => /unavailable|not connected/.test(document.querySelector('.pepper-reply').textContent));
    assert.ok(await page.locator('.pepper-book').getAttribute('href'));
    await page.getByRole('button', { name: 'Price for my dates', exact: true }).click();
    await page.waitForFunction(() => /unavailable|not connected/.test(document.querySelector('.pepper-reply').textContent));
    assert.doesNotMatch(await page.locator('.pepper-reply').innerText(), /\$/);
    assert.equal(await page.locator('.lodgify-widget').count(), 1);
    assert.ok(await page.getByRole('link', { name: 'Open secure Lodgify checkout', exact: true }).getAttribute('href'));
    const widget = page.frameLocator('.lodgify-widget iframe').locator('#lodgify-search-bar [data-testid=button]');
    await page.locator('.pepper-panel summary').click();
    await page.locator('.lodgify-widget iframe').scrollIntoViewIfNeeded();
    await widget.waitFor();
    assert.match(await widget.getAttribute('href'), /ogr\/(603326|603323|728474)/);
    // Currency is resolved asynchronously by Lodgify's own localization API.
    await page.waitForFunction(() => document.querySelector('.lodgify-widget iframe').contentDocument?.querySelector('[data-testid=button]')?.href.includes('currency=USD'));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const ownErrors = errors.filter(x => !x.includes('app.lodgify.com'));
    assert.deepEqual(ownErrors, []);
    if (errors.length) console.log('Vendor widget network errors:', errors.length, '(direct checkout fallback present)');
    console.log('PASS all-AI/Worker outage taps, booking fallback and mobile layout:', file);
  }
  if (process.env.PEPPER_SCREENSHOT) await page.screenshot({ path: process.env.PEPPER_SCREENSHOT, fullPage: false });
} finally { await browser.close(); if (server) await new Promise(resolve => server.close(resolve)); }

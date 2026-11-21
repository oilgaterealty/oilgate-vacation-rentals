import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const data = JSON.parse(await readFile(new URL('data/properties.json', root), 'utf8'));
const remote = process.env.PEPPER_SITE;
const server = remote ? null : createServer(async (req, res) => {
  try { const path = new URL(req.url, 'http://localhost').pathname; if (path.includes('..')) throw new Error(); const bytes = await readFile(new URL('.' + (path === '/' ? '/index.html' : path), root)); res.setHeader('Content-Type', { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css' }[extname(path)] || 'application/octet-stream'); res.end(bytes); } catch { res.writeHead(404).end(); }
});
if (server) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = remote || `http://127.0.0.1:${server.address().port}/`;
const proof = { base, checkedAt: new Date().toISOString(), pages: [], photosChecked: 0 };
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const file of ['index.html', ...Object.values(data.properties).map(p => p.page)]) {
      const response = await page.goto(new URL(file, base).href, { waitUntil: 'domcontentloaded' });
      assert.equal(response.status(), 200);
      if (remote) {
        const liveBytes = Buffer.from(await response.body()), localBytes = await readFile(new URL(file, root));
        assert.equal(createHash('sha256').update(liveBytes).digest('hex'), createHash('sha256').update(localBytes).digest('hex'), 'Live bytes match release: ' + file);
      }
      assert.ok((await page.locator('#availability').boundingBox()).y < 260);
      assert.equal(await page.locator('#compare').count(), 1);
      assert.match(await page.locator('#availability').innerText(), /No cleaning fees, ever/);
      assert.match(await page.locator('#rental-terms').innerText(), /minimum booking age is 18/);
      assert.doesNotMatch(await page.locator('body').innerText(), /(?:\+?1[\s().-]*)?\d{3}[\s().-]*\d{3}[\s().-]*\d{4}|Call your host/i);
      assert.equal(await page.locator('a[href^="tel:"]').count(), 0);
      const widget = page.frameLocator('.lodgify-widget iframe').locator('#lodgify-search-bar [data-testid=button]');
      await widget.waitFor({ timeout: 30000 });
      await page.waitForTimeout(1200);
      const frame = await page.locator('.lodgify-widget iframe').boundingBox();
      assert.ok(frame.height < 580, 'Widget should fit compact search, not fixed 580px');
      await page.frameLocator('.lodgify-widget iframe').locator('[data-testid=start-date-button]').click();
      await page.waitForTimeout(300);
      const expanded = await page.locator('.lodgify-widget iframe').boundingBox();
      const contentBottom = await page.frameLocator('.lodgify-widget iframe').locator('body').evaluate(body => Math.max(...[...body.querySelectorAll('*')].map(el => el.getBoundingClientRect()).filter(r => r.width && r.height).map(r => r.bottom)));
      assert.ok(expanded.height >= contentBottom, 'Open calendar must fit inside iframe');
      await page.frameLocator('.lodgify-widget iframe').locator('[data-testid=start-date-button]').click();
      await page.waitForTimeout(300);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      if (file === 'index.html') {
        await page.locator('#stay-picker').selectOption('728474');
        await page.frameLocator('.lodgify-widget iframe').locator('#lodgify-search-bar [data-testid=button]').waitFor();
        assert.match(await page.locator('.checkout-link').getAttribute('href'), /728474/);
      } else {
        const p = Object.values(data.properties).find(p => p.page === file);
        assert.equal(await page.locator('#photos img').count(), p.photos.length);
        await page.locator('.pepper-panel summary').click();
        await page.locator('#pepper-message').fill('What is the host phone number?');
        await page.getByRole('button', { name: 'Ask', exact: true }).click();
        await page.waitForTimeout(500);
        assert.doesNotMatch(await page.locator('.pepper-reply').innerText(), /(?:\+?1[\s().-]*)?\d{3}[\s().-]*\d{3}[\s().-]*\d{4}/);
        await page.locator('.pepper-panel summary').click();
      }
      if (process.env.CONTENT_PROOF_DIR) { await mkdir(process.env.CONTENT_PROOF_DIR, { recursive: true }); await page.screenshot({ path: `${process.env.CONTENT_PROOF_DIR}/${width}-${file}.png` }); }
      proof.pages.push({ file, width, status: response.status(), widgetHeight: frame.height });
      console.log(`PASS content, top widget, comparison, terms and mobile layout: ${file} at ${width}px`);
    }
  }
  const urls = [...new Set(Object.values(data.properties).flatMap(p => p.photos.map(x => x.url)))];
  let next = 0;
  await Promise.all(Array.from({ length: 6 }, async () => { while (next < urls.length) { const url = urls[next++]; const r = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(30000) }); assert.equal(r.status, 200, 'Lodgify photo available'); assert.match(r.headers.get('content-type'), /image/); proof.photosChecked++; } }));
  console.log(`PASS ${proof.photosChecked} unique Lodgify photos return HTTP 200.`);
  if (process.env.CONTENT_PROOF_DIR) await writeFile(`${process.env.CONTENT_PROOF_DIR}/content-proof.json`, JSON.stringify(proof, null, 2));
} finally { await browser.close(); if (server) await new Promise(resolve => server.close(resolve)); }

import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';
const root = new URL('../', import.meta.url);
const server = createServer(async (req, res) => { try { const path = new URL(req.url, 'http://localhost').pathname; const bytes = await readFile(new URL('.' + (path === '/' ? '/index.html' : path), root)); res.setHeader('Content-Type', { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css' }[extname(path)] || 'application/octet-stream'); res.end(bytes); } catch { res.writeHead(404).end(); } });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const messages = [];
  page.on('console', m => { if (m.type() === 'error') messages.push(m.text().slice(0, 300)); });
  page.on('pageerror', e => messages.push(e.stack.slice(0, 700)));
  await page.goto(process.env.PEPPER_SITE || `http://127.0.0.1:${server.address().port}/index.html`, { waitUntil: 'load' });
  await page.locator('.lodgify-widget iframe').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(4000);
  console.log('Console/page errors:', JSON.stringify(messages));
  console.log('Visible parent controls:', await page.locator('button:visible,input:visible').count());
  const frame = page.frameLocator('.lodgify-widget iframe');
  await frame.locator('[data-testid=start-date-button]').click();
  await page.waitForTimeout(300);
  console.log('Open calendar frame height:', await page.locator('.lodgify-widget iframe').evaluate(el => el.getBoundingClientRect().height));
  console.log('Calendar visible:', await frame.locator('[role=dialog]').count());
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }

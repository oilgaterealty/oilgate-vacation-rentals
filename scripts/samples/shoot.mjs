// Screenshots each sample at 390x844 (mobile) and 1440x900 (desktop) into samples/shots/.
// Usage: node scripts/samples/shoot.mjs [file ...] [--full]
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
const root = fileURLToPath(new URL('../../', import.meta.url));
const types = { '.html': 'text/html', '.webp': 'image/webp', '.png': 'image/png', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2' };
export function serve() {
  return createServer(async (req, res) => {
    let p = normalize(join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
    if (/[\\/]$/.test(p)) p = join(p, 'index.html');
    try { const b = await readFile(p); res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(b); }
    catch { res.writeHead(404); res.end('not found'); }
  }).listen(0);
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const srv = serve(); const port = srv.address().port;
  const args = process.argv.slice(2), full = args.includes('--full');
  const files = args.filter(a => !a.startsWith('--'));
  await mkdir(join(root, 'samples/shots'), { recursive: true });
  const browser = await chromium.launch();
  for (const f of files) {
    for (const [tag, vp, mobile] of [['mobile', { width: 390, height: 844 }, true], ['desktop', { width: 1440, height: 900 }, false]]) {
      const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
      const page = await ctx.newPage(); const errs = [];
      page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); page.on('pageerror', e => errs.push(String(e)));
      await page.goto(`http://localhost:${port}/samples/${f}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      const name = f.replace('.html', '');
      await page.screenshot({ path: join(root, `samples/shots/${name}-${tag}.png`) });
      if (full) await page.screenshot({ path: join(root, `samples/shots/_full-${name}-${tag}.png`), fullPage: true });
      console.log(f, tag, 'scrollWidth', sw, errs.length ? 'ERRORS ' + errs.join(' | ') : 'no console errors');
      await ctx.close();
    }
  }
  await browser.close(); srv.close();
}

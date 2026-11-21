import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { load } from 'cheerio';
const root = new URL('../', import.meta.url);
for (const page of (await readdir(root)).filter(x => x.endsWith('.html'))) {
  const html = await readFile(new URL(page, root), 'utf8');
  assert.doesNotMatch(html, /tel:|call your host/i, page);
  const $ = load(html);
  // Public social IDs can be long numbers. Check displayed copy and accessible labels.
  $('script,style').remove();
  const visible = $('body').text() + $('*[alt],*[title],*[aria-label]').toArray().map(el => ['alt', 'title', 'aria-label'].map(a => $(el).attr(a) || '').join(' ')).join(' ');
  assert.doesNotMatch(visible.normalize('NFKC'), /(?:\+?1[\s().-]*)?\d{3}[\s().-]*\d{3}[\s().-]*\d{4}/, page);
  if (page !== 'lodgify-widget.html') {
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, page + ': one heading');
    assert.match(html, /<nav[^>]*>[\s\S]*?The stays[\s\S]*?Good to know[\s\S]*?<\/nav>/, page);
    assert.match(html, /href="(?:https:\/\/checkout\.lodgify\.com\/en\/ogr\/\d+\/reservation\?currency=USD|index\.html#stays)">Contact host through Lodgify/, page);
  }
  console.log('PASS design/contact structure:', page);
}
for (const file of ['pepper.js', 'pepper-core.js', 'pepper-knowledge.json', 'scripts/integrate.mjs']) {
  const text = await readFile(new URL(file, root), 'utf8');
  assert.doesNotMatch(text, /tel:|hostPhone/, file);
}

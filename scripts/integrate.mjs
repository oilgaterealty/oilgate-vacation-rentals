import { readFile, writeFile } from 'node:fs/promises';
import knowledge from '../pepper-knowledge.json' with { type: 'json' };
const pages = [['index.html', ''], ...Object.entries(knowledge.properties).map(([id, p]) => [p.page, id])];
for (const [page, id] of pages) {
  const url = new URL('../' + page, import.meta.url);
  let html = await readFile(url, 'utf8');
  if (!html.includes('pepper.css')) html = html.replace('</head>', '<link rel="stylesheet" href="pepper.css"><script type="module" src="pepper.js"></script></head>');
  if (!html.includes('data-pepper')) html = html.replace('</body>', `<aside data-pepper data-property="${id}" aria-label="Pepper guest assistant"><a href="${id ? `https://checkout.lodgify.com/en/ogr/${id}/reservation?currency=USD` : 'index.html#stays'}">Contact your host</a></aside></body>`);
  if (id) {
    const widget = `<div class="lodgify-widget"><iframe title="Lodgify booking for ${knowledge.properties[id].name}" loading="lazy" src="lodgify-widget.html?property=${id}&amp;currency=USD"></iframe><a href="https://checkout.lodgify.com/en/ogr/${id}/reservation?currency=USD" target="_blank" rel="noopener">Open secure Lodgify checkout</a></div>`;
    if (html.includes('class="lodgify-widget"')) html = html.replace(/<div class="lodgify-widget">[\s\S]*?<\/aside>/, widget + '</aside>');
    else html = html.replace('</aside>', widget + '</aside>');
  }
  // Remove stale hardcoded financial statements. All current terms are at checkout.
  html = html.replace(/\$100 USD/g, 'shown at checkout').replace(/Current listings: paid prepayments are non-refundable\./g, 'Review the current cancellation terms in Lodgify checkout.').replace(/The current listings state that paid prepayments are non-refundable\./g, 'Cancellation terms depend on the live Lodgify quote.');
  html = html.replace(/Prices in USD · shown at checkout security deposit/g, 'Prices and security deposit shown in Lodgify checkout').replace(/The shown at checkout security deposit is separate from this stay-price comparison\./g, 'Review the current security deposit in Lodgify checkout.');
  await writeFile(url, html);
}

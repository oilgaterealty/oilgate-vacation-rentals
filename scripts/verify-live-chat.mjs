import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const base = process.env.PEPPER_SITE || 'https://oilgaterealty.github.io/oilgate-vacation-rentals/';
const endpoint = 'https://pepper-chat.oilgaterealty.workers.dev/chat';
const browser = await chromium.launch({ headless: true });
const proof = { site: base, endpoint, checkedAt: new Date().toISOString(), quotes: [] };
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  const knowledge = await page.evaluate(async () => (await fetch('./pepper-knowledge.json', { cache: 'no-store' })).json());
  assert.equal(knowledge.liveChatEnabled, true);
  assert.equal(knowledge.chatEndpoint, endpoint);
  for (const file of ['index.html', '404.html', ...Object.values(knowledge.properties).map(p => p.page)]) {
    const html = await page.evaluate(async file => (await fetch(file, { cache: 'no-store' })).text(), file);
    assert.doesNotMatch(html.normalize('NFKC'), /call your host|tel:|330[\s().-]*333[\s().-]*1425/i);
  }
  await page.locator('.pepper-panel summary').click();
  await page.locator('#pepper-message').fill('Where can I leave my vehicle?');
  const questionResponse = page.waitForResponse(r => r.url() === endpoint && r.request().method() === 'POST');
  await page.getByRole('button', { name: 'Ask', exact: true }).click();
  const question = await (await questionResponse).json();
  assert.equal(question.intent, 'parking');
  assert.notEqual(question.provider, 'no-ai');
  await page.waitForFunction(reply => document.querySelector('.pepper-reply').textContent === reply, question.reply);
  proof.question = question;
  console.log('PASS live natural-language question:', JSON.stringify(question));
  for (const [id, property] of Object.entries(knowledge.properties)) {
    await page.goto(new URL(property.page, base).href, { waitUntil: 'domcontentloaded' });
    await page.locator('.pepper-panel summary').click();
    assert.equal(await page.locator('[name=property]').inputValue(), id);
    await page.locator('[name=arrival]').fill('2027-03-08');
    await page.locator('[name=departure]').fill('2027-03-11');
    const response = page.waitForResponse(r => r.url() === endpoint && r.request().method() === 'POST');
    await page.getByRole('button', { name: 'Price for my dates', exact: true }).click();
    const quote = await (await response).json();
    assert.equal(quote.live, true);
    assert.match(quote.reply, /Lodgify stay total: \$\d+\.\d{2} USD/);
    await page.waitForFunction(reply => document.querySelector('.pepper-reply').textContent === reply, quote.reply);
    assert.equal(await page.locator('.lodgify-widget').count(), 1);
    proof.quotes.push({ id, name: property.name, arrival: '2027-03-08', departure: '2027-03-11', guests: 2, ...quote });
    console.log('PASS live UI quote:', id, quote.reply.split('\n')[0]);
    if (process.env.PEPPER_PROOF_DIR) await page.screenshot({ path: `${process.env.PEPPER_PROOF_DIR}/${id}-live.png` });
  }
  const denied = await fetch(endpoint, { method: 'POST', headers: { Origin: 'https://example.com', 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal(denied.status, 403);
  proof.cors = 'unapproved origin denied with 403';
  if (process.env.PEPPER_PROOF_DIR) await writeFile(`${process.env.PEPPER_PROOF_DIR}/live-proof.json`, JSON.stringify(proof, null, 2));
  console.log('PASS no host-call tab or phone on all five live HTML pages; CORS restricted.');
} finally { await browser.close(); }

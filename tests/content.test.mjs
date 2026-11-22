import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { load } from 'cheerio';
import data from '../data/properties.json' with { type: 'json' };
import knowledge from '../pepper-knowledge.json' with { type: 'json' };
const root = new URL('../', import.meta.url);
test('API counts and generated Pepper facts agree, including Parkgate correction', () => {
  for (const [id, expectedPhotos, beds] of [['603326', 37, 3], ['603323', 47, 3], ['728474', 29, 2]]) {
    const p = data.properties[id];
    assert.equal(p.photos.length, expectedPhotos);
    assert.equal(p.beds, beds);
    assert.equal(p.bedrooms, beds);
    assert.equal(knowledge.properties[id].beds, p.beds);
    assert.equal(knowledge.properties[id].bedrooms, p.bedrooms);
    assert.deepEqual(p.missing, []);
  }
  assert.equal(knowledge.liveChatEnabled, true);
  assert.equal(knowledge.chatEndpoint, 'https://pepper-chat.oilgaterealty.workers.dev/chat');
});
test('all pages put booking first and preserve comparison, contact, terms and privacy', async () => {
  for (const file of ['index.html', ...Object.values(data.properties).map(p => p.page)]) {
    const html = await readFile(new URL(file, root), 'utf8'), $ = load(html);
    assert.equal($('main').children().first().attr('id'), 'availability');
    assert.equal($('.lodgify-widget iframe').length, 1);
    assert.match($('#compare').text(), /Compare booking options/);
    assert.match($('#compare').text(), /Comparison layout only/);
    assert.match($('#rental-terms').text(), /minimum booking age is 18/);
    assert.match($('#rental-terms').text(), /except as required by law/);
    assert.match($('.date-search').text(), /No cleaning fees, ever/);
    assert.match($('.date-search').text(), /Unless house rules are broken/);
    assert.equal($(`a[href="mailto:${data.contact.email}"]`).length > 0, true);
    assert.doesNotMatch($('footer').text(), /Prices in USD/);
    assert.doesNotMatch($('body').text().normalize('NFKC'), /(?:\+?1[\s().-]*)?\d{3}[\s().-]*\d{3}[\s().-]*\d{4}|call your host/i);
    assert.equal($('a[href^="tel:"]').length, 0);
    for (const social of data.contact.social) assert.equal($(`a[href="${social.url}"]`).length, 1);
    const p = Object.values(data.properties).find(p => p.page === file);
    if (p) {
      assert.equal($('#photos img').length, p.photos.length);
      assert.match($('.property-hero').text(), new RegExp(`${p.bedrooms} bedrooms · ${p.beds} beds`));
      assert.ok($('#house-rules').text().includes('No pets'));
    }
  }
});

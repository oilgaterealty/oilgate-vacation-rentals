import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { load } from 'cheerio';
import data from '../data/properties.json' with { type: 'json' };
import knowledge from '../pepper-knowledge.json' with { type: 'json' };
import v3Knowledge from '../v3-preview/assets/concierge-knowledge.json' with { type: 'json' };
import prices from '../data/prices.json' with { type: 'json' };

const root = new URL('../', import.meta.url);

test('API counts, Parkgate owner override, and generated knowledge agree', () => {
  for (const [id, expectedPhotos, beds] of [['603326', 37, 3], ['603323', 47, 3], ['728474', 29, 3]]) {
    const p = data.properties[id];
    assert.equal(p.photos.length, expectedPhotos);
    assert.equal(p.beds, beds);
    assert.equal(p.bedrooms, beds);
    assert.equal(p.bathrooms, 1);
    assert.equal(knowledge.properties[id].beds, p.beds);
    assert.equal(knowledge.properties[id].bedrooms, p.bedrooms);
    assert.equal(v3Knowledge.properties[id].beds, p.beds);
    assert.equal(v3Knowledge.properties[id].bedrooms, p.bedrooms);
    assert.equal(v3Knowledge.properties[id].bathrooms, 1);
    assert.deepEqual(p.missing, []);
  }
  assert.equal(data.properties['728474'].ownerOverride?.source, 'LaVante, 2026-11-21');
  assert.equal(knowledge.liveChatEnabled, true);
  assert.equal(knowledge.chatEndpoint, 'https://pepper-chat.oilgaterealty.workers.dev/chat');
  assert.doesNotMatch(JSON.stringify(v3Knowledge), /lodgify/i);
});

test('live root pages remain intact before sign-off', async () => {
  for (const file of ['index.html', ...Object.values(data.properties).map(p => p.page)]) {
    const html = await readFile(new URL(file, root), 'utf8'), $ = load(html);
    assert.equal($('main').children().first().attr('id'), 'availability');
    assert.equal($('.lodgify-widget iframe').length, 1);
    assert.match($('#compare').text(), /Compare booking options/);
    assert.match($('#rental-terms').text(), /minimum booking age is 18/);
    assert.match($('#rental-terms').text(), /except as required by law/);
    assert.equal($(`a[href="mailto:${data.contact.email}"]`).length > 0, true);
    assert.doesNotMatch($('body').text().normalize('NFKC'), /(?:\+?1[\s().-]*)?\d{3}[\s().-]*\d{3}[\s().-]*\d{4}|call your host/i);
    assert.equal($('a[href^="tel:"]').length, 0);
  }
});

test('v3-preview pages implement Oilgate Signature theme, 27 fixes, zero Lodgify text, and real prices', async () => {
  const v3Pages = [
    'v3-preview/index.html',
    'v3-preview/unit-1-at-oilgate-at-oakdale.html',
    'v3-preview/unit-2-at-oilgate-at-oakdale.html',
    'v3-preview/oilgate-at-parkgate.html',
    'v3-preview/direct/index.html',
    'v3-preview/404.html',
  ];

  for (const file of v3Pages) {
    const html = await readFile(new URL(file, root), 'utf8');
    const $ = load(html);

    // Zero forbidden strings anywhere in markup or text
    assert.doesNotMatch(html, /lodgify/i, `${file} must not mention Lodgify`);
    assert.doesNotMatch(html, /tel:/i, `${file} must not contain tel:`);
    assert.doesNotMatch(html, /call your host/i, `${file} must not say Call your host`);
    assert.doesNotMatch(html, /suspended/i, `${file} must not mention suspension`);
    assert.doesNotMatch(html, /not entered/i, `${file} must not contain placeholder text`);
    assert.doesNotMatch(html, /prices not/i, `${file} must not contain placeholder text`);
    assert.doesNotMatch($('body').text().normalize('NFKC'), /(?:\+?1[\s().-]*)?\d{3}[\s().-]*\d{3}[\s().-]*\d{4}/);

    // Header has bigger logo, centered Akron, Ohio, and renamed nav
    assert.match($('header .top-location').text(), /Akron, Ohio/);
    assert.match($('header nav').text(), /Rentals/);
    assert.match($('header nav').text(), /The experience/);
    assert.match($('header nav').text(), /Real prices/);
    assert.match($('header nav').text(), /FAQ/);

    // Cleaning hook placement: top star badge reads only "No cleaning fees"; blue square holds big hook + exception
    assert.equal($('.chip').text().replace(/\s+/g, ' ').trim(), '★ No cleaning fees');
    assert.match($('.promise-main').text(), /No cleaning fees, ever/);
    assert.match($('.promise-exception').text(), /Unless house rules are broken/);

    // 18+ rule, liability, email, social, concierge
    assert.match($('#rental-terms').text(), /minimum booking age is 18/);
    assert.match($('#rental-terms').text(), /except as required by law/);
    assert.ok($(`a[href="mailto:${data.contact.email}"]`).length > 0);
    for (const social of data.contact.social) {
      assert.equal($(`a[href="${social.url}"]`).length, 1, `${file} missing ${social.name}`);
    }
    assert.equal($('[data-concierge]').attr('aria-label'), 'Ask our concierge');

    // Word "whole" retired (at most 1 occurrence, only in FAQ)
    const wholeMatches = html.match(/\bwhole\b/gi) || [];
    assert.ok(wholeMatches.length <= 1, `${file} uses "whole" ${wholeMatches.length} times`);

    // No duplicate IDs
    const ids = $('[id]').toArray().map(el => $(el).attr('id'));
    assert.equal(new Set(ids).size, ids.length, `${file} has duplicate IDs`);

    // Booking pages have Proceed button & form
    if (file !== 'v3-preview/404.html') {
      assert.equal($('main').children().first().attr('id'), 'availability');
      assert.equal($('form[data-book] button[type="submit"]').text().trim(), 'Proceed');
      assert.match($('#compare').text(), /7-night average/i);
      assert.match($('#compare').text(), /vacationrentals\.oilgaterealty\.com\/direct/);
    }

    // Rental page specifics
    const prop = Object.values(data.properties).find(p => `v3-preview/${p.page}` === file);
    if (prop) {
      assert.equal($('#photos img').length, prop.photos.length);
      assert.match($('.hero').text(), new RegExp(`${prop.bedrooms} bedrooms · ${prop.beds} beds · 1 bathroom`));
      assert.ok($('#house-rules').text().includes('No pets'));
    }
  }
});

test('data/prices.json contains fresh verified 7-night direct averages for all three rentals', () => {
  assert.ok(prices.checkedAt);
  assert.equal(prices.window?.nights, 7);
  for (const id of ['603326', '603323', '728474']) {
    const direct = prices.properties?.[id]?.channels?.direct;
    assert.ok(direct, `missing direct entry for ${id}`);
    assert.equal(direct.status, 'ok');
    assert.equal(typeof direct.averageNightly, 'number');
    assert.ok(direct.averageNightly > 0);
    assert.equal(direct.nightlyPrices.length, 7);
  }
});

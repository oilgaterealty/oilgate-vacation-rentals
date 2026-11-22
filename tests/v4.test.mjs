import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { load } from 'cheerio';
import {
  answer,
  detectIntent,
  detectIntentWithHistory,
  safeReply,
  SAFE,
} from '../v4-preview/assets/pepper-core.js';

const root = new URL('../', import.meta.url);
const v4Pages = [
  'v4-preview/index.html',
  'v4-preview/unit-1-at-oilgate-at-oakdale.html',
  'v4-preview/unit-2-at-oilgate-at-oakdale.html',
  'v4-preview/oilgate-at-parkgate.html',
  'v4-preview/direct/index.html',
  'v4-preview/404.html',
];

test('v4 preview pages contain no Lodgify wording, phone numbers, Sand Run, or shared washer text', async () => {
  for (const rel of v4Pages) {
    const html = await readFile(new URL(rel, root), 'utf8');
    const $ = load(html);
    const bodyText = $('body').text().normalize('NFKC');
    assert.doesNotMatch(bodyText, /lodgify/i, `${rel} mentions Lodgify`);
    assert.doesNotMatch(bodyText, /(?:\+?1[\s().-]*)?\d{3}[\s().-]*\d{3}[\s().-]*\d{4}|call your host/i, `${rel} leaks phone`);
    assert.equal($('a[href^="tel:"]').length, 0, `${rel} has tel link`);
    assert.doesNotMatch(bodyText, /sand run/i, `${rel} still mentions Sand Run`);
    assert.doesNotMatch(bodyText, /shared washer/i, `${rel} still mentions shared washer`);
    assert.doesNotMatch(bodyText, /host'?s?\s+email/i, `${rel} still says Host email`);
    assert.equal($('footer .footer-logos img').length, 3, `${rel} must show 3 transparent footer logos`);
    assert.equal($('#beams-canvas').length, 1, `${rel} must have animated beams background canvas`);
  }
});

test('v4 homepage meets all LaVante Nov 22 copy, order, ticker, and pricing requirements', async () => {
  const html = await readFile(new URL('v4-preview/index.html', root), 'utf8');
  const $ = load(html);
  const body = $('body').text();

  assert.match($('h1').text(), /More than just a stay in Akron\./);
  assert.match($('.slogan-chip').text(), /No cleaning fees, ever\./);
  assert.equal($('.top-location').text().trim(), 'Akron, Ohio');
  assert.match($('.hero p.l').text(), /Cable TV · Free pay-per-view · Fast Wi-Fi · Free parking/);

  // Booking box: no removed chips, no proceed sentence, Reserve button, capitalized Beds/Bathrooms/Bedrooms
  const bookText = $('.glass-book').text();
  assert.doesNotMatch(bookText, /Direct checkout|Instant date|Guest prefill|Select your dates/i);
  assert.match(bookText, /Choose your stay[\s\S]*Find your dates[\s\S]*Check in[\s\S]*Check out[\s\S]*Guests[\s\S]*Reserve/);
  assert.match(bookText, /Bedrooms/);
  assert.match(bookText, /Beds/);
  assert.match(bookText, /Bathroom/);

  // Ticker: removed Free parking included and Direct booking; keeps exact 5 items
  const marqueeText = $('.marquee').text();
  assert.doesNotMatch(marqueeText, /Free parking included|Direct booking/i);
  assert.match(marqueeText, /Minutes to Highland Square and downtown Akron/);
  assert.match(marqueeText, /3-bedroom private homes/);
  assert.match(marqueeText, /Full private kitchens/);
  assert.match(marqueeText, /Cable TV, free pay-per-view, fast Wi-Fi, free parking/);

  // Homes cards highlights
  const cardsText = $('#rentals').text();
  assert.match(cardsText, /PENTHOUSE SUITE/);
  assert.match(cardsText, /separate dining room/i);
  assert.match(cardsText, /completely renovated/i);
  assert.match(cardsText, /2 queen, 1 full/i);
  assert.doesNotMatch(cardsText, /desk in each bedroom/i);

  // Experience timeline & nearby spots
  const expText = $('#experience').text();
  assert.match(expText, /2:45 PM/);
  assert.match(expText, /3:00 PM/);
  assert.match(expText, /11:00 AM/);
  assert.match(expText, /Swenson/i);
  assert.match(expText, /Highland Square/i);
  assert.match(expText, /LeBron James/i);
  assert.match(expText, /I PROMISE School/i);
  assert.match(expText, /Home Court/i);
  assert.match(expText, /Blossom Music Center/i);

  // Pricing section: one average across all units, 7-night average once at top, no /direct, no "Each rate shows"
  const pricingText = $('#pricing').text();
  assert.equal((pricingText.match(/7-night average/gi) || []).length, 1);
  assert.doesNotMatch(pricingText, /\/direct|Each rate shows|7-night avg \/ night/i);
  assert.equal($('#pricing [data-price-val]').length, 4);
  assert.match(pricingText, /Our site/);
  assert.match(pricingText, /vacationrentals\.oilgaterealty\.com/);
});

test('v4 unit pages have hero photo, about photo, categorized kinetic photo tour in exact order, and per-unit pricing', async () => {
  const expectedOrder = [
    'Exterior',
    'Living room',
    'Full kitchen',
    'Dining room',
    'Bedroom 1',
    'Bedroom 2',
    'Bedroom 3',
    'Bathrooms',
    'Laundry area',
  ];
  for (const page of [
    'v4-preview/unit-1-at-oilgate-at-oakdale.html',
    'v4-preview/unit-2-at-oilgate-at-oakdale.html',
    'v4-preview/oilgate-at-parkgate.html',
  ]) {
    const html = await readFile(new URL(page, root), 'utf8');
    const $ = load(html);
    assert.ok($('.hero > img.hero-bg').attr('src').includes('photos/'), `${page} missing unit hero photo`);
    assert.ok($('.about-photo img').attr('src').includes('photos/'), `${page} missing About photo`);
    const heads = $('.tour-category h3').map((_, el) => $(el).clone().children().remove().end().text().trim()).get();
    assert.equal(heads.length, expectedOrder.length, `${page} photo tour category count mismatch`);
    expectedOrder.forEach((name, idx) => {
      assert.ok(heads[idx].startsWith(name), `${page} category ${idx} expected "${name}", got "${heads[idx]}"`);
    });
    assert.equal($('[data-kinetic-track]').length, expectedOrder.length, `${page} must use kinetic scroll track for every category`);
    assert.equal($('[data-open-all-photos]').length >= 1, true, `${page} missing See all photos button`);
    assert.equal($('#pricing [data-price-val]').length, 4, `${page} missing 4-channel comparison`);
  }
});

test('Pepper v4 concierge greets "hi", answers knowledge bank topics, and never leaks phone/cards', async () => {
  const knowledge = JSON.parse(await readFile(new URL('v4-preview/assets/pepper-knowledge.json', root), 'utf8'));
  assert.equal(detectIntent('hi'), 'greeting');
  assert.equal(detectIntent('Hello!'), 'greeting');
  assert.match(answer(knowledge, '603326', 'greeting'), /Pepper/i);
  assert.match(answer(knowledge, '603323', 'beds'), /PENTHOUSE SUITE/);
  assert.match(answer(knowledge, '603326', 'nearby'), /LeBron James/);
  assert.match(answer(knowledge, '603326', 'checkin'), /2:45 PM/);
  assert.match(answer(knowledge, '603326', 'cleaning'), /No cleaning fees/i);
  assert.equal(safeReply('Call 330-555-0199 now'), SAFE);
  assert.equal(safeReply('Card 4111 1111 1111 1111'), SAFE);
  assert.equal(detectIntentWithHistory('What about Unit 2?', [{ role: 'user', text: 'Where do I park?' }]), 'parking');
});

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
} from '../v5-preview/assets/pepper-core.js';

const root = new URL('../', import.meta.url);
const v5Pages = [
  'v5-preview/index.html',
  'v5-preview/unit-1-at-oilgate-at-oakdale.html',
  'v5-preview/unit-2-at-oilgate-at-oakdale.html',
  'v5-preview/oilgate-at-parkgate.html',
  'v5-preview/direct/index.html',
  'v5-preview/404.html',
];

test('v5 preview pages have zero forbidden wording, 3 transparent official Drive logos, and light Wave Mesh canvas', async () => {
  for (const rel of v5Pages) {
    const html = await readFile(new URL(rel, root), 'utf8');
    const $ = load(html);
    const bodyText = $('body').text().normalize('NFKC');
    assert.doesNotMatch(bodyText, /lodgify/i, `${rel} mentions Lodgify`);
    assert.doesNotMatch(bodyText, /(?:\+?1[\s().-]*)?\d{3}[\s().-]*\d{3}[\s().-]*\d{4}|call your host/i, `${rel} leaks phone`);
    assert.equal($('a[href^="tel:"]').length, 0, `${rel} has tel link`);
    assert.doesNotMatch(bodyText, /sand run/i, `${rel} mentions Sand Run`);
    assert.doesNotMatch(bodyText, /shared washer/i, `${rel} mentions shared washer`);
    assert.doesNotMatch(bodyText, /host'?s?\s+email/i, `${rel} says Host email`);
    assert.equal($('footer .footer-logos img').length, 3, `${rel} must show 3 transparent footer logos`);
    assert.ok($('footer > img.footer-bg').attr('src').includes('akron-canalway-skyline.webp'), `${rel} must keep v3 city footer bg`);
    assert.equal($('.top-location').text().replace(/\s+/g, ' ').trim(), 'Akron, Ohio');
    assert.equal($('.top-location .loc-comma').text(), ',');
  }
});

test('v5 homepage combines v3 visuals (photo backgrounds, header, radii) with all v4 content requirements', async () => {
  const html = await readFile(new URL('v5-preview/index.html', root), 'utf8');
  const $ = load(html);

  // Hero background = v3 Lock 3 flower/cityscape
  assert.ok($('.hero > img.hero-bg').attr('src').includes('akron-lock3-canal.webp'));
  // Experience background = v3 Main Street PNC building; photo = OUR Oakdale exterior (not Art Museum!)
  assert.ok($('#experience > img.broll-bg').attr('src').includes('akron-main-street.webp'));
  assert.ok($('#experience .day-window img').attr('src').includes('experience-oakdale-exterior.webp'));
  assert.doesNotMatch($('#experience').html(), /akron-art-museum/i);
  // Rules background = v3 Cascade Plaza cityscape
  assert.ok($('#rental-terms > img.broll-bg').attr('src').includes('akron-from-cascade-plaza.webp'));
  // FAQ background = Golden-hour Akron skyline in same .broll-band style
  assert.ok($('#faq > img.broll-bg').attr('src').includes('akron-evening-skyline.webp'));
  // Plain sections (Rentals + Pricing) use light Wave Mesh canvas
  assert.equal($('#rentals canvas.wave-mesh-canvas').length, 1);
  assert.equal($('#pricing canvas.wave-mesh-canvas').length, 1);

  // All v4 text & copy
  assert.match($('h1').text(), /More than just a stay in Akron\./);
  assert.match($('.slogan-chip').text(), /No cleaning fees, ever\./);
  assert.match($('.hero p.l').text(), /Cable TV · Free pay-per-view · Fast Wi-Fi · Free parking/);
  assert.match($('header nav').text(), /Rentals[\s\S]*Experience[\s\S]*Pricing[\s\S]*FAQ/);

  const bookText = $('.glass-book').text();
  assert.doesNotMatch(bookText, /Direct checkout|Instant date|Guest prefill|Select your dates/i);
  assert.match(bookText, /Choose your stay[\s\S]*Find your dates[\s\S]*Check in[\s\S]*Check out[\s\S]*Guests[\s\S]*Reserve/);
  assert.match(bookText, /Bedrooms/);
  assert.match(bookText, /Beds/);
  assert.match(bookText, /Bathroom/);

  const marqueeText = $('.marquee').text();
  assert.doesNotMatch(marqueeText, /Free parking included|Direct booking/i);
  assert.match(marqueeText, /Minutes to Highland Square and downtown Akron/);

  const cardsText = $('#rentals').text();
  assert.match(cardsText, /PENTHOUSE SUITE/);
  assert.match(cardsText, /separate dining room/i);
  assert.match(cardsText, /completely renovated/i);
  assert.match(cardsText, /2 queen, 1 full/i);

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

  const pricingText = $('#pricing').text();
  assert.equal((pricingText.match(/7-night average/gi) || []).length, 1);
  assert.doesNotMatch(pricingText, /\/direct|Each rate shows|7-night avg \/ night/i);
  assert.equal($('#pricing [data-price-val]').length, 4);

  // Corner exception in promise square & Contact label
  assert.match($('.promise-exception').text(), /Unless house rules are broken/i);
  assert.match($('footer').text(), /Contact/);
});

test('v5 unit pages have categorized photo tours with >3 photo auto-scroll markers and per-unit pricing', async () => {
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
    'v5-preview/unit-1-at-oilgate-at-oakdale.html',
    'v5-preview/unit-2-at-oilgate-at-oakdale.html',
    'v5-preview/oilgate-at-parkgate.html',
  ]) {
    const html = await readFile(new URL(page, root), 'utf8');
    const $ = load(html);
    assert.ok($('.hero > img.hero-bg').attr('src').includes('photos/'));
    assert.ok($('.about-photo img').attr('src').includes('photos/'));
    const heads = $('.tour-category h3').map((_, el) => $(el).clone().children().remove().end().text().trim()).get();
    assert.equal(heads.length, expectedOrder.length, `${page} photo tour category count mismatch`);
    expectedOrder.forEach((name, idx) => {
      assert.ok(heads[idx].startsWith(name), `${page} category ${idx} expected "${name}", got "${heads[idx]}"`);
    });
    assert.ok($('[data-kinetic-gallery][data-photo-count]').length === expectedOrder.length);
    assert.equal($('#pricing [data-price-val]').length, 4);
  }
});

test('Pepper v5 concierge uses 3D Pepper head asset and answers safely', async () => {
  const knowledge = JSON.parse(await readFile(new URL('v5-preview/assets/pepper-knowledge.json', root), 'utf8'));
  const pepperJs = await readFile(new URL('v5-preview/assets/pepper.js', root), 'utf8');
  assert.match(pepperJs, /pepper-head-3d\.webp/);
  assert.match(pepperJs, /pepper-idle\.mp4/);
  assert.equal(detectIntent('hi'), 'greeting');
  assert.match(answer(knowledge, '603323', 'beds'), /PENTHOUSE SUITE/);
  assert.equal(safeReply('Call 330-555-1234'), SAFE);
  assert.equal(detectIntentWithHistory('What about Unit 2?', [{ role: 'user', text: 'Where do we park?' }]), 'parking');
});

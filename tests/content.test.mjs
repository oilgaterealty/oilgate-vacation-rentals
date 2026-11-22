import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { load } from 'cheerio';
import data from '../data/properties.json' with { type: 'json' };
import preview from '../v3-preview/assets/catalog.json' with { type: 'json' };
import knowledge from '../pepper-knowledge.json' with { type: 'json' };
const root = new URL('../', import.meta.url);
test('Verified counts and the generated preview concierge agree; deployed Pepper stays unchanged', () => {
  for (const [id, expectedPhotos, beds] of [['603326', 37, 3], ['603323', 47, 3], ['728474', 29, 3]]) {
    const p = data.properties[id];
    assert.equal(p.photos.length, expectedPhotos);
    assert.equal(p.beds, beds);
    assert.equal(p.bedrooms, beds);
    assert.match(preview[id].facts,new RegExp(p.bedrooms+' bedrooms · '+p.beds+' beds'));
    assert.deepEqual(preview[id].bedTypes,p.bedTypes);
    assert.deepEqual(p.missing, []);
  }
  assert.equal(knowledge.properties['728474'].beds,2, 'live Pepper stays unchanged before sign-off');
  assert.equal(knowledge.liveChatEnabled, true);
  assert.equal(knowledge.chatEndpoint, 'https://pepper-chat.oilgaterealty.workers.dev/chat');
});
test('unchanged current live pages put booking first and preserve comparison, contact, terms and privacy', async () => {
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
      assert.match($('.property-hero').text(), new RegExp(`${knowledge.properties[p.id].bedrooms} bedrooms · ${knowledge.properties[p.id].beds} beds`));
      assert.ok($('#house-rules').text().includes('No pets'));
    }
  }
});

test('preview pages preserve full photo galleries, booking, age, rules and policy controls', async()=>{
 for(const p of Object.values(data.properties)){
   const $=load(await readFile(new URL('v3-preview/'+p.page,root),'utf8'));
   assert.equal($('form[data-book] input[name=stay]').val(),p.id);
   assert.equal($('.gallery img').length,(p.retainedPhotos||p.photos).length);
   assert.match($('.rules').text(),/No pets|pet-free/i);
   assert.match($('main').text(),/Guests 18\+/);
   assert.match($('main').text(),/except as required by law/);
   assert.equal($('a[href^="tel:"]').length,0);
   assert.equal($('a[href="https://oilgaterealty.com/en/privacy-policy"]').length,1);
 }
 const $=load(await readFile(new URL('v3-preview/index.html',root),'utf8'));
 assert.equal($('#compare tbody tr').length,4);
 assert.equal($('[data-price]').length,12);
 assert.equal($('.rental').length,3);
 assert.match($('.promise').text(),/No cleaning fees, ever.*Unless house rules are broken/i);
});

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { load } = require('cheerio');
const root = new URL('../', import.meta.url);
const key = process.env.LODGIFY_API_KEY;
if (!key) throw new Error('LODGIFY_API_KEY is missing from the process environment.');
const listings = [
  ['603326', 'unit-1-at-oilgate-at-oakdale', 'Oakdale / Unit 1'],
  ['603323', 'unit-2-at-oilgate-at-oakdale', 'Oakdale / Unit 2'],
  ['728474', 'oilgate-at-parkgate', 'Oilgate at Parkgate'],
];
const phone = /(?:\+?1[\s().-]*)?\d{3}[\s().-]*\d{3}[\s().-]*\d{4}/g;
const clean = value => {
  const $ = load(String(value || '').replace(/<br\s*\/?\s*>/gi, '\n').replace(/<\/(?:p|li|ol)>/gi, '\n'));
  $('script,style').remove();
  return $.text().replace(phone, '').replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n\n').trim();
};
async function get(url, api = false) {
  const r = await fetch(url, { headers: api ? { 'X-ApiKey': key, Accept: 'application/json' } : {}, signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error(`${api ? 'Lodgify' : 'Public source'} HTTP ${r.status}`);
  return api ? r.json() : r.text();
}
const homepage = await get('https://oilgaterealty.com/en');
const $home = load(homepage);
const emails = new Set();
$home('[data-cfemail]').each((_, el) => {
  const b = Buffer.from($home(el).attr('data-cfemail'), 'hex');
  emails.add([...b.subarray(1)].map(c => String.fromCharCode(c ^ b[0])).join(''));
});
$home('a[href^="mailto:"]').each((_, el) => emails.add($home(el).attr('href').slice(7).split('?')[0]));
const social = [];
for (const [name, domain] of [['Facebook', 'facebook.com'], ['Instagram', 'instagram.com'], ['X', 'x.com']]) {
  const url = $home('a[href]').toArray().map(el => $home(el).attr('href')).find(x => { try { return new URL(x).hostname.replace(/^www\./, '') === domain; } catch { return false; } });
  if (url) social.push({ name, url });
}
const data = {
  pulledAt: new Date().toISOString(),
  sources: ['https://oilgaterealty.com/en', 'https://api.lodgify.com/v2/properties/{id}', 'https://api.lodgify.com/v2/properties/{id}/rooms'],
  contact: { email: [...emails][0] || '', social },
  ownerTerms: { source: 'LaVante, November 20 2026, t958u', cleaning: 'No cleaning fees, ever', cleaningException: 'Unless house rules are broken.', minimumAge: 18, liability: 'Guests are responsible for damage they cause. Oilgate Realty is not liable for injury or loss of personal property, except as required by law.' },
  missing: ['Matching live quotes for Direct, Airbnb, Vrbo and Booking.com were not supplied by the content endpoints.', 'A public LinkedIn page was not verified; the official source links to an admin dashboard.', 'No TikTok or YouTube link was found on the official source.'],
  properties: {},
};
await mkdir(new URL('data/', root), { recursive: true });
for (const [id, slug, displayName] of listings) {
  const publicUrl = `https://oilgaterealty.com/en/${slug}`;
  const [property, rooms, html] = await Promise.all([get(`https://api.lodgify.com/v2/properties/${id}`, true), get(`https://api.lodgify.com/v2/properties/${id}/rooms`, true), get(publicUrl)]);
  if (rooms.length !== 1) throw new Error(`Unexpected room count for ${id}`);
  const room = rooms[0], $ = load(html);
  const bedTypes = (room.amenities.sleeping || []).filter(x => /^Sleeping.*Bed$/.test(x.name) && Number.isFinite(Number(x.prefix)) && x.prefix !== null);
  const faq = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const visit = value => { if (Array.isArray(value)) value.forEach(visit); else if (value && typeof value === 'object') { if (value['@type'] === 'Question') faq.push({ question: clean(value.name), answer: clean(value.acceptedAnswer?.text) }); Object.values(value).forEach(visit); } };
      visit(JSON.parse($(el).text()));
    } catch { /* Only recognized structured facts are used. */ }
  });
  const time = faq.find(x => /check-in.*check-out/i.test(x.question))?.answer || '';
  const checkin = time.match(/Check-in time is ([^.]+)\./i)?.[1] || '';
  const checkout = time.match(/Check-out time is ([^.]+)\./i)?.[1] || '';
  const policies = {};
  for (const label of ['Payment Schedule', 'Payment Policy', 'Cancellation Policy', 'Security deposit']) {
    const heading = $('h2,h3,h4').filter((_, el) => $(el).text().trim().toLowerCase() === label.toLowerCase()).first();
    if (heading.length) policies[label] = clean(heading.nextUntil('h2,h3,h4').text());
  }
  const photos = room.images.map((photo, i) => ({ url: new URL(photo.url, 'https://l.icdbcdn.com').href, alt: clean(photo.text) || `${displayName} — photo ${i + 1}` }));
  const amenities = Object.fromEntries(Object.entries(room.amenities).map(([group, items]) => [group, items.map(x => clean(x.text))]));
  data.properties[id] = { id, name: displayName, sourceName: clean(property.name), page: `${slug}.html`, publicUrl, description: clean(room.description || property.description), bedrooms: room.bedrooms ?? null, bathrooms: room.bathrooms ?? null, beds: bedTypes.length ? bedTypes.reduce((n, x) => n + Number(x.prefix), 0) : null, bedTypes: bedTypes.map(x => clean(x.text)), maxGuests: room.max_people ?? null, amenities, petsAllowed: room.pets_allowed ?? null, checkin, checkout, houseRules: clean(property.agreement_text), policies, photos, publicFacts: faq, missing: [] };
  if (id === '728474') {
    const $existing = load(await readFile(new URL(`${slug}.html`, root), 'utf8'));
    const seen = new Set();
    data.properties[id].retainedPhotos = $existing('img[src^="assets/parkgate-"]').toArray().map(el => ({ url: $existing(el).attr('src'), alt: $existing(el).attr('alt') || displayName })).filter(x => !seen.has(x.url) && seen.add(x.url));
  }
  for (const field of ['description', 'bedrooms', 'beds', 'bathrooms', 'maxGuests', 'checkin', 'checkout', 'houseRules']) if (data.properties[id][field] === '' || data.properties[id][field] === null) data.properties[id].missing.push(field);
  console.log(`Pulled ${id}: ${photos.length} photos, ${room.bedrooms} bedrooms, ${data.properties[id].beds} beds.`);
}
// Never persist raw API/public responses, credentials, or host telephone fields.
await writeFile(new URL('data/properties.json', root), JSON.stringify(data, null, 2) + '\n');
console.log('Saved sanitized data/properties.json.');

// Only public mapping and rendered quote data are printed. Never print secrets or guest records.
import assert from 'node:assert/strict';
import { renderQuote } from '../worker/src/index.js';
const key = process.env.LODGIFY_KEY || process.env.LODGIFY_API_KEY;
if (!key) { console.log('BLOCKED: Lodgify key unavailable'); process.exitCode = 1; }
else {
  async function get(path) {
    const r = await fetch('https://api.lodgify.com' + path, { headers: { 'X-ApiKey': key }, signal: AbortSignal.timeout(15000) });
    if (!r.ok) { console.log(JSON.stringify({ path: path.split('?')[0], status: r.status })); process.exitCode = 1; return null; }
    return r.json();
  }
  const properties = await get('/v2/properties?limit=50');
  const rows = Array.isArray(properties) ? properties : properties?.items || [];
  console.log('Property mapping:', JSON.stringify(rows.filter(p => /oakdale|parkgate/i.test(p.name)).map(p => ({ id: p.id, name: p.name, rooms: p.rooms?.map(x => ({ id: x.id, name: x.name })) }))));
  for (const [id, room] of [['603326', '670117'], ['603323', '670114'], ['728474', '795590']]) {
    for (const path of [`/v2/quote/${id}?arrival=2027-03-08&departure=2027-03-11&roomTypes[0].id=${room}&roomTypes[0].people=2&roomTypes[0].units=1`, `/v2/availability/${id}?start=2027-03-08&end=2027-03-11`]) {
      const q = await get(path);
      assert.ok(q, 'Live Lodgify read failed');
      if (path.includes('quote')) {
        assert.equal(q[0]?.property_id, Number(id));
        assert.equal(q[0]?.date_arrival?.slice(0,10), '2027-03-08');
        assert.equal(q[0]?.date_departure?.slice(0,10), '2027-03-11');
        const rendered = renderQuote(q);
        assert.ok(rendered.allowedAmounts.length);
        console.log(JSON.stringify({ id, kind: 'quote', arrival: '2027-03-08', departure: '2027-03-11', guests: 2, ...rendered }));
      } else { assert.equal(q[0]?.property_id, Number(id)); assert.ok(q[0]?.periods?.length); console.log(JSON.stringify({ id, kind: 'availability', passed: true })); }
    }
  }
}

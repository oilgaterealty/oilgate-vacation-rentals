#!/usr/bin/env node
/**
 * Daily no-AI 7-night average price fetcher for Oilgate Vacation Rentals.
 *
 * Reads:
 *   - scripts/prices/listings.json (verified listing URLs + Lodgify property/room IDs)
 *   - process.env.LODGIFY_API_KEY (or LODGIFY_KEY) for Direct quotes & nightly rates
 *
 * Writes:
 *   - data/prices.json
 *
 * Rules:
 *   - Plain deterministic code, zero AI.
 *   - Never prints secrets.
 *   - Never invents or estimates numbers.
 *   - Never bypasses bot checks, CAPTCHAs, or rate limits; blocked/unavailable
 *     channels stay null so the site renders a blank/dash cell with no notes.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const config = JSON.parse(await readFile(new URL('./listings.json', import.meta.url), 'utf8'));
const lodgifyKey = process.env.LODGIFY_API_KEY || process.env.LODGIFY_KEY || '';

const NIGHTS = Number(config.nights || 7);
const GUESTS = Number(config.guests || 2);
const CURRENCY = config.currency || 'USD';

function akronTodayIso() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const get = t => parts.find(p => p.type === t)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function addDays(iso, days) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function parseMoney(str) {
  if (!str) return null;
  const cleaned = String(str).replace(/,/g, '').match(/\$\s*(\d+(?:\.\d{1,2})?)/);
  if (!cleaned) return null;
  const val = Number(cleaned[1]);
  return Number.isFinite(val) && val > 0 ? round2(val) : null;
}

const today = akronTodayIso();
const startDate = addDays(today, 1);
const endDate = addDays(startDate, NIGHTS);
const nightDates = Array.from({ length: NIGHTS }, (_, i) => addDays(startDate, i));

async function fetchDirect(prop) {
  const checkedAt = new Date().toISOString();
  const base = {
    channel: 'direct',
    label: 'vacationrentals.oilgaterealty.com/direct',
    sourceUrl: prop.channels.direct,
    checkedAt,
    currency: CURRENCY,
    nights: NIGHTS,
    guests: GUESTS,
    method: '7-night direct stay quote divided by 7 (USD, 2 guests, taxes and weekly discount included)',
    sevenNightTotal: null,
    averageNightly: null,
    nightlyPrices: [],
    status: 'missing_key',
  };
  if (!lodgifyKey) return base;

  const headers = {
    'X-ApiKey': lodgifyKey,
    Accept: 'application/json',
    'User-Agent': 'Oilgate-PriceCompare/1.0',
  };

  try {
    const quoteParams = new URLSearchParams({
      arrival: startDate,
      departure: endDate,
      'roomTypes[0].id': prop.roomId,
      'roomTypes[0].people': String(GUESTS),
      'roomTypes[0].units': '1',
    });
    const qResp = await fetch(`https://api.lodgify.com/v2/quote/${prop.id}?${quoteParams}`, {
      headers,
      redirect: 'manual',
      signal: AbortSignal.timeout(20000),
    });
    if (qResp.status === 429) {
      return { ...base, status: 'rate_limited_429' };
    }
    if (!qResp.ok) {
      return { ...base, status: `http_${qResp.status}` };
    }
    const quotes = await qResp.json();
    const q = Array.isArray(quotes) ? quotes[0] : quotes;
    const currency = q?.currency || q?.currency_code;
    const total = q?.total_including_vat ?? q?.total_excluding_vat;
    if (currency !== 'USD' || typeof total !== 'number' || !Number.isFinite(total) || total <= 0) {
      return { ...base, status: 'invalid_quote' };
    }

    // Also pull the 7 individual nightly calendar rates (USD) for transparency.
    const nightlyPrices = [];
    try {
      const calParams = new URLSearchParams({
        HouseId: prop.id,
        RoomTypeId: prop.roomId,
        StartDate: startDate,
        EndDate: addDays(endDate, -1),
      });
      const calResp = await fetch(`https://api.lodgify.com/v2/rates/calendar?${calParams}`, {
        headers,
        redirect: 'manual',
        signal: AbortSignal.timeout(20000),
      });
      if (calResp.ok) {
        const cal = await calResp.json();
        const byDate = new Map();
        for (const item of cal?.calendar_items || []) {
          const p = item?.prices?.[0]?.price_per_day;
          if (item?.date && typeof p === 'number' && Number.isFinite(p)) {
            byDate.set(item.date.slice(0, 10), round2(p));
          }
        }
        for (const d of nightDates) {
          if (byDate.has(d)) nightlyPrices.push({ date: d, baseRate: byDate.get(d), effectiveNightly: round2(total / NIGHTS) });
        }
      }
    } catch {
      // Calendar breakdown is supplemental; the verified 7-night quote still stands.
    }

    if (nightlyPrices.length !== NIGHTS) {
      nightlyPrices.length = 0;
      for (const d of nightDates) {
        nightlyPrices.push({ date: d, effectiveNightly: round2(total / NIGHTS) });
      }
    }

    return {
      ...base,
      sevenNightTotal: round2(total),
      averageNightly: round2(total / NIGHTS),
      nightlyPrices,
      status: 'ok',
    };
  } catch (err) {
    return { ...base, status: `error:${err?.name || 'fetch'}` };
  }
}

async function fetchAirbnb(ctx, prop) {
  const checkedAt = new Date().toISOString();
  const baseUrl = prop.channels.airbnb;
  const base = {
    channel: 'airbnb',
    label: 'Airbnb',
    sourceUrl: baseUrl,
    checkedAt,
    currency: CURRENCY,
    nights: NIGHTS,
    guests: GUESTS,
    method: '7-night public listing stay total divided by 7 (USD, 2 guests)',
    sevenNightTotal: null,
    averageNightly: null,
    nightlyPrices: [],
    status: baseUrl ? 'unreadable' : 'no_url',
  };
  if (!baseUrl || !ctx) return base;

  const url = `${baseUrl}?check_in=${startDate}&check_out=${endDate}&adults=${GUESTS}`;
  const page = await ctx.newPage();
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    if (!resp || resp.status() === 404 || resp.status() === 410) {
      return { ...base, sourceUrl: url, status: `unavailable_http_${resp?.status() || 0}` };
    }
    if (resp.status() === 429 || resp.status() === 403) {
      return { ...base, sourceUrl: url, status: `blocked_http_${resp.status()}` };
    }
    await page.waitForTimeout(4500);
    const extracted = await page.evaluate((nights) => {
      const text = (document.body?.innerText || '').replace(/\s+/g, ' ');
      if (/verify you are human|bot or not|captcha|access denied/i.test(text.slice(0, 800))) {
        return { blocked: true };
      }
      // Match the listing's own explicit "for 7 nights" total (never similar listings).
      const re = new RegExp(`\\$\\s*([\\d,]+(?:\\.\\d{2})?)\\s*for\\s+${nights}\\s+nights`, 'i');
      const m = text.match(re);
      if (m) return { total: m[0] };
      // Fallback: inspect booking sidebar specifically for a "$X x 7 nights" or "Total $X" line.
      const sidebar = document.querySelector('[data-section-id="BOOK_IT_SIDEBAR"], [data-testid="book-it-default"]');
      if (sidebar) {
        const st = sidebar.innerText.replace(/\s+/g, ' ');
        const sm = st.match(re) || st.match(/Total\s*(?:before taxes)?\s*\$\s*([\d,]+(?:\.\d{2})?)/i);
        if (sm) return { total: sm[0] };
      }
      return { total: null };
    }, NIGHTS);

    if (extracted.blocked) return { ...base, sourceUrl: url, status: 'blocked_challenge' };
    const total = parseMoney(extracted.total);
    if (!total) return { ...base, sourceUrl: url, status: 'unavailable_or_unpriced' };
    const avg = round2(total / NIGHTS);
    return {
      ...base,
      sourceUrl: url,
      sevenNightTotal: total,
      averageNightly: avg,
      nightlyPrices: nightDates.map(d => ({ date: d, effectiveNightly: avg })),
      status: 'ok',
    };
  } catch (err) {
    return { ...base, sourceUrl: url, status: `error:${err?.name || 'playwright'}` };
  } finally {
    await page.close();
  }
}

async function fetchBooking(ctx, prop) {
  const checkedAt = new Date().toISOString();
  const baseUrl = prop.channels.booking;
  const base = {
    channel: 'booking',
    label: 'Booking.com',
    sourceUrl: baseUrl,
    checkedAt,
    currency: CURRENCY,
    nights: NIGHTS,
    guests: GUESTS,
    method: '7-night public listing stay total divided by 7 (USD, 2 guests)',
    sevenNightTotal: null,
    averageNightly: null,
    nightlyPrices: [],
    status: baseUrl ? 'unreadable' : 'no_url',
  };
  if (!baseUrl || !ctx) return base;

  const url = `${baseUrl}?checkin=${startDate}&checkout=${endDate}&group_adults=${GUESTS}&no_rooms=1&selected_currency=${CURRENCY}`;
  const page = await ctx.newPage();
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    const status = resp?.status() || 0;
    if (status === 202 || status === 403 || status === 429) {
      return { ...base, sourceUrl: url, status: `blocked_http_${status}` };
    }
    if (status >= 400) {
      return { ...base, sourceUrl: url, status: `unavailable_http_${status}` };
    }
    await page.waitForTimeout(4500);
    const extracted = await page.evaluate(() => {
      const text = (document.body?.innerText || '').replace(/\s+/g, ' ');
      if (/verify you are human|captcha|access denied|perimeterx/i.test(text.slice(0, 800))) {
        return { blocked: true };
      }
      const table = document.querySelector('#hprt-table');
      if (!table) return { total: null, perNight: null, taxes: null };
      const priceEl = table.querySelector('.bui-price-display__value, .prco-valign-middle-helper, [data-testid="price-and-discounted-price"]');
      const priceText = priceEl?.innerText?.trim() || '';
      const tableText = table.innerText.replace(/\s+/g, ' ');
      const taxMatch = tableText.match(/\+\s*\$\s*([\d,]+(?:\.\d{2})?)\s*taxes/i);
      const perNightMatch = tableText.match(/\$\s*([\d,]+(?:\.\d{2})?)\s*per\s*night/i);
      return { total: priceText, taxes: taxMatch ? `$${taxMatch[1]}` : null, perNight: perNightMatch ? `$${perNightMatch[1]}` : null };
    });

    if (extracted.blocked) return { ...base, sourceUrl: url, status: 'blocked_challenge' };
    const subtotal = parseMoney(extracted.total);
    const taxes = parseMoney(extracted.taxes) || 0;
    if (!subtotal) return { ...base, sourceUrl: url, status: 'unavailable_or_unpriced' };
    const total = round2(subtotal + taxes);
    const avg = round2(total / NIGHTS);
    return {
      ...base,
      sourceUrl: url,
      sevenNightTotal: total,
      averageNightly: avg,
      nightlyPrices: nightDates.map(d => ({ date: d, effectiveNightly: avg })),
      method: taxes > 0
        ? '7-night public listing stay total plus displayed taxes divided by 7 (USD, 2 guests)'
        : '7-night public listing stay total divided by 7 (USD, 2 guests)',
      status: 'ok',
    };
  } catch (err) {
    return { ...base, sourceUrl: url, status: `error:${err?.name || 'playwright'}` };
  } finally {
    await page.close();
  }
}

async function fetchVrbo(ctx, prop) {
  const checkedAt = new Date().toISOString();
  const baseUrl = prop.channels.vrbo;
  const base = {
    channel: 'vrbo',
    label: 'Vrbo',
    sourceUrl: baseUrl,
    checkedAt,
    currency: CURRENCY,
    nights: NIGHTS,
    guests: GUESTS,
    method: '7-night public listing stay total divided by 7 (USD, 2 guests)',
    sevenNightTotal: null,
    averageNightly: null,
    nightlyPrices: [],
    status: baseUrl ? 'unreadable' : 'no_url',
  };
  if (!baseUrl || !ctx) return base;

  const url = `${baseUrl}?chkin=${startDate}&chkout=${endDate}&x_pwa=1&adults=${GUESTS}`;
  const page = await ctx.newPage();
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    const status = resp?.status() || 0;
    if (status === 429 || status === 403) {
      return { ...base, sourceUrl: url, status: `blocked_http_${status}` };
    }
    if (status >= 400) {
      return { ...base, sourceUrl: url, status: `unavailable_http_${status}` };
    }
    await page.waitForTimeout(4500);
    const extracted = await page.evaluate(() => {
      const title = document.title || '';
      const text = (document.body?.innerText || '').replace(/\s+/g, ' ');
      if (/bot or not|verify you are human|captcha|access denied/i.test(title + ' ' + text.slice(0, 800))) {
        return { blocked: true };
      }
      const totalMatch = text.match(/Total(?:\s+includes\s+taxes\s+and\s+fees)?\s*\$\s*([\d,]+(?:\.\d{2})?)/i)
        || text.match(/\$\s*([\d,]+(?:\.\d{2})?)\s*total/i);
      return { total: totalMatch ? totalMatch[0] : null };
    });

    if (extracted.blocked) return { ...base, sourceUrl: url, status: 'blocked_challenge' };
    const total = parseMoney(extracted.total);
    if (!total) return { ...base, sourceUrl: url, status: 'blocked_or_unpriced' };
    const avg = round2(total / NIGHTS);
    return {
      ...base,
      sourceUrl: url,
      sevenNightTotal: total,
      averageNightly: avg,
      nightlyPrices: nightDates.map(d => ({ date: d, effectiveNightly: avg })),
      status: 'ok',
    };
  } catch (err) {
    return { ...base, sourceUrl: url, status: `error:${err?.name || 'playwright'}` };
  } finally {
    await page.close();
  }
}

let browser = null;
try {
  const pw = await import('@playwright/test');
  browser = await pw.chromium.launch({ headless: true });
} catch {
  console.warn('Playwright browser unavailable; fetching Direct prices only.');
}

async function withFreshContext(fn) {
  if (!browser) return fn(null);
  const c = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    locale: 'en-US',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  });
  try {
    return await fn(c);
  } finally {
    await c.close();
  }
}

const output = {
  schemaVersion: 1,
  checkedAt: new Date().toISOString(),
  checkedDate: today,
  window: { startDate, endDate, nights: NIGHTS, guests: GUESTS, currency: CURRENCY },
  freshnessHours: 48,
  properties: {},
};

try {
  for (const prop of config.properties) {
    const direct = await fetchDirect(prop);
    const airbnb = await withFreshContext(c => fetchAirbnb(c, prop));
    const vrbo = await withFreshContext(c => fetchVrbo(c, prop));
    const booking = await withFreshContext(c => fetchBooking(c, prop));
    output.properties[prop.id] = {
      id: prop.id,
      name: prop.name,
      slug: prop.slug,
      channels: { direct, airbnb, vrbo, booking },
    };
    console.log(
      `${prop.name} (${prop.id}): direct=${direct.averageNightly ?? '—'} (${direct.status}), ` +
      `airbnb=${airbnb.averageNightly ?? '—'} (${airbnb.status}), ` +
      `vrbo=${vrbo.averageNightly ?? '—'} (${vrbo.status}), ` +
      `booking=${booking.averageNightly ?? '—'} (${booking.status})`
    );
  }
} finally {
  if (browser) await browser.close();
}

const outPath = new URL('data/prices.json', root);
if (!existsSync(new URL('data/', root))) await mkdir(new URL('data/', root), { recursive: true });
await writeFile(outPath, JSON.stringify(output, null, 2) + '\n');
console.log('Saved data/prices.json for window', startDate, 'to', endDate);

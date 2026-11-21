// Sample 3: "Linked Up" — Oilgate Links look (near-black ground, neon lime, link-in-bio card stack, Archivo + Space Mono).
import { stays, akron, brand, booking, compare, rentalTerms, faq, footer, img, stayImg, esc, socials, nearParkgate, times } from './shared.mjs';

const credits = [akron.canalway, akron.lock3];

const body = `
<header class="hd">
<a class="hd-brand" href="#main">${brand('primaryWhite', 'hd-logo', true)}</a>
<nav class="hd-nav" aria-label="Main navigation"><a href="#stays">Stays</a><a href="#compare">Compare</a><a href="#faq">FAQ</a><a href="#contact">Contact</a></nav>
</header>
<main id="main">
${booking({ title: 'Check your dates' })}
<section class="intro" aria-labelledby="h1">
<p class="tag">Akron, Ohio · 3 whole-home stays</p>
<h1 id="h1">Every Akron stay, <span>one tap away.</span></h1>
<p class="lede">Pick a home, pick your dates, book direct. Two Oakdale units and a renovated Parkgate home, each sleeping up to six.</p>
<figure class="intro-fig">${img(akron.canalway, '', true)}<figcaption>Downtown Akron from the Ohio &amp; Erie Canalway</figcaption></figure>
${socials('soc-row')}
</section>

<section class="links" id="stays" aria-labelledby="stays-title">
<h2 id="stays-title">The stays</h2>
<ul class="link-stack">
${stays.map(s => `<li><a class="link-card" href="#stay-${s.key}">${stayImg(s, 'img', 'lc-thumb')}<span class="lc-text"><strong>${esc(s.name)}</strong><small>${s.specs}</small></span><span class="lc-go" aria-hidden="true">→</span></a></li>`).join('')}
<li><a class="link-card lc-plain" href="#compare"><span class="lc-text"><strong>Compare booking options</strong><small>Same stay, same dates, every channel</small></span><span class="lc-go" aria-hidden="true">→</span></a></li>
<li><a class="link-card lc-plain" href="mailto:oilgaterealty@gmail.com"><span class="lc-text"><strong>Email your host</strong><small>oilgaterealty@gmail.com</small></span><span class="lc-go" aria-hidden="true">→</span></a></li>
</ul>
</section>

<section class="detail" aria-label="Stay details">
${stays.map((s, i) => `<article class="dt" id="stay-${s.key}">
<figure>${stayImg(s, i === 1 ? 'ext' : 'img')}</figure>
<div class="dt-copy"><p class="tag">0${i + 1} · ${esc(s.place)}</p><h3>${esc(s.name)}</h3><p class="mono">${s.specs}</p><p>${esc(s.line)} ${esc(s.body)}</p>
<a class="btn-line" href="#availability" data-stay="${s.id}">Check dates for ${esc(s.short)}</a></div>
</article>`).join('')}
</section>

<section class="facts" aria-labelledby="facts-title">
<h2 id="facts-title">Quick facts</h2>
<dl class="fact-list">
<div><dt>Check in</dt><dd>${times.checkin}</dd></div>
<div><dt>Check out</dt><dd>${times.checkout}</dd></div>
<div><dt>Cleaning fees</dt><dd>None, ever*</dd></div>
<div><dt>Near Parkgate</dt><dd>${nearParkgate.slice(0, 3).join(', ')}</dd></div>
</dl>
<p class="mono small">*Unless house rules are broken.</p>
</section>

${compare({ kicker: 'No guesswork', heading: 'Compare booking options' })}
<div class="tf">${rentalTerms()}${faq({ heading: 'FAQ' })}</div>
</main>
${footer({ logoVariant: 'secondaryWhite', tagline: 'Every Akron stay in one place.', credits })}`;

const css = `
:root{--bg:#0b0e0a;--surface:#161a14;--surface-2:#22281f;--text:#ecf0e9;--text-muted:#b2baae;--border:#323a2e;--accent:#84f616;--accent-contrast:#0b0e0a;--success:#84f616;--warning:#f8c20d;--danger:#ff7a6b;--focus:#84f616;--glow:0 0 48px rgb(132 246 22/.22);
--font-display:'Archivo',sans-serif;--font-mono:'Space Mono',monospace;--r-sm:8px;--r-md:16px;--r-lg:24px;--r-pill:999px;--s1:4px;--s2:8px;--s3:16px;--s4:24px;--s5:32px;--s6:48px;--s7:64px;--s8:96px;--dur:160ms}
body{background:var(--bg);color:var(--text);font:400 17px/1.55 var(--font-display)}
a{color:var(--accent)}
h1,h2,h3{font-family:var(--font-display);font-weight:900;line-height:1;margin:0;letter-spacing:-.02em}
h2{font-size:36px;margin-bottom:var(--s4)}
h3{font-size:32px}
.tag,.mono,.kicker{font-family:var(--font-mono);font-size:14px;letter-spacing:.02em}
.tag,.kicker{color:var(--accent);margin:0 0 var(--s3);text-transform:uppercase}
.mono{color:var(--text-muted)}
.small{font-size:13px}
.hd{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:var(--s2) var(--s4);padding:var(--s3)}
.hd-logo{width:148px;border-radius:var(--r-sm)}
.hd-nav{display:flex;gap:0 var(--s3);flex-wrap:wrap}
.hd-nav a{font-family:var(--font-mono);font-size:14px;color:var(--text);text-decoration:none;min-height:44px;display:inline-flex;align-items:center}
.hd-nav a:hover{color:var(--accent)}
main{display:grid;gap:0;padding:0 var(--s3)}
.bk{background:var(--accent);color:var(--accent-contrast);border-radius:var(--r-lg);padding:var(--s4) var(--s3);box-shadow:var(--glow)}
.bk-title{font-weight:900;font-size:32px;line-height:1;margin:0;letter-spacing:-.02em}
.bk label,.bk-label{font-family:var(--font-mono);font-size:13px;font-weight:700;text-transform:uppercase}
.bk select,.bk-date,.bk-step{background:var(--bg);color:var(--text);border:0;border-radius:var(--r-sm)}
.bk-pm{background:transparent;border:0;color:var(--accent)}
.bk-go{background:var(--bg);color:var(--accent);border:0;border-radius:var(--r-md);font-weight:900;font-size:19px;transition:transform var(--dur)}
.bk-go:hover{transform:scale(1.02)}
.bk :focus-visible{outline-color:var(--bg)}
.bk-cal{background:var(--bg);color:var(--text);border-radius:var(--r-md)}
.bk-cal :focus-visible{outline-color:var(--accent)}
.bk-nav{background:var(--surface-2);color:var(--accent);border:0;border-radius:var(--r-pill)}
.bk-day{border-radius:var(--r-sm)}
.bk-day:hover:not([disabled]){background:var(--surface-2)}
.bk-day.is-on{background:var(--accent);color:var(--accent-contrast)}
.bk-day.is-mid{background:var(--surface-2)}
.bk-out-link{color:var(--accent-contrast);font-weight:900;min-height:44px;display:inline-flex;align-items:center}
.bk-promise{font-weight:700}
.intro{padding:var(--s5) var(--s3);margin:var(--s4) 0 0;background:var(--surface);border-radius:var(--r-lg)}
.intro h1{font-size:48px}
.intro h1 span{color:var(--accent);display:block}
.lede{font-size:19px;color:var(--text-muted);max-width:32em;margin:var(--s4) 0}
.intro-fig{margin:0 0 var(--s4)}
.intro-fig img{border-radius:var(--r-md);width:100%;aspect-ratio:7/2;object-fit:cover}
figcaption{font-family:var(--font-mono);font-size:13px;color:var(--text-muted);margin-top:var(--s2)}
.soc-row{display:flex;flex-wrap:wrap;gap:var(--s2)}
.soc-row a{min-height:44px;display:inline-flex;align-items:center;padding:0 var(--s4);border:1px solid var(--border);border-radius:var(--r-pill);color:var(--text);text-decoration:none;font-family:var(--font-mono);font-size:14px}
.soc-row a:hover{border-color:var(--accent);color:var(--accent)}
.links{padding:var(--s6) 0}
.link-stack{list-style:none;margin:0;padding:0;display:grid;gap:var(--s3)}
.link-card{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:var(--s3);padding:var(--s2);padding-right:var(--s4);background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);color:var(--text);text-decoration:none;transition:border-color var(--dur),transform var(--dur)}
.link-card:hover{border-color:var(--accent);transform:translateX(4px)}
.lc-plain{grid-template-columns:1fr auto;padding:var(--s4)}
.lc-thumb{width:80px;height:80px;object-fit:cover;border-radius:var(--r-sm)}
.lc-text{display:grid;gap:var(--s1)}
.lc-text strong{font-size:18px;font-weight:800}
.lc-text small{font-family:var(--font-mono);font-size:13px;color:var(--text-muted)}
.lc-go{color:var(--accent);font-size:24px;font-weight:900}
.detail{display:grid;gap:var(--s6);padding:var(--s6) 0}
.dt{display:grid;gap:var(--s4);background:var(--surface);border-radius:var(--r-lg);padding:var(--s3)}
.dt figure{margin:0}
.dt img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:var(--r-md)}
.dt-copy{padding:0 var(--s2) var(--s3)}
.dt h3{margin-bottom:var(--s2)}
.btn-line{display:inline-flex;align-items:center;min-height:48px;padding:0 var(--s4);border:2px solid var(--accent);border-radius:var(--r-pill);color:var(--accent);font-weight:800;text-decoration:none}
.btn-line:hover{background:var(--accent);color:var(--accent-contrast)}
.facts{padding:var(--s6) 0}
.fact-list{display:grid;grid-template-columns:1fr 1fr;gap:var(--s2);margin:0 0 var(--s3)}
.fact-list div{background:var(--surface-2);border-radius:var(--r-md);padding:var(--s3)}
.fact-list dt{font-family:var(--font-mono);font-size:13px;color:var(--text-muted);text-transform:uppercase}
.fact-list dd{margin:var(--s1) 0 0;font-weight:800;font-size:20px}
.cmp{padding:var(--s6) 0;display:grid;gap:var(--s4)}
.cmp-box{background:var(--surface);border:1px solid var(--accent);border-radius:var(--r-lg);padding:var(--s4)}
.cmp-context{font-family:var(--font-mono);font-size:14px;color:var(--text-muted);margin:0 0 var(--s3)}
.cmp-table th,.cmp-table td{border-bottom:1px solid var(--border)}
.cmp-table thead th{font-family:var(--font-mono);font-size:13px;color:var(--accent);text-transform:uppercase}
.cmp-table td{font-family:var(--font-mono);font-size:14px;color:var(--text-muted)}
.cmp-fine{font-size:14px;color:var(--text-muted);margin:var(--s3) 0 0}
.tf{display:grid;gap:var(--s6);padding:var(--s6) 0}
.terms-list{padding-left:var(--s4);margin:0}
.terms-list li{margin-bottom:var(--s2)}
.faq details{background:var(--surface);border-radius:var(--r-md);padding:0 var(--s3);margin-bottom:var(--s2)}
.faq summary{font-weight:800}
.faq details p{margin:0;padding-bottom:var(--s3);color:var(--text-muted)}
.ft{border-top:1px solid var(--border);padding:var(--s6) var(--s3);display:grid;gap:var(--s5);background:var(--surface)}
.ft a{color:var(--text)}
.ft a:hover{color:var(--accent)}
.ft-logo{width:220px;border-radius:var(--r-sm)}
.ft-h{font-family:var(--font-mono);font-size:13px;text-transform:uppercase;color:var(--accent);margin:0 0 var(--s2)}
.ft-contact{display:grid;justify-items:start}
.ft-credits{font-size:13px;color:var(--text-muted)}
@media (min-width:900px){
 .hd{padding:var(--s4) var(--s6)}
 .hd-logo{width:184px}
 .hd-nav{gap:0 var(--s5)}
 main{grid-template-columns:7fr 5fr;column-gap:var(--s7);padding:0 var(--s6);align-items:start}
 .bk{grid-column:2;grid-row:1;position:sticky;top:var(--s4)}
 .bk-cal{position:static}
 .intro{grid-column:1;grid-row:1;margin:0;padding:var(--s6)}
 .intro h1{font-size:80px}
 .links{grid-column:2;grid-row:2}
 .detail{grid-column:1;grid-row:2 / span 2}
 .facts{grid-column:2;grid-row:3}
 .cmp,.tf{grid-column:1/-1}
 .cmp{grid-template-columns:4fr 8fr}
 .tf{grid-template-columns:1fr 1fr}
 .dt{grid-template-columns:1fr 1fr;align-items:center}
 .ft{grid-template-columns:2fr 1fr 1fr;padding:var(--s7) var(--s6)}
 .ft-legal{grid-column:1/-1}
}`;

export default {
  file: '03-linked-up-og-links.html',
  name: 'Linked Up: the OG Links look',
  inspiration: 'Oilgate Links (oilgatelinks.com/app)',
  title: 'Sample 3: Linked Up | Oilgate Vacation Rentals, Akron',
  description: 'Design sample in the Oilgate Links style: every Akron stay one tap away. Three whole homes that sleep up to six. No cleaning fees, ever, unless house rules are broken.',
  fontsHref: 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;800;900&family=Space+Mono:wght@400;700&display=swap',
  theme: '#0b0e0a',
  css, body,
  refs: [
    'https://oilgatelinks.com/app — official Oilgate Links app studied: black ground, lime #7cfc00 accent with dark green #3e8500, Archivo Black display and Space Mono labels, 0.75rem-radius cards, "One clean page for every link".',
    'https://oilgatelinks.com/ — marketing page and logo pack: glowing lime link-chain mark, stacked link cards like a link-in-bio page.',
    'https://fonts.google.com/specimen/Archivo — free display/body family (900 weight stands in for Archivo Black).',
    'https://fonts.google.com/specimen/Space+Mono — free mono for labels, as on oilgatelinks.com.',
    'https://commons.wikimedia.org/wiki/File:Downtown_skyline_panorama_as_seen_from_Ohio_%26_Erie_Canalway,_Akron,_Ohio_-_20200530.jpg — CC BY-SA 4.0 Akron skyline panorama.',
  ],
};

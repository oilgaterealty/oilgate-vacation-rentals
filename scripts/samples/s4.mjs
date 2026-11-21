// Sample 4: "Rubber City" — Akron-forward theme. Limestone, canal brick and the logo's own gold; industrial display type; free-licensed Akron photography.
import { stays, akron, brand, booking, compare, rentalTerms, faq, footer, img, stayImg, esc, nearParkgate, times } from './shared.mjs';

const credits = [akron.lock3, akron.main, akron.airdock, akron.cascade, akron.canalway];
const cards = [
  [akron.main, 'Main Street', 'Brick, towers and theater marquees downtown.'],
  [akron.airdock, 'Goodyear Airdock', 'The giant airship hangar that says “Akron” from the highway.'],
  [akron.cascade, 'Cascade Plaza', 'Downtown towers above the plaza.'],
  [akron.canalway, 'Ohio & Erie Canalway', 'The skyline from the canal trail.'],
];

const body = `
<header class="hd">
<a class="hd-brand" href="#main">${brand('alt', 'hd-logo', true)}</a>
<nav class="hd-nav" aria-label="Main navigation"><a href="#stays">Stays</a><a href="#akron">Akron</a><a href="#compare">Compare</a><a href="#contact">Contact</a></nav>
</header>
<main id="main">
${booking({ title: 'Plan your Akron stay' })}
<section class="hero" aria-labelledby="h1">
<figure class="hero-fig">${img(akron.lock3, '', true)}</figure>
<div class="hero-card">
<p class="kicker">Akron, Ohio · The Rubber City</p>
<h1 id="h1">Stay like you’re <span>from Akron.</span></h1>
<p>Whole homes in two Akron neighborhoods, Oakdale and Parkgate. Your own kitchen, your own front door, room for six.</p>
</div>
<p class="hero-cap">Lock 3 and the Ohio &amp; Erie Canal, downtown Akron</p>
</section>

<section class="hoods" id="stays" aria-labelledby="stays-title">
<div class="sec-head"><p class="kicker">Two neighborhoods, three homes</p><h2 id="stays-title">Pick your corner of Akron</h2></div>
<article class="hood">
<div class="hood-head"><h3>Oakdale</h3><p>A charming duplex with two three-bedroom units. Book one, or book both for a bigger group. The basement laundry is the only shared space.</p></div>
<div class="hood-stays">
${stays.slice(0, 2).map(s => `<div class="unit">${stayImg(s)}<div class="unit-copy"><p class="unit-name">${esc(s.name)}</p><p class="unit-specs">${s.specs}</p><p>${esc(s.line)}</p><a class="go" href="#availability" data-stay="${s.id}">Check dates for ${esc(s.short)}</a></div></div>`).join('')}
</div>
</article>
<article class="hood hood-pg">
<div class="hood-head"><h3>Parkgate</h3><p>A completely renovated two-bedroom home minutes from ${nearParkgate.slice(0, -1).join(', ')} and ${nearParkgate.at(-1)}.</p></div>
<div class="hood-stays">
<div class="unit">${stayImg(stays[2])}<div class="unit-copy"><p class="unit-name">${esc(stays[2].name)}</p><p class="unit-specs">${stays[2].specs}</p><p>${esc(stays[2].body)}</p><a class="go" href="#availability" data-stay="${stays[2].id}">Check dates for Parkgate</a></div></div>
</div>
</article>
</section>

<section class="akron" id="akron" aria-labelledby="akron-title">
<div class="sec-head"><p class="kicker">Postcards from home base</p><h2 id="akron-title">This is Akron</h2></div>
<ul class="cards">${cards.map(([o, t, d]) => `<li><figure>${img(o)}<figcaption><strong>${esc(t)}</strong>${esc(d)}<small>Photo: ${esc(o.credit)}</small></figcaption></figure></li>`).join('')}</ul>
</section>

<section class="clock" aria-label="Arrival and departure">
<p><span>Check in</span>${times.checkin}</p><p><span>Check out</span>${times.checkout}</p><p><span>Cleaning fees</span>None, ever*</p>
<small>*Unless house rules are broken.</small>
</section>

${compare({ kicker: 'Book smart', heading: 'Compare booking options' })}
<div class="tf">${rentalTerms()}${faq()}</div>
</main>
${footer({ logoVariant: 'altWhite', tagline: 'Whole-home stays in Oakdale and Parkgate, Akron, Ohio.', credits })}`;

const css = `
:root{--bg:#faf5ea;--surface:#ffffff;--surface-2:#efe4cf;--soot:#221811;--text:#221811;--text-muted:#5e5047;--border:#d6c8b1;--accent:#ba2e17;--accent-contrast:#faf5ea;--gold:#fea802;--success:#2f6b3a;--warning:#8a5a00;--danger:#ba2e17;--focus:#ba2e17;
--font-display:'Big Shoulders Display',sans-serif;--font-body:'Libre Franklin',sans-serif;--r-sm:2px;--r-md:6px;--r-lg:12px;--s1:4px;--s2:8px;--s3:16px;--s4:24px;--s5:32px;--s6:48px;--s7:64px;--s8:96px;--elev-1:0 12px 32px rgb(34 24 17/.18);--dur:180ms}
body{background:var(--bg);color:var(--text);font:400 17px/1.6 var(--font-body)}
a{color:var(--accent)}
h1,h2,h3{font-family:var(--font-display);font-weight:900;text-transform:uppercase;line-height:.95;margin:0}
h2{font-size:48px}
h3{font-size:40px}
.kicker{font-size:13px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin:0 0 var(--s2)}
.hd{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:var(--s2) var(--s4);padding:var(--s3)}
.hd-logo{width:180px}
.hd-nav{display:flex;gap:0 var(--s3);flex-wrap:wrap}
.hd-nav a{font-weight:700;font-size:14px;letter-spacing:.06em;text-transform:uppercase;color:var(--text);text-decoration:none;min-height:44px;display:inline-flex;align-items:center}
.hd-nav a:hover{color:var(--accent)}
.bk{background:var(--accent);color:var(--accent-contrast);padding:var(--s4) var(--s3)}
.bk :focus-visible{outline-color:var(--gold)}
.bk-title{font-family:var(--font-display);font-weight:900;text-transform:uppercase;font-size:36px;line-height:1;margin:0}
.bk label,.bk-label{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
.bk select,.bk-date,.bk-step{background:var(--bg);color:var(--text);border:0;border-radius:var(--r-sm)}
.bk-pm{background:transparent;border:0;color:var(--text)}
.bk-go{background:var(--gold);color:var(--soot);border:0;border-radius:var(--r-md);font-family:var(--font-display);font-weight:900;text-transform:uppercase;font-size:22px;letter-spacing:.04em;transition:background var(--dur)}
.bk-go:hover{background:var(--bg)}
.bk-cal{background:var(--bg);color:var(--text);border-radius:var(--r-md)}
.bk-cal :focus-visible{outline-color:var(--accent)}
.bk-nav{background:var(--surface-2);border:0;border-radius:var(--r-md);color:var(--text)}
.bk-day{border-radius:var(--r-sm)}
.bk-day:hover:not([disabled]){background:var(--surface-2)}
.bk-day.is-on{background:var(--accent);color:var(--accent-contrast)}
.bk-day.is-mid{background:var(--surface-2)}
.bk-out-link{color:var(--accent-contrast);font-weight:700;min-height:44px;display:inline-flex;align-items:center}
.bk-promise strong{color:var(--gold);font-family:var(--font-display);font-size:24px;text-transform:uppercase}
.hero{display:grid;position:relative}
.hero-fig{margin:0}
.hero-fig img{width:100%;aspect-ratio:4/3;object-fit:cover}
.hero-card{background:var(--soot);color:var(--accent-contrast);padding:var(--s5) var(--s3);margin:calc(var(--s6) * -1) var(--s3) 0;position:relative;border-radius:var(--r-sm)}
.hero-card .kicker{color:var(--gold)}
.hero-card h1{font-size:56px}
.hero-card h1 span{display:block;color:var(--gold)}
.hero-card p:last-child{margin:var(--s3) 0 0}
.hero-cap{font-size:13px;color:var(--text-muted);padding:var(--s2) var(--s3);margin:0}
.sec-head{margin-bottom:var(--s5)}
.hoods{padding:var(--s7) var(--s3);display:grid;gap:var(--s7)}
.hoods .sec-head{margin:0}
.hood{display:grid;gap:var(--s4);border-top:4px solid var(--soot);padding-top:var(--s4)}
.hood-head p{color:var(--text-muted);margin:var(--s2) 0 0;max-width:36em}
.hood-stays{display:grid;gap:var(--s4)}
.unit{display:grid;gap:var(--s3);background:var(--surface);border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--elev-1)}
.unit img{width:100%;aspect-ratio:3/2;object-fit:cover}
.unit-copy{padding:0 var(--s4) var(--s4)}
.unit-name{font-family:var(--font-display);font-weight:900;text-transform:uppercase;font-size:28px;line-height:1;margin:0 0 var(--s2)}
.unit-specs{font-weight:700;font-size:14px;color:var(--text-muted);margin:0 0 var(--s2)}
.go{display:inline-flex;align-items:center;min-height:44px;font-weight:700;color:var(--accent)}
.akron{background:var(--soot);color:var(--accent-contrast);padding:var(--s7) var(--s3)}
.akron .kicker{color:var(--gold)}
.cards{list-style:none;margin:0;padding:0;display:grid;gap:var(--s4)}
.cards figure{margin:0;background:var(--bg);color:var(--text);padding:var(--s2) var(--s2) var(--s3);border-radius:var(--r-sm);transform:rotate(-1deg)}
.cards li:nth-child(even) figure{transform:rotate(1deg)}
.cards img{width:100%;aspect-ratio:4/3;object-fit:cover}
.cards figcaption{display:grid;gap:var(--s1);padding:var(--s3) var(--s2) 0;font-size:15px}
.cards strong{font-family:var(--font-display);font-weight:900;text-transform:uppercase;font-size:24px;line-height:1}
.cards small{font-size:12px;color:var(--text-muted)}
.clock{display:grid;gap:var(--s3);padding:var(--s6) var(--s3);background:var(--gold);color:var(--soot)}
.clock p{margin:0;font-family:var(--font-display);font-weight:900;font-size:44px;line-height:1;text-transform:uppercase}
.clock span{display:block;font-family:var(--font-body);font-size:13px;letter-spacing:.14em;font-weight:700}
.clock small{font-weight:700}
.cmp{padding:var(--s7) var(--s3);display:grid;gap:var(--s4)}
.cmp-box{background:var(--surface);border-radius:var(--r-lg);padding:var(--s4);border:2px solid var(--soot)}
.cmp-context{font-weight:700;margin:0 0 var(--s3)}
.cmp-table th,.cmp-table td{border-bottom:1px solid var(--border)}
.cmp-table thead th{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted)}
.cmp-table td{color:var(--text-muted)}
.cmp-fine{font-size:14px;color:var(--text-muted);margin:var(--s3) 0 0}
.tf{display:grid;gap:var(--s6);padding:var(--s7) var(--s3);background:var(--surface-2)}
.terms-list{padding-left:var(--s4);margin:var(--s3) 0 0}
.terms-list li{margin-bottom:var(--s2)}
.faq-list{margin-top:var(--s3)}
.faq details{border-bottom:1px solid var(--border);padding:var(--s1) 0}
.faq summary{font-weight:700}
.faq details p{margin:0 0 var(--s3);color:var(--text-muted)}
.ft{background:var(--soot);color:var(--accent-contrast);padding:var(--s7) var(--s3);display:grid;gap:var(--s5)}
.ft a{color:var(--accent-contrast)}
.ft-logo{width:240px;border-radius:var(--r-md)}
.ft-h{font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin:0 0 var(--s2)}
.ft-contact{display:grid;justify-items:start}
.ft-credits{font-size:13px;opacity:.85}
@media (min-width:900px){
 .hd{padding:var(--s3) var(--s6)}
 .hd-logo{width:220px}
 .hd-nav{gap:0 var(--s5)}
 .bk{padding:var(--s4) var(--s6)}
 .bk-form{grid-template-columns:1.2fr 1.6fr 1fr auto;align-items:end;gap:var(--s3)}
 .bk-title,.bk-status,.bk-out-link,.bk-promise{grid-column:1/-1}
 .bk-cal{grid-column:2/4;max-width:440px}
 .hero{grid-template-columns:repeat(12,1fr)}
 .hero-fig{grid-column:4/-1;grid-row:1}
 .hero-fig img{aspect-ratio:16/8}
 .hero-card{grid-column:1/7;grid-row:1;align-self:end;margin:0 0 var(--s6) var(--s6);padding:var(--s6)}
 .hero-card h1{font-size:96px}
 .hero-cap{grid-column:4/-1;text-align:right;padding:var(--s2) var(--s6)}
 .hoods,.akron,.cmp,.tf{padding:var(--s8) var(--s6)}
 h2{font-size:72px}
 .hood{grid-template-columns:4fr 8fr;gap:var(--s6)}
 .hood-stays{grid-template-columns:1fr 1fr}
 .hood-pg .hood-stays{grid-template-columns:1fr}
 .hood-pg .unit{grid-template-columns:1fr 1fr;align-items:center}
 .hood-pg .unit img{height:100%;aspect-ratio:auto}
 .hood-pg .unit-copy{padding:var(--s5)}
 .cards{grid-template-columns:repeat(4,1fr)}
 .clock{grid-template-columns:repeat(3,1fr);padding:var(--s6)}
 .clock small{grid-column:1/-1}
 .clock p{font-size:64px}
 .cmp{grid-template-columns:4fr 8fr}
 .tf{grid-template-columns:1fr 1fr}
 .ft{grid-template-columns:2fr 1fr 1fr;padding:var(--s8) var(--s6)}
 .ft-legal{grid-column:1/-1}
}`;

export default {
  file: '04-rubber-city-akron.html',
  name: 'Rubber City: Akron-forward',
  inspiration: 'Akron, Ohio imagery (Adobe Stock search used as mood reference only)',
  title: 'Sample 4: Rubber City | Oilgate Vacation Rentals, Akron',
  description: 'Design sample built around Akron, Ohio: whole-home stays in Oakdale and Parkgate, near downtown, the canal and Sand Run Metro Park. No cleaning fees, ever, unless house rules are broken.',
  fontsHref: 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@900&family=Libre+Franklin:wght@400;700&display=swap',
  theme: '#ba2e17',
  css, body,
  refs: [
    'https://stock.adobe.com/search/images?k=akron+ohio — mood reference only (skyline at golden hour, brick downtown, canal, Airdock). No Adobe Stock images are downloaded or used.',
    'https://commons.wikimedia.org/wiki/Category:Downtown_Akron,_Ohio — the free-licensed photos actually used (CC0 by Dillguy9; CC BY-SA 4.0 by Andre Carrotflower), credited in the footer.',
    'https://commons.wikimedia.org/wiki/Category:Goodyear_Airdock — CC0 Goodyear Airdock photo; the industrial Rubber City mood behind the type and soot/brick palette.',
    'https://fonts.google.com/specimen/Big+Shoulders+Display — free industrial condensed display face (Chicago-born, fits a Rust Belt city).',
    'https://fonts.google.com/specimen/Libre+Franklin — free body sans; gold taken from the official Oilgate Vacation Rentals logo (#fea802).',
  ],
};

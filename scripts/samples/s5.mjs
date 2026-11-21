// Sample 5: "Best of" — combines 1-3: Oilgate Links ground, lime and link-card stack (3), serif italics, ordinals and hour-by-hour (1), condensed uppercase energy and promise strip (2).
import { stays, akron, brand, booking, compare, rentalTerms, faq, footer, img, stayImg, esc, nearParkgate, times } from './shared.mjs';

const credits = [akron.lock3, akron.main];

const body = `
<header class="hd">
<a class="hd-brand" href="#main">${brand('primaryWhite', 'hd-logo', true)}</a>
<nav class="hd-nav" aria-label="Main navigation"><a href="#stays">Stays</a><a href="#compare">Compare</a><a href="#faq">Good to know</a><a href="#contact">Contact</a></nav>
</header>
<main id="main">
${booking({ title: 'Your Akron stay starts here' })}
<section class="hero" aria-labelledby="h1">
<div class="hero-copy">
<p class="kicker">Akron, Ohio · Oakdale + Parkgate</p>
<h1 id="h1"><span class="cond">Whole homes.</span> <i>Real Akron.</i></h1>
<p class="lede">Three places to call your own for a weekend or a longer stretch. Your own kitchen, your own front door, room for up to six.</p>
<a class="btn-line" href="#stays">Find your stay</a>
</div>
<div class="hero-art">
<figure class="ha-a">${img(akron.lock3, '', true)}</figure>
<div class="phone" aria-label="Oilgate Links style page with all three stays">
<div class="ph-screen">
${brand('primaryWhite', 'ph-logo')}
<p class="ph-name">Oilgate Vacation Rentals</p><p class="ph-sub">Akron, Ohio · 3 whole homes</p>
<ul class="ph-links">${stays.map(s => `<li><a href="#availability" data-stay="${s.id}">${stayImg(s, 'img', 'ph-thumb')}<span>${esc(s.short)}<small>${s.specs.split(' · ')[0]}</small></span></a></li>`).join('')}</ul>
<img class="ph-mark" src="img/og-links-icon.webp" width="150" height="160" alt="Oilgate Links chain mark" loading="lazy">
</div></div>
<p class="ha-cap">Lock 3, downtown Akron · your stays as an Oilgate Links page</p>
</div>
</section>

<section class="strip" aria-label="House promise"><p>No cleaning fees, ever<span>Unless house rules are broken</span></p><p>Whole homes only<span>No shared kitchens</span></p><p>Sleeps up to six<span>At every stay</span></p></section>

<section class="ordinals" aria-labelledby="ord-title">
<h2 id="ord-title"><span class="cond">What you came for</span></h2>
<ol class="ord-list">
<li><p class="ord-n">First:</p><p class="ord-t">a whole place to yourself.</p><p>Every stay is an entire home or unit. At Oakdale, the basement laundry is the only shared space.</p></li>
<li><p class="ord-n">Second:</p><p class="ord-t">room for everyone.</p><p>Oakdale’s units have three bedrooms with workspaces and blackout curtains. Parkgate has two bedrooms, a deck and a big yard.</p></li>
<li><p class="ord-n">Third:</p><p class="ord-t">Akron, close by.</p><p>Parkgate is minutes from ${nearParkgate.slice(0, -1).join(', ')} and ${nearParkgate.at(-1)}.</p></li>
</ol>
</section>

<section class="stays" id="stays" aria-labelledby="stays-title">
<div class="stays-head"><p class="kicker">The collection</p><h2 id="stays-title"><span class="cond">Three homes,</span> <i>one tap each.</i></h2></div>
<ul class="link-stack">
${stays.map((s, i) => `<li><a class="link-card" href="#availability" data-stay="${s.id}">${stayImg(s, 'img', 'lc-thumb')}<span class="lc-text"><small class="lc-n">0${i + 1} · ${esc(s.place)}</small><strong>${esc(s.name)}</strong><small>${s.specs}</small><span class="lc-line">${esc(s.line)}</span></span><span class="lc-go">Check dates →</span></a></li>`).join('')}
</ul>
<figure class="stays-fig">${img(akron.main)}<figcaption>Main Street, downtown Akron</figcaption></figure>
</section>

<section class="day" aria-labelledby="day-title">
<h2 id="day-title"><span class="cond">Key to checkout,</span> <i>hour by hour</i></h2>
<ol class="day-list">
<li><time>${times.checkin}</time><p><strong>Check in.</strong> Settle into a whole home.</p></li>
<li><time>Evening</time><p><strong>Dinner nearby.</strong> Swensons and Highland Square are minutes from Parkgate.</p></li>
<li><time>Morning</time><p><strong>Coffee, then a walk.</strong> Coffee makers in every kitchen; Sand Run Metro Park is close to Parkgate.</p></li>
<li><time>${times.checkout}</time><p><strong>Check out.</strong> No cleaning fees, ever, unless house rules are broken.</p></li>
</ol>
</section>

<div class="light">
${compare({ kicker: 'A clearer way to compare', heading: 'Compare booking options' })}
<div class="tf">${rentalTerms()}${faq()}</div>
</div>
</main>
${footer({ logoVariant: 'secondaryWhite', tagline: 'Whole homes. Real Akron.', credits })}`;

const css = `
:root{--bg:#0b0e0a;--surface:#161a14;--surface-2:#22281f;--paper:#f5f2e7;--text:#ecf0e9;--text-muted:#b2baae;--ink:#1b1f18;--ink-muted:#4d5448;--border:#323a2e;--paper-border:#d8d3c2;--accent:#84f616;--accent-ink:#376e00;--accent-contrast:#0b0e0a;--success:#84f616;--warning:#f8c20d;--danger:#ff7a6b;--focus:#84f616;--glow:0 0 40px rgb(132 246 22/.2);
--font-serif:'Cormorant Garamond',Georgia,serif;--font-sans:'Archivo',sans-serif;--r-sm:4px;--r-md:12px;--r-lg:24px;--r-pill:999px;--s1:4px;--s2:8px;--s3:16px;--s4:24px;--s5:32px;--s6:48px;--s7:64px;--s8:96px;--dur:180ms}
body{background:var(--bg);color:var(--text);font:400 17px/1.55 var(--font-sans)}
a{color:var(--accent)}
h1,h2{margin:0;line-height:.95;font-weight:500}
.cond{font-family:var(--font-sans);font-stretch:70%;font-weight:900;text-transform:uppercase;letter-spacing:-.01em}
h1 i,h2 i{font-family:var(--font-serif);font-weight:500;color:var(--accent)}
h2{font-size:44px}
.kicker{font-stretch:75%;font-weight:800;font-size:15px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);margin:0 0 var(--s3)}
.hd{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:var(--s2) var(--s4);padding:var(--s3)}
.hd-logo{width:148px;border-radius:var(--r-sm)}
.hd-nav{display:flex;gap:0 var(--s3);flex-wrap:wrap}
.hd-nav a{font-stretch:75%;font-weight:700;text-transform:uppercase;letter-spacing:.1em;font-size:15px;color:var(--text);text-decoration:none;min-height:44px;display:inline-flex;align-items:center}
.hd-nav a:hover{color:var(--accent)}
.bk{background:var(--accent);color:var(--accent-contrast);margin:0 var(--s3);border-radius:var(--r-lg);padding:var(--s4) var(--s3);box-shadow:var(--glow)}
.bk :focus-visible{outline-color:var(--bg)}
.bk-title{font-family:var(--font-serif);font-style:italic;font-weight:600;font-size:32px;line-height:1;margin:0}
.bk label,.bk-label{font-stretch:75%;font-weight:800;font-size:14px;letter-spacing:.14em;text-transform:uppercase}
.bk select,.bk-date,.bk-step{background:var(--bg);color:var(--text);border:0;border-radius:var(--r-md)}
.bk-pm{background:transparent;border:0;color:var(--accent)}
.bk-go{background:var(--bg);color:var(--accent);border:0;border-radius:var(--r-pill);font-stretch:75%;font-weight:900;font-size:20px;letter-spacing:.06em;text-transform:uppercase;transition:transform var(--dur)}
.bk-go:hover{transform:translateY(-2px)}
.bk-cal{background:var(--bg);color:var(--text);border-radius:var(--r-md)}
.bk-cal :focus-visible{outline-color:var(--accent)}
.bk-nav{background:var(--surface-2);border:0;border-radius:var(--r-pill);color:var(--accent)}
.bk-day{border-radius:var(--r-pill)}
.bk-day:hover:not([disabled]){background:var(--surface-2)}
.bk-day.is-on{background:var(--accent);color:var(--accent-contrast)}
.bk-day.is-mid{background:var(--surface-2)}
.bk-out-link{color:var(--accent-contrast);font-weight:800;min-height:44px;display:inline-flex;align-items:center}
.bk-promise strong{font-family:var(--font-serif);font-style:italic;font-size:22px}
.hero{display:grid;gap:var(--s5);padding:var(--s6) var(--s3)}
.hero h1{font-size:56px}
.hero h1 .cond,.hero h1 i{display:block}
.lede{font-size:19px;color:var(--text-muted);max-width:32em;margin:var(--s4) 0}
.btn-line{display:inline-flex;align-items:center;min-height:48px;padding:0 var(--s4);border:2px solid var(--accent);border-radius:var(--r-pill);color:var(--accent);font-stretch:75%;font-weight:800;text-transform:uppercase;letter-spacing:.1em;text-decoration:none;transition:background var(--dur),color var(--dur)}
.btn-line:hover{background:var(--accent);color:var(--accent-contrast)}
.hero-art{display:grid;grid-template-columns:1fr 1fr;gap:var(--s3);align-items:end}
.hero-art figure{margin:0;overflow:hidden;border-radius:var(--r-lg);background:var(--surface)}
.ha-a img{width:100%;aspect-ratio:3/5;object-fit:cover}
.phone{background:var(--surface);border:2px solid var(--accent);border-radius:var(--r-lg);padding:var(--s2);box-shadow:var(--glow)}
.ph-screen{background:var(--bg);border-radius:var(--r-md);padding:var(--s3) var(--s2);display:grid;justify-items:center;text-align:center}
.ph-logo{width:100%;max-width:160px;border-radius:var(--r-sm)}
.ph-name{font-stretch:75%;font-weight:900;text-transform:uppercase;font-size:15px;margin:var(--s2) 0 0}
.ph-sub{font-size:12px;color:var(--text-muted);margin:0 0 var(--s2)}
.ph-links{list-style:none;margin:0;padding:0;display:grid;gap:var(--s2);width:100%}
.ph-links a{display:grid;grid-template-columns:40px 1fr;gap:var(--s2);align-items:center;min-height:52px;padding:var(--s1);background:var(--surface-2);border:1px solid var(--border);border-radius:var(--r-md);color:var(--text);text-decoration:none;text-align:left;font-weight:800;font-size:14px;transition:border-color var(--dur)}
.ph-links a:hover{border-color:var(--accent)}
.ph-links small{display:block;font-weight:400;font-size:12px;color:var(--text-muted)}
.ph-thumb{width:40px;height:40px;object-fit:cover;border-radius:var(--r-sm)}
.ph-mark{width:32px;height:auto;margin-top:var(--s3)}
.ha-cap{grid-column:1/-1;margin:0;font-family:var(--font-serif);font-style:italic;font-size:16px;color:var(--text-muted)}
.strip{display:grid;background:var(--surface)}
.strip p{margin:0;padding:var(--s4) var(--s3);font-stretch:70%;font-weight:900;text-transform:uppercase;font-size:28px;line-height:1;color:var(--accent);border-top:1px solid var(--border)}
.strip span{display:block;font-family:var(--font-serif);font-style:italic;font-weight:500;text-transform:none;font-size:18px;color:var(--text-muted);margin-top:var(--s1)}
.ordinals{padding:var(--s7) var(--s3)}
.ord-list{list-style:none;margin:var(--s5) 0 0;padding:0;display:grid;gap:var(--s5)}
.ord-list li{border-top:1px solid var(--border);padding-top:var(--s4)}
.ord-n{font-family:var(--font-serif);font-style:italic;font-size:28px;color:var(--accent);margin:0}
.ord-t{font-stretch:70%;font-weight:900;text-transform:uppercase;font-size:32px;line-height:1;margin:0 0 var(--s3)}
.ord-list li p:last-child{color:var(--text-muted);margin:0}
.stays{padding:var(--s7) var(--s3);background:var(--surface);display:grid;gap:var(--s5)}
.link-stack{list-style:none;margin:0;padding:0;display:grid;gap:var(--s3)}
.link-card{display:grid;grid-template-columns:96px 1fr;gap:var(--s3);padding:var(--s3);background:var(--bg);border:1px solid var(--border);border-radius:var(--r-md);color:var(--text);text-decoration:none;transition:border-color var(--dur),transform var(--dur)}
.link-card:hover{border-color:var(--accent);transform:translateX(4px)}
.lc-thumb{width:96px;height:120px;object-fit:cover;border-radius:var(--r-sm)}
.lc-text{display:grid;gap:var(--s1);align-content:start}
.lc-text strong{font-stretch:75%;font-weight:900;text-transform:uppercase;font-size:24px;line-height:1}
.lc-text small{font-size:14px;color:var(--text-muted)}
.lc-n{color:var(--accent)!important;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.lc-line{font-family:var(--font-serif);font-style:italic;font-size:18px;line-height:1.3}
.lc-go{grid-column:2;color:var(--accent);font-stretch:75%;font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:15px}
.stays-fig{margin:0}
.stays-fig img{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:var(--r-lg)}
figcaption{font-family:var(--font-serif);font-style:italic;color:var(--text-muted);margin-top:var(--s2)}
.day{padding:var(--s7) var(--s3)}
.day-list{list-style:none;margin:var(--s5) 0 0;padding:0}
.day-list li{display:grid;grid-template-columns:120px 1fr;gap:var(--s3);padding:var(--s4) 0;border-top:1px solid var(--border)}
.day-list time{font-family:var(--font-serif);font-style:italic;font-size:24px;color:var(--accent)}
.day-list p{margin:0}
.light{background:var(--paper);color:var(--ink)}
.light a{color:var(--accent-ink)}
.light .kicker{color:var(--accent-ink)}
.light h2{font-family:var(--font-serif);font-style:italic;font-weight:500}
.cmp{padding:var(--s7) var(--s3);display:grid;gap:var(--s4)}
.cmp-box{background:var(--bg);color:var(--text);border-radius:var(--r-lg);padding:var(--s4)}
.cmp-context{color:var(--text-muted);margin:0 0 var(--s3);font-size:15px}
.cmp-table th,.cmp-table td{border-bottom:1px solid var(--border)}
.cmp-table thead th{font-stretch:75%;text-transform:uppercase;letter-spacing:.12em;font-size:14px;color:var(--accent)}
.cmp-table td{color:var(--text-muted);font-family:var(--font-serif);font-style:italic;font-size:18px}
.cmp-fine{font-size:14px;color:var(--text-muted);margin:var(--s3) 0 0}
.tf{display:grid;gap:var(--s6);padding:0 var(--s3) var(--s7)}
.terms-list{padding-left:var(--s4);margin:var(--s4) 0 0}
.terms-list li{margin-bottom:var(--s2)}
.faq-list{margin-top:var(--s4)}
.faq details{border-bottom:1px solid var(--paper-border);padding:var(--s1) 0}
.faq summary{font-stretch:75%;font-weight:800;text-transform:uppercase;letter-spacing:.04em;font-size:17px}
.faq details p{margin:0 0 var(--s3);color:var(--ink-muted)}
.ft{background:var(--bg);color:var(--text);padding:var(--s7) var(--s3);display:grid;gap:var(--s5)}
.ft a{color:var(--text)}
.ft a:hover{color:var(--accent)}
.ft-logo{width:220px;border-radius:var(--r-sm)}
.ft-h{font-stretch:75%;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin:0 0 var(--s2)}
.ft-contact{display:grid;justify-items:start}
.ft-credits{font-size:13px;color:var(--text-muted)}
@media (min-width:900px){
 .hd{padding:var(--s4) var(--s6)}
 .hd-logo{width:184px}
 .hd-nav{gap:0 var(--s5)}
 .bk{margin:0 var(--s6);padding:var(--s4) var(--s5)}
 .bk-form{grid-template-columns:1.2fr 1.6fr 1fr auto;align-items:end;gap:var(--s3)}
 .bk-title,.bk-status,.bk-out-link,.bk-promise{grid-column:1/-1}
 .bk-cal{grid-column:2/4;max-width:440px}
 .hero{grid-template-columns:6fr 5fr;align-items:center;gap:var(--s7);padding:var(--s7) var(--s6)}
 .hero h1{font-size:104px}
 h2{font-size:72px}
 .strip{grid-template-columns:repeat(3,1fr)}
 .strip p{padding:var(--s5) var(--s6);border-top:0;border-left:1px solid var(--border)}
 .strip p:first-child{border-left:0}
 .ordinals,.stays,.day,.cmp{padding:var(--s8) var(--s6)}
 .ord-list{grid-template-columns:repeat(3,1fr);gap:var(--s6)}
 .stays{grid-template-columns:7fr 5fr;align-items:start}
 .stays-head{grid-column:1/-1}
 .stays-fig{position:sticky;top:var(--s4)}
 .stays-fig img{aspect-ratio:4/5}
 .day-list li{grid-template-columns:220px 1fr}
 .cmp{grid-template-columns:4fr 8fr}
 .tf{grid-template-columns:1fr 1fr;padding:0 var(--s6) var(--s8)}
 .ft{grid-template-columns:2fr 1fr 1fr;padding:var(--s8) var(--s6)}
 .ft-legal{grid-column:1/-1}
}`;

export default {
  file: '05-best-of-akron-linked.html',
  name: 'Best of 1–3, OG Links imagery',
  inspiration: 'Samples 1–3 combined, Oilgate Links imagery',
  title: 'Sample 5: Best of | Oilgate Vacation Rentals, Akron',
  description: 'Design sample combining the best of samples 1 to 3: whole homes in Akron with dark Oilgate Links styling. No cleaning fees, ever, unless house rules are broken.',
  fontsHref: 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Cormorant+Garamond:ital,wght@0,500;1,500;1,600&display=swap',
  theme: '#0b0e0a',
  css, body,
  refs: [
    'https://oilgatelinks.com/app — Oilgate Links imagery: near-black ground, lime glow, the official chain mark and a phone link-page with stacked link cards (from sample 3 and the OG Links marketing images).',
    'https://www.schlosshotel-kitzbuehel.com/en — serif italics, "First:/Second:/Third:" ordinals and the hour-by-hour narrative (from sample 1).',
    'https://clubcharlestown.com.au/ — condensed uppercase headlines, pill buttons and the promise strip (from sample 2).',
    'https://fonts.google.com/specimen/Archivo — one variable family covers both condensed (wdth 70) and black weights, keeping the page to two families.',
    'https://fonts.google.com/specimen/Cormorant+Garamond — free serif for the italic accents.',
  ],
};

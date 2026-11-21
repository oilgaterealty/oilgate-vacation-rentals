// Sample 1: "Portage" — homage to the Schlosshotel Kitzbühel site (quiet luxury, claret on ivory, serif display, ordinal sections).
import { stays, akron, brand, booking, compare, rentalTerms, faq, footer, img, stayImg, esc, times, nearParkgate } from './shared.mjs';

const roman = ['I', 'II', 'III'];
const credits = [akron.lock3, akron.main];

const body = `
<header class="hd">
<a class="hd-brand" href="#main">${brand('primary', 'hd-logo', true)}<span class="hd-place">Akron, Ohio</span></a>
<nav class="hd-nav" aria-label="Main navigation"><a href="#stays">The stays</a><a href="#compare">Compare</a><a href="#faq">Good to know</a><a href="#contact">Contact</a></nav>
</header>
<main id="main">
${booking({ title: 'Your Akron stay starts here' })}
<section class="hero" aria-labelledby="h1">
<div class="hero-copy">
<p class="kicker">Akron, Ohio · Oakdale &amp; Parkgate</p>
<h1 id="h1">A quieter way <i>to stay in Akron.</i></h1>
<p class="lede">Three whole homes on two Akron streets. Your own front door, your own kitchen, and room for up to six. For a weekend, or for a longer stretch.</p>
<a class="link-arrow" href="#stays">Step inside the stays</a>
</div>
<figure class="hero-fig">${img(akron.lock3, 'hero-img', true)}<figcaption>Lock 3 and the Ohio &amp; Erie Canal, downtown Akron</figcaption></figure>
</section>

<section class="ordinals" aria-labelledby="ord-title">
<h2 id="ord-title" class="sr-only">What you are looking for</h2>
<article class="ord">
<figure>${stayImg(stays[0], 'ext')}</figure>
<div><p class="ord-n">First:</p><h3>a whole place to yourself.</h3><p>Every stay is an entire home or an entire unit. No shared kitchens, no shared living rooms. At Oakdale, the basement laundry is the only space two units share.</p><a class="link-arrow" href="#stays">See all three homes</a></div>
</article>
<article class="ord ord-flip">
<figure>${stayImg(stays[1], 'ext')}</figure>
<div><p class="ord-n">Second:</p><h3>room for everyone.</h3><p>Each stay sleeps up to six. Oakdale’s units have three bedrooms, each with a workspace and blackout curtains. Parkgate has two bedrooms and a deck with a big yard.</p><a class="link-arrow" href="#faq">Read what to expect</a></div>
</article>
<article class="ord">
<figure>${img(akron.main)}</figure>
<div><p class="ord-n">Third:</p><h3>Akron, close by.</h3><p>Parkgate is minutes from ${nearParkgate.slice(0, -1).join(', ')} and ${nearParkgate.at(-1)}.</p><a class="link-arrow" href="#availability" data-stay="728474">Check dates at Parkgate</a></div>
</article>
</section>

<section class="stays" id="stays" aria-labelledby="stays-title">
<div class="sec-head"><p class="kicker">The collection</p><h2 id="stays-title">Three Akron homes</h2></div>
<div class="stay-list">
${stays.map((s, i) => `<article class="stay">
<figure>${stayImg(s)}</figure>
<div class="stay-copy"><p class="stay-n">${roman[i]}</p><h3>${esc(s.name)}</h3><p class="stay-specs">${s.specs}</p><p>${esc(s.line)}</p><p class="stay-body">${esc(s.body)}</p>
<a class="link-arrow" href="#availability" data-stay="${s.id}">Check dates for ${esc(s.short)}</a></div>
</article>`).join('')}
</div>
</section>

<section class="day" aria-labelledby="day-title">
<div class="sec-head"><p class="kicker">From key to checkout</p><h2 id="day-title">A stay, hour by hour</h2></div>
<ol class="day-list">
<li><time>${times.checkin}</time><p><strong>Check in.</strong> Let yourself in and settle into a whole home.</p></li>
<li><time>Evening</time><p><strong>Dinner nearby.</strong> From Parkgate, Swensons and Highland Square are minutes away.</p></li>
<li><time>Night</time><p><strong>Sleep in the dark.</strong> Blackout curtains in every bedroom.</p></li>
<li><time>Morning</time><p><strong>Coffee, then a walk.</strong> Coffee makers in every kitchen. Sand Run Metro Park is close to Parkgate.</p></li>
<li><time>${times.checkout}</time><p><strong>Check out.</strong> No cleaning fees, ever, unless house rules are broken.</p></li>
</ol>
</section>

${compare()}
<div class="tf">${rentalTerms()}${faq()}</div>
</main>
${footer({ logoVariant: 'primaryWhite', tagline: 'Three whole-home stays in Akron, Ohio.', credits })}`;

const css = `
:root{--bg:#f9f4ec;--surface:#ffffff;--surface-2:#ebdfd0;--text:#3c101d;--text-muted:#6a4d4c;--border:#d9cbbd;--accent:#ad0f33;--accent-contrast:#f9f4ec;--deep:#2a0a14;--brass:#e6b55d;--success:#2f6b3a;--warning:#8a5a00;--danger:#ad0f33;--focus:#ad0f33;
--font-display:'Cormorant Garamond',Georgia,serif;--font-body:'Assistant',sans-serif;--r-sm:2px;--r-md:4px;--r-pill:999px;--s1:4px;--s2:8px;--s3:16px;--s4:24px;--s5:32px;--s6:48px;--s7:64px;--s8:96px;--elev-1:0 1px 2px rgb(60 16 29/.08);--dur:200ms}
body{background:var(--bg);color:var(--text);font:400 18px/1.6 var(--font-body)}
a{color:var(--accent)}
h1,h2,h3{font-family:var(--font-display);font-weight:500;line-height:1.05;margin:0;letter-spacing:-.01em}
h2{font-size:40px}
h3{font-size:32px}
.kicker{font-size:13px;letter-spacing:.16em;text-transform:uppercase;margin:0 0 var(--s3);color:var(--text-muted);font-weight:600}
.hd{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:var(--s2) var(--s4);padding:var(--s2) var(--s3);background:var(--bg)}
.hd-brand{display:flex;align-items:center;gap:var(--s3);text-decoration:none;color:var(--text);font-family:var(--font-display);font-size:24px;line-height:1}
.hd-place{font-family:var(--font-body);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted);border-left:1px solid var(--border);padding-left:var(--s3)}
.hd-logo{width:136px;height:auto}
.hd-nav{display:flex;gap:0 var(--s3);flex-wrap:wrap}
.hd-nav a{color:var(--text);text-decoration:none;font-size:14px;min-height:44px;display:inline-flex;align-items:center}
.hd-nav a:hover{color:var(--accent)}
.bk{background:var(--accent);color:var(--accent-contrast);padding:var(--s4) var(--s3)}
.bk :focus-visible{outline-color:var(--brass)}
.bk-title{margin:0;font-family:var(--font-display);font-size:28px;line-height:1.1}
.bk label,.bk-label{font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:600}
.bk select,.bk-date,.bk-step{background:var(--bg);color:var(--text);border:1px solid var(--bg);border-radius:var(--r-sm)}
.bk-pm{background:transparent;border:0;color:var(--text)}
.bk-go{background:var(--deep);color:var(--accent-contrast);border:1px solid var(--brass);border-radius:var(--r-md);font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-size:15px;transition:background var(--dur)}
.bk-go:hover{background:var(--text)}
.bk-cal{background:var(--bg);color:var(--text);border-radius:var(--r-md)}
.bk-cal :focus-visible{outline-color:var(--accent)}
.bk-nav{background:transparent;border:1px solid var(--border);border-radius:var(--r-pill);color:var(--text)}
.bk-day{border-radius:var(--r-sm)}
.bk-day:hover:not([disabled]){background:var(--surface-2)}
.bk-day.is-on{background:var(--accent);color:var(--accent-contrast)}
.bk-day.is-mid{background:var(--surface-2)}
.bk-out-link{color:var(--accent-contrast);font-weight:700;min-height:44px;display:inline-flex;align-items:center}
.bk-promise{font-size:15px}
.bk-promise strong{font-family:var(--font-display);font-size:22px;font-weight:600}
.hero{background:var(--surface-2);display:grid;gap:var(--s5);padding:var(--s6) var(--s3) var(--s7)}
.hero h1{font-size:48px;font-weight:500}
.hero h1 i{display:block;color:var(--accent)}
.lede{font-size:20px;max-width:34em;margin:var(--s4) 0}
.link-arrow{display:inline-flex;align-items:center;gap:var(--s2);min-height:44px;font-weight:700;text-decoration:none;color:var(--accent);border-bottom:1px solid currentColor}
.link-arrow::after{content:'→'}
.hero-fig{margin:0}
.hero-img{width:100%;aspect-ratio:4/3;object-fit:cover}
figcaption{font-size:14px;color:var(--text-muted);margin-top:var(--s2);font-style:italic}
.ordinals{display:grid;gap:var(--s7);padding:var(--s7) var(--s3);background:var(--surface)}
.ord{display:grid;gap:var(--s4);align-items:center}
.ord figure{margin:0}
.ord img{width:100%;aspect-ratio:5/4;object-fit:cover}
.ord-n{font-family:var(--font-display);font-style:italic;font-size:28px;color:var(--accent);margin:0}
.ord h3{font-size:40px;margin-bottom:var(--s3)}
.sec-head{margin-bottom:var(--s6)}
.stays{padding:var(--s7) var(--s3)}
.stay-list{display:grid;gap:var(--s7)}
.stay{display:grid;gap:var(--s4)}
.stay figure{margin:0}
.stay img{width:100%;aspect-ratio:8/7;object-fit:cover}
.stay-n{font-family:var(--font-display);font-size:20px;letter-spacing:.2em;color:var(--accent);margin:0 0 var(--s2)}
.stay-specs{font-size:15px;letter-spacing:.04em;color:var(--text-muted);margin:var(--s2) 0}
.stay-body{color:var(--text-muted)}
.day{background:var(--surface-2);padding:var(--s7) var(--s3)}
.day-list{list-style:none;margin:0;padding:0;display:grid;gap:0}
.day-list li{display:grid;grid-template-columns:112px 1fr;gap:var(--s3);padding:var(--s4) 0;border-top:1px solid var(--border)}
.day-list time{font-family:var(--font-display);font-size:24px;font-style:italic;color:var(--accent)}
.day-list p{margin:0}
.cmp{padding:var(--s7) var(--s3);display:grid;gap:var(--s5)}
.cmp-box{background:var(--surface);border:1px solid var(--border);padding:var(--s4);border-radius:var(--r-md);box-shadow:var(--elev-1)}
.cmp-context{font-size:15px;color:var(--text-muted);margin:0 0 var(--s3)}
.cmp-table th,.cmp-table td{border-bottom:1px solid var(--border)}
.cmp-table thead th{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted)}
.cmp-table td{color:var(--text-muted);font-style:italic}
.cmp-fine{font-size:14px;color:var(--text-muted);margin:var(--s3) 0 0}
.tf{display:grid;gap:var(--s7);padding:var(--s7) var(--s3);background:var(--surface)}
.terms-list{padding-left:var(--s4);margin:var(--s4) 0 0}
.terms-list li{margin-bottom:var(--s3)}
.faq-list{margin-top:var(--s4)}
.faq details{border-top:1px solid var(--border);padding:var(--s2) 0}
.faq summary{font-family:var(--font-display);font-size:22px}
.faq details p{margin:0 0 var(--s3);color:var(--text-muted)}
.ft{background:var(--deep);color:var(--accent-contrast);padding:var(--s7) var(--s3);display:grid;gap:var(--s5)}
.ft a{color:var(--accent-contrast)}
.ft-logo{width:240px;border-radius:var(--r-md)}
.ft-h{font-size:12px;letter-spacing:.16em;text-transform:uppercase;margin:0 0 var(--s2);color:var(--brass)}
.ft-contact{display:grid;justify-items:start}
.ft-credits{font-size:13px;opacity:.85}
@media (min-width:900px){
 .hd{padding:var(--s3) var(--s6)}
 .hd-logo{width:176px}
 .hd-nav{gap:0 var(--s4)}
 .hd-nav a{font-size:15px}
 .bk{padding:var(--s4) var(--s6)}
 .bk-form{grid-template-columns:1.1fr 1.3fr 1.6fr 1fr auto;align-items:end;gap:var(--s3)}
 .bk-title{grid-column:1/-1}
 .bk-go{padding:0 var(--s5)}
 .bk-cal{grid-column:3/5;max-width:420px}
 .bk-status,.bk-out-link,.bk-promise{grid-column:1/-1}
 .hero{grid-template-columns:5fr 7fr;align-items:center;padding:var(--s7) var(--s6) var(--s8);gap:var(--s7)}
 .hero h1{font-size:88px}
 .ordinals,.stays,.day,.cmp,.tf{padding:var(--s8) var(--s6)}
 .ord{grid-template-columns:7fr 5fr;gap:var(--s7)}
 .ord-flip figure{order:2}
 .ord-flip{grid-template-columns:5fr 7fr}
 .stay-list{grid-template-columns:repeat(3,1fr);gap:var(--s5)}
 .stay:nth-child(2){margin-top:var(--s8)}
 .day-list li{grid-template-columns:200px 1fr}
 .cmp{grid-template-columns:4fr 7fr;align-items:start}
 .tf{grid-template-columns:1fr 1fr}
 .ft{grid-template-columns:2fr 1fr 1fr;padding:var(--s8) var(--s6)}
 .ft-legal{grid-column:1/-1}
}`;

export default {
  file: '01-portage-quiet-luxury.html',
  name: 'Portage: quiet luxury',
  inspiration: 'Schlosshotel Kitzbühel (Awwwards)',
  title: 'Sample 1: Portage | Oilgate Vacation Rentals, Akron',
  description: 'Design sample. Three whole-home stays in Akron, Ohio, in a quiet serif style. No cleaning fees, ever, unless house rules are broken.',
  fontsHref: 'https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&display=swap',
  theme: '#ad0f33',
  css, body,
  refs: [
    'https://www.awwwards.com/sites/schlosshotel-kitzbuhel — the inspiration entry (Brandnamic, 2026).',
    'https://www.schlosshotel-kitzbuehel.com/en — live site studied: deep claret (#42041e family) on ivory, serif display with a sans body (Assistant), ordinal "First:/Second:" section titles, hour-by-hour narrative.',
    'https://fonts.google.com/specimen/Cormorant+Garamond — free display serif standing in for the reference serif.',
    'https://fonts.google.com/specimen/Assistant — free body sans, the same family the reference uses.',
    'https://commons.wikimedia.org/wiki/Category:Downtown_Akron,_Ohio — free-licensed Akron photography (Lock 3, Main Street).',
  ],
};

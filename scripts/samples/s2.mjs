// Sample 2: "Rubber City Club" — homage to Club Charlestown (bold condensed uppercase, black + vivid orange, pill buttons, community energy).
import { stays, akron, brand, booking, compare, rentalTerms, faq, footer, img, stayImg, esc, nearParkgate, times } from './shared.mjs';

const credits = [akron.main, akron.airdock, akron.cascade];

const body = `
<header class="hd">
<a class="hd-brand" href="#main">${brand('primary', 'hd-logo', true)}</a>
<nav class="hd-nav" aria-label="Main navigation"><a href="#stays">Stays</a><a href="#compare">Compare</a><a href="#faq">Good to know</a><a href="#contact">Contact</a></nav>
</header>
<main id="main">
${booking({ title: 'Book your Akron stay' })}
<section class="hero" aria-labelledby="h1">
<div class="hero-copy">
<p class="kicker">Akron, Ohio</p>
<h1 id="h1">Where Akron <span>stays.</span></h1>
<p class="lede">Three whole homes in Oakdale and Parkgate. Bring the crew: every stay sleeps up to six, with your own kitchen and your own front door.</p>
<a class="btn-round" href="#stays">Meet the stays</a>
</div>
<div class="hero-grid">
<figure class="hg-a">${img(akron.main, '', true)}</figure>
<figure class="hg-b">${img(akron.airdock)}</figure>
<figure class="hg-c">${stayImg(stays[2])}</figure>
</div>
</section>

<section class="strip" aria-label="House promise"><p>No cleaning fees, ever <span>Unless house rules are broken</span></p><p>Whole homes only <span>No shared kitchens</span></p><p>Check in ${times.checkin} <span>Check out ${times.checkout}</span></p></section>

<section class="stays" id="stays" aria-labelledby="stays-title">
<div class="sec-head"><p class="kicker">The lineup</p><h2 id="stays-title">Pick your <span>home base</span></h2></div>
<div class="stay-grid">
${stays.map((s, i) => `<article class="stay stay-${i + 1}">
<figure>${stayImg(s)}<figcaption>${esc(s.place)}</figcaption></figure>
<div class="stay-copy"><h3>${esc(s.name)}</h3><p class="stay-specs">${s.specs}</p><p>${esc(s.line)}</p>
<a class="btn-round btn-line" href="#availability" data-stay="${s.id}">Check dates</a></div>
</article>`).join('')}
</div>
</section>

<section class="near" aria-labelledby="near-title">
<figure class="near-fig">${img(akron.cascade)}</figure>
<div class="near-copy"><p class="kicker">Around Parkgate</p><h2 id="near-title">Minutes from the <span>good stuff</span></h2>
<ul class="chips">${nearParkgate.map(n => `<li>${esc(n)}</li>`).join('')}</ul>
<p>Oakdale’s two units share one Akron address, so a bigger group can book both and stay side by side.</p></div>
</section>

${compare({ kicker: 'Side by side', heading: 'Compare booking options' })}
<div class="tf">${rentalTerms({ heading: 'The house rules, short' })}${faq({ heading: 'Good to know' })}</div>
</main>
${footer({ logoVariant: 'secondaryWhite', tagline: 'Whole-home stays in Oakdale and Parkgate, Akron, Ohio.', credits })}`;

const css = `
:root{--bg:#ffffff;--surface:#f4f1ee;--surface-2:#0f0a08;--text:#0f0a08;--text-muted:#5b524d;--border:#d8d2cc;--accent:#fa6e1d;--accent-ink:#b44200;--accent-contrast:#0f0a08;--on-dark:#ffffff;--scrim:rgb(15 10 8/.78);--success:#2f6b3a;--warning:#8a5a00;--danger:#b3261e;--focus:#b44200;
--font-display:'Barlow Condensed',sans-serif;--font-body:'Barlow',sans-serif;--r-sm:4px;--r-md:8px;--r-lg:20px;--r-pill:999px;--s1:4px;--s2:8px;--s3:16px;--s4:24px;--s5:32px;--s6:48px;--s7:64px;--s8:96px;--elev-1:0 8px 24px rgb(15 10 8/.12);--dur:180ms}
body{background:var(--bg);color:var(--text);font:400 17px/1.55 var(--font-body)}
a{color:var(--accent-ink)}
h1,h2,h3{font-family:var(--font-display);font-weight:800;text-transform:uppercase;line-height:.92;margin:0;letter-spacing:-.005em}
h2{font-size:48px}
h2 span{color:var(--accent-ink)}
.hero h1 span{color:var(--accent)}
h3{font-size:32px}
.kicker{font-family:var(--font-display);font-weight:600;font-size:16px;letter-spacing:.2em;text-transform:uppercase;color:var(--accent-ink);margin:0 0 var(--s2)}
.hd{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--s2) var(--s4);padding:var(--s2) var(--s3);background:var(--bg)}
.hd-logo{width:132px}
.hd-nav{display:flex;gap:0 var(--s3);flex-wrap:wrap}
.hd-nav a{font-family:var(--font-display);font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:15px;color:var(--text);text-decoration:none;min-height:44px;display:inline-flex;align-items:center}
.hd-nav a:hover{color:var(--accent-ink)}
.bk{background:var(--accent);color:var(--accent-contrast);padding:var(--s4) var(--s3)}
.bk :focus-visible{outline-color:var(--text)}
.bk-title{font-family:var(--font-display);font-weight:800;text-transform:uppercase;font-size:32px;line-height:1;margin:0}
.bk label,.bk-label{font-family:var(--font-display);font-weight:600;text-transform:uppercase;letter-spacing:.14em;font-size:14px}
.bk select,.bk-date,.bk-step{background:var(--bg);color:var(--text);border:2px solid var(--text);border-radius:var(--r-sm)}
.bk-pm{background:transparent;border:0;color:var(--text)}
.bk-go{background:var(--text);color:var(--on-dark);border:0;border-radius:var(--r-pill);font-family:var(--font-display);font-weight:800;font-size:20px;text-transform:uppercase;letter-spacing:.06em;transition:transform var(--dur)}
.bk-go:hover{transform:translateY(-2px)}
.bk-cal{background:var(--bg);color:var(--text);border-radius:var(--r-md);box-shadow:var(--elev-1)}
.bk-nav{background:var(--surface);border:0;border-radius:var(--r-pill);color:var(--text)}
.bk-day{border-radius:var(--r-pill)}
.bk-day:hover:not([disabled]){background:var(--surface)}
.bk-day.is-on{background:var(--text);color:var(--on-dark)}
.bk-day.is-mid{background:var(--surface)}
.bk-out-link{color:var(--text);font-weight:600;min-height:44px;display:inline-flex;align-items:center}
.bk-promise{font-weight:600}
.hero{background:var(--surface-2);color:var(--on-dark);display:grid;gap:var(--s5);padding:var(--s6) var(--s3)}
.hero h1{font-size:72px}
.hero h1 span{display:block}
.hero .kicker{color:var(--accent)}
.lede{font-size:19px;max-width:30em;margin:var(--s4) 0}
.btn-round{display:inline-flex;align-items:center;min-height:48px;padding:0 var(--s4);border-radius:var(--r-pill);background:var(--accent);color:var(--accent-contrast);font-family:var(--font-display);font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:18px;text-decoration:none;transition:transform var(--dur)}
.btn-round:hover{transform:translateY(-2px)}
.btn-line{background:transparent;color:var(--text);border:2px solid var(--text)}
.hero-grid{display:grid;grid-template-columns:2fr 1fr;grid-template-rows:auto auto;gap:var(--s2)}
.hero-grid figure{margin:0;overflow:hidden;border-radius:var(--r-md)}
.hero-grid img{width:100%;height:100%;object-fit:cover}
.hg-a{grid-column:1/-1;aspect-ratio:16/9}
.hg-b,.hg-c{aspect-ratio:4/3}
.strip{display:grid;background:var(--accent);color:var(--accent-contrast)}
.strip p{margin:0;padding:var(--s3);font-family:var(--font-display);font-weight:800;text-transform:uppercase;font-size:26px;line-height:1;border-top:2px solid var(--text)}
.strip span{display:block;font-family:var(--font-body);font-weight:600;text-transform:none;font-size:15px;margin-top:var(--s1)}
.stays{padding:var(--s7) var(--s3)}
.sec-head{margin-bottom:var(--s5)}
.stay-grid{display:grid;gap:var(--s6)}
.stay{display:grid;gap:var(--s3)}
.stay figure{margin:0;position:relative;overflow:hidden;border-radius:var(--r-lg)}
.stay img{width:100%;aspect-ratio:4/5;object-fit:cover}
.stay figcaption{position:absolute;left:0;bottom:0;right:0;padding:var(--s6) var(--s3) var(--s3);background:linear-gradient(transparent,var(--scrim));color:var(--on-dark);font-family:var(--font-display);font-weight:800;text-transform:uppercase;letter-spacing:.1em;font-size:20px}
.stay-specs{font-weight:600;color:var(--text-muted);margin:var(--s2) 0}
.near{background:var(--surface);display:grid}
.near-fig{margin:0}
.near-fig img{width:100%;height:100%;object-fit:cover;aspect-ratio:16/10}
.near-copy{padding:var(--s6) var(--s3)}
.chips{list-style:none;padding:0;margin:var(--s4) 0;display:flex;flex-wrap:wrap;gap:var(--s2)}
.chips li{border:2px solid var(--text);border-radius:var(--r-pill);padding:var(--s1) var(--s3);font-weight:600}
.cmp{padding:var(--s7) var(--s3);display:grid;gap:var(--s4)}
.cmp-box{border:2px solid var(--text);border-radius:var(--r-lg);padding:var(--s4)}
.cmp-context{font-weight:600;margin:0 0 var(--s3)}
.cmp-table th,.cmp-table td{border-bottom:2px solid var(--surface)}
.cmp-table thead th{font-family:var(--font-display);text-transform:uppercase;letter-spacing:.12em;font-size:15px}
.cmp-table td{color:var(--text-muted)}
.cmp-fine{font-size:15px;color:var(--text-muted);margin:var(--s3) 0 0}
.tf{display:grid;gap:var(--s6);padding:var(--s7) var(--s3);background:var(--surface)}
.terms-list{padding-left:var(--s4);margin:var(--s4) 0 0}
.terms-list li{margin-bottom:var(--s2)}
.faq-list{margin-top:var(--s4)}
.faq details{border-bottom:2px solid var(--text);padding:var(--s2) 0}
.faq summary{font-family:var(--font-display);font-weight:600;text-transform:uppercase;font-size:20px;letter-spacing:.04em}
.faq details p{margin:0 0 var(--s3)}
.ft{background:var(--surface-2);color:var(--on-dark);padding:var(--s7) var(--s3);display:grid;gap:var(--s5)}
.ft a{color:var(--on-dark)}
.ft-logo{width:240px;border-radius:var(--r-md)}
.ft-h{font-family:var(--font-display);font-weight:800;text-transform:uppercase;letter-spacing:.16em;color:var(--accent);margin:0 0 var(--s2)}
.ft-contact{display:grid;justify-items:start}
.ft-credits{font-size:14px;opacity:.85}
@media (min-width:900px){
 .hd{padding:var(--s3) var(--s6)}
 .hd-logo{width:176px}
 .hd-nav{gap:0 var(--s5)}
 .bk{padding:var(--s4) var(--s6)}
 .bk-form{grid-template-columns:1.2fr 1.6fr 1fr auto;align-items:end;gap:var(--s3)}
 .bk-title,.bk-status,.bk-out-link,.bk-promise{grid-column:1/-1}
 .bk-cal{grid-column:2/4;max-width:440px}
 .hero{grid-template-columns:5fr 6fr;align-items:center;padding:var(--s7) var(--s6);gap:var(--s6)}
 .hero h1{font-size:128px}
 .strip{grid-template-columns:repeat(3,1fr)}
 .strip p{padding:var(--s4) var(--s6);border-top:0;border-left:2px solid var(--text)}
 .strip p:first-child{border-left:0}
 .stays,.cmp,.tf{padding:var(--s8) var(--s6)}
 h2{font-size:80px}
 .stay-grid{grid-template-columns:repeat(3,1fr);gap:var(--s4)}
 .stay-2{transform:translateY(var(--s7))}
 .stays{padding-bottom:calc(var(--s8) + var(--s7))}
 .near{grid-template-columns:1fr 1fr}
 .near-copy{padding:var(--s8) var(--s6)}
 .cmp{grid-template-columns:5fr 7fr}
 .tf{grid-template-columns:1fr 1fr}
 .ft{grid-template-columns:2fr 1fr 1fr;padding:var(--s8) var(--s6)}
 .ft-legal{grid-column:1/-1}
}`;

export default {
  file: '02-rubber-city-club.html',
  name: 'Rubber City Club: bold and social',
  inspiration: 'Club Charlestown (Awwwards)',
  title: 'Sample 2: Rubber City Club | Oilgate Vacation Rentals, Akron',
  description: 'Design sample. Bold, social style for three whole-home Akron stays that sleep up to six. No cleaning fees, ever, unless house rules are broken.',
  fontsHref: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;800&family=Barlow:wght@400;600&display=swap',
  theme: '#fa6e1d',
  css, body,
  refs: [
    'https://www.awwwards.com/sites/club-charlestown — the inspiration entry.',
    'https://clubcharlestown.com.au/ — live site studied: Gotham condensed uppercase headlines, black and white with vivid orange (rgb(255,105,0)), 20px-radius cards and pill buttons, community-first copy ("Where Locals Meet").',
    'https://fonts.google.com/specimen/Barlow+Condensed — free condensed display face standing in for Gotham Condensed.',
    'https://fonts.google.com/specimen/Barlow — free body sans from the same superfamily.',
    'https://commons.wikimedia.org/wiki/Category:Downtown_Akron,_Ohio — free-licensed Akron photography (Main Street, Cascade Plaza, Goodyear Airdock).',
  ],
};

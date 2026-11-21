// Shared, verified content and components for the five static design samples in /samples/.
// Every fact here comes from data/properties.json (Lodgify + oilgaterealty.com) or the live homepage.
// No prices, deposits, phone numbers, reviews or invented contact details.
import { readFileSync } from 'node:fs';

const data = JSON.parse(readFileSync(new URL('../../data/properties.json', import.meta.url), 'utf8'));
export const contact = data.contact; // { email, social: [{name,url}] }
export const terms = data.ownerTerms;

const P = data.properties;
export const stays = [
  {
    id: '603326', key: 'u1', name: P['603326'].name, short: 'Unit 1', place: 'Oakdale',
    specs: `${P['603326'].bedrooms} bedrooms · ${P['603326'].beds} beds · ${P['603326'].bathrooms} bath · up to ${P['603326'].maxGuests} guests`,
    line: 'First floor of a charming Oakdale duplex, with original wood coffered ceilings in the living room.',
    body: 'Three bedrooms, each with blackout curtains, a workspace and Fire TV with cable. A fully equipped kitchen, a dining room and access to the basement laundry.',
    img: 'img/u1-06.webp', w: 1050, h: 1400, alt: 'Unit 1 living room with a dark wood coffered ceiling, TV console and patterned rug',
    ext: 'img/oakdale-unit-1.webp', ew: 1400, eh: 933, extAlt: 'Front of the Oakdale duplex with its enclosed porch under a blue sky',
  },
  {
    id: '603323', key: 'u2', name: P['603323'].name, short: 'Unit 2', place: 'Oakdale',
    specs: `${P['603323'].bedrooms} bedrooms · ${P['603323'].beds} beds · ${P['603323'].bathrooms} bath · up to ${P['603323'].maxGuests} guests`,
    line: 'A spacious upper-level unit for short and mid-term stays.',
    body: 'Three bedrooms, each with a workspace, a plush chair and FireTV with free cable. Your own private kitchen, living room and dining room. The basement laundry is the only shared space.',
    img: 'img/u2-04.webp', w: 1050, h: 1400, alt: 'Unit 2 dining room with a wood table, four chairs and a window',
    ext: 'img/u2-05.webp', ew: 1400, eh: 1050, extAlt: 'Unit 2 kitchen with wood cabinets, a gas range and a microwave',
  },
  {
    id: '728474', key: 'pg', name: P['728474'].name, short: 'Parkgate', place: 'Parkgate',
    specs: `${P['728474'].bedrooms} bedrooms · ${P['728474'].beds} beds · ${P['728474'].bathrooms} bath · up to ${P['728474'].maxGuests} guests`,
    line: 'A completely renovated two-bedroom home in one of Akron’s best neighborhoods.',
    body: 'Brand-new appliances, luxury bedding, blackout curtains, a 75-inch TV with free cable, fast Wi-Fi and smart lock entry. Deck, big yard, washer and dryer, and on-site parking.',
    img: 'img/parkgate-living.webp', w: 904, h: 1200, alt: 'Parkgate living room with a cream sofa, coffee table, wall clock and ceiling fan',
    ext: 'img/parkgate-14.webp', ew: 900, eh: 1200, extAlt: 'Parkgate kitchen with white cabinets, stainless appliances and a dark tile floor',
  },
];
for (const s of stays) if (!/bedrooms/.test(s.specs)) throw new Error('bad specs');
if (P['728474'].bedrooms !== 2 || P['728474'].beds !== 2) throw new Error('Parkgate must be 2 bedrooms / 2 beds');

export const nearParkgate = ['Swensons', 'Highland Square', 'downtown Akron', 'Sand Run Metro Park', 'LeBron’s I Promise School'];
export const times = { checkin: '3:00 p.m.', checkout: '11:00 a.m.' };

// Free-licensed Akron photos (Wikimedia Commons). Credits are printed on every page that uses them.
export const akron = {
  lock3: { src: 'img/akron-lock3-canal.webp', w: 1400, h: 1050, alt: 'Lock 3 park and the Ohio and Erie Canal in downtown Akron at sunset, with a flower mural and the skyline', credit: 'Dillguy9, CC0', file: 'https://commons.wikimedia.org/wiki/File:Lock_3,_Canal_Square,_%26_Civic_Theatre.jpg' },
  main: { src: 'img/akron-main-street.webp', w: 1400, h: 787, alt: 'Main Street in downtown Akron with brick buildings and towers at dusk', credit: 'Dillguy9, CC0', file: 'https://commons.wikimedia.org/wiki/File:Main_Street_Akron.jpg' },
  airdock: { src: 'img/akron-goodyear-airdock.webp', w: 1400, h: 788, alt: 'The Goodyear Airdock, a huge curved hangar, across an open field in Akron', credit: 'Dillguy9, CC0', file: 'https://commons.wikimedia.org/wiki/File:Goodyear_Airdock_July_2024.jpg' },
  cascade: { src: 'img/akron-from-cascade-plaza.webp', w: 1400, h: 663, alt: 'Downtown Akron towers seen from Cascade Plaza on a bright day', credit: 'Dillguy9, CC0', file: 'https://commons.wikimedia.org/wiki/File:Downtown_Akron_from_Cascade_Plaza.jpg' },
  canalway: { src: 'img/akron-canalway-skyline.webp', w: 1400, h: 398, alt: 'Panorama of the downtown Akron skyline from the Ohio and Erie Canalway', credit: 'Andre Carrotflower, CC BY-SA 4.0', file: 'https://commons.wikimedia.org/wiki/File:Downtown_skyline_panorama_as_seen_from_Ohio_%26_Erie_Canalway,_Akron,_Ohio_-_20200530.jpg' },
};

// Official Oilgate Vacation Rentals logos (LaVante's OFFICIAL folder). *-white = official logo on its white field, used as a plate on dark grounds.
export const logos = {
  primary: { src: 'img/ovr-primary.webp', w: 720, h: 181 }, primaryWhite: { src: 'img/ovr-primary-white.webp', w: 720, h: 240 },
  secondary: { src: 'img/ovr-secondary.webp', w: 720, h: 198 }, secondaryWhite: { src: 'img/ovr-secondary-white.webp', w: 720, h: 240 },
  alt: { src: 'img/ovr-alt.webp', w: 720, h: 149 }, altWhite: { src: 'img/ovr-alt-white.webp', w: 720, h: 240 },
};
export const brand = (v, cls, eager = false) => { const l = logos[v]; return `<img src="${l.src}" width="${l.w}" height="${l.h}" alt="Oilgate Vacation Rentals" class="${cls}"${eager ? '' : ' loading="lazy"'}>`; };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export { esc };

export const img = (o, cls = '', eager = false) =>
  `<img${cls ? ` class="${cls}"` : ''} src="${o.src}" width="${o.w}" height="${o.h}" alt="${esc(o.alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;

export const stayImg = (s, which = 'img', cls = '', eager = false) =>
  img({ src: which === 'img' ? s.img : s.ext, w: which === 'img' ? s.w : s.ew, h: which === 'img' ? s.h : s.eh, alt: which === 'img' ? s.alt : s.extAlt }, cls, eager);

// ---------- Booking search (first block on every page) ----------
export function booking({ title = 'Find your dates', note = true } = {}) {
  return `<section class="bk" id="availability" aria-label="Search dates">
<form class="bk-form" id="bk" novalidate>
<p class="bk-title">${esc(title)}</p>
<div class="bk-field bk-stay"><label for="bk-stay">Stay</label>
<select id="bk-stay" name="stay">${stays.map(s => `<option value="${s.id}">${esc(s.name)} · ${s.specs.split(' · ')[0]}</option>`).join('')}</select></div>
<div class="bk-field bk-dates"><span class="bk-label" id="bk-dates-label">Dates</span>
<div class="bk-pair"><button type="button" class="bk-date" id="bk-in" aria-expanded="false" aria-controls="bk-cal" aria-describedby="bk-dates-label"><small>Check in</small><span data-v>Add date</span></button>
<button type="button" class="bk-date" id="bk-out" aria-expanded="false" aria-controls="bk-cal" aria-describedby="bk-dates-label"><small>Check out</small><span data-v>Add date</span></button></div></div>
<div class="bk-field bk-guests"><span class="bk-label" id="bk-g-label">Guests</span>
<div class="bk-step" role="group" aria-labelledby="bk-g-label"><button type="button" class="bk-pm" data-d="-1" aria-label="Fewer guests">−</button><output id="bk-g" aria-live="polite">2</output><button type="button" class="bk-pm" data-d="1" aria-label="More guests">+</button></div></div>
<button type="submit" class="primary bk-go">Check availability</button>
<div class="bk-cal" id="bk-cal" hidden>
<div class="bk-cal-head"><button type="button" class="bk-nav" data-m="-1" aria-label="Previous month">‹</button><p class="bk-month" aria-live="polite"></p><button type="button" class="bk-nav" data-m="1" aria-label="Next month">›</button></div>
<div class="bk-dow" aria-hidden="true"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div>
<div class="bk-grid"></div>
<p class="bk-hint">Tap your check-in day, then your check-out day. To change check-in, tap Check in.</p>
</div>
<p class="bk-status" id="bk-status" aria-live="polite"></p>
<a class="bk-out-link" id="bk-checkout" href="https://checkout.lodgify.com/en/ogr/603326/reservation?currency=USD" target="_blank" rel="noopener" hidden>Continue to secure Lodgify checkout</a>
${note ? `<p class="bk-promise"><strong>No cleaning fees, ever</strong> <span>(unless house rules are broken)</span></p>` : ''}
</form>
</section>`;
}

// ---------- Compare booking options (kept from the live site; no invented prices) ----------
export function compare({ kicker = 'A clearer way to compare', heading = 'Compare booking options' } = {}) {
  const rows = [['direct', 'Oilgate Realty direct (Lodgify)'], ['airbnb', 'Airbnb'], ['vrbo', 'Vrbo'], ['booking', 'Booking.com']];
  return `<section class="cmp" id="compare" aria-labelledby="compare-title">
<div class="cmp-intro"><p class="kicker">${esc(kicker)}</p><h2 id="compare-title">${esc(heading)}</h2>
<p>Compare the same stay, dates and guest count on every channel before you choose where to book.</p></div>
<div class="cmp-box">
<p class="cmp-context" id="cmp-context">Stay: Oakdale / Unit 1 · Dates: not chosen yet · Guests: 2</p>
<div class="cmp-scroll" role="region" aria-label="Booking options, scrolls sideways on small screens" tabindex="0">
<table class="cmp-table"><caption class="sr-only">Full-stay totals by booking channel</caption>
<thead><tr><th scope="col">Booking channel</th><th scope="col">Full-stay total</th></tr></thead>
<tbody>${rows.map(([k, n]) => `<tr data-ch="${k}"><th scope="row">${n}</th><td>Live quote unavailable</td></tr>`).join('')}</tbody></table></div>
<p class="cmp-fine">Live quotes are not connected in this preview, so no prices are shown. We never post estimated prices. Parkgate is not currently listed on Airbnb.</p>
</div></section>`;
}

export function rentalTerms({ heading = 'Rental terms' } = {}) {
  return `<section class="terms" id="rental-terms" aria-labelledby="terms-title">
<h2 id="terms-title">${esc(heading)}</h2>
<ul class="terms-list">
<li><strong>Minimum age 18.</strong> The person booking must be at least 18 years old.</li>
<li><strong>No cleaning fees, ever</strong> (unless house rules are broken).</li>
<li><strong>Liability.</strong> ${esc(terms.liability)}</li>
<li><strong>Payment and cancellation.</strong> Review the full price, payment schedule and cancellation terms for your dates in Lodgify checkout before you confirm.</li>
</ul></section>`;
}

export function faq({ heading = 'Good to know' } = {}) {
  const qs = [
    ['Am I booking a room or a whole place?', 'A whole place. Book an entire Oakdale unit or the whole Parkgate home. At Oakdale, the basement laundry is the only space shared between the two units.'],
    ['Are there cleaning fees?', 'No cleaning fees, ever, unless house rules are broken.'],
    ['What are check-in and check-out times?', `Check-in is ${times.checkin}. Check-out is ${times.checkout}.`],
    ['Are pets allowed?', 'Pets are not allowed at any of our stays. Children are welcome.'],
    ['What is the minimum booking age?', '18.'],
  ];
  return `<section class="faq" id="faq" aria-labelledby="faq-title"><h2 id="faq-title">${esc(heading)}</h2>
<div class="faq-list">${qs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></section>`;
}

export function socials(cls = 'soc') {
  return `<nav class="${cls}" aria-label="Oilgate Realty social pages">${contact.social.map(s => `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name}</a>`).join('')}</nav>`;
}

export function footer({ logoVariant = 'primary', tagline = 'Whole-home stays in Akron, Ohio.', credits = [] } = {}) {
  return `<footer class="ft" id="contact">
<div class="ft-brand">${brand(logoVariant, 'ft-logo')}<p>${esc(tagline)}</p></div>
<div class="ft-contact"><p class="ft-h">Contact</p><a href="mailto:${contact.email}">${contact.email}</a><a href="https://checkout.lodgify.com/en/ogr/603326/reservation?currency=USD" target="_blank" rel="noopener">Contact host through Lodgify</a></div>
<div class="ft-social"><p class="ft-h">Follow</p>${socials()}</div>
<div class="ft-legal"><p>© 2026 Oilgate Realty · <a href="https://oilgaterealty.com/en/privacy-policy">Privacy policy</a></p>
${credits.length ? `<p class="ft-credits">Akron photos via Wikimedia Commons: ${credits.map(c => `<a href="${c.file}">${esc(c.credit)}</a>`).join(' · ')}. Property photos: Oilgate Realty listings.</p>` : '<p class="ft-credits">Photos: Oilgate Realty listings.</p>'}
<p class="ft-credits">Design sample for review. Not the live booking site.</p></div>
</footer>`;
}

// ---------- Mechanics CSS shared by all samples (layout skins live in each sample) ----------
export const baseCss = `
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0}
[hidden]{display:none!important}
p,h1,h2,h3,li,a,summary,td,th,figcaption,time{overflow-wrap:anywhere}
main :where(div,section,article,figure,form,ol,ul,li){min-width:0}
button{padding:0}
p,ul,ol,dl,blockquote{margin-top:0;margin-bottom:16px}
img{max-width:100%;height:auto;display:block}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.skip{position:absolute;left:8px;top:-48px;z-index:20;padding:8px 16px;background:var(--surface);color:var(--text)}
.skip:focus{top:8px}
:focus-visible{outline:3px solid var(--focus);outline-offset:2px}
.bk-form{display:grid;gap:12px}
.bk-field{display:grid;gap:4px;min-width:0}
.bk-pair{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.bk-date{display:grid;gap:0;text-align:left;min-height:48px;padding:4px 12px;font:inherit;cursor:pointer}
.bk-date.is-active{box-shadow:inset 0 0 0 2px currentColor}
.bk-date small{font-size:12px;line-height:16px}
.bk-date span{font-size:16px;line-height:24px}
.bk-step{display:grid;grid-template-columns:48px 1fr 48px;align-items:center;min-height:48px}
.bk-step output{text-align:center;font-size:16px;font-variant-numeric:tabular-nums}
.bk-pm,.bk-nav{min-width:44px;min-height:44px;font:inherit;font-size:20px;cursor:pointer}
.bk-go{min-height:52px;padding:0 24px;font:inherit;cursor:pointer}
select{font:inherit;min-height:48px;padding:8px 12px;width:100%}
.bk-cal{grid-column:1/-1;padding:12px}
.bk-cal-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.bk-month{margin:0;font-weight:700}
.bk-dow,.bk-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center}
.bk-dow span{font-size:12px;padding:4px 0}
.bk-day{min-height:44px;font:inherit;font-size:15px;font-variant-numeric:tabular-nums;cursor:pointer;border:0;background:transparent;color:inherit}
.bk-day[disabled]{opacity:.38;cursor:not-allowed}
.bk-hint{margin:8px 0 0;font-size:14px}
.bk-status:empty{display:none}
.bk-status{grid-column:1/-1;margin:0;font-size:15px}
.bk-out-link{grid-column:1/-1}
.bk-promise{grid-column:1/-1;margin:0}
.cmp-scroll{overflow-x:auto}
.cmp-table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}
.cmp-table th,.cmp-table td{text-align:left;padding:12px 8px}
.cmp-table td{text-align:right}
.faq details summary{cursor:pointer;min-height:44px;display:flex;align-items:center}
.ft a{display:inline-flex;align-items:center;min-height:44px}
.ft .soc{display:flex;flex-wrap:wrap;gap:16px}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}}
`;

// ---------- Booking + compare behaviour (inline, no dependencies) ----------
export const js = `(()=>{
const S=${JSON.stringify(Object.fromEntries(stays.map(s => [s.id, s.name])))};
const f=document.getElementById('bk');if(!f)return;
const q=s=>f.querySelector(s),cal=q('#bk-cal'),grid=q('.bk-grid'),mon=q('.bk-month'),st=q('#bk-status'),out=q('#bk-checkout');
const bIn=q('#bk-in'),bOut=q('#bk-out'),sel=q('#bk-stay'),gEl=q('#bk-g');
const today=new Date();today.setHours(0,0,0,0);
let a=null,b=null,g=2,mode='in',done=false,view=new Date(today.getFullYear(),today.getMonth(),1);
const fmt=d=>d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const nights=()=>a&&b?Math.round((b-a)/864e5):0;
// Dates and guests are passed along; the guest confirms them on Lodgify's secure checkout.
const href=()=>'https://checkout.lodgify.com/en/ogr/'+sel.value+'/reservation?currency=USD'+(a&&b?'&arrival='+iso(a)+'&departure='+iso(b):'')+'&adults='+g;
function stale(){if(done){done=false;out.hidden=true;st.textContent=a&&b?nights()+' nights selected. Tap Check availability.':'';}out.href=href();}
function ctx(){const c=document.getElementById('cmp-context');if(!c)return;
 c.textContent='Stay: '+S[sel.value]+' · Dates: '+(a&&b?fmt(a)+' to '+fmt(b)+' ('+nights()+' nights)':'not chosen yet')+' · Guests: '+g;
 const air=document.querySelector('#compare tr[data-ch="airbnb"] td');if(air)air.textContent=sel.value==='728474'?'Not listed for Parkgate':'Live quote unavailable';}
function paint(keep){bIn.querySelector('[data-v]').textContent=a?fmt(a):'Add date';bOut.querySelector('[data-v]').textContent=b?fmt(b):'Add date';
 bIn.classList.toggle('is-active',!cal.hidden&&mode==='in');bOut.classList.toggle('is-active',!cal.hidden&&mode==='out');
 mon.textContent=view.toLocaleDateString('en-US',{month:'long',year:'numeric'});
 const pad=view.getDay(),days=new Date(view.getFullYear(),view.getMonth()+1,0).getDate();let h='';
 for(let i=0;i<pad;i++)h+='<span></span>';
 for(let d=1;d<=days;d++){const t=new Date(view.getFullYear(),view.getMonth(),d);const past=t<today||(mode==='out'&&a&&t<=a);
  const on=(a&&+t===+a)||(b&&+t===+b),mid=a&&b&&t>a&&t<b;
  h+='<button type="button" class="bk-day'+(on?' is-on':'')+(mid?' is-mid':'')+'" data-t="'+(+t)+'"'+(past?' disabled':'')+' aria-pressed="'+(on?'true':'false')+'" aria-label="'+t.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})+'">'+d+'</button>';}
 grid.innerHTML=h;if(keep){const k=grid.querySelector('[data-t="'+keep+'"]');if(k)k.focus();}ctx();}
function open(v,m){if(m)mode=m;cal.hidden=!v;bIn.setAttribute('aria-expanded',v);bOut.setAttribute('aria-expanded',v);
 if(v){const d=mode==='out'&&b?b:a;if(d)view=new Date(d.getFullYear(),d.getMonth(),1);}paint();}
bIn.addEventListener('click',()=>{open(cal.hidden||mode!=='in','in');});
bOut.addEventListener('click',()=>{open(cal.hidden||mode!=='out',a?'out':'in');});
f.querySelectorAll('.bk-nav').forEach(n=>n.addEventListener('click',()=>{const m=new Date(view.getFullYear(),view.getMonth()+ +n.dataset.m,1);if(m>=new Date(today.getFullYear(),today.getMonth(),1)){view=m;paint();}}));
grid.addEventListener('click',e=>{const t=e.target.closest('.bk-day');if(!t||t.disabled)return;const d=new Date(+t.dataset.t);
 if(mode==='out'&&a){if(d<=a)return;b=d;}else{a=d;if(b&&b<=a)b=null;mode='out';}
 stale();paint(t.dataset.t);if(a&&b){st.textContent=nights()+' nights selected. Tap Check availability.';}});
f.querySelectorAll('.bk-pm').forEach(p=>p.addEventListener('click',()=>{g=Math.min(6,Math.max(1,g+ +p.dataset.d));gEl.textContent=g;stale();ctx();}));
sel.addEventListener('change',()=>{stale();ctx();});
f.addEventListener('submit',e=>{e.preventDefault();
 if(!a||!b){open(true,a?'out':'in');st.textContent='Choose a check-in day and a check-out day first.';out.hidden=true;return;}
 open(false);done=true;out.hidden=false;out.href=href();
 st.textContent=S[sel.value]+' · '+fmt(a)+' to '+fmt(b)+' · '+nights()+' nights · '+g+(g>1?' guests':' guest')+'. Confirm live availability, dates and the full price in secure Lodgify checkout.';ctx();});
document.querySelectorAll('[data-stay]').forEach(l=>l.addEventListener('click',()=>{sel.value=l.dataset.stay;sel.dispatchEvent(new Event('change'));}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!cal.hidden){open(false);(mode==='out'?bOut:bIn).focus();}});
out.href=href();paint();
})();`;

export function page({ title, description, fontsHref, css, body, refs, theme = '#ffffff' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="${theme}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="https://oilgaterealty.github.io/oilgate-vacation-rentals/assets/oakdale-unit-1.webp">
<link rel="icon" href="img/favicon-48.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fontsHref}">
<style>${baseCss}${css}</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${body}
<script>${js}</script>
<!-- Design references (live, free sources):
${refs.map(r => `  ${r}`).join('\n')}
  Image sources: property photos are Oilgate Realty's own Lodgify listing photos (data/properties.json, assets/). Akron photos are from Wikimedia Commons under the licenses credited in the footer. No Adobe Stock images are used.
-->
</body>
</html>
`;
}

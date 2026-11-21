// Builds samples/index.html: one phone-friendly page that links all five samples with their phone screenshots.
import { writeFileSync } from 'node:fs';
import { page, brand, esc } from './shared.mjs';

const samples = [];
for (const id of ['s1', 's2', 's3', 's4', 's5']) samples.push((await import(`./${id}.mjs`)).default);

const body = `
<header class="hd">${brand('primary', 'hd-logo', true)}<p class="hd-note">Design samples · November 20, 2026</p></header>
<main id="main">
<section class="intro" aria-labelledby="h1">
<p class="kicker">For LaVante · pick a direction</p>
<h1 id="h1">Five looks for Oilgate Vacation Rentals</h1>
<p>Each sample is a full page built with our real Akron stays, photos and terms. The booking search is first on every page, and every page keeps the Compare booking options box. These are previews only; the live site has not changed.</p>
<a class="primary" href="#samples">See the five samples</a>
</section>
<ol class="grid" id="samples">
${samples.map((s, i) => {
  const base = s.file.replace('.html', '');
  return `<li class="card">
<a class="shot" href="${s.file}"><img src="shots/${base}-mobile.webp" width="600" height="1298" alt="Phone screenshot of sample ${i + 1}, ${esc(s.name)}"${i < 2 ? '' : ' loading="lazy"'}></a>
<div class="card-copy"><p class="num">Sample ${i + 1}</p><h2>${esc(s.name)}</h2><p class="insp">Inspired by ${esc(s.inspiration)}</p>
<p class="links"><a href="${s.file}">Open sample ${i + 1}</a><a href="shots/${base}-desktop.webp">Desktop screenshot</a></p></div>
</li>`;
}).join('')}
</ol>
<section class="notes" aria-labelledby="notes-title">
<h2 id="notes-title">What every sample includes</h2>
<ul>
<li>Date search with a phone-friendly calendar at the top of the page.</li>
<li>Compare booking options box, with no made-up prices.</li>
<li>No cleaning fees, ever (unless house rules are broken).</li>
<li>Rental terms: minimum age 18 and a short liability clause.</li>
<li>Official Oilgate Vacation Rentals logos.</li>
</ul>
</section>
</main>
<footer class="ft-mini"><p>© 2026 Oilgate Realty · <a href="mailto:oilgaterealty@gmail.com">oilgaterealty@gmail.com</a> · Akron photos via Wikimedia Commons, credited on each sample.</p></footer>`;

const css = `
:root{--bg:#fbf8f1;--surface:#ffffff;--surface-2:#012342;--text:#012342;--text-muted:#46566a;--border:#d9d3c4;--accent:#fea802;--accent-ink:#8a5a00;--accent-contrast:#012342;--success:#2f6b3a;--warning:#8a5a00;--danger:#b3261e;--focus:#8a5a00;
--font-display:'Archivo',sans-serif;--font-body:'Source Serif 4',Georgia,serif;--r-sm:4px;--r-md:16px;--r-pill:999px;--s1:4px;--s2:8px;--s3:16px;--s4:24px;--s5:32px;--s6:48px;--s7:64px;--elev-1:0 12px 32px rgb(1 35 66/.16)}
body{background:var(--bg);color:var(--text);font:400 17px/1.6 var(--font-body)}
a{color:var(--text)}
h1,h2{font-family:var(--font-display);font-weight:900;line-height:1;margin:0}
.hd{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:var(--s2);padding:var(--s3)}
.hd-logo{width:180px}
.hd-note{margin:0;font-family:var(--font-display);font-size:14px;color:var(--text-muted)}
.intro{background:var(--accent);padding:var(--s6) var(--s3)}
.intro h1{font-size:48px;max-width:12em;margin-bottom:var(--s4)}
.intro p{max-width:38em}
.primary{display:inline-flex;align-items:center;min-height:52px;margin-top:var(--s4);padding:0 var(--s5);background:var(--surface-2);color:var(--bg);border-radius:var(--r-pill);font-family:var(--font-display);font-weight:800;text-decoration:none}
.kicker{font-family:var(--font-display);font-weight:800;font-size:13px;letter-spacing:.16em;text-transform:uppercase;margin:0 0 var(--s3)}
.grid{list-style:none;margin:0;padding:var(--s6) var(--s3);display:grid;gap:var(--s6)}
.card{display:grid;gap:var(--s4);grid-template-columns:5fr 6fr;align-items:start}
.shot{display:block;border-radius:var(--r-md);overflow:hidden;box-shadow:var(--elev-1);border:8px solid var(--surface-2);background:var(--surface-2)}
.shot img{width:100%}
.num{font-family:var(--font-display);font-weight:800;font-size:13px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent-ink);margin:0 0 var(--s2)}
.card h2{font-size:28px;margin-bottom:var(--s2)}
.insp{color:var(--text-muted);font-size:15px}
.links{display:grid;gap:0;margin:0}
.links a{min-height:44px;display:inline-flex;align-items:center;font-family:var(--font-display);font-weight:800}
.notes{background:var(--surface-2);color:var(--bg);padding:var(--s6) var(--s3)}
.notes h2{font-size:32px;margin-bottom:var(--s4)}
.notes li{margin-bottom:var(--s2)}
.ft-mini{padding:var(--s4) var(--s3);font-size:14px;color:var(--text-muted)}
.links a{border-radius:var(--r-sm)}
.ft-mini a{color:var(--text);display:inline-flex;align-items:center;min-height:44px}
@media (min-width:900px){
 .hd{padding:var(--s4) var(--s6)}
 .intro{padding:var(--s7) var(--s6)}
 .intro h1{font-size:80px}
 .grid{grid-template-columns:repeat(5,1fr);padding:var(--s7) var(--s6);gap:var(--s5)}
 .card{grid-template-columns:1fr}
 .notes{padding:var(--s7) var(--s6)}
 .ft-mini{padding:var(--s4) var(--s6)}
}`;

writeFileSync(new URL('../../samples/index.html', import.meta.url), page({
  title: 'Design samples | Oilgate Vacation Rentals, Akron',
  description: 'Five design samples for the Oilgate Vacation Rentals site, with phone screenshots to compare side by side.',
  fontsHref: 'https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&family=Source+Serif+4:wght@400&display=swap',
  theme: '#fea802', css, body,
  refs: [
    'https://oilgaterealty.github.io/oilgate-vacation-rentals/ — the live site these samples are previews for (unchanged).',
    'https://www.awwwards.com/sites/schlosshotel-kitzbuhel and https://www.awwwards.com/sites/club-charlestown — inspirations for samples 1 and 2.',
    'https://oilgatelinks.com/app — inspiration for samples 3 and 5.',
    'https://fonts.google.com/specimen/Source+Serif+4 — free body serif for this index; navy and gold taken from the official OVR logo.',
  ],
}));
console.log('built index.html');

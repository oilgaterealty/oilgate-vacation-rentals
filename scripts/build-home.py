"""Build the live homepage (index.html) from design 6, "Oilgate Signature".

Run from the repo root:  python3 scripts/build-home.py
Real content comes from previews/tools/content.py (fed by data/properties.json).
Kept from the old homepage so the site and its tests keep working:
the Lodgify widget (#availability, #stay-picker, .lodgify-widget iframe, property-ui.js),
the owner's comparison box (#compare, copied verbatim from the current index.html),
the rental terms (#rental-terms), Pepper (pepper.js, pepper.css, tokens.css) and the meta tags.
The old homepage is saved in backup/index-2026-11-21.html.
"""
import os, re, sys, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "previews", "tools"))
from content import *  # noqa

data = json.load(open(os.path.join(ROOT, "data", "properties.json")))
ot = data["ownerTerms"]
cur = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
m = re.search(r'<section class="og" id="compare".*?</section>', cur, re.S)
if not m:
    sys.exit("Comparison box (#compare) missing from index.html")
COMPARE = m.group(0)

css = BASE_CSS + """
:root{--navy:#012342;--gold:#FEA802;--stone:#f2eee7;--line:#e2dcd2;--ink:#17202b;--muted:#5f6772;--serif:'Cormorant Garamond',Georgia,serif;--sans:'Inter',system-ui,sans-serif;--display:'Bebas Neue',Impact,sans-serif}
body{font-family:var(--sans);color:var(--ink);background:#fff;font-size:16.5px;line-height:1.7}
a{color:var(--navy)}
:focus-visible{outline:3px solid var(--gold);outline-offset:2px}
.top{position:absolute;top:0;left:0;right:0;z-index:5}
.top nav{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;padding:16px 20px}
.plate{display:inline-block;background:rgba(255,255,255,.95);border-radius:12px;padding:8px 12px}.plate img{height:38px;width:auto}
.top ul{display:flex;gap:24px;list-style:none;margin:0;padding:0}.top ul a{color:#fff;text-decoration:none;font-size:14px}
.hero{position:relative;min-height:94vh;color:#fff;display:flex;flex-direction:column;padding-top:86px}
.hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(1,35,66,.78),rgba(1,35,66,.55) 45%,rgba(1,35,66,.9))}
.hero .c{position:relative;z-index:2;margin:auto;max-width:1000px;width:100%;padding:24px 20px 60px;text-align:center}
.hero .k{font:400 20px var(--display);letter-spacing:.24em;color:var(--gold);margin:0}
.hero h1{font:400 clamp(46px,7.4vw,96px)/1.02 var(--serif);margin:10px 0 14px}
.hero p.l{max-width:560px;margin:0 auto 26px;opacity:.92}
.glass{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.3);border-radius:18px;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);padding:14px;text-align:left}
.glass h2{font:400 20px var(--display);letter-spacing:.2em;color:#fff;margin:0 0 8px}
.pick{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center;margin-bottom:10px}
.pick label{font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.9}
.pick select{flex:1 1 260px;height:46px;border:0;border-radius:10px;background:#fff;color:var(--ink);padding:0 12px;font:inherit;font-size:15px}
.wpanel{background:#fff;border-radius:12px;color:var(--ink);padding:4px}
.lodgify-widget{margin:0}
.lodgify-widget iframe{display:block;width:100%;height:160px;min-height:140px;border:0}
.checkout-link{display:inline-block;margin:10px 0 0;background:var(--gold);color:var(--navy);text-decoration:none;font:700 14px var(--sans);letter-spacing:.08em;text-transform:uppercase;padding:13px 22px;border-radius:10px}
.fine{font-size:13.5px;opacity:.9;margin:8px 0 0}
.chip{display:inline-flex;gap:8px;align-items:center;margin-top:18px;font-size:15px}.chip b{color:var(--gold)}
.marquee{background:var(--gold);overflow:hidden;white-space:nowrap}
.marquee .run{display:inline-flex;gap:44px;padding:12px 0;animation:run 38s linear infinite}
.marquee span{font:400 34px/1 var(--display);letter-spacing:.06em;color:var(--navy)}
@keyframes run{to{transform:translateX(-50%)}}
.label{font:400 20px var(--display);letter-spacing:.2em;color:var(--navy);margin:0 0 8px}
h2{font:400 clamp(34px,4.4vw,56px)/1.08 var(--serif);margin:0;color:var(--navy)}
.rule{width:44px;height:2px;background:var(--gold);margin:18px 0}
.stays{max-width:1200px;margin:0 auto;padding:clamp(64px,8vw,112px) 20px;display:grid;grid-template-columns:300px 1fr;gap:40px}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.card{position:relative;color:#fff;text-decoration:none;display:block;overflow:hidden;border-radius:14px}
.card img{width:100%;aspect-ratio:3/4.1;object-fit:cover;transition:transform .6s}.card:hover img{transform:scale(1.04)}
.card::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(1,35,66,.92))}
.card .rib{position:absolute;z-index:1;top:18px;left:0;background:var(--gold);color:var(--navy);font:400 17px var(--display);letter-spacing:.14em;padding:6px 16px 6px 12px;clip-path:polygon(0 0,100% 0,90% 50%,100% 100%,0 100%)}
.card .t{position:absolute;z-index:1;left:18px;right:18px;bottom:16px}
.card h3{font:400 30px/1.05 var(--serif);margin:0}.card p{margin:4px 0 0;font-size:13.5px}
.ghost{display:inline-block;border:1px solid var(--navy);padding:11px 18px;text-decoration:none;font-size:13px;letter-spacing:.1em;text-transform:uppercase;border-radius:999px}
.stone{background:var(--stone)}
.day{max-width:1200px;margin:0 auto;padding:clamp(64px,8vw,112px) 20px;display:grid;grid-template-columns:1fr 1.2fr;gap:clamp(24px,5vw,72px);align-items:center}
.day img{border-radius:999px 999px 14px 14px;aspect-ratio:3/4;object-fit:cover;width:100%}
.day ol{list-style:none;margin:24px 0 0;padding:0;border-left:1px solid var(--line)}
.day li{display:grid;grid-template-columns:120px 1fr;gap:16px;padding:14px 0 14px 24px;position:relative}
.day li::before{content:"";position:absolute;left:-6px;top:24px;width:11px;height:11px;border-radius:50%;background:var(--gold)}
.day time{font:400 28px var(--serif);color:var(--navy)}.day strong{display:block}.day li p{margin:0;color:var(--muted);font-size:15px}
#compare{max-width:1200px;margin:0 auto;padding:clamp(64px,8vw,112px) 20px}
.og-comparison-intro{max-width:720px}.og-eyebrow{font:400 20px var(--display);letter-spacing:.2em;color:var(--navy);margin:0 0 8px}
.og-comparison-context{background:var(--stone);border-left:4px solid var(--gold);border-radius:0 12px 12px 0;padding:14px 18px;font-size:15px;margin:22px 0}
.og-table-scroll{overflow-x:auto}
.og-table{width:100%;border-collapse:collapse;border:1px solid var(--line);border-radius:14px;overflow:hidden}
.og-table caption{text-align:left;font:400 23px var(--serif);color:var(--navy);padding:0 0 8px}
.og-table th,.og-table td{text-align:left;padding:13px 16px;border-bottom:1px solid var(--line)}
.og-table thead th{background:var(--navy);color:#fff;font-size:13px;letter-spacing:.1em;text-transform:uppercase}
.og-table tbody th{font:500 20px var(--serif);color:var(--navy)}.og-table td{color:var(--muted)}
.og-fineprint{color:var(--muted);font-size:14px}
.info{max-width:1200px;margin:0 auto;padding:clamp(64px,8vw,112px) 20px;display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,5vw,72px)}
.info .lead{font-size:18px;margin:16px 0 0}
.rules{margin:16px 0 0}.rules div{display:grid;grid-template-columns:160px 1fr;gap:12px;padding:11px 0;border-bottom:1px solid var(--line)}.rules dt{font-weight:600;font-size:14px}.rules dd{margin:0;font-size:15px;color:#2d3540}
.promise{background:var(--navy);color:#fff;border-radius:14px;padding:18px 20px;margin-top:18px}.promise strong{font:400 28px var(--serif);color:var(--gold);display:block}
.note{color:var(--muted);font-size:14px}
.faqw{max-width:880px;margin:0 auto;padding:clamp(64px,8vw,112px) 20px}
.faq details{border-bottom:1px solid var(--line);padding:16px 2px}.faq summary{font:400 23px var(--serif);color:var(--navy);list-style:none;display:flex;justify-content:space-between;gap:12px;cursor:pointer}.faq summary::after{content:"+";color:var(--gold);font-size:26px;line-height:1}.faq details[open] summary::after{content:"–"}.faq p{margin:8px 0 0;color:#2d3540}
.float{position:fixed;left:16px;bottom:16px;z-index:20;background:var(--navy);color:#fff;text-decoration:none;padding:13px 20px;border-radius:999px;font-weight:700;font-size:14px;box-shadow:0 6px 20px rgba(1,35,66,.35)}
.float b{color:var(--gold)}
footer{position:relative;color:#fff;overflow:hidden;padding-bottom:70px}
footer>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
footer::after{content:"";position:absolute;inset:0;background:rgba(1,35,66,.9)}
footer .wrap{position:relative;z-index:1;max-width:1200px;margin:0 auto;padding:64px 20px 32px;display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:28px}
footer h2{font:400 20px var(--display);letter-spacing:.2em;color:var(--gold);margin:0 0 10px}footer a{color:#fff}
.social{display:flex;gap:10px}.social a{width:42px;height:42px;display:grid;place-items:center;border-radius:50%;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.3)}.social svg{width:20px;height:20px;fill:#fff}
.credits{grid-column:1/-1;font-size:13px;opacity:.8;margin:10px 0 0}
@media (max-width:900px){.top ul{display:none}.stays,.day,.info,footer .wrap{grid-template-columns:1fr}.cards{grid-template-columns:1fr}.day li,.rules div{grid-template-columns:1fr;gap:2px}.day img{max-height:420px}.hero{padding-top:74px}.hero .c{padding-top:8px}}
@media (prefers-reduced-motion:reduce){.marquee .run{animation:none}.card img{transition:none}html{scroll-behavior:auto}}
"""

def fix(h):
    return h.replace('src="../', 'src="').replace('href="../', 'href="').replace('src="img/ovr-', 'src="previews/img/ovr-')

l3 = AKRON["lock3"]
words = ["No cleaning fees, ever", "Whole homes", "Akron, Ohio", "Guests 18+", "Book direct"]
run = "".join(f"<span>{w} ✦</span>" for w in words * 3)
cards = "".join(f"""<a class="card" href="{s['page']}">{stay_img(s, 2 if s['id'] != '728474' else 1)}<span class="rib">{E(s['place'].upper())}</span><div class="t"><h3>{E(s['name'])}</h3><p>{s['facts']}</p></div></a>""" for s in STAYS)
opts = "".join(f'<option value="{s["id"]}">{E(s["name"])} · {s["facts"].split(" · ")[0]}</option>' for s in STAYS)
first = STAYS[0]["id"]
akron_credits = " · ".join(f'<a href="{AKRON[k][5]}">{E(AKRON[k][4])}</a>' for k in ("lock3", "skyline"))

title = "Akron Vacation Rentals | Oilgate Realty"
desc = "Explore three whole-unit Akron stays, with no cleaning fees unless house rules are broken. Check dates and book with Lodgify."
html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<meta property="og:title" content="{E(title)}">
<meta property="og:image" content="https://oilgaterealty.github.io/oilgate-vacation-rentals/assets/oakdale-unit-1.webp">
<link rel="icon" href="assets/favicon-48.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:wght@400;500&family=Inter:wght@400;600;700&display=swap">
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="pepper.css">
<style>{css}</style>
<script type="module" src="pepper.js"></script>
<script type="module" src="property-ui.js"></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top"><nav aria-label="Main"><a class="plate" href="index.html">{logo('primary')}</a><ul><li><a href="#stays">Stays</a></li><li><a href="#day">Your stay</a></li><li><a href="#compare">Compare</a></li><li><a href="#faq">FAQ</a></li></ul></nav></header>
<main id="main"><section class="hero date-search" id="availability" aria-labelledby="hero-title"><img src="{l3[0]}" width="{l3[1]}" height="{l3[2]}" alt="{E(l3[3])}" fetchpriority="high">
<div class="c"><p class="k">Akron, Ohio</p><h1 id="hero-title">A whole home,<br>right in Akron</h1><p class="l">Three homes in Oakdale and Parkgate, booked whole, with your own kitchen and living room.</p>
<div class="glass"><h2 id="date-search-title">Find your dates</h2><div class="pick"><label for="stay-picker">Choose your stay</label><select id="stay-picker">{opts}</select></div>
<div class="wpanel"><div class="lodgify-widget"><iframe title="Lodgify booking search" src="lodgify-widget.html?property={first}&amp;currency=USD"></iframe></div></div>
<a class="checkout-link" href="https://checkout.lodgify.com/en/ogr/{first}/reservation?currency=USD" target="_blank" rel="noopener">Open secure Lodgify checkout</a>
<p class="fine">Choose dates and guests for current availability. Reservations and payments are completed securely with Lodgify.</p></div>
<p class="chip"><b>★</b> {E(ot['cleaning'])}. {E(ot['cleaningException'])}</p></div></section>
<div class="marquee" aria-hidden="true"><div class="run">{run}</div></div>
<section class="stays" id="stays" aria-labelledby="st"><div><p class="label">The stays</p><h2 id="st">Pick your home base</h2><div class="rule"></div><p class="note">Two three-bedroom Oakdale units and the renovated two-bedroom Parkgate home. Each one sleeps up to 6.</p><a class="ghost" href="#availability">Check dates</a></div><div class="cards">{cards}</div></section>
<div class="stone"><section class="day" id="day" aria-labelledby="dy">{stay_img(STAYS[0], 2)}<div><p class="label">Your stay</p><h2 id="dy">An easy Akron day</h2><ol>
<li><time>3:00 PM</time><div><strong>Check in</strong><p>Your whole home is ready from 3.</p></div></li>
<li><time>Evening</time><div><strong>Head out or stay in</strong><p>{NEARBY}</p></div></li>
<li><time>10:00 PM</time><div><strong>Quiet hours</strong><p>10 PM to 10 AM, out of respect for the neighbors.</p></div></li>
<li><time>11:00 AM</time><div><strong>Check out</strong><p>{CLEANING}, unless house rules are broken.</p></div></li></ol></div></section></div>
{COMPARE}
<div class="stone"><section class="info" id="rental-terms" aria-labelledby="rt"><div><p class="label">Before you book</p><h2 id="rt">Rules and terms</h2><p class="lead">The minimum booking age is {ot['minimumAge']}.</p><p>{E(ot['liability'])}</p><div class="promise"><strong>{E(ot['cleaning'])}</strong>{E(ot['cleaningException'])}</div></div>
<div>{rules_list()}</div></section></div>
<section class="faqw" id="faq" aria-labelledby="fq"><p class="label">Good to know</p><h2 id="fq">Questions, answered</h2>{faq_list()}</section>
</main>
<a class="float" href="#availability"><b>★</b> Check dates</a>
<footer id="contact">{akron_img('skyline')}<div class="wrap"><div><span class="plate">{logo('secondary')}</span><p>Whole-home stays in Akron, Ohio.</p>{social('social', icons=True)}</div>
<div><h2>Stays</h2>{''.join(f'<p><a href="{s["page"]}">{E(s["name"])}</a></p>' for s in STAYS)}</div>
<div><h2>Contact</h2><p><a href="mailto:{EMAIL}">{EMAIL}</a></p><p><a href="{PRIVACY}">Privacy policy</a></p><p>© 2026 Oilgate Realty</p></div>
<p class="credits">Akron photos via Wikimedia Commons: {akron_credits}. Home photos: Oilgate Realty listings.</p></div></footer>
<aside data-pepper data-property="" aria-label="Pepper guest assistant"><a href="index.html#stays">Contact host through Lodgify</a></aside>
</body></html>
"""
open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8").write(fix(html))
print("Built index.html from design 6 (Oilgate Signature).")

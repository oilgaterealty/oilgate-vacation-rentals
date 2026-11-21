"""Build the six OVR homepage previews into previews/.

Run from the repo root:  python3 previews/tools/build.py
Each design is one self-contained HTML file with its own CSS.
Shared real content lives in content.py; shared booking logic in assets/book.js.
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from content import *  # noqa

OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NAVY, GOLD = "#012342", "#FEA802"


def write(name, html):
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        f.write(html)
    print("wrote", name, len(html))


# ---------------------------------------------------------------------------
# 1. Schlosshotel Kitzbühel -> "Castle Calm"
# Full-bleed photo hero, centered serif wordmark, quiet stone sections,
# room slider with a 1/3 counter, floating Book + Enquire buttons,
# scalloped offer badge, a "day at the house" timeline.
# ---------------------------------------------------------------------------
def d1():
    css = BASE_CSS + """
:root{--ink:#1d1a17;--navy:#012342;--gold:#FEA802;--stone:#f1ece4;--stone2:#e6ded2;--wine:#3a1d2a;--serif:'Cormorant Garamond',Georgia,serif;--sans:'Jost',system-ui,sans-serif}
body{font-family:var(--sans);color:var(--ink);background:#fff;font-size:17px;line-height:1.65}
a{color:var(--navy)}
.topbook{background:var(--navy);color:#fff;padding:14px 20px}
.topbook .wrap{max-width:1240px;margin:0 auto;display:flex;gap:18px;align-items:center;flex-wrap:wrap}
.topbook h2{font:500 13px/1 var(--sans);letter-spacing:.22em;text-transform:uppercase;margin:0;color:#fff;flex:0 0 auto}
.book{flex:1 1 640px}.book fieldset{display:grid;grid-template-columns:1.6fr 1fr 1fr .8fr auto;gap:8px;align-items:end}
.book label{display:block;font-size:11px;letter-spacing:.16em;text-transform:uppercase;opacity:.85;margin-bottom:4px}
.book select,.book input{width:100%;height:44px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);color:#fff;padding:0 10px;font:inherit;font-size:15px;border-radius:0;color-scheme:dark}
.book select option{color:#111}
.book button{height:44px;padding:0 22px;border:0;background:var(--gold);color:var(--navy);font:600 13px var(--sans);letter-spacing:.14em;text-transform:uppercase;cursor:pointer}
.book-msg{margin:4px 0 0;font-size:13px;min-height:0}
.hero{position:relative;min-height:88vh;display:grid;place-items:center;color:#fff;text-align:center;overflow:hidden}
.hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(1,35,66,.55),rgba(1,35,66,.15) 40%,rgba(1,35,66,.6))}
.hero .in{position:relative;z-index:1;padding:40px 20px}
.hero .plate{display:inline-block;background:rgba(255,255,255,.94);padding:14px 22px;margin-bottom:28px}
.hero .plate img{height:56px;width:auto}
.hero h1{font:400 clamp(44px,7vw,92px)/1.02 var(--serif);margin:0}
.hero p.k{font:500 13px var(--sans);letter-spacing:.34em;text-transform:uppercase;margin:22px 0 0}
.badge{text-decoration:none;position:absolute;z-index:2;left:clamp(16px,4vw,56px);bottom:clamp(16px,4vw,56px);width:168px;height:168px;display:grid;place-items:center;text-align:center;color:#fff;background:var(--navy);
border-radius:50%;box-shadow:0 0 0 6px var(--navy),0 0 0 7px var(--gold)}
.badge strong{font:400 22px/1.05 var(--serif);display:block;padding:0 18px}.badge small{display:block;font-size:11px;letter-spacing:.1em;margin-top:6px;opacity:.9}
.float{position:fixed;right:16px;bottom:16px;z-index:20;display:flex;gap:6px}
.float a{padding:13px 20px;font:600 12px var(--sans);letter-spacing:.16em;text-transform:uppercase;text-decoration:none}
.float .b1{background:#fff;color:var(--navy);box-shadow:0 2px 12px rgba(0,0,0,.18)}.float .b2{background:var(--navy);color:#fff}
.intro{display:grid;grid-template-columns:1fr 1.1fr 1fr;gap:clamp(20px,4vw,64px);max-width:1240px;margin:0 auto;padding:clamp(64px,9vw,128px) 20px;align-items:center}
.intro img{width:100%;aspect-ratio:3/4;object-fit:cover}
.intro h2{font:400 clamp(34px,4vw,54px)/1.08 var(--serif);margin:0 0 6px}
.intro .k{font-size:13px;letter-spacing:.28em;text-transform:uppercase;color:#6b5f52;margin:0 0 18px}
.intro .tagline{font:italic 400 24px var(--serif);color:var(--navy)}
.btn{display:inline-block;margin-top:14px;padding:14px 26px;border:1px solid var(--navy);color:var(--navy);text-decoration:none;font:600 12px var(--sans);letter-spacing:.18em;text-transform:uppercase}
.btn:hover{background:var(--navy);color:#fff}
.rooms{background:var(--stone);padding:clamp(64px,8vw,112px) 0}
.rooms header{max-width:1240px;margin:0 auto 32px;padding:0 20px;display:flex;justify-content:space-between;align-items:end;gap:20px;flex-wrap:wrap}
.rooms h2{font:400 clamp(32px,4vw,52px)/1.1 var(--serif);margin:0;max-width:16ch}
.track{display:grid;grid-auto-flow:column;grid-auto-columns:min(78vw,520px);gap:24px;overflow-x:auto;scroll-snap-type:x mandatory;padding:0 max(20px,calc((100vw - 1240px)/2)) 12px;scrollbar-width:thin}
.room{scroll-snap-align:start;background:#fff}
.room img{width:100%;aspect-ratio:4/3;object-fit:cover}
.room .body{padding:22px 24px 26px}
.room h3{font:400 30px/1.1 var(--serif);margin:0 0 6px}.room h3 a{text-decoration:none}
.room .facts{font-size:14px;color:#6b5f52;margin:0 0 14px}
.room .acts{display:flex;gap:8px;flex-wrap:wrap}
.room .acts a{padding:11px 16px;font:600 11px var(--sans);letter-spacing:.16em;text-transform:uppercase;text-decoration:none}
.room .acts .p{background:var(--navy);color:#fff}.room .acts .s{border:1px solid var(--navy);color:var(--navy)}
.count{max-width:1240px;margin:18px auto 0;padding:0 20px;font:400 22px var(--serif);color:#6b5f52}
.quote{display:grid;grid-template-columns:1fr 1fr;min-height:520px}
.quote img{width:100%;height:100%;object-fit:cover}
.quote .q{background:var(--navy);color:#fff;padding:clamp(40px,6vw,96px);display:flex;flex-direction:column;justify-content:center}
.quote blockquote{font:italic 400 clamp(24px,2.6vw,34px)/1.35 var(--serif);margin:0}
.quote cite{font-style:normal;margin-top:24px;font-size:13px;letter-spacing:.24em;text-transform:uppercase;color:var(--gold)}
.day{max-width:1100px;margin:0 auto;padding:clamp(64px,9vw,128px) 20px}
.day h2{font:400 clamp(32px,4vw,52px)/1.1 var(--serif);text-align:center;margin:0 0 48px}
.day ol{list-style:none;margin:0;padding:0;border-left:1px solid var(--stone2)}
.day li{display:grid;grid-template-columns:140px 1fr;gap:24px;padding:22px 0 22px 28px;position:relative}
.day li::before{content:"";position:absolute;left:-6px;top:32px;width:11px;height:11px;border-radius:50%;background:var(--gold)}
.day time{font:400 30px var(--serif);color:var(--navy)}
.day h3{font:500 15px var(--sans);letter-spacing:.14em;text-transform:uppercase;margin:6px 0 4px}.day p{margin:0;color:#4a433c}
.panel{background:var(--stone);padding:clamp(56px,8vw,112px) 20px}
.panel .wrap{max-width:1240px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,5vw,72px)}
.panel h2{font:400 clamp(30px,3.6vw,46px)/1.1 var(--serif);margin:0 0 14px}
.cmp{list-style:none;margin:20px 0 0;padding:0;border-top:1px solid var(--stone2)}.cmp li{display:flex;justify-content:space-between;gap:16px;padding:14px 0;border-bottom:1px solid var(--stone2)}.cmp span{color:#6b5f52;text-align:right;font-size:15px}
.note{font-size:14px;color:#6b5f52}
.rules{margin:0;display:grid;gap:0}.rules div{padding:14px 0;border-bottom:1px solid var(--stone2)}.rules dt{font:400 22px var(--serif);color:var(--navy)}.rules dd{margin:2px 0 0;font-size:15px}
.promise{background:#fff;border-left:3px solid var(--gold);padding:18px 20px;margin-top:22px}.promise strong{font:400 26px var(--serif);display:block;color:var(--navy)}
.faqs{max-width:900px;margin:0 auto;padding:clamp(64px,9vw,128px) 20px}
.faqs h2{font:400 clamp(32px,4vw,52px)/1.1 var(--serif);text-align:center;margin:0 0 32px}
.faq details{border-bottom:1px solid var(--stone2);padding:18px 4px}.faq summary{font:400 24px var(--serif);list-style:none;display:flex;justify-content:space-between;gap:12px}.faq summary::after{content:"+";color:var(--gold);font-size:28px;line-height:1}.faq details[open] summary::after{content:"–"}.faq p{margin:10px 0 0;color:#4a433c}
footer{background:#14110f;color:#d9d2c8;padding:64px 20px 96px}
footer .wrap{max-width:1240px;margin:0 auto;display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:32px}
footer .plate{background:#fff;display:inline-block;padding:10px 14px}footer .plate img{height:42px;width:auto}
footer a{color:#fff}footer h2{font:500 12px var(--sans);letter-spacing:.24em;text-transform:uppercase;color:var(--gold);margin:0 0 12px}
.social{display:flex;gap:16px;flex-wrap:wrap}.credits{grid-column:1/-1;font-size:13px;opacity:.75;border-top:1px solid #2c2622;padding-top:20px;margin:0}
@media (max-width:900px){.book fieldset{grid-template-columns:1fr 1fr}.book .f-stay{grid-column:1/-1}.book button{grid-column:1/-1}
.intro{grid-template-columns:1fr}.intro img:last-child{display:none}.quote{grid-template-columns:1fr}.quote img{aspect-ratio:4/3}.panel .wrap,footer .wrap{grid-template-columns:1fr}
.day li{grid-template-columns:1fr;gap:4px}.badge{width:128px;height:128px}.badge strong{font-size:17px}.hero{min-height:78vh}}
"""
    rooms = "".join(f"""<article class="room">{stay_img(s)}<div class="body"><h3><a href="{s['page']}">{E(s['name'])}</a></h3><p class="facts">{s['facts']}</p><p>{E(s['blurb'])}</p><div class="acts"><a class="p" href="#book">Book</a><a class="s" href="{s['page']}">Details</a></div></div></article>""" for s in STAYS)
    html = head("Oilgate Vacation Rentals · Akron, Ohio", "Three whole-home stays in Akron, Ohio. " + CLEANING_FULL + ".",
                "family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@400;500;600", css) + f"""<body>
<a class="skip" href="#main">Skip to content</a>
<section class="topbook" id="book" aria-labelledby="bk"><div class="wrap"><h2 id="bk">Find your dates</h2>{book_form('d1')}</div></section>
<header class="hero">{stay_img(STAYS[0], loading='eager')}
<div class="in"><div class="plate">{logo('primary')}</div><h1>Oilgate Vacation Rentals</h1><p class="k">Three whole homes · Akron, Ohio</p></div>
<a class="badge" href="#terms"><span><strong>{CLEANING}</strong><small>Unless house rules are broken</small></span></a>
</header>
<nav class="float" aria-label="Quick actions"><a class="b1" href="#book">Book</a><a class="b2" href="mailto:{EMAIL}">Enquire</a></nav>
<main id="main">
<section class="intro" aria-labelledby="welcome">{stay_img(STAYS[0],2)}
<div><p class="k">Welcome</p><h2 id="welcome">A whole home, quietly yours.</h2>
<p>Book an entire Oakdale unit or the whole Parkgate home. Your own kitchen and living room, no front desk, no rush.</p>
<p class="tagline">{CLEANING}.</p><p>{CLEANING_SUB} {NEARBY}</p><a class="btn" href="#stays">See the stays</a></div>
{stay_img(STAYS[2],2)}</section>
<section class="rooms" id="stays" aria-labelledby="st"><header><h2 id="st">Three homes. Pick the one that fits.</h2><a class="btn" href="#book">Check dates</a></header>
<div class="track" tabindex="0" role="region" aria-label="The three stays, scroll sideways">{rooms}</div><p class="count" aria-hidden="true">1 / 3</p></section>
<section class="quote" aria-label="Our promise">{stay_img(STAYS[1],2)}<div class="q"><blockquote>“Every stay is the whole place, with no cleaning fees, ever. Unless house rules are broken.”</blockquote><cite>Oilgate Realty</cite></div></section>
<section class="day" aria-labelledby="dy"><h2 id="dy">A day at the house</h2><ol>
<li><time>3:00 PM</time><div><h3>Arrive</h3><p>Check-in opens. Smart lock entry at Parkgate.</p></div></li>
<li><time>6:00 PM</time><div><h3>Settle in</h3><p>Cook in your own full kitchen or head out to Swensons and Highland Square.</p></div></li>
<li><time>10:00 PM</time><div><h3>Quiet hours</h3><p>Quiet hours run 10 PM to 10 AM, out of respect for the neighbors.</p></div></li>
<li><time>11:00 AM</time><div><h3>Check out</h3><p>Check-out by 11. No cleaning fees, unless house rules are broken.</p></div></li>
</ol></section>
<section class="panel" id="terms" aria-label="Compare and terms"><div class="wrap">
<div><h2 id="compare">Compare booking options</h2><p>{COMPARE_INTRO}</p>{compare_rows()}<p class="note">{COMPARE_NOTE}</p></div>
<div><h2>Rules and terms</h2>{rules_list()}<div class="promise"><strong>{CLEANING}</strong>{CLEANING_SUB}</div></div>
</div></section>
<section class="faqs" aria-labelledby="fq"><h2 id="fq">Good to know</h2>{faq_list()}</section>
</main>
<footer><div class="wrap"><div><div class="plate">{logo('secondary')}</div><p>Three whole-home stays in Akron, Ohio.</p></div>
<div><h2>Contact</h2><p><a href="mailto:{EMAIL}">{EMAIL}</a></p>{social()}</div>
<div><h2>Stays</h2>{''.join(f'<p><a href="{s["page"]}">{E(s["name"])}</a></p>' for s in STAYS)}<p><a href="{PRIVACY}">Privacy policy</a></p></div>
{credits([])}</div></footer>
{FOOT_SCRIPT}</body></html>"""
    write("01-castle-calm.html", html)


# ---------------------------------------------------------------------------
# 2. Club Charlestown -> "Rubber City Club"
# Utility bar, white nav with a solid CTA, rounded inset photo hero with huge
# condensed caps, scrolling marquee strip, arch-masked photos, oval badge.
# ---------------------------------------------------------------------------
def d2():
    css = BASE_CSS + """
:root{--navy:#012342;--gold:#FEA802;--cream:#fff6e5;--ink:#0c1b2b;--display:'Bebas Neue',Impact,sans-serif;--sans:'Montserrat',system-ui,sans-serif}
body{font-family:var(--sans);color:var(--ink);background:#fff;font-size:16px;line-height:1.65}
a{color:var(--navy)}
.util{background:var(--navy);color:#fff;font-size:14px}
.util .wrap{max-width:1320px;margin:0 auto;display:flex;justify-content:space-between;gap:16px;padding:10px 20px;flex-wrap:wrap}
.util a{color:#fff;text-decoration:none}.util span{color:var(--gold);font-weight:600}
.nav{position:sticky;top:0;z-index:10;background:#fff;border-bottom:1px solid #e7e2d8}
.nav .wrap{max-width:1320px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:12px 20px}
.nav img{height:44px;width:auto}.nav ul{display:flex;gap:28px;list-style:none;margin:0;padding:0}.nav ul a{text-decoration:none;color:var(--ink)}
.cta{display:inline-block;background:var(--gold);color:var(--navy);font-weight:700;padding:12px 22px;text-decoration:none;border-radius:4px}
.cta.ghost{background:transparent;border:2px solid #fff;color:#fff}
.bookbox{max-width:1320px;margin:16px auto 0;padding:0 20px}
.book{background:var(--cream);border:2px solid var(--navy);border-radius:14px;padding:16px}
.book fieldset{display:grid;grid-template-columns:1.6fr 1fr 1fr .8fr auto;gap:10px;align-items:end}
.book label{display:block;font:400 20px var(--display);letter-spacing:.04em;color:var(--navy)}
.book select,.book input{width:100%;height:48px;border:2px solid var(--navy);border-radius:8px;padding:0 10px;font:inherit;background:#fff;color:var(--ink)}
.book button{height:48px;padding:0 24px;border:0;border-radius:8px;background:var(--navy);color:#fff;font:400 24px var(--display);letter-spacing:.06em;cursor:pointer}
.book-msg{margin:4px 0 0;font-size:14px}
.hero{max-width:1320px;margin:16px auto 0;padding:0 20px}
.hero .frame{position:relative;border-radius:14px;overflow:hidden;min-height:640px;display:flex;align-items:flex-end}
.hero .frame>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero .frame::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(1,35,66,.82),rgba(1,35,66,.25) 65%,transparent)}
.hero .copy{position:relative;z-index:1;color:#fff;padding:clamp(28px,6vw,80px);max-width:760px}
.hero .k{margin:0 0 6px;font-size:17px}
.hero h1{font:400 clamp(60px,9vw,128px)/.9 var(--display);margin:0 0 18px;letter-spacing:.01em}
.hero .acts{display:flex;gap:14px;flex-wrap:wrap;margin-top:22px}
.oval{position:absolute;z-index:2;right:clamp(16px,3vw,40px);bottom:clamp(16px,3vw,40px);width:300px;height:170px;border-radius:50%;background:var(--cream);border:3px solid var(--navy);box-shadow:inset 0 0 0 6px var(--cream),inset 0 0 0 8px var(--navy);display:grid;place-items:center;text-align:center;color:var(--navy);text-decoration:none}
.oval b{display:block;font:400 18px var(--display);letter-spacing:.1em;color:var(--gold)}.oval strong{display:block;font:400 38px/.95 var(--display)}.oval small{display:block;font-size:12px;margin-top:4px}
.marquee{margin-top:28px;background:var(--cream);border-block:2px solid var(--navy);overflow:hidden;white-space:nowrap}
.marquee .run{display:inline-flex;gap:56px;padding:14px 0;animation:run 40s linear infinite}
.marquee span{font:400 clamp(40px,5vw,72px)/1 var(--display);color:var(--navy)}.marquee span:nth-child(odd){color:var(--gold);-webkit-text-stroke:1px var(--navy)}
@keyframes run{to{transform:translateX(-50%)}}
.split{max-width:1320px;margin:0 auto;padding:clamp(64px,9vw,120px) 20px;display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,6vw,96px);align-items:center}
.split .k{color:#5d6b78;margin:0}
.split h2,.sec h2{font:400 clamp(44px,6vw,84px)/.95 var(--display);color:var(--navy);margin:6px 0 16px}
.arch{position:relative}.arch img{border-radius:999px 999px 0 0;aspect-ratio:3/4;object-fit:cover;width:78%;margin-left:auto}
.arch img.small{position:absolute;left:0;bottom:-30px;width:46%;border-radius:999px 999px 0 0;border:8px solid #fff}
.sec{max-width:1320px;margin:0 auto;padding:clamp(48px,7vw,96px) 20px}
.sec .head{display:flex;justify-content:space-between;align-items:end;gap:20px;flex-wrap:wrap}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:28px}
.card{border-radius:14px;overflow:hidden;background:var(--cream);display:flex;flex-direction:column}
.card img{aspect-ratio:4/3;object-fit:cover;width:100%}
.card .body{padding:20px 22px 24px;display:flex;flex-direction:column;gap:6px;flex:1}
.card h3{font:400 40px/1 var(--display);margin:0;color:var(--navy)}.card .facts{font-weight:600;margin:0}
.card .tags{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px;padding:0;list-style:none}.card .tags li{background:#fff;border:1px solid var(--navy);border-radius:999px;padding:3px 10px;font-size:13px}
.card .cta{margin-top:auto;align-self:flex-start}
.band{background:var(--navy);color:#fff}
.band .sec h2{color:#fff}.band a{color:var(--gold)}
.two{display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,5vw,72px)}
.cmp{list-style:none;margin:0;padding:0;display:grid;gap:10px}.cmp li{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.25);border-radius:10px;padding:14px 16px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}.cmp strong{font:400 26px/1 var(--display);letter-spacing:.03em}
.rules{margin:0;display:grid;grid-template-columns:1fr 1fr;gap:14px}.rules div{background:var(--cream);border-radius:10px;padding:14px 16px}.rules dt{font:400 24px/1 var(--display);color:var(--navy)}.rules dd{margin:6px 0 0;font-size:15px}
.faq details{border:2px solid var(--navy);border-radius:10px;padding:14px 18px;margin-bottom:10px}.faq summary{font:400 26px var(--display);color:var(--navy)}.faq p{margin:8px 0 0}
footer{background:var(--ink);color:#cfd7df;padding:56px 20px 32px}
footer .wrap{max-width:1320px;margin:0 auto;display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:32px}
footer .plate{background:#fff;border-radius:10px;padding:10px 14px;display:inline-block}footer .plate img{height:46px;width:auto}
footer h2{font:400 26px var(--display);color:var(--gold);margin:0 0 10px;letter-spacing:.04em}footer a{color:#fff}
.social{display:flex;gap:16px}.credits{grid-column:1/-1;font-size:13px;opacity:.8;margin:12px 0 0}
@media (max-width:900px){.nav ul{display:none}.book fieldset{grid-template-columns:1fr 1fr}.book .f-stay,.book button{grid-column:1/-1}
.hero .frame{min-height:560px}.oval{width:200px;height:116px}.oval strong{font-size:26px}.split,.two,footer .wrap{grid-template-columns:1fr}.cards{grid-template-columns:1fr}.rules{grid-template-columns:1fr}.arch img{width:100%}.arch img.small{display:none}}
"""
    words = ["No cleaning fees", "Whole homes", "Akron, Ohio", "Book direct", "Guests 18+", "Oakdale", "Parkgate"]
    run = "".join(f"<span>{w}</span>" for w in words * 2)
    cards = "".join(f"""<article class="card">{stay_img(s)}<div class="body"><h3>{E(s['name'])}</h3><p class="facts">{s['facts']}</p><p>{E(s['blurb'])}</p><ul class="tags">{''.join(f'<li>{E(t)}</li>' for t in s['tags'])}</ul><a class="cta" href="{s['page']}">Explore {E(s['short'])}</a></div></article>""" for s in STAYS)
    html = head("Oilgate Vacation Rentals · Akron, Ohio", "Book a whole home in Akron, Ohio. " + CLEANING_FULL + ".",
                "family=Bebas+Neue&family=Montserrat:wght@400;600;700", css) + f"""<body>
<a class="skip" href="#main">Skip to content</a>
<div class="util"><div class="wrap"><span>{CLEANING} · {CLEANING_SUB}</span><a href="mailto:{EMAIL}">{EMAIL}</a></div></div>
<header class="nav"><div class="wrap"><a href="#main">{logo('primary')}</a><nav aria-label="Main"><ul><li><a href="#stays">The stays</a></li><li><a href="#compare">Compare</a></li><li><a href="#terms">House rules</a></li><li><a href="#faq">FAQ</a></li></ul></nav><a class="cta" href="#book">Book a stay</a></div></header>
<main id="main">
<section class="bookbox" id="book" aria-label="Find your dates">{book_form('d2', 'Search')}</section>
<section class="hero"><div class="frame">{stay_img(STAYS[0], loading='eager')}
<div class="copy"><p class="k">Welcome to Oilgate Vacation Rentals</p><h1>More than a stay,<br>it's your Akron</h1><p>Three whole homes in Akron's Oakdale and Parkgate neighborhoods. Your own kitchen, your own living room, your own space.</p>
<div class="acts"><a class="cta" href="#stays">Explore the stays</a><a class="cta ghost" href="#book">Check dates</a></div></div>
<a class="oval" href="#terms"><span><b>★ ★ ★</b><strong>No cleaning<br>fees, ever</strong><small>Unless house rules are broken</small></span></a></div></section>
<div class="marquee" aria-hidden="true"><div class="run">{run}</div></div>
<section class="split" aria-labelledby="loc"><div><p class="k">Where locals stay</p><h2 id="loc">The whole place, all to yourself</h2><p>{NEARBY} Fast Wi-Fi and cable TV at every home, plus parking.</p><a class="cta" href="#stays">See all three</a></div>
<div class="arch">{stay_img(STAYS[2],2)}{stay_img(STAYS[1],2,'small')}</div></section>
<section class="sec" id="stays" aria-labelledby="st"><div class="head"><div><p class="k">The stays</p><h2 id="st">Pick your home base</h2></div><a class="cta" href="#book">Check dates</a></div><div class="cards">{cards}</div></section>
<div class="band"><section class="sec two" id="compare" aria-label="Compare booking options"><div><h2>Compare booking options</h2><p>{COMPARE_INTRO}</p><p>{COMPARE_NOTE}</p></div>{compare_rows()}</section></div>
<section class="sec" id="terms" aria-labelledby="tr"><h2 id="tr">House rules and terms</h2>{rules_list()}</section>
<section class="sec" id="faq" aria-labelledby="fq"><h2 id="fq">Questions, answered</h2>{faq_list()}</section>
</main>
<footer><div class="wrap"><div><div class="plate">{logo('alternate')}</div><p>Whole-home stays in Akron, Ohio. {CLEANING}, unless house rules are broken.</p></div>
<div><h2>Get in touch</h2><p><a href="mailto:{EMAIL}">{EMAIL}</a></p>{social()}</div>
<div><h2>Quick links</h2>{''.join(f'<p><a href="{s["page"]}">{E(s["name"])}</a></p>' for s in STAYS)}<p><a href="{PRIVACY}">Privacy policy</a></p></div>
{credits([])}</div></footer>
{FOOT_SCRIPT}</body></html>"""
    write("02-rubber-city-club.html", html)


# ---------------------------------------------------------------------------
# 3. Key -> "Key Stay"
# Navy promo strip, transparent nav over a full-bleed photo, centered serif
# headline with spaced caps subline, inline booking bar with one strong button,
# "Homes that inspire" intro + portrait cards with a gold ribbon,
# alternating photo/text features, sticky header search on scroll.
# ---------------------------------------------------------------------------
def d3():
    css = BASE_CSS + """
:root{--navy:#012342;--navy2:#0a1630;--gold:#FEA802;--ink:#1b1f24;--muted:#5c6470;--line:#e4e6ea;--serif:'EB Garamond',Georgia,serif;--sans:'Montserrat',system-ui,sans-serif}
body{font-family:var(--sans);color:var(--ink);background:#fff;font-size:16px;line-height:1.7}
a{color:var(--navy)}
.promo{background:var(--navy2);color:#fff;text-align:center;padding:9px 16px;font-size:14px}.promo strong{color:var(--gold)}
.hero{position:relative;min-height:92vh;display:flex;flex-direction:column;color:#fff}
.hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero::after{content:"";position:absolute;inset:0;background:rgba(1,20,40,.42)}
.hero nav{position:relative;z-index:2;max-width:1160px;width:100%;margin:0 auto;display:flex;justify-content:space-between;align-items:center;padding:18px 20px}
.hero nav .plate{background:#fff;padding:6px 10px}.hero nav .plate img{height:34px;width:auto}
.hero nav ul{display:flex;gap:26px;list-style:none;margin:0;padding:0;align-items:center}.hero nav a{color:#fff;text-decoration:none;font-size:13px;letter-spacing:.08em;text-transform:uppercase}
.hero nav .out{border:1px solid #fff;padding:8px 16px}
.hero .c{position:relative;z-index:2;margin:auto;text-align:center;padding:40px 20px 80px;max-width:900px;width:100%}
.hero h1{font:400 clamp(46px,7vw,86px)/1.08 var(--serif);margin:0}
.hero .sub{font-size:13px;letter-spacing:.2em;text-transform:uppercase;margin:16px 0 30px}
.book fieldset{display:grid;grid-template-columns:1.6fr 1fr 1fr .8fr auto;gap:8px;align-items:end;text-align:left}
.book label{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:4px}
.book select,.book input{width:100%;height:46px;border:0;background:#fff;color:var(--ink);padding:0 12px;font:inherit;font-size:15px;border-radius:0}
.book button{height:46px;padding:0 22px;border:0;background:var(--gold);color:var(--navy);font:700 13px var(--sans);letter-spacing:.12em;text-transform:uppercase;cursor:pointer}
.book-msg{margin:6px 0 0;font-size:14px}
.sticky{position:sticky;top:0;z-index:30;background:#fff;box-shadow:0 2px 14px rgba(0,0,0,.08)}
.sticky .wrap{max-width:1160px;margin:0 auto;display:flex;gap:18px;align-items:center;padding:8px 20px}
.sticky img{height:30px;width:auto;flex:0 0 auto}.sticky .book{flex:1}
.sticky .book label{color:var(--muted)}.sticky .book select,.sticky .book input{border:1px solid var(--line);height:40px}.sticky .book button{height:40px}
.inspire{max-width:1160px;margin:0 auto;padding:clamp(64px,8vw,112px) 20px;display:grid;grid-template-columns:320px 1fr;gap:40px}
h2{font:400 clamp(34px,4vw,48px)/1.1 var(--serif);margin:0;color:var(--navy)}
.rule{width:40px;height:2px;background:var(--gold);margin:22px 0}
.muted{color:var(--muted)}
.ghost{display:inline-block;border:1px solid var(--ink);padding:10px 16px;text-decoration:none;color:var(--ink);font-size:13px;letter-spacing:.1em;text-transform:uppercase}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.card{position:relative;color:#fff;text-decoration:none;display:block;overflow:hidden}
.card img{width:100%;aspect-ratio:3/4.2;object-fit:cover;transition:transform .6s}
.card:hover img{transform:scale(1.04)}
.card::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,rgba(1,20,40,.85))}
.card .rib{position:absolute;z-index:1;top:22px;left:0;background:var(--gold);color:var(--navy);font-size:12px;font-weight:700;letter-spacing:.18em;padding:8px 18px 8px 14px;clip-path:polygon(0 0,100% 0,92% 50%,100% 100%,0 100%)}
.card .t{position:absolute;z-index:1;left:18px;right:18px;bottom:18px}
.card h3{font:400 30px/1.1 var(--serif);margin:0}.card p{margin:4px 0 0;font-size:14px;letter-spacing:.04em}
.bar{max-width:1160px;margin:0 auto;height:2px;background:var(--line);position:relative}.bar::before{content:"";position:absolute;left:0;top:0;width:14%;height:2px;background:var(--gold)}
.feat{max-width:1160px;margin:0 auto;padding:clamp(56px,7vw,96px) 20px;display:grid;gap:clamp(48px,7vw,96px)}
.feat article{display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,5vw,72px);align-items:center}
.feat article:nth-child(even) img{order:2}
.feat img{width:100%;aspect-ratio:4/3;object-fit:cover}
.box{background:#f6f7f9;padding:clamp(56px,7vw,96px) 20px}
.box .wrap{max-width:1160px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,5vw,72px)}
.cmp{list-style:none;margin:20px 0 0;padding:0;background:#fff;border:1px solid var(--line)}.cmp li{display:grid;grid-template-columns:150px 1fr;gap:12px;padding:16px 18px;border-bottom:1px solid var(--line)}.cmp li:last-child{border:0}.cmp strong{font:500 20px var(--serif);color:var(--navy)}.cmp span{color:var(--muted);font-size:15px}
.rules{margin:20px 0 0}.rules div{display:grid;grid-template-columns:170px 1fr;gap:12px;padding:12px 0;border-bottom:1px solid var(--line)}.rules dt{font-weight:600;font-size:14px}.rules dd{margin:0;font-size:15px;color:#333a44}
.pill{display:inline-block;background:var(--navy);color:#fff;padding:12px 18px;margin-top:20px}.pill strong{color:var(--gold)}
.faqw{max-width:860px;margin:0 auto;padding:clamp(56px,7vw,96px) 20px;text-align:center}
.faq{text-align:left;margin-top:28px}.faq details{border-top:1px solid var(--line);padding:18px 0}.faq details:last-child{border-bottom:1px solid var(--line)}.faq summary{font:500 22px var(--serif);color:var(--navy)}.faq p{margin:8px 0 0;color:#333a44}
.cta{background:var(--navy);color:#fff;text-align:center;padding:clamp(56px,7vw,96px) 20px}.cta h2{color:#fff}.cta p{max-width:560px;margin:14px auto 22px}
.btn{display:inline-block;background:var(--gold);color:var(--navy);font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:13px;padding:14px 26px;text-decoration:none}
footer{background:var(--navy2);color:#c4ccd8;padding:56px 20px 32px}
footer .wrap{max-width:1160px;margin:0 auto;display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:28px}
footer .plate{background:#fff;padding:8px 12px;display:inline-block}footer .plate img{height:38px;width:auto}
footer h2{font:600 12px var(--sans);letter-spacing:.2em;text-transform:uppercase;color:#fff;margin:0 0 12px}footer a{color:#fff}
.social{display:flex;gap:16px}.credits{grid-column:1/-1;font-size:13px;opacity:.75;margin:12px 0 0}
@media (max-width:900px){.book fieldset{grid-template-columns:1fr 1fr}.book .f-stay,.book button{grid-column:1/-1}.hero nav ul li:not(:last-child){display:none}
.sticky .book{display:none}.sticky .wrap{justify-content:space-between}.inspire,.box .wrap,footer .wrap{grid-template-columns:1fr}.cards{grid-template-columns:1fr}.feat article{grid-template-columns:1fr}.feat article:nth-child(even) img{order:0}.rules div,.cmp li{grid-template-columns:1fr;gap:2px}}
@media (min-width:901px){.sticky .go{display:none}}
"""
    cards = "".join(f"""<a class="card" href="{s['page']}">{stay_img(s,2 if s['id']!='728474' else 1)}<span class="rib">{'AKRON' if i else 'NEW LOOK'}</span><div class="t"><h3>{E(s['name'])}</h3><p>{s['facts']}</p></div></a>""" for i, s in enumerate(STAYS))
    cards = cards.replace("NEW LOOK", "AKRON")
    html = head("Oilgate Vacation Rentals · Whole homes in Akron, Ohio", "Three whole homes in Akron, Ohio. " + CLEANING_FULL + ".",
                "family=EB+Garamond:wght@400;500&family=Montserrat:wght@400;600;700", css) + f"""<body>
<a class="skip" href="#main">Skip to content</a>
<p class="promo" style="margin:0"><strong>{CLEANING}</strong> · {CLEANING_SUB}</p>
<header class="hero">{stay_img(STAYS[0], loading='eager')}
<nav aria-label="Main"><span class="plate">{logo('primary')}</span><ul><li><a href="#stays">Homes</a></li><li><a href="#compare">Compare</a></li><li><a href="#faq">FAQ</a></li><li><a class="out" href="mailto:{EMAIL}">Contact</a></li></ul></nav>
<div class="c"><h1>Your Akron stay,<br>the whole house</h1><p class="sub">Three whole homes · Akron, Ohio</p>
<div id="book">{book_form('d3', 'Search')}</div></div></header>
<div class="sticky" aria-label="Quick booking"><div class="wrap">{logo('alternate')}{book_form('d3s', 'Search')}<a class="btn go" href="#book">Check dates</a></div></div>
<main id="main">
<section class="inspire" id="stays" aria-labelledby="st"><div><h2 id="st">Homes that feel like yours</h2><div class="rule"></div><p class="muted">Three homes, each one booked whole: two three-bedroom Oakdale units and the renovated two-bedroom Parkgate home.</p><a class="ghost" href="#book">Check dates →</a></div>
<div class="cards">{cards}</div></section>
<div class="bar" aria-hidden="true"></div>
<section class="feat" aria-label="Why stay with us">
<article>{stay_img(STAYS[2])}<div><h2>Three homes, known inside out</h2><div class="rule"></div><p>Three homes we know inside and out. {STAYS[2]['blurb']}</p></div></article>
<article>{stay_img(STAYS[0],2)}<div><h2>No cleaning fees, ever</h2><div class="rule"></div><p>{CLEANING_SUB} That's the whole rule. Check the full total for your dates in the secure Lodgify checkout.</p></div></article>
<article>{stay_img(STAYS[1],2)}<div><h2>Room for the whole crew</h2><div class="rule"></div><p>Every home sleeps up to 6 guests. {NEARBY}</p></div></article>
</section>
<section class="box" aria-label="Compare and terms"><div class="wrap">
<div id="compare"><h2>Compare booking options</h2><div class="rule"></div><p class="muted">{COMPARE_INTRO}</p>{compare_rows()}<p class="muted">{COMPARE_NOTE}</p></div>
<div id="terms"><h2>Rules and terms</h2><div class="rule"></div>{rules_list()}<p class="pill"><strong>{CLEANING}.</strong> {CLEANING_SUB}</p></div>
</div></section>
<section class="faqw" id="faq" aria-labelledby="fq"><h2 id="fq">Good to know</h2>{faq_list()}</section>
<section class="cta" aria-labelledby="ct"><h2 id="ct">Ready when you are</h2><p>Pick a home, pick your dates, and see the real total in Lodgify's secure checkout.</p><a class="btn" href="#book">Check dates</a></section>
</main>
<footer><div class="wrap"><div><span class="plate">{logo('secondary')}</span><p>Whole-home stays in Akron, Ohio.</p></div>
<div><h2>Homes</h2>{''.join(f'<p><a href="{s["page"]}">{E(s["name"])}</a></p>' for s in STAYS)}</div>
<div><h2>Contact</h2><p><a href="mailto:{EMAIL}">{EMAIL}</a></p>{social()}<p><a href="{PRIVACY}">Privacy policy</a></p></div>
{credits([])}</div></footer>
{FOOT_SCRIPT}</body></html>"""
    write("03-key-stay.html", html)


# ---------------------------------------------------------------------------
# 4. LaVante's OG Links Akron theme -> "Akron Linked"
# Big Akron city photo fixed behind everything, deep navy/blue overlay,
# clean centered white type, glassy cards, a social-icon row. Link-in-bio
# rhythm stretched into a full homepage.
# ---------------------------------------------------------------------------
def d4():
    css = BASE_CSS + """
:root{--navy:#012342;--blue:#0b3a6e;--gold:#FEA802;--glass:rgba(255,255,255,.12);--edge:rgba(255,255,255,.28);--sans:'Poppins',system-ui,sans-serif;--display:'Anton',Impact,sans-serif}
body{font-family:var(--sans);color:#fff;font-size:16px;line-height:1.6;background:var(--navy)}
.bg{position:fixed;inset:0;z-index:-1}.bg img{width:100%;height:100%;object-fit:cover}
.bg::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(1,35,66,.72),rgba(1,35,66,.86) 50%,rgba(1,20,40,.96))}
a{color:#fff}
.col{max-width:620px;margin:0 auto;padding:0 18px}
.glass{background:var(--glass);border:1px solid var(--edge);border-radius:22px;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 10px 40px rgba(0,0,0,.25)}
.top{padding:22px 0 8px;text-align:center}
.plate{display:inline-block;background:rgba(255,255,255,.95);border-radius:16px;padding:10px 16px}.plate img{height:52px;width:auto}
.bookcard{margin-top:18px;padding:18px}
.bookcard h2{margin:0 0 10px;font:600 15px var(--sans);letter-spacing:.18em;text-transform:uppercase;text-align:center}
.book fieldset{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.book .f-stay,.book button{grid-column:1/-1}
.book label{display:block;font-size:12px;opacity:.85;margin-bottom:4px}
.book select,.book input{width:100%;height:48px;border-radius:12px;border:1px solid var(--edge);background:rgba(255,255,255,.1);color:#fff;padding:0 12px;font:inherit;color-scheme:dark}
.book select option{color:#111}
.book button{height:52px;border:0;border-radius:999px;background:var(--gold);color:var(--navy);font:700 16px var(--sans);cursor:pointer}
.book-msg{margin:6px 0 0;font-size:14px;text-align:center}
.hello{text-align:center;padding:40px 0 10px}
.hello .akron{font:400 clamp(72px,18vw,140px)/.9 var(--display);letter-spacing:.06em;margin:0;text-shadow:0 6px 30px rgba(0,0,0,.35)}
.hello h1{font:600 22px var(--sans);margin:14px 0 6px}
.hello p{opacity:.9;margin:0 auto;max-width:44ch}
.social{display:flex;justify-content:center;gap:12px;margin:22px 0 6px}
.social a{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:var(--glass);border:1px solid var(--edge)}
.social svg{width:22px;height:22px;fill:#fff}
.links{display:grid;gap:12px;margin:22px 0}
.link{display:grid;grid-template-columns:88px 1fr auto;gap:14px;align-items:center;padding:10px 16px 10px 10px;text-decoration:none}
.link img{width:88px;height:88px;object-fit:cover;border-radius:14px}
.link strong{display:block;font-size:18px}.link small{opacity:.85}.link .go{font-size:22px;color:var(--gold)}
.link:hover{background:rgba(255,255,255,.2)}
.promise{text-align:center;padding:22px;margin:18px 0}.promise strong{display:block;font:400 34px/1.1 var(--display);letter-spacing:.04em;color:var(--gold)}
section h2.t{font:400 34px/1.05 var(--display);letter-spacing:.04em;text-align:center;margin:44px 0 14px}
.pad{padding:18px}
.cmp{list-style:none;margin:0;padding:0;display:grid;gap:10px}.cmp li{background:rgba(255,255,255,.08);border:1px solid var(--edge);border-radius:14px;padding:12px 14px}.cmp strong{display:block}.cmp span{font-size:14px;opacity:.85}
.rules{margin:0;display:grid;gap:10px}.rules div{padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.08);border:1px solid var(--edge)}.rules dt{font-weight:600}.rules dd{margin:2px 0 0;font-size:14px;opacity:.9}
.faq{display:grid;gap:10px}.faq details{border-radius:14px;background:rgba(255,255,255,.08);border:1px solid var(--edge);padding:14px 16px}.faq summary{font-weight:600}.faq p{margin:8px 0 0;opacity:.9}
.note{font-size:14px;opacity:.85;text-align:center;margin:10px 0 0}
footer{text-align:center;padding:48px 0 40px;font-size:14px}
footer .plate img{height:40px}
.credits{opacity:.75;font-size:12px;margin-top:14px}
@media (min-width:980px){.col.wide{max-width:1040px}.wide .links{grid-template-columns:repeat(3,1fr)}.wide .link{grid-template-columns:1fr;text-align:center;padding:12px}.wide .link img{width:100%;height:220px}.wide .link .go{display:none}
.wide .two{display:grid;grid-template-columns:1fr 1fr;gap:18px}}
"""
    a = AKRON["lock3"]
    links = "".join(f"""<a class="link glass" href="{s['page']}">{stay_img(s)}<span><strong>{E(s['name'])}</strong><small>{s['facts']}</small></span><span class="go" aria-hidden="true">→</span></a>""" for s in STAYS)
    html = head("Oilgate Vacation Rentals · Akron", "Your Akron home base. Three whole homes. " + CLEANING_FULL + ".",
                "family=Anton&family=Poppins:wght@400;600;700", css) + f"""<body>
<a class="skip" href="#main">Skip to content</a>
<div class="bg" aria-hidden="true"><img src="{a[0]}" width="{a[1]}" height="{a[2]}" alt="" fetchpriority="high"></div>
<header class="col top"><span class="plate">{logo('primary')}</span>
<section class="glass bookcard" id="book" aria-labelledby="bk"><h2 id="bk">Find your dates</h2>{book_form('d4', 'Check availability')}</section></header>
<main id="main">
<div class="col"><section class="hello" aria-labelledby="hi"><p class="akron" aria-hidden="true">AKRON</p><h1 id="hi">Your Akron home base</h1><p>Three whole homes in Oakdale and Parkgate. Book the entire place, settle in, and make Akron yours.</p>{social('social', icons=True)}</section></div>
<div class="col wide"><section aria-labelledby="st"><h2 class="t" id="st">The stays</h2><div class="links">{links}</div></section>
<div class="glass promise"><strong>{CLEANING}</strong>{CLEANING_SUB}</div>
<div class="two"><section aria-labelledby="cp"><h2 class="t" id="cp">Compare booking options</h2><div class="glass pad"><p style="margin-top:0">{COMPARE_INTRO}</p>{compare_rows()}<p class="note">{COMPARE_NOTE}</p></div></section>
<section aria-labelledby="tr"><h2 class="t" id="tr">Rules and terms</h2><div class="glass pad">{rules_list()}</div></section></div>
<section aria-labelledby="fq"><h2 class="t" id="fq">Good to know</h2>{faq_list()}</section></div>
</main>
<footer class="col"><span class="plate">{logo('secondary')}</span>{social('social', icons=True)}<p><a href="mailto:{EMAIL}">{EMAIL}</a> · <a href="{PRIVACY}">Privacy policy</a></p>{credits(['lock3'])}</footer>
{FOOT_SCRIPT}</body></html>"""
    write("04-akron-linked.html", html)


# ---------------------------------------------------------------------------
# 5. Akron photo-forward (Adobe Stock "akron ohio" mood, free photos only)
# Edge-to-edge city photography, editorial mosaic, credits on every photo,
# charcoal + navy with gold, sturdy grotesk type.
# ---------------------------------------------------------------------------
def d5():
    css = BASE_CSS + """
:root{--navy:#012342;--gold:#FEA802;--char:#101418;--paper:#f5f3ee;--sans:'Archivo',system-ui,sans-serif;--cond:'Archivo Narrow','Archivo',sans-serif}
body{font-family:var(--sans);color:var(--char);background:var(--paper);font-size:17px;line-height:1.6}
a{color:var(--navy)}
.head{position:absolute;z-index:5;left:0;right:0;top:0}
.head .wrap{max-width:1400px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;padding:16px 20px}
.head .plate{background:#fff;padding:8px 12px}.head .plate img{height:36px;width:auto}
.head nav a{color:#fff;text-decoration:none;font-weight:600;margin-left:22px;font-size:15px}
.hero{position:relative;height:min(100vh,980px);min-height:640px;color:#fff}
.hero>img{width:100%;height:100%;object-fit:cover}
.hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(16,20,24,.55),rgba(16,20,24,0) 30%,rgba(16,20,24,.15) 55%,rgba(16,20,24,.88))}
.hero .copy{position:absolute;z-index:2;left:0;right:0;bottom:0;max-width:1400px;margin:0 auto;padding:0 20px 28px}
.hero h1{font:800 clamp(56px,10vw,150px)/.88 var(--sans);letter-spacing:-.03em;margin:0;text-transform:uppercase}
.hero h1 span{color:var(--gold)}
.hero .row{display:flex;justify-content:space-between;align-items:end;gap:20px;flex-wrap:wrap;margin-top:14px}
.hero .row p{max-width:520px;margin:0;font-size:18px}
.cap{font-size:12px;opacity:.8}
.bookstrip{position:relative;z-index:3;max-width:1400px;margin:-1px auto 0;padding:0 20px}
.book{background:var(--gold);padding:18px}
.book fieldset{display:grid;grid-template-columns:auto 1.6fr 1fr 1fr .8fr auto;gap:10px;align-items:end}
.book legend.sr+div{}
.book label{display:block;font:700 12px var(--sans);letter-spacing:.1em;text-transform:uppercase;color:var(--navy);margin-bottom:4px}
.book select,.book input{width:100%;height:50px;border:2px solid var(--navy);background:#fff;padding:0 12px;font:inherit;color:var(--char);border-radius:0}
.book button{height:50px;padding:0 28px;border:0;background:var(--navy);color:#fff;font:700 15px var(--sans);letter-spacing:.06em;text-transform:uppercase;cursor:pointer}
.book-msg{margin:6px 0 0;font-size:14px;color:var(--navy)}
.bk-title{font:800 26px/1 var(--sans);color:var(--navy);text-transform:uppercase;align-self:center;margin:0}
.mosaic{max-width:1400px;margin:0 auto;padding:clamp(56px,7vw,96px) 20px;display:grid;grid-template-columns:repeat(12,1fr);gap:12px}
.mosaic figure{margin:0;position:relative;overflow:hidden;background:#222}
.mosaic img{width:100%;height:100%;object-fit:cover}
.mosaic figcaption{position:absolute;left:0;right:0;bottom:0;padding:28px 14px 10px;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.75));font-size:14px}
.mosaic figcaption strong{display:block;font-size:18px}
.m1{grid-column:span 7;grid-row:span 2;min-height:520px}.m2{grid-column:span 5;min-height:254px}.m3{grid-column:span 5;min-height:254px}
.mosaic .txt{grid-column:span 12;display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:end;padding:28px 0 8px}
.kick{font:700 13px var(--sans);letter-spacing:.18em;text-transform:uppercase;color:var(--navy);margin:0 0 8px}
h2{font:800 clamp(40px,5.5vw,80px)/.92 var(--sans);letter-spacing:-.02em;text-transform:uppercase;margin:0}
.stays{background:var(--char);color:#fff;padding:clamp(56px,7vw,96px) 20px}
.stays .wrap{max-width:1400px;margin:0 auto}
.stays h2{color:#fff}.stays .kick{color:var(--gold)}
.stay{display:grid;grid-template-columns:1.3fr 1fr;gap:clamp(20px,4vw,56px);padding:36px 0;border-top:1px solid #2b3238;align-items:center}
.stay:nth-child(odd){grid-template-columns:1fr 1.3fr}.stay:nth-child(odd) .ph{order:2}
.stay .ph{display:grid;grid-template-columns:2fr 1fr;gap:10px}.stay .ph img{width:100%;height:100%;aspect-ratio:4/3;object-fit:cover}.stay .ph img+img{aspect-ratio:auto}
.stay h3{font:800 clamp(30px,3.6vw,48px)/1 var(--sans);text-transform:uppercase;margin:0 0 8px}
.stay .facts{color:var(--gold);font-weight:700;margin:0 0 12px}
.btn{display:inline-block;background:var(--gold);color:var(--navy);font-weight:800;text-transform:uppercase;letter-spacing:.06em;padding:14px 22px;text-decoration:none;margin-top:10px}
.btn.line{background:transparent;color:#fff;border:2px solid #fff;margin-left:8px}
.pano{position:relative}.pano img{width:100%;height:auto;max-height:520px;object-fit:cover}
.pano .big{position:absolute;inset:0;display:grid;place-items:center;text-align:center;color:#fff;background:rgba(1,35,66,.45)}
.pano .big strong{font:800 clamp(36px,6vw,92px)/.95 var(--sans);text-transform:uppercase;letter-spacing:-.02em}.pano .big span{display:block;font-size:18px;margin-top:10px}
.pano .cap{position:absolute;right:12px;bottom:8px;color:#fff}
.grid2{max-width:1400px;margin:0 auto;padding:clamp(56px,7vw,96px) 20px;display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,5vw,72px)}
.cmp{list-style:none;margin:18px 0 0;padding:0}.cmp li{display:grid;grid-template-columns:170px 1fr;gap:12px;padding:16px 0;border-top:3px solid var(--char)}.cmp strong{font-weight:800;text-transform:uppercase}
.rules{margin:18px 0 0}.rules div{padding:14px 0;border-top:3px solid var(--char)}.rules dt{font-weight:800;text-transform:uppercase}.rules dd{margin:4px 0 0}
.faqw{background:#fff;padding:clamp(56px,7vw,96px) 20px}.faqw .wrap{max-width:1000px;margin:0 auto}
.faq{margin-top:22px}.faq details{border-top:3px solid var(--char);padding:18px 0}.faq summary{font:800 22px var(--sans);text-transform:uppercase}.faq p{margin:8px 0 0}
footer{background:var(--navy);color:#dfe6ee;padding:56px 20px 28px}
footer .wrap{max-width:1400px;margin:0 auto;display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:28px}
footer .plate{background:#fff;padding:8px 12px;display:inline-block}footer .plate img{height:42px;width:auto}
footer h2{font:800 16px var(--sans);letter-spacing:.12em;color:var(--gold);margin:0 0 10px}footer a{color:#fff}
.social{display:flex;gap:16px}.credits{grid-column:1/-1;font-size:13px;opacity:.85;margin:10px 0 0}
@media (max-width:900px){.head nav{display:none}.book fieldset{grid-template-columns:1fr 1fr}.bk-title,.book .f-stay,.book button{grid-column:1/-1}
.m1,.m2,.m3{grid-column:span 12;min-height:280px}.mosaic .txt{grid-template-columns:1fr}.stay,.stay:nth-child(odd){grid-template-columns:1fr}.stay:nth-child(odd) .ph{order:0}.grid2,footer .wrap{grid-template-columns:1fr}.cmp li{grid-template-columns:1fr;gap:2px}.btn.line{margin-left:0}}
"""
    m, l3, ad, cs, sk = AKRON["main"], AKRON["lock3"], AKRON["airdock"], AKRON["cascade"], AKRON["skyline"]
    stays = "".join(f"""<article class="stay"><div class="ph">{stay_img(s)}{stay_img(s,2)}</div><div><p class="kick">{E(s['place'])} · Akron, OH</p><h3>{E(s['name'])}</h3><p class="facts">{s['facts']}</p><p>{E(s['blurb'])}</p><a class="btn" href="#book">Check dates</a><a class="btn line" href="{s['page']}">See the home</a></div></article>""" for s in STAYS)
    html = head("Oilgate Vacation Rentals · Stay in Akron, Ohio", "Stay in Akron, Ohio. Three whole homes near downtown. " + CLEANING_FULL + ".",
                "family=Archivo:wght@400;600;700;800", css) + f"""<body>
<a class="skip" href="#main">Skip to content</a>
<header class="head"><div class="wrap"><span class="plate">{logo('primary')}</span><nav aria-label="Main"><a href="#stays">Stays</a><a href="#compare">Compare</a><a href="#terms">Rules</a><a href="#faq">FAQ</a></nav></div></header>
<section class="hero" aria-labelledby="h1"><img src="{l3[0]}" width="{l3[1]}" height="{l3[2]}" alt="{E(l3[3])}" fetchpriority="high">
<div class="copy"><h1 id="h1">Stay in<br><span>Akron</span>, Ohio</h1><div class="row"><p>Three whole homes, minutes from downtown, Highland Square and Sand Run Metro Park. {CLEANING}.</p><span class="cap">Photo: {E(l3[4])}</span></div></div></section>
<div class="bookstrip" id="book"><form class="book" data-book aria-label="Find your dates"><fieldset><legend class="sr">Find your dates</legend><p class="bk-title">Find your dates</p>
{book_form('d5','Search stays').split('<legend class="sr">Find your dates</legend>',1)[1].split('</fieldset>')[0]}</fieldset><p class="book-msg" data-book-msg role="status" aria-live="polite"></p></form></div>
<main id="main">
<section class="mosaic" aria-labelledby="ak"><div class="txt"><div><p class="kick">The Rubber City</p><h2 id="ak">Akron is the plan</h2></div><p>Brick downtown streets, the canal trail, the giant Goodyear Airdock. Spend the day out in the city, then come home to a whole house.</p></div>
<figure class="m1"><img src="{m[0]}" width="{m[1]}" height="{m[2]}" alt="{E(m[3])}" loading="lazy"><figcaption><strong>Main Street</strong>Photo: {E(m[4])}</figcaption></figure>
<figure class="m2"><img src="{ad[0]}" width="{ad[1]}" height="{ad[2]}" alt="{E(ad[3])}" loading="lazy"><figcaption><strong>Goodyear Airdock</strong>Photo: {E(ad[4])}</figcaption></figure>
<figure class="m3"><img src="{cs[0]}" width="{cs[1]}" height="{cs[2]}" alt="{E(cs[3])}" loading="lazy"><figcaption><strong>Cascade Plaza</strong>Photo: {E(cs[4])}</figcaption></figure>
</section>
<section class="stays" id="stays" aria-labelledby="st"><div class="wrap"><p class="kick">Your home base</p><h2 id="st">Three whole homes</h2>{stays}</div></section>
<div class="pano"><img src="{sk[0]}" width="{sk[1]}" height="{sk[2]}" alt="{E(sk[3])}" loading="lazy"><div class="big"><p><strong>{CLEANING}</strong><span>{CLEANING_SUB}</span></p></div><span class="cap">Photo: {E(sk[4])}</span></div>
<section class="grid2" aria-label="Compare and terms"><div id="compare"><p class="kick">Book smart</p><h2>Compare booking options</h2><p>{COMPARE_INTRO}</p>{compare_rows()}<p>{COMPARE_NOTE}</p></div>
<div id="terms"><p class="kick">Before you book</p><h2>Rules and terms</h2>{rules_list()}</div></section>
<section class="faqw" id="faq" aria-labelledby="fq"><div class="wrap"><p class="kick">Good to know</p><h2 id="fq">Questions</h2>{faq_list()}</div></section>
</main>
<footer><div class="wrap"><div><span class="plate">{logo('alternate')}</span><p>Whole-home stays in Akron, Ohio.</p></div>
<div><h2>CONTACT</h2><p><a href="mailto:{EMAIL}">{EMAIL}</a></p>{social()}</div>
<div><h2>STAYS</h2>{''.join(f'<p><a href="{s["page"]}">{E(s["name"])}</a></p>' for s in STAYS)}<p><a href="{PRIVACY}">Privacy policy</a></p></div>
{credits(['lock3','main','airdock','cascade','skyline'])}</div></footer>
{FOOT_SCRIPT}</body></html>"""
    write("05-akron-photo.html", html)


# ---------------------------------------------------------------------------
# 6. Best of -> "Oilgate Signature"
# Key's booking bar + serif headline + ribbon cards, Schlosshotel's calm stone
# rhythm, day timeline and floating Book button, Club Charlestown's marquee
# and condensed section labels, with the Akron-theme imagery (navy-washed
# city photo, glass card).
# ---------------------------------------------------------------------------
def d6():
    css = BASE_CSS + """
:root{--navy:#012342;--gold:#FEA802;--stone:#f2eee7;--line:#e2dcd2;--ink:#17202b;--muted:#5f6772;--serif:'Cormorant Garamond',Georgia,serif;--sans:'Inter',system-ui,sans-serif;--display:'Bebas Neue',Impact,sans-serif}
body{font-family:var(--sans);color:var(--ink);background:#fff;font-size:16.5px;line-height:1.7}
a{color:var(--navy)}
.hero{position:relative;min-height:94vh;color:#fff;display:flex;flex-direction:column}
.hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(1,35,66,.78),rgba(1,35,66,.55) 45%,rgba(1,35,66,.9))}
.hero nav{position:relative;z-index:2;max-width:1200px;width:100%;margin:0 auto;display:flex;justify-content:space-between;align-items:center;padding:16px 20px}
.plate{display:inline-block;background:rgba(255,255,255,.95);border-radius:12px;padding:8px 12px}.plate img{height:38px;width:auto}
.hero nav ul{display:flex;gap:24px;list-style:none;margin:0;padding:0}.hero nav ul a{color:#fff;text-decoration:none;font-size:14px}
.hero .c{position:relative;z-index:2;margin:auto;max-width:1000px;width:100%;padding:24px 20px 60px;text-align:center}
.hero .k{font:400 20px var(--display);letter-spacing:.24em;color:var(--gold);margin:0}
.hero h1{font:400 clamp(48px,7.4vw,96px)/1.02 var(--serif);margin:10px 0 14px}
.hero p.l{max-width:560px;margin:0 auto 26px;opacity:.92}
.glass{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.3);border-radius:18px;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);padding:14px}
.book fieldset{display:grid;grid-template-columns:1.6fr 1fr 1fr .8fr auto;gap:8px;align-items:end;text-align:left}
.book label{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;margin-bottom:4px;opacity:.9}
.book select,.book input{width:100%;height:48px;border:0;border-radius:10px;background:#fff;color:var(--ink);padding:0 12px;font:inherit;font-size:15px}
.book button{height:48px;padding:0 24px;border:0;border-radius:10px;background:var(--gold);color:var(--navy);font:700 14px var(--sans);letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
.book-msg{margin:6px 0 0;font-size:14px}
.chip{display:inline-flex;gap:8px;align-items:center;margin-top:18px;font-size:14px}.chip b{color:var(--gold)}
.marquee{background:var(--gold);overflow:hidden;white-space:nowrap}
.marquee .run{display:inline-flex;gap:44px;padding:12px 0;animation:run 38s linear infinite}
.marquee span{font:400 34px/1 var(--display);letter-spacing:.06em;color:var(--navy)}
@keyframes run{to{transform:translateX(-50%)}}
.label{font:400 20px var(--display);letter-spacing:.2em;color:var(--gold);margin:0 0 8px;-webkit-text-stroke:.3px var(--navy)}
.on-light .label{color:var(--navy);-webkit-text-stroke:0}
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
.info{max-width:1200px;margin:0 auto;padding:clamp(64px,8vw,112px) 20px;display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,5vw,72px)}
.cmp{list-style:none;margin:16px 0 0;padding:0;border:1px solid var(--line);border-radius:14px;overflow:hidden}.cmp li{display:grid;grid-template-columns:140px 1fr;gap:12px;padding:14px 16px;border-bottom:1px solid var(--line);background:#fff}.cmp li:last-child{border:0}.cmp strong{font:500 21px var(--serif);color:var(--navy)}.cmp span{color:var(--muted);font-size:15px}
.rules{margin:16px 0 0}.rules div{display:grid;grid-template-columns:160px 1fr;gap:12px;padding:11px 0;border-bottom:1px solid var(--line)}.rules dt{font-weight:600;font-size:14px}.rules dd{margin:0;font-size:15px;color:#2d3540}
.promise{background:var(--navy);color:#fff;border-radius:14px;padding:18px 20px;margin-top:18px}.promise strong{font:400 28px var(--serif);color:var(--gold);display:block}
.note{color:var(--muted);font-size:14px}
.faqw{max-width:880px;margin:0 auto;padding:clamp(64px,8vw,112px) 20px}
.faq details{border-bottom:1px solid var(--line);padding:16px 2px}.faq summary{font:400 23px var(--serif);color:var(--navy);list-style:none;display:flex;justify-content:space-between;gap:12px}.faq summary::after{content:"+";color:var(--gold);font-size:26px;line-height:1}.faq details[open] summary::after{content:"–"}.faq p{margin:8px 0 0;color:#2d3540}
.float{position:fixed;right:16px;bottom:16px;z-index:20;background:var(--navy);color:#fff;text-decoration:none;padding:13px 20px;border-radius:999px;font-weight:700;font-size:14px;box-shadow:0 6px 20px rgba(1,35,66,.35)}
.float b{color:var(--gold)}
footer{position:relative;color:#fff;overflow:hidden}
footer>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
footer::after{content:"";position:absolute;inset:0;background:rgba(1,35,66,.9)}
footer .wrap{position:relative;z-index:1;max-width:1200px;margin:0 auto;padding:64px 20px 32px;display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:28px}
footer h2{font:400 20px var(--display);letter-spacing:.2em;color:var(--gold);margin:0 0 10px}footer a{color:#fff}
.social{display:flex;gap:10px}.social a{width:42px;height:42px;display:grid;place-items:center;border-radius:50%;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.3)}.social svg{width:20px;height:20px;fill:#fff}
.credits{grid-column:1/-1;font-size:13px;opacity:.8;margin:10px 0 0}
@media (max-width:900px){.hero nav ul{display:none}.book fieldset{grid-template-columns:1fr 1fr}.book .f-stay,.book button{grid-column:1/-1}
.stays,.day,.info,footer .wrap{grid-template-columns:1fr}.cards{grid-template-columns:1fr}.day li,.rules div,.cmp li{grid-template-columns:1fr;gap:2px}.day img{max-height:420px}}
"""
    l3 = AKRON["lock3"]
    words = ["No cleaning fees, ever", "Whole homes", "Akron, Ohio", "Guests 18+", "Book direct"]
    run = "".join(f"<span>{w} ✦</span>" for w in words * 3)
    cards = "".join(f"""<a class="card" href="{s['page']}">{stay_img(s,2 if s['id']!='728474' else 1)}<span class="rib">{E(s['place'].upper())}</span><div class="t"><h3>{E(s['name'])}</h3><p>{s['facts']}</p></div></a>""" for s in STAYS)
    html = head("Oilgate Vacation Rentals · Akron, Ohio", "Whole-home stays in Akron, Ohio. " + CLEANING_FULL + ".",
                "family=Bebas+Neue&family=Cormorant+Garamond:wght@400;500&family=Inter:wght@400;600;700", css) + f"""<body>
<a class="skip" href="#main">Skip to content</a>
<header class="hero"><img src="{l3[0]}" width="{l3[1]}" height="{l3[2]}" alt="{E(l3[3])}" fetchpriority="high">
<nav aria-label="Main"><span class="plate">{logo('primary')}</span><ul><li><a href="#stays">Stays</a></li><li><a href="#day">Your stay</a></li><li><a href="#compare">Compare</a></li><li><a href="#faq">FAQ</a></li></ul></nav>
<div class="c"><p class="k">Akron, Ohio</p><h1>A whole home,<br>right in Akron</h1><p class="l">Three homes in Oakdale and Parkgate, booked whole, with your own kitchen and living room.</p>
<div class="glass" id="book">{book_form('d6', 'Check availability')}</div>
<p class="chip"><b>★</b> {CLEANING}. {CLEANING_SUB}</p></div></header>
<div class="marquee" aria-hidden="true"><div class="run">{run}</div></div>
<main id="main">
<section class="stays on-light" id="stays" aria-labelledby="st"><div><p class="label">The stays</p><h2 id="st">Pick your home base</h2><div class="rule"></div><p class="note">Two three-bedroom Oakdale units and the renovated two-bedroom Parkgate home. Each one sleeps up to 6.</p><a class="ghost" href="#book">Check dates</a></div><div class="cards">{cards}</div></section>
<div class="stone"><section class="day on-light" id="day" aria-labelledby="dy">{stay_img(STAYS[0],2)}<div><p class="label">Your stay</p><h2 id="dy">An easy Akron day</h2><ol>
<li><time>3:00 PM</time><div><strong>Check in</strong><p>Your whole home is ready from 3.</p></div></li>
<li><time>Evening</time><div><strong>Head out or stay in</strong><p>{NEARBY}</p></div></li>
<li><time>10:00 PM</time><div><strong>Quiet hours</strong><p>10 PM to 10 AM, out of respect for the neighbors.</p></div></li>
<li><time>11:00 AM</time><div><strong>Check out</strong><p>{CLEANING}, unless house rules are broken.</p></div></li></ol></div></section></div>
<section class="info on-light" aria-label="Compare and terms"><div id="compare"><p class="label">Book smart</p><h2>Compare booking options</h2><p>{COMPARE_INTRO}</p>{compare_rows()}<p class="note">{COMPARE_NOTE}</p></div>
<div id="terms"><p class="label">Before you book</p><h2>Rules and terms</h2>{rules_list()}<div class="promise"><strong>{CLEANING}</strong>{CLEANING_SUB}</div></div></section>
<div class="stone"><section class="faqw on-light" id="faq" aria-labelledby="fq"><p class="label">Good to know</p><h2 id="fq">Questions, answered</h2>{faq_list()}</section></div>
</main>
<a class="float" href="#book"><b>★</b> Check dates</a>
<footer>{akron_img('skyline')}<div class="wrap"><div><span class="plate">{logo('secondary')}</span><p>Whole-home stays in Akron, Ohio.</p>{social('social', icons=True)}</div>
<div><h2>Stays</h2>{''.join(f'<p><a href="{s["page"]}">{E(s["name"])}</a></p>' for s in STAYS)}</div>
<div><h2>Contact</h2><p><a href="mailto:{EMAIL}">{EMAIL}</a></p><p><a href="{PRIVACY}">Privacy policy</a></p></div>
{credits(['lock3','skyline'])}</div></footer>
{FOOT_SCRIPT}</body></html>"""
    write("06-oilgate-signature.html", html)


if __name__ == "__main__":
    for f in (d1, d2, d3, d4, d5, d6):
        f()

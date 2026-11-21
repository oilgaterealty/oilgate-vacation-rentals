"""Real content for the OVR design previews.

Every fact here comes from data/properties.json (Lodgify pull) or its
ownerTerms block (LaVante, Nov 20 2026). Nothing is invented: no prices,
no deposits, no phone numbers.
"""
import html

E = html.escape

STAYS = [
    {
        "id": "603326",
        "name": "Oakdale / Unit 1",
        "short": "Unit 1",
        "place": "Oakdale",
        "page": "../unit-1-at-oilgate-at-oakdale.html",
        "facts": "3 bedrooms · 3 beds · 1 bathroom · up to 6 guests",
        "beds": "2 double beds, 1 queen bed",
        "blurb": "A cozy first-floor home in a charming duplex: three bedrooms with blackout curtains and a workspace, original wood coffered ceilings in the living room, Fire TV with cable and a fully equipped kitchen.",
        "img": "../assets/oakdale-unit-1.webp", "w": 1400, "h": 933,
        "alt": "Front of the Oakdale duplex with its long enclosed porch under a blue sky",
        "img2": "../samples/img/u1-06.webp", "w2": 1050, "h2": 1400,
        "alt2": "Unit 1 living room with a wood coffered ceiling and a TV stand",
        "tags": ["Coffered ceilings", "Fire TV + cable", "Wi-Fi", "Washer and dryer"],
    },
    {
        "id": "603323",
        "name": "Oakdale / Unit 2",
        "short": "Unit 2",
        "place": "Oakdale",
        "page": "../unit-2-at-oilgate-at-oakdale.html",
        "facts": "3 bedrooms · 3 beds · 1 bathroom · up to 6 guests",
        "beds": "2 double beds, 1 queen bed",
        "blurb": "A spacious upper-level home for short and mid-term stays: three bedrooms, each with a workspace and Fire TV with free cable, plus a private kitchen, a cozy living room and a dining room.",
        "img": "../assets/oakdale-unit-2.webp", "w": 1400, "h": 933,
        "alt": "Side view of the Oakdale duplex and its front walk on a bright day",
        "img2": "../samples/img/u2-04.webp", "w2": 1050, "h2": 1400,
        "alt2": "Unit 2 dining room with a long wood table and chairs",
        "tags": ["Private kitchen", "Dining room", "Driveway parking", "Wi-Fi"],
    },
    {
        "id": "728474",
        "name": "Oilgate at Parkgate",
        "short": "Parkgate",
        "place": "Parkgate",
        "page": "../oilgate-at-parkgate.html",
        "facts": "2 bedrooms · 2 beds · 1 bathroom · up to 6 guests",
        "beds": "1 double bed, 1 queen bed",
        "blurb": "A completely renovated two-bedroom home with brand-new appliances, luxury bedding, a 75-inch TV with free cable, fast Wi-Fi, smart lock entry, a deck, a big yard and on-site parking.",
        "img": "../assets/parkgate-living.webp", "w": 904, "h": 1200,
        "alt": "Parkgate living room with a cream sofa, coffee table and ceiling fan",
        "img2": "../samples/img/parkgate-14.webp", "w2": 900, "h2": 1200,
        "alt2": "Parkgate kitchen with a range, microwave and refrigerator",
        "tags": ["75-inch TV", "Smart lock", "Deck + big yard", "Dishwasher"],
    },
]

NEARBY = "Minutes from Swensons, Highland Square, downtown Akron and Sand Run Metro Park."

CLEANING = "No cleaning fees, ever"
CLEANING_SUB = "Unless house rules are broken."
CLEANING_FULL = "No cleaning fees, ever (unless house rules are broken)"

RULES = [
    ("Check-in and check-out", "Check in from 3:00 PM. Check out by 11:00 AM."),
    ("Guests 18+", "The person booking must be 18 or older."),
    ("No parties", "Up to 3 visitors at a time. No overnight visitors unless approved and paid for in advance."),
    ("Quiet hours", "10 PM to 10 AM, out of respect for neighbors and the other unit."),
    ("Smoke-free and pet-free", "No cigarette smoking in the home. No pets."),
    ("Parking", "Unit 2 uses the driveway, Unit 1 parks on the street. Parkgate guests can use the street or the driveway."),
    ("Laundry", "Oakdale's basement laundry is shared by both units. Please clean up and empty the machines when done."),
    ("Damage", "Guests are responsible for damage they cause. Oilgate Realty is not liable for injury or loss of personal property, except as required by law."),
]

FAQ = [
    ("Am I booking a room or a whole place?", "A whole place. You book an entire Oakdale unit or the whole Parkgate home. At Oakdale, only the basement laundry room is shared with the other unit."),
    ("Are there cleaning fees?", "No cleaning fees, ever, unless house rules are broken."),
    ("How old do I need to be to book?", "18 or older."),
    ("What time is check-in and check-out?", "Check-in is from 3:00 PM and check-out is by 11:00 AM."),
    ("Can I bring a pet?", "No. All three homes are pet-free."),
    ("Where will I see the full price and cancellation terms?", "Pick your stay and dates above. Lodgify's secure checkout shows the full stay total, payment schedule and cancellation terms before you confirm."),
]

CHANNELS = [
    ("Book direct", "Secure Lodgify checkout on this site"),
    ("Airbnb", "Parkgate isn't listed on Airbnb right now"),
    ("Vrbo", "Same homes, Vrbo's own fees and terms"),
    ("Booking.com", "Same homes, Booking.com's own fees and terms"),
]
COMPARE_INTRO = "Compare the full stay total for the same home, dates, guest count and cancellation terms before you choose where to book."
COMPARE_NOTE = "We don't show prices here. Totals change by date, so check each one live."

EMAIL = "oilgaterealty@gmail.com"
SOCIAL = [
    ("Facebook", "https://www.facebook.com/profile.php?id=61575747832440"),
    ("Instagram", "https://www.instagram.com/oilgaterealty/"),
    ("X", "https://x.com/OilgateRealty"),
]
PRIVACY = "https://oilgaterealty.com/en/privacy-policy"

AKRON = {
    "lock3": ("../samples/img/akron-lock3-canal.webp", 1400, 1050, "Downtown Akron at dusk: the canal path, a flower mural and the tower skyline", "Dillguy9, CC0", "https://commons.wikimedia.org/wiki/File:Lock_3,_Canal_Square,_%26_Civic_Theatre.jpg"),
    "main": ("../samples/img/akron-main-street.webp", 1400, 787, "Main Street in downtown Akron with brick buildings and towers at dusk", "Dillguy9, CC0", "https://commons.wikimedia.org/wiki/File:Main_Street_Akron.jpg"),
    "airdock": ("../samples/img/akron-goodyear-airdock.webp", 1400, 788, "The Goodyear Airdock, a huge curved hangar, across an open field in Akron", "Dillguy9, CC0", "https://commons.wikimedia.org/wiki/File:Goodyear_Airdock_July_2024.jpg"),
    "cascade": ("../samples/img/akron-from-cascade-plaza.webp", 1400, 663, "Downtown Akron towers seen from Cascade Plaza", "Dillguy9, CC0", "https://commons.wikimedia.org/wiki/File:Downtown_Akron_from_Cascade_Plaza.jpg"),
    "skyline": ("../samples/img/akron-canalway-skyline.webp", 1400, 398, "Panorama of the downtown Akron skyline from the Ohio and Erie Canalway", "Andre Carrotflower, CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Downtown_skyline_panorama_as_seen_from_Ohio_%26_Erie_Canalway,_Akron,_Ohio_-_20200530.jpg"),
}

LOGO = {
    "primary": ("img/ovr-primary.webp", 720, 181),
    "secondary": ("img/ovr-secondary.webp", 720, 198),
    "alternate": ("img/ovr-alternate.webp", 720, 149),
}


def logo(kind="primary", cls="logo", height=None):
    src, w, h = LOGO[kind]
    style = f' style="height:{height}px;width:auto"' if height else ""
    return f'<img class="{cls}" src="{src}" width="{w}" height="{h}" alt="Oilgate Vacation Rentals"{style}>'


def head(title, desc, fonts, css):
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<link rel="icon" href="../assets/favicon-48.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{fonts}&display=swap">
<style>{css}</style>
</head>
"""


def book_form(prefix, button="Check availability", cls="book", legend=None, compact=False):
    opts = "".join(f'<option value="{s["id"]}">{E(s["name"])} · {s["facts"].split(" · ")[0]}</option>' for s in STAYS)
    guests = "".join(f'<option value="{n}"{" selected" if n == 2 else ""}>{n} guest{"s" if n > 1 else ""}</option>' for n in range(1, 7))
    leg = f'<legend class="sr">{E(legend or "Find your dates")}</legend>'
    return f"""<form class="{cls}" data-book aria-label="Find your dates">
<fieldset>{leg}
<div class="f f-stay"><label for="{prefix}-stay">Stay</label><select id="{prefix}-stay" name="stay">{opts}</select></div>
<div class="f f-in"><label for="{prefix}-in">Check-in</label><input id="{prefix}-in" name="arrival" type="date" required></div>
<div class="f f-out"><label for="{prefix}-out">Check-out</label><input id="{prefix}-out" name="departure" type="date" required></div>
<div class="f f-guests"><label for="{prefix}-guests">Guests</label><select id="{prefix}-guests" name="guests">{guests}</select></div>
<button type="submit">{E(button)}</button>
</fieldset>
<p class="book-msg" data-book-msg role="status" aria-live="polite"></p>
</form>"""


def compare_rows(cls="cmp"):
    rows = "".join(f'<li><strong>{E(n)}</strong><span>{E(d)}</span></li>' for n, d in CHANNELS)
    return f'<ul class="{cls}">{rows}</ul>'


def rules_list(cls="rules"):
    return f'<dl class="{cls}">' + "".join(f"<div><dt>{E(t)}</dt><dd>{E(d)}</dd></div>" for t, d in RULES) + "</dl>"


def faq_list(cls="faq"):
    return f'<div class="{cls}">' + "".join(f"<details><summary>{E(q)}</summary><p>{E(a)}</p></details>" for q, a in FAQ) + "</div>"


def social(cls="social", icons=False):
    svg = {
        "Facebook": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6z"/></svg>',
        "Instagram": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM17.5 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>',
        "X": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg>',
        "Email": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1 3.2V17h16V8.2l-8 5.3zM5.2 7 12 11.5 18.8 7z"/></svg>',
    }
    items = []
    for n, u in SOCIAL:
        inner = svg[n] if icons else E(n)
        items.append(f'<a href="{u}" target="_blank" rel="noopener noreferrer" aria-label="Oilgate Realty on {n}">{inner}</a>')
    if icons:
        items.append(f'<a href="mailto:{EMAIL}" aria-label="Email Oilgate Realty">{svg["Email"]}</a>')
    return f'<nav class="{cls}" aria-label="Oilgate Realty social pages">' + "".join(items) + "</nav>"


def credits(keys):
    parts = []
    for k in keys:
        a = AKRON[k]
        parts.append(f'<a href="{a[5]}">{E(a[4])}</a>')
    akron = ("Akron photos via Wikimedia Commons: " + " · ".join(parts) + ". ") if parts else ""
    return f'<p class="credits">{akron}Home photos: Oilgate Realty listings. Design preview, not the live booking site.</p>'


def akron_img(key, cls="", loading="lazy", sizes=None):
    src, w, h, alt, _, _ = AKRON[key]
    c = f' class="{cls}"' if cls else ""
    return f'<img{c} src="{src}" width="{w}" height="{h}" alt="{E(alt)}" loading="{loading}" decoding="async">'


def stay_img(s, which=1, cls="", loading="lazy"):
    if which == 1:
        src, w, h, alt = s["img"], s["w"], s["h"], s["alt"]
    else:
        src, w, h, alt = s["img2"], s["w2"], s["h2"], s["alt2"]
    c = f' class="{cls}"' if cls else ""
    return f'<img{c} src="{src}" width="{w}" height="{h}" alt="{E(alt)}" loading="{loading}" decoding="async">'


FOOT_SCRIPT = '<script src="assets/book.js" defer></script>'

BASE_CSS = """*,*::before,*::after{box-sizing:border-box}html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}body{margin:0}img{max-width:100%;height:auto;display:block}
.sr{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.skip{position:absolute;left:-999px;top:8px;z-index:99;padding:10px 14px;background:#fff;color:#012342}.skip:focus{left:8px}
fieldset{border:0;margin:0;padding:0;min-width:0}
details summary{cursor:pointer}
:focus-visible{outline:3px solid #FEA802;outline-offset:3px}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
"""

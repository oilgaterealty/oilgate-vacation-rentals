"""Build the complete Oilgate Vacation Rentals v4 site into /v4-preview/.

Driven by data/properties.json, data/prices.json, and v4-preview/photos/manifest.json.
Generates:
  - v4-preview/index.html
  - v4-preview/unit-1-at-oilgate-at-oakdale.html
  - v4-preview/unit-2-at-oilgate-at-oakdale.html
  - v4-preview/oilgate-at-parkgate.html
  - v4-preview/direct/index.html
  - v4-preview/404.html
  - v4-preview/assets/pepper-knowledge.json

Does NOT touch live root pages or v3-preview/.
"""
import html
import json
import os
import re
from datetime import datetime, timezone

E = html.escape
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "v4-preview")

with open(os.path.join(ROOT, "data", "properties.json"), encoding="utf-8") as f:
    PROPS_DATA = json.load(f)

PRICES_PATH = os.path.join(ROOT, "data", "prices.json")
PRICES_DATA = {}
if os.path.exists(PRICES_PATH):
    with open(PRICES_PATH, encoding="utf-8") as f:
        PRICES_DATA = json.load(f)

MANIFEST_PATH = os.path.join(OUT, "photos", "manifest.json")
with open(MANIFEST_PATH, encoding="utf-8") as f:
    PHOTO_MANIFEST = json.load(f)

ORDER = ["603326", "603323", "728474"]
OWNER_TERMS = PROPS_DATA["ownerTerms"]
CONTACT = PROPS_DATA["contact"]
EMAIL = CONTACT["email"]
SOCIAL = CONTACT["social"]
PRIVACY = "https://oilgaterealty.com/en/privacy-policy"

AKRON = {
    "lock3": {
        "label": "Lock 3 Canal",
        "path": "samples/img/akron-lock3-canal.webp",
        "w": 1400, "h": 1050,
        "alt": "Downtown Akron skyline and brick buildings along the Lock 3 canal at dusk",
        "credit": "Dillguy9, CC0",
        "url": "https://commons.wikimedia.org/wiki/File:Lock_3,_Canal_Square,_%26_Civic_Theatre.jpg",
    },
    "museum": {
        "label": "Akron Art Museum",
        "path": "v3-preview/img/akron-art-museum.webp",
        "w": 1400, "h": 788,
        "alt": "Modern glass and steel roof of the Akron Art Museum in downtown Akron",
        "credit": "Dillguy9, CC0",
        "url": "https://commons.wikimedia.org/wiki/File:Akron_Art_Museum_May_2024.jpg",
    },
    "evening": {
        "label": "Evening Skyline",
        "path": "v3-preview/img/akron-evening-skyline.webp",
        "w": 1400, "h": 647,
        "alt": "Downtown Akron skyline glowing at golden hour",
        "credit": "Dillguy9, CC0",
        "url": "https://commons.wikimedia.org/wiki/File:Akron,_Ohio,_Evening_Skyline.jpg",
    },
    "civic": {
        "label": "Civic Theatre",
        "path": "v3-preview/img/akron-civic-stage.webp",
        "w": 1400, "h": 1050,
        "alt": "Akron Civic Theatre marquee and Knight Stage in downtown Akron",
        "credit": "Dillguy9, CC0",
        "url": "https://commons.wikimedia.org/wiki/File:Akron_Civic_Theatre_and_Knight_Stage.jpg",
    },
}

# Verified unit facts and highlights per LaVante's Nov 22 review
STAY_EXTRAS = {
    "603326": {
        "place": "Oakdale",
        "card_img": "v4-preview/photos/u1/about.webp",
        "card_alt": "Oakdale Unit 1 living room with original wood coffered ceilings",
        "thumb_img": "v4-preview/photos/u1/hero.webp",
        "thumb_alt": "Front exterior of Oakdale Unit 1",
        "bed_summary": "2 double, 1 queen",
        "highlights": [
            "Free cable including pay-per-view & Fire TV in every bedroom",
            "Dedicated workspace in each bedroom",
            "Full private kitchen & original wood coffered ceilings",
            "1 bathroom & smart home entry",
        ],
        "picker_summary": "3 Bedrooms · 3 Beds (2 double, 1 queen) · 1 Bathroom · Smart home entry, free cable + PPV, workspace in each bedroom, full private kitchen.",
        "about_paras": [
            "Welcome to Oakdale Unit 1, a cozy, private first-floor home featuring three comfortable bedrooms, each equipped with blackout curtains, a dedicated workspace, and a Fire TV with free cable including pay-per-view.",
            "Relax in the living room beneath original wood coffered ceilings, cook in your full private kitchen, and enjoy seamless smart home entry just minutes from Akron's favorite spots.",
        ],
    },
    "603323": {
        "place": "Oakdale",
        "card_img": "v4-preview/photos/u2/about.webp",
        "card_alt": "Oakdale Unit 2 Penthouse Suite spanning the entire upper floor",
        "thumb_img": "v4-preview/photos/u2/hero.webp",
        "thumb_alt": "Exterior view of Oakdale Unit 2",
        "bed_summary": "2 double, 1 queen",
        "highlights": [
            "PENTHOUSE SUITE — a huge bedroom spanning the whole upper floor",
            "Separate dining room & full private kitchen",
            "Workspace in each bedroom & free cable including pay-per-view",
            "1 bathroom, dedicated driveway parking & smart home entry",
        ],
        "picker_summary": "3 Bedrooms · 3 Beds (2 double, 1 queen) · 1 Bathroom · Massive Penthouse Suite spanning the whole upper floor, separate dining room, workspaces, free cable + PPV, smart home entry.",
        "about_paras": [
            "Welcome to Oakdale Unit 2, a spacious upper-level private stay highlighted by the PENTHOUSE SUITE — a huge bedroom that spans the entire upper floor for unmatched space and privacy.",
            "Every bedroom includes a comfortable bed, blackout curtains, a workspace, and Fire TV with free cable including pay-per-view. Enjoy a full private kitchen, cozy living room, separate dining room, dedicated driveway parking, and smart home entry.",
        ],
    },
    "728474": {
        "place": "Parkgate",
        "card_img": "v4-preview/photos/pg/about.webp",
        "card_alt": "Completely renovated Parkgate living room with fireplace and sofa",
        "thumb_img": "v4-preview/photos/pg/hero.webp",
        "thumb_alt": "Front exterior of Oilgate at Parkgate",
        "bed_summary": "2 queen, 1 full",
        "highlights": [
            "Completely renovated 3-bedroom home (2 queen, 1 full)",
            "75-inch TV with free cable including pay-per-view & fast Wi-Fi",
            "Full renovated kitchen with stainless appliances, private deck & big yard",
            "1 bathroom & smart home entry",
        ],
        "picker_summary": "3 Bedrooms · 3 Beds (2 queen, 1 full) · 1 Bathroom · Completely renovated home with smart home entry, 75-inch TV + free cable & PPV, private deck, and big yard.",
        "about_paras": [
            "Welcome to Oilgate at Parkgate, a completely renovated 3-bedroom home (2 queen beds, 1 full bed, 1 bathroom) designed for effortless comfort in one of Akron's favorite neighborhoods.",
            "Enjoy brand-new stainless appliances, luxury bedding, blackout curtains, a 75-inch TV with free cable and pay-per-view, fast Wi-Fi, smart home entry, a private deck, big backyard, and on-site parking.",
        ],
    },
}

# Exact 5 ticker items requested by LaVante (removed "Free parking included" & "Direct booking")
MARQUEE_ITEMS = [
    "Minutes to Highland Square and downtown Akron",
    "3-bedroom private homes",
    "Akron, Ohio",
    "Full private kitchens",
    "Cable TV, free pay-per-view, fast Wi-Fi, free parking",
]

RULES_SUMMARY = [
    ("Check-in & checkout", "Door code sent at 2:45 PM. Check-in from 3:00 PM; checkout by 11:00 AM (Akron local time)."),
    ("Guests 18+", "The person booking must be 18 or older."),
    ("No parties", "Up to 3 visitors at a time. No overnight visitors unless approved and paid for in advance."),
    ("Quiet hours", "10:00 PM to 10:00 AM, out of respect for neighbors."),
    ("Smoke-free & pet-free", "No cigarette smoking in the home. No pets allowed."),
    ("Parking", "Free parking at every home: Unit 2 uses the driveway, Unit 1 uses street parking, and Parkgate offers driveway or street parking."),
    ("Smart home entry", "Keyless smart lock access at every home — your personal door code arrives at 2:45 PM on check-in day."),
    ("Damage & liability", OWNER_TERMS["liability"]),
]

FAQ_ITEMS = [
    (
        "Are there any cleaning fees?",
        "No cleaning fees, ever — unless house rules are broken.",
    ),
    (
        "When do I get my smart lock door code?",
        "Your personal door code is sent at 2:45 PM on check-in day. Check-in starts at 3:00 PM and checkout is 11:00 AM (Akron local time).",
    ),
    (
        "Are these private 3-bedroom homes?",
        "Yes. You reserve the entire private 3-bedroom, 1-bathroom home or unit with your own full private kitchen and smart home entry.",
    ),
    (
        "What entertainment and Wi-Fi are included?",
        "Every home includes free cable TV with free pay-per-view, fast Wi-Fi, and dedicated workspaces.",
    ),
    (
        "Are pets allowed?",
        "No. All three Akron homes are pet-free.",
    ),
    (
        "How do I reserve and see my live total?",
        "Choose your stay, check-in and check-out dates, and guest count at the top of the page, then click Reserve to view live pricing and complete checkout.",
    ),
]


def rel(path_from_repo_root, depth=1):
    if path_from_repo_root.startswith("http"):
        return path_from_repo_root
    if path_from_repo_root.startswith("v4-preview/"):
        sub = path_from_repo_root[len("v4-preview/"):]
        return ("../" * (depth - 1)) + sub
    return ("../" * depth) + path_from_repo_root


def prop_facts_lower(p):
    return f"{p['bedrooms']} bedrooms · {p['beds']} beds · {p['bathrooms']} bath · up to {p['maxGuests']} guests"


def prop_facts_booking_box(p):
    """Capitalized Bedrooms, Beds, Bathrooms strictly inside the Find your dates box."""
    ba = "Bathroom" if p["bathrooms"] == 1 else "Bathrooms"
    return f"{p['bedrooms']} Bedrooms · {p['beds']} Beds · {p['bathrooms']} {ba} · Up to {p['maxGuests']} Guests"


def clean_amenities(p):
    has_bathtub_fact = any("bathtub" in (q.get("answer", "").lower()) for q in p.get("publicFacts", []))
    cleaned = {}
    for group, items in p.get("amenities", {}).items():
        vals = []
        for item in items:
            low = item.strip().lower()
            if low == "hot tub" and has_bathtub_fact:
                vals.append("Bathtub")
            elif low == "2 bedroom" and p["bedrooms"] == 3:
                vals.append("3 Bedroom")
            elif low == "tv (cable)":
                vals.append("Cable TV & Free Pay-Per-View")
            else:
                vals.append(item)
        if vals:
            cleaned[group] = vals
    cleaned.setdefault("entry", []).append("Smart Home Keyless Entry")
    return cleaned


def is_fresh_prices():
    checked_at = PRICES_DATA.get("checkedAt")
    if not checked_at:
        return False
    try:
        dt = datetime.fromisoformat(checked_at.replace("Z", "+00:00"))
        age_h = (datetime.now(timezone.utc) - dt).total_seconds() / 3600.0
        return age_h <= float(PRICES_DATA.get("freshnessHours", 48))
    except Exception:
        return False


def format_baked_price(prop_id_or_all, channel):
    if not is_fresh_prices():
        return "—"
    if prop_id_or_all == "all":
        avg = PRICES_DATA.get("averages", {}).get(channel, {}).get("averageNightly")
        if not isinstance(avg, (int, float)):
            vals = [
                p.get("channels", {}).get(channel, {}).get("averageNightly")
                for p in PRICES_DATA.get("properties", {}).values()
            ]
            vals = [v for v in vals if isinstance(v, (int, float)) and v > 0]
            avg = (sum(vals) / len(vals)) if vals else None
    else:
        avg = PRICES_DATA.get("properties", {}).get(prop_id_or_all, {}).get("channels", {}).get(channel, {}).get("averageNightly")
    if isinstance(avg, (int, float)) and avg > 0:
        return f"${round(avg)}"
    return "—"


def header_html(depth=1, is_home=False):
    home_href = "index.html" if depth == 1 else "../index.html"
    prefix = "" if is_home else home_href
    logo_src = rel("previews/img/ovr-primary.webp", depth)
    return f"""<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <div class="top-inner">
    <a class="plate" href="{home_href}" aria-label="Oilgate Vacation Rentals home">
      <img src="{logo_src}" width="720" height="181" alt="Oilgate Vacation Rentals">
    </a>
    <p class="top-location">Akron, Ohio</p>
    <nav aria-label="Main">
      <ul>
        <li><a href="{prefix}#rentals">Rentals</a></li>
        <li><a href="{prefix}#experience">Experience</a></li>
        <li><a href="{prefix}#pricing">Pricing</a></li>
        <li><a href="{prefix}#faq">FAQ</a></li>
      </ul>
    </nav>
  </div>
</header>"""


def booking_form_html(prefix, depth=1, fixed_property_id=None):
    guests_opts = "".join(
        f'<option value="{n}"{" selected" if n == 2 else ""}>{n} guest{"s" if n > 1 else ""}</option>'
        for n in range(1, 7)
    )
    if fixed_property_id:
        p = PROPS_DATA["properties"][fixed_property_id]
        stay_block = f'<input type="hidden" name="stay" value="{E(fixed_property_id)}">'
        stay_summary = f'<p class="bfield-label" style="margin:0;color:var(--gold-soft)">{E(p["name"])} · {E(prop_facts_booking_box(p))}</p>'
    else:
        first_id = ORDER[0]
        first_p = PROPS_DATA["properties"][first_id]
        first_ex = STAY_EXTRAS[first_id]
        options_html = []
        for idx, pid in enumerate(ORDER):
            p = PROPS_DATA["properties"][pid]
            ex = STAY_EXTRAS[pid]
            img_src = rel(ex["thumb_img"], depth)
            sel = "true" if idx == 0 else "false"
            options_html.append(
                f'<li id="{prefix}-opt-{pid}" class="stay-option{" is-active" if idx == 0 else ""}" '
                f'role="option" aria-selected="{sel}" '
                f'data-id="{pid}" data-name="{E(p["name"])}" '
                f'data-facts="{E(prop_facts_booking_box(p))}" '
                f'data-img="{E(img_src)}" data-alt="{E(ex["thumb_alt"])}" '
                f'data-summary="{E(ex["picker_summary"])}">'
                f'<img class="stay-option-thumb" src="{E(img_src)}" width="120" height="80" alt="" aria-hidden="true">'
                f'<span class="stay-option-body"><strong>{E(p["name"])}</strong><span>{E(prop_facts_booking_box(p))}</span></span>'
                f"</li>"
            )
        first_src = rel(first_ex["thumb_img"], depth)
        stay_summary = ""
        stay_block = f"""<div class="bfield book-stay-row">
          <span class="bfield-label" id="{prefix}-stay-lbl">Choose your stay</span>
          <div class="stay-picker" data-stay-picker>
            <input type="hidden" name="stay" value="{first_id}">
            <button type="button" class="stay-trigger" role="combobox" aria-labelledby="{prefix}-stay-lbl" aria-haspopup="listbox" aria-expanded="false" aria-controls="{prefix}-listbox">
              <img class="stay-trigger-thumb" src="{E(first_src)}" width="72" height="60" alt="{E(first_ex['thumb_alt'])}">
              <span class="stay-trigger-text">
                <span class="stay-trigger-name">{E(first_p['name'])}</span>
                <span class="stay-trigger-meta">{E(prop_facts_booking_box(first_p))}</span>
              </span>
            </button>
            <div class="stay-popover" hidden>
              <ul id="{prefix}-listbox" class="stay-options" role="listbox" tabindex="-1" aria-labelledby="{prefix}-stay-lbl" aria-activedescendant="{prefix}-opt-{first_id}">
                {''.join(options_html)}
              </ul>
              <div class="stay-preview" aria-live="polite">
                <img data-preview-img src="{E(first_src)}" width="420" height="280" alt="{E(first_ex['thumb_alt'])}">
                <div class="stay-preview-cap">
                  <strong data-preview-title>{E(first_p['name'])}</strong>
                  <p data-preview-desc>{E(first_ex['picker_summary'])}</p>
                </div>
              </div>
            </div>
          </div>
        </div>"""

    return f"""<div class="glass-book">
  <form data-book aria-labelledby="{prefix}-dates-title">
    <fieldset class="book-stack">
      <legend class="sr">Choose your stay and find your dates</legend>
      {stay_block}
      {stay_summary}
      <h2 id="{prefix}-dates-title" class="book-dates-heading">Find your dates</h2>
      <div class="book-fields-row">
        <div class="bfield">
          <label for="{prefix}-in">Check in</label>
          <input id="{prefix}-in" name="arrival" type="date" required>
        </div>
        <div class="bfield">
          <label for="{prefix}-out">Check out</label>
          <input id="{prefix}-out" name="departure" type="date" required>
        </div>
        <div class="bfield">
          <label for="{prefix}-guests">Guests</label>
          <select id="{prefix}-guests" name="guests">{guests_opts}</select>
        </div>
        <button type="submit" class="btn-reserve">Reserve</button>
      </div>
    </fieldset>
    <p class="book-msg" data-book-msg role="status" aria-live="polite"></p>
  </form>
</div>"""


def marquee_html():
    spans = "".join(f"<span>{E(item)} ✦</span>" for item in MARQUEE_ITEMS * 3)
    return f'<div class="marquee" aria-hidden="true"><div class="run">{spans}</div></div>'


def pricing_section_html(depth=1, only_property_id=None):
    prices_url = rel("data/prices.json", depth)
    checked_at = PRICES_DATA.get("checkedAt", "")
    checked_date = PRICES_DATA.get("checkedDate", "")
    pretty_date = ""
    if checked_date and is_fresh_prices():
        try:
            pretty_date = "Updated " + datetime.strptime(checked_date, "%Y-%m-%d").strftime("%b %d, %Y").replace(" 0", " ")
        except Exception:
            pretty_date = f"Updated {checked_date}"

    target = only_property_id if only_property_id else "all"
    heading = f"{E(PROPS_DATA['properties'][only_property_id]['name'])} pricing" if only_property_id else "Compare with real numbers"
    channels = [
        ("direct", "Our site", "vacationrentals.oilgaterealty.com", True),
        ("airbnb", "Airbnb", "", False),
        ("vrbo", "Vrbo", "", False),
        ("booking", "Booking.com", "", False),
    ]
    tiles = []
    for ch_key, ch_name, ch_domain, is_direct in channels:
        val = format_baked_price(target, ch_key)
        domain_html = f'<span class="price-domain">{E(ch_domain)}</span>' if ch_domain else ""
        cls = "price-tile is-direct" if is_direct else "price-tile"
        if is_direct:
            tiles.append(
                f'<a class="{cls}" href="#availability">'
                f'<div><span class="price-site">{E(ch_name)}</span>{domain_html}</div>'
                f'<span class="price-val" data-price-val data-prop="{E(target)}" data-channel="{ch_key}">{E(val)}</span>'
                f"</a>"
            )
        else:
            tiles.append(
                f'<div class="{cls}">'
                f'<div><span class="price-site">{E(ch_name)}</span>{domain_html}</div>'
                f'<span class="price-val" data-price-val data-prop="{E(target)}" data-channel="{ch_key}">{E(val)}</span>'
                f"</div>"
            )

    return f"""<section class="sec-wrap" id="pricing" aria-labelledby="cmp-title" data-prices-url="{E(prices_url)}" data-baked-checked-at="{E(checked_at)}">
  <div class="glass-panel compare-panel">
    <div class="compare-head">
      <div>
        <p class="label">Pricing</p>
        <h2 class="sec-title" id="cmp-title">{heading}</h2>
      </div>
      <div class="compare-badge">
        <strong>7-night average</strong>
        <span data-prices-checked>{E(pretty_date)}</span>
      </div>
    </div>
    <div class="price-cards-row">
      {''.join(tiles)}
    </div>
  </div>
</section>"""


def before_you_book_html():
    rules_items = "".join(f"<div><dt>{E(t)}</dt><dd>{E(d)}</dd></div>" for t, d in RULES_SUMMARY)
    return f"""<section class="sec-wrap" id="rental-terms" aria-labelledby="rt">
  <div class="glass-panel rules-panel">
    <div class="info-grid">
      <div>
        <p class="label">Before you book</p>
        <h2 class="sec-title" id="rt">Rules and terms</h2>
        <p class="info-lead">Minimum booking age is {OWNER_TERMS['minimumAge']}.</p>
        <p class="info-text">{E(OWNER_TERMS['liability'])}</p>
        <div class="promise-square">
          <p class="promise-main">No cleaning fees, ever.</p>
          <p class="promise-exception"><b>★</b>Unless house rules are broken.</p>
        </div>
      </div>
      <div>
        <dl class="rules-dl">{rules_items}</dl>
      </div>
    </div>
  </div>
</section>"""


def faq_section_html():
    items = "".join(f"<details><summary>{E(q)}</summary><p>{E(a)}</p></details>" for q, a in FAQ_ITEMS)
    return f"""<span id="questions"></span>
<section class="faq-wrap" id="faq" aria-labelledby="fq">
  <div class="glass-panel faq-panel">
    <p class="label">Good to know</p>
    <h2 class="sec-title" id="fq">Questions, answered</h2>
    <div class="faq">{items}</div>
  </div>
</section>"""


def footer_html(credit_keys, depth=1):
    logo_crew = rel("v4-preview/img/logo-crew.webp", depth)
    logo_realty = rel("v4-preview/img/logo-realty-light.webp", depth)
    logo_ai = rel("v4-preview/img/logo-ai.webp", depth)
    seen = []
    for k in credit_keys:
        if k in AKRON and k not in seen:
            seen.append(k)
    akron_credits = " · ".join(
        f'<a href="{E(AKRON[k]["url"])}" target="_blank" rel="noopener noreferrer">{E(AKRON[k]["label"])} ({E(AKRON[k]["credit"])})</a>'
        for k in seen
    )
    credits_line = f'<p class="footer-credits">Akron photos (Wikimedia Commons): {akron_credits}</p>' if akron_credits else ""
    return f"""<footer class="site-footer" id="contact">
  <div class="footer-slim">
    <div class="footer-logos" aria-label="Oilgate Crew x Oilgate Realty x Oilgate AI">
      <img class="logo-crew" src="{E(logo_crew)}" width="120" height="268" alt="Oilgate Crew">
      <span class="footer-x" aria-hidden="true">×</span>
      <img class="logo-realty" src="{E(logo_realty)}" width="140" height="130" alt="Oilgate Realty">
      <span class="footer-x" aria-hidden="true">×</span>
      <img class="logo-ai" src="{E(logo_ai)}" width="150" height="121" alt="Oilgate AI">
    </div>
    <div class="footer-meta">
      <a href="mailto:{E(EMAIL)}">Contact: {E(EMAIL)}</a>
      <span>·</span>
      <a href="{E(PRIVACY)}" target="_blank" rel="noopener noreferrer">Privacy</a>
      <span>·</span>
      <span>© 2026 Oilgate Realty</span>
    </div>
  </div>
  {credits_line}
</footer>"""


def page_shell(title, desc, body_html, credit_keys, depth=1, is_home=False, property_id="", og_img="v4-preview/photos/u1/hero.webp"):
    css_href = rel("v4-preview/assets/v4.css", depth)
    pepper_css = rel("v4-preview/assets/pepper.css", depth)
    js_href = rel("v4-preview/assets/v4.js", depth)
    pepper_js = rel("v4-preview/assets/pepper.js", depth)
    fav_href = rel("assets/favicon-48.png", depth)
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<meta property="og:title" content="{E(title)}">
<meta property="og:description" content="{E(desc)}">
<meta property="og:image" content="https://oilgaterealty.github.io/oilgate-vacation-rentals/{E(og_img)}">
<link rel="icon" href="{E(fav_href)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="{E(css_href)}">
<link rel="stylesheet" href="{E(pepper_css)}">
<script src="{E(js_href)}" defer></script>
<script type="module" src="{E(pepper_js)}"></script>
</head>
<body>
<div class="ambient-bg" aria-hidden="true">
  <canvas id="beams-canvas"></canvas>
  <div class="ambient-grain"></div>
</div>
{header_html(depth=depth, is_home=is_home)}
<main id="main">
{body_html}
</main>
{footer_html(credit_keys, depth=depth)}
<aside data-concierge data-property="{E(property_id)}" aria-label="Pepper concierge"></aside>
</body>
</html>
"""


def build_homepage():
    hero_bg = AKRON["lock3"]
    exp_img = AKRON["museum"]
    cards = []
    for pid in ORDER:
        p = PROPS_DATA["properties"][pid]
        ex = STAY_EXTRAS[pid]
        hi_li = "".join(f"<li>{E(h)}</li>" for h in ex["highlights"])
        cards.append(f"""<a class="card" href="{E(p['page'])}">
  <div class="card-media">
    <img src="{E(rel(ex['card_img'], 1))}" width="1100" height="825" alt="{E(ex['card_alt'])}" loading="lazy" decoding="async">
    <span class="rib">{E(ex['place'].upper())}</span>
  </div>
  <div class="card-body">
    <h3>{E(p['name'])}</h3>
    <p class="card-facts">{E(prop_facts_lower(p))}</p>
    <ul class="card-highlights">{hi_li}</ul>
    <span class="card-cta">Explore &amp; reserve →</span>
  </div>
</a>""")

    body = f"""<section class="hero" id="availability" aria-labelledby="hero-title">
  <img class="hero-bg" src="{E(rel(hero_bg['path'], 1))}" width="{hero_bg['w']}" height="{hero_bg['h']}" alt="{E(hero_bg['alt'])}" fetchpriority="high">
  <div class="c">
    <h1 id="hero-title">More than just a stay in Akron.</h1>
    <p class="l">Cable TV · Free pay-per-view · Fast Wi-Fi · Free parking</p>
    {booking_form_html("home", depth=1)}
    <p class="slogan-chip"><b>★</b> No cleaning fees, ever.</p>
  </div>
</section>
{marquee_html()}
<section class="sec-wrap" id="rentals" aria-labelledby="st">
  <div class="rentals-grid">
    <div class="glass-panel rentals-intro">
      <p class="label">Rentals</p>
      <h2 class="sec-title" id="st">Pick your home base</h2>
      <div class="rule"></div>
      <p class="note">Two private 3-bedroom Oakdale units and our completely renovated 3-bedroom Parkgate home. Every stay includes 1 bathroom, smart home entry, and space for up to 6 guests.</p>
      <a class="btn-reserve" href="#availability">Reserve</a>
    </div>
    <div class="cards">{''.join(cards)}</div>
  </div>
</section>
<section class="sec-wrap" id="experience" aria-labelledby="dy">
  <div class="glass-panel experience-panel">
    <div class="day-grid">
      <figure class="day-window">
        <img src="{E(rel(exp_img['path'], 1))}" width="{exp_img['w']}" height="{exp_img['h']}" alt="{E(exp_img['alt'])}" loading="lazy" decoding="async">
        <figcaption>Akron Art Museum — minutes from every Oilgate home</figcaption>
      </figure>
      <div>
        <p class="label">The experience</p>
        <h2 class="sec-title" id="dy">An easy Akron day</h2>
        <ol class="timeline">
          <li><time>2:45 PM</time><div><strong>Door code sent</strong><p>Your personal smart home entry code arrives before arrival.</p></div></li>
          <li><time>3:00 PM</time><div><strong>Check-in</strong><p>Step straight into your private 3-bedroom home — keyless, seamless, ready.</p></div></li>
          <li><time>11:00 AM</time><div><strong>Checkout</strong><p>Simple 11:00 AM departure with no cleaning fees, ever.</p></div></li>
        </ol>
        <div class="nearby-box">
          <h3>Right around the corner</h3>
          <p>Minutes from Akron’s famous Swenson’s, Highland Square, LeBron James’ I PROMISE School, the LeBron James Home Court museum, and Blossom Music Center.</p>
        </div>
      </div>
    </div>
  </div>
</section>
{pricing_section_html(depth=1)}
{before_you_book_html()}
{faq_section_html()}"""

    html_doc = page_shell(
        title="Oilgate Vacation Rentals | More than just a stay in Akron.",
        desc="More than just a stay in Akron. Three private 3-bedroom homes with Cable TV, free pay-per-view, fast Wi-Fi, free parking, smart home entry, and no cleaning fees, ever.",
        body_html=body,
        credit_keys=["lock3", "museum"],
        depth=1,
        is_home=True,
    )
    with open(os.path.join(OUT, "index.html"), "w", encoding="utf-8") as f:
        f.write(html_doc)


def build_photo_tour_html(pid, prop_name):
    manifest = PHOTO_MANIFEST[pid]
    cats = manifest["categories"]
    total_photos = sum(len(c["photos"]) for c in cats)

    pills = []
    sections = []
    all_grid = []

    for c in cats:
        cname = c["name"]
        cslug = c["slug"]
        photos = c["photos"]
        if not photos:
            continue
        display_name = "Bedroom 1 · Penthouse Suite" if (pid == "603323" and cname == "Bedroom 1") else cname
        pills.append(f'<a class="tour-pill" href="#tour-{E(cslug)}">{E(display_name)} ({len(photos)})</a>')

        cards = []
        for idx, ph in enumerate(photos, start=1):
            src = rel(ph["src"], 1)
            alt = ph["alt"]
            cards.append(
                f'<figure class="kinetic-card">'
                f'<button type="button" data-lightbox-src="{E(src)}" data-lightbox-alt="{E(alt)}" data-lightbox-cat="{E(display_name)}" aria-label="View {E(alt)}">'
                f'<img src="{E(src)}" width="{ph["w"]}" height="{ph["h"]}" alt="{E(alt)}" loading="lazy" decoding="async">'
                f'<figcaption>{E(alt)}</figcaption>'
                f"</button></figure>"
            )
            all_grid.append(
                f'<figure data-lightbox-src="{E(src)}" data-lightbox-alt="{E(alt)}" data-lightbox-cat="{E(display_name)}">'
                f'<img src="{E(src)}" width="{ph["w"]}" height="{ph["h"]}" alt="{E(alt)}" loading="lazy" decoding="async">'
                f'<figcaption><strong>{E(display_name)}</strong> · {E(alt)}</figcaption></figure>'
            )

        sections.append(f"""<div class="tour-category" id="tour-{E(cslug)}" data-kinetic-gallery>
  <div class="tour-cat-head">
    <h3>{E(display_name)}<span class="tour-cat-count">{len(photos)} photo{"s" if len(photos) != 1 else ""}</span></h3>
    <div class="kinetic-nav">
      <button type="button" class="kinetic-btn" data-kinetic-prev aria-label="Scroll {E(display_name)} left">‹</button>
      <button type="button" class="kinetic-btn" data-kinetic-next aria-label="Scroll {E(display_name)} right">›</button>
    </div>
  </div>
  <div class="kinetic-track" data-kinetic-track tabindex="0" aria-label="{E(display_name)} kinetic scroll gallery">
    {''.join(cards)}
  </div>
</div>""")

    tour_html = f"""<section class="sec-wrap" id="photos" aria-labelledby="ph-title">
  <div class="glass-panel tour-panel">
    <div class="tour-top">
      <div>
        <p class="label">Photo tour</p>
        <h2 class="sec-title" id="ph-title">Explore every room</h2>
      </div>
      <button type="button" class="btn-ghost" data-open-all-photos>See all {total_photos} photos</button>
    </div>
    <nav class="tour-pills" aria-label="Photo tour rooms">
      {''.join(pills)}
    </nav>
    {''.join(sections)}
  </div>
</section>
<div id="all-photos-modal" class="all-photos-modal" role="dialog" aria-modal="true" aria-label="All photos of {E(prop_name)}" hidden>
  <div class="modal-bar">
    <h2>All {total_photos} photos · {E(prop_name)}</h2>
    <button type="button" class="modal-close" data-close-modal aria-label="Close all photos">&times;</button>
  </div>
  <div class="all-photos-grid">
    {''.join(all_grid)}
  </div>
</div>
<div id="lightbox-modal" class="lightbox-modal" role="dialog" aria-modal="true" aria-label="Photo viewer" hidden>
  <div class="modal-bar">
    <span data-lb-count style="color:var(--gold);font-weight:700"></span>
    <button type="button" class="modal-close" data-lb-close aria-label="Close photo viewer">&times;</button>
  </div>
  <div class="lightbox-stage">
    <button type="button" class="kinetic-btn" data-lb-prev aria-label="Previous photo">‹</button>
    <img data-lb-img alt="" loading="lazy">
    <button type="button" class="kinetic-btn" data-lb-next aria-label="Next photo">›</button>
  </div>
  <p class="lightbox-cap" data-lb-cap></p>
</div>"""
    return tour_html, total_photos


def build_rental_page(pid):
    p = PROPS_DATA["properties"][pid]
    ex = STAY_EXTRAS[pid]
    manifest = PHOTO_MANIFEST[pid]
    hero_ph = manifest["hero"]
    about_ph = manifest["about"]
    amenities = clean_amenities(p)
    raw_rules = [re.sub(r"^\d+\.\s*", "", x.strip()) for x in re.split(r"\n\s*\n", p.get("houseRules", "")) if x.strip()]
    # Keep rules accurate while stripping shared-space language
    rules = [r for r in raw_rules if not re.search(r"shared|both units|other unit", r, re.I)]
    parking_rule = next((r for r in raw_rules if "Park in designated" in r), "Free on-site/street parking available.")
    policies = [(k, re.sub(r"\.([A-Z])", r". \1", v)) for k, v in p.get("policies", {}).items() if k != "Security deposit"]
    tour_html, total_photos = build_photo_tour_html(pid, p["name"])

    amenity_blocks = []
    for grp, vals in amenities.items():
        grp_title = grp.replace("-", " ")
        li = "".join(f"<li>{E(v)}</li>" for v in vals)
        amenity_blocks.append(f'<div class="amenity-group"><h3>{E(grp_title)}</h3><ul>{li}</ul></div>')

    policy_blocks = "".join(
        f'<div class="policy-card"><h3>{E(k)}</h3><p>{E(v)}</p></div>'
        for k, v in policies
    )

    hi_stats = "".join(f"<li>{E(h)}</li>" for h in ex["highlights"])

    body = f"""<section class="hero hero--unit" id="availability" aria-labelledby="hero-title">
  <img class="hero-bg" src="{E(rel(hero_ph['src'], 1))}" width="{hero_ph['w']}" height="{hero_ph['h']}" alt="{E(hero_ph['alt'])}" fetchpriority="high">
  <div class="c">
    <h1 id="hero-title">{E(p['name'])}</h1>
    <p class="l">{E(prop_facts_lower(p))} · {E(ex['bed_summary'])} · Smart home entry</p>
    <ul class="hero-stats">{hi_stats}</ul>
    {booking_form_html(f"stay-{pid}", depth=1, fixed_property_id=pid)}
    <p class="slogan-chip"><b>★</b> No cleaning fees, ever.</p>
  </div>
</section>
{marquee_html()}
<section class="sec-wrap" id="overview" aria-labelledby="ov-title">
  <div class="overview-grid">
    <div class="glass-panel about-box">
      <p class="label">Make yourself at home</p>
      <h2 class="sec-title" id="ov-title">About {E(p['name'])}</h2>
      <div class="rule"></div>
      {''.join(f'<p style="color:var(--muted-light);margin:0 0 12px">{E(para)}</p>' for para in ex['about_paras'])}
      <figure class="about-photo">
        <img src="{E(rel(about_ph['src'], 1))}" width="{about_ph['w']}" height="{about_ph['h']}" alt="{E(about_ph['alt'])}" loading="lazy" decoding="async">
      </figure>
      <div style="display:flex;flex-wrap:wrap;gap:12px">
        <a class="btn-reserve" href="#photos">Tour all {total_photos} photos</a>
        <button type="button" class="btn-ghost" data-open-all-photos>See all photos</button>
      </div>
    </div>
    <aside class="glass-panel arrival-card" aria-label="Arrival details">
      <h3>Plan your arrival</h3>
      <p><strong>Door code sent:</strong> 2:45 PM</p>
      <p><strong>Check-in:</strong> 3:00 PM · <strong>Checkout:</strong> 11:00 AM (Akron local time)</p>
      <p><strong>Layout:</strong> {E(prop_facts_lower(p))}</p>
      <p><strong>Beds:</strong> {E(ex['bed_summary'])}</p>
      <p><strong>Entry:</strong> Smart home keyless entry</p>
      <p><strong>Parking:</strong> {E(parking_rule)}</p>
      <p><strong>Pets:</strong> Pets are not allowed.</p>
      <p><strong>Contact:</strong> <a href="mailto:{E(EMAIL)}">{E(EMAIL)}</a></p>
      <p style="margin-top:16px"><a class="btn-reserve" href="#availability">Reserve</a></p>
    </aside>
  </div>
</section>
{tour_html}
<section class="sec-wrap" id="amenities" aria-labelledby="am-title">
  <div class="glass-panel" style="padding:clamp(22px,3.4vw,38px)">
    <p class="label">The details</p>
    <h2 class="sec-title" id="am-title">What’s included</h2>
    <div class="amenity-groups">{''.join(amenity_blocks)}</div>
  </div>
</section>
{pricing_section_html(depth=1, only_property_id=pid)}
<section class="sec-wrap" id="house-rules" aria-labelledby="hr-title">
  <div class="glass-panel" style="padding:clamp(22px,3.4vw,38px)">
    <p class="label">A good stay starts here</p>
    <h2 class="sec-title" id="hr-title">House rules</h2>
    <p class="note">Door code sent 2:45 PM · Check-in 3:00 PM · Checkout 11:00 AM (Akron local time)</p>
    <ol class="rules-bullets">{''.join(f'<li>{E(r)}</li>' for r in rules)}</ol>
  </div>
</section>
{before_you_book_html()}
<section class="sec-wrap" id="policies" aria-labelledby="pol-title">
  <div class="glass-panel" style="padding:clamp(22px,3.4vw,38px)">
    <p class="label">Reservation terms</p>
    <h2 class="sec-title" id="pol-title">Booking policies</h2>
    <div class="policy-grid">{policy_blocks}</div>
  </div>
</section>
{faq_section_html()}"""

    html_doc = page_shell(
        title=f"{p['name']} · 3-Bedroom Akron Rental | Oilgate Vacation Rentals",
        desc=f"{p['name']}: {prop_facts_lower(p)}. Categorized room photo tour, Cable TV + free pay-per-view, smart home entry, and no cleaning fees, ever.",
        body_html=body,
        credit_keys=[],
        depth=1,
        is_home=False,
        property_id=pid,
        og_img=hero_ph["src"],
    )
    with open(os.path.join(OUT, p["page"]), "w", encoding="utf-8") as f:
        f.write(html_doc)


def build_direct_page():
    direct_dir = os.path.join(OUT, "direct")
    os.makedirs(direct_dir, exist_ok=True)
    hero_bg = AKRON["evening"]
    body = f"""<section class="hero hero--compact" id="availability" aria-labelledby="hero-title">
  <img class="hero-bg" src="{E(rel(hero_bg['path'], 2))}" width="{hero_bg['w']}" height="{hero_bg['h']}" alt="{E(hero_bg['alt'])}" fetchpriority="high">
  <div class="c">
    <h1 id="hero-title">More than just a stay in Akron.</h1>
    <p class="l">Cable TV · Free pay-per-view · Fast Wi-Fi · Free parking</p>
    {booking_form_html("direct", depth=2)}
    <p class="slogan-chip"><b>★</b> No cleaning fees, ever.</p>
  </div>
</section>
{marquee_html()}
{pricing_section_html(depth=2)}
{before_you_book_html()}"""

    html_doc = page_shell(
        title="Reserve Direct | Oilgate Vacation Rentals · Akron, Ohio",
        desc="Book directly at vacationrentals.oilgaterealty.com for three private 3-bedroom Akron homes with no cleaning fees, ever.",
        body_html=body,
        credit_keys=["evening"],
        depth=2,
        is_home=False,
    )
    with open(os.path.join(direct_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(html_doc)


def build_404_page():
    hero_bg = AKRON["civic"]
    links = "".join(
        f'<a class="btn-ghost" href="{E(PROPS_DATA["properties"][pid]["page"])}">{E(PROPS_DATA["properties"][pid]["name"])}</a>'
        for pid in ORDER
    )
    body = f"""<section class="hero hero--compact" id="availability" aria-labelledby="hero-title">
  <img class="hero-bg" src="{E(rel(hero_bg['path'], 1))}" width="{hero_bg['w']}" height="{hero_bg['h']}" alt="{E(hero_bg['alt'])}" fetchpriority="high">
  <div class="c">
    <h1 id="hero-title">Let’s get you back to Akron.</h1>
    <p class="l">That page moved — choose any of our three private 3-bedroom Akron homes below.</p>
    <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:20px">
      <a class="btn-reserve" href="index.html">Back to homepage</a>
      {links}
    </div>
    <p class="slogan-chip"><b>★</b> No cleaning fees, ever.</p>
  </div>
</section>
{before_you_book_html()}"""

    html_doc = page_shell(
        title="Page Not Found | Oilgate Vacation Rentals",
        desc="Return to Oilgate Vacation Rentals in Akron, Ohio.",
        body_html=body,
        credit_keys=["civic"],
        depth=1,
        is_home=False,
    )
    with open(os.path.join(OUT, "404.html"), "w", encoding="utf-8") as f:
        f.write(html_doc)


def build_pepper_knowledge():
    knowledge = {
        "version": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "source": "Generated from data/properties.json and LaVante's Nov 22 v4 updates.",
        "common": {
            "greeting": "Hi there! I'm Pepper, your Oilgate Vacation Rentals concierge. Ask me anything about our three private 3-bedroom Akron homes — Oakdale Unit 1, Oakdale Unit 2 (with the Penthouse Suite!), and Parkgate — including amenities, beds, check-in times, parking, pets, nearby spots, or how to reserve!",
            "units": "We offer three private 3-bedroom, 1-bathroom homes in Akron, Ohio — all with smart home entry, Cable TV + free pay-per-view, fast Wi-Fi, free parking, and no cleaning fees, ever:\n• Oakdale Unit 1: First-floor charm with wood coffered ceilings, workspace in each bedroom, full private kitchen.\n• Oakdale Unit 2: Upper-level home featuring the huge PENTHOUSE SUITE spanning the entire upper floor, separate dining room, and workspaces in each bedroom.\n• Oilgate at Parkgate: Completely renovated home with 2 queen + 1 full beds, 75-inch TV, private deck, and big yard.",
            "cleaning": "No cleaning fees, ever — unless house rules are broken.",
            "checkin": "Your personal smart home door code is sent at 2:45 PM. Check-in starts at 3:00 PM and checkout is 11:00 AM (Akron local time).",
            "pets": "Pets are not allowed at any of our Akron homes — all three properties are pet-free.",
            "nearby": "All three homes are minutes from Akron's famous Swenson's, Highland Square, LeBron James' I PROMISE School, the LeBron James Home Court museum, and Blossom Music Center.",
            "booking": "To book: pick your stay in the Choose your stay selector, enter Check in, Check out, and Guests under Find your dates, and click Reserve to see your exact live total and finish checkout.",
            "rules": f"Quiet hours are 10:00 PM to 10:00 AM (Akron local time). Up to 6 overnight guests and up to 3 visitors. No parties, smoking, or pets. Minimum booking age {OWNER_TERMS['minimumAge']}. {OWNER_TERMS['liability']}",
            "contact": f"Email us anytime at {EMAIL}, or click Reserve above to review dates and checkout. We never share personal phone numbers.",
        },
        "properties": {
            "603326": {
                "name": "Oakdale / Unit 1",
                "page": "unit-1-at-oilgate-at-oakdale.html",
                "maxGuests": 6,
                "bedrooms": 3,
                "bedsCount": 3,
                "bathrooms": 1,
                "beds": "Oakdale Unit 1 has 3 bedrooms, 3 beds (2 double, 1 queen), and 1 bathroom — sleeping up to 6 guests.",
                "amenities": "Oakdale Unit 1 includes free cable TV with free pay-per-view, Fire TV + a workspace in each bedroom, fast Wi-Fi, full private kitchen, original wood coffered ceilings, 1 bathroom, free parking, and smart home entry.",
                "parking": "Oakdale Unit 1 includes free street parking right out front. (The driveway is reserved for Unit 2 guests.)",
            },
            "603323": {
                "name": "Oakdale / Unit 2",
                "page": "unit-2-at-oilgate-at-oakdale.html",
                "maxGuests": 6,
                "bedrooms": 3,
                "bedsCount": 3,
                "bathrooms": 1,
                "beds": "Oakdale Unit 2 has 3 bedrooms, 3 beds (2 double, 1 queen), and 1 bathroom — including the massive PENTHOUSE SUITE spanning the entire upper floor! Sleeps up to 6 guests.",
                "amenities": "Oakdale Unit 2 features the huge Penthouse Suite (whole upper floor), separate dining room, full private kitchen, a workspace in each bedroom, Fire TV with free cable including pay-per-view, fast Wi-Fi, 1 bathroom, driveway parking, and smart home entry.",
                "parking": "Oakdale Unit 2 guests have dedicated free driveway parking.",
            },
            "728474": {
                "name": "Oilgate at Parkgate",
                "page": "oilgate-at-parkgate.html",
                "maxGuests": 6,
                "bedrooms": 3,
                "bedsCount": 3,
                "bathrooms": 1,
                "beds": "Oilgate at Parkgate is a completely renovated 3-bedroom home with 2 queen beds, 1 full bed, and 1 bathroom — sleeping up to 6 guests.",
                "amenities": "Parkgate is completely renovated with smart home entry, a 75-inch TV with free cable including pay-per-view, fast Wi-Fi, full renovated kitchen with stainless appliances & dishwasher, workspace, private deck, big backyard, in-home laundry, and 1 bathroom.",
                "parking": "Parkgate includes free driveway or street parking (garage not in use; please don't park on the grass).",
            },
        },
    }
    assets_dir = os.path.join(OUT, "assets")
    os.makedirs(assets_dir, exist_ok=True)
    with open(os.path.join(assets_dir, "pepper-knowledge.json"), "w", encoding="utf-8") as f:
        json.dump(knowledge, f, indent=2)
        f.write("\n")


def main():
    os.makedirs(OUT, exist_ok=True)
    build_pepper_knowledge()
    build_homepage()
    for pid in ORDER:
        build_rental_page(pid)
    build_direct_page()
    build_404_page()
    print("Built v4-preview site: index.html, 3 rental pages, direct/index.html, 404.html, pepper-knowledge.json.")


if __name__ == "__main__":
    main()

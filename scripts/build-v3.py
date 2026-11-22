"""Build the complete Oilgate Vacation Rentals v3 site into /v3-preview/.

Single shared generator driven by data/properties.json and data/prices.json.
Builds:
  - v3-preview/index.html
  - v3-preview/unit-1-at-oilgate-at-oakdale.html
  - v3-preview/unit-2-at-oilgate-at-oakdale.html
  - v3-preview/oilgate-at-parkgate.html
  - v3-preview/direct/index.html
  - v3-preview/404.html
  - v3-preview/assets/concierge-knowledge.json

Does NOT touch live root pages (index.html, live rental pages, CNAME, DNS).
"""
import html
import json
import os
import re
from datetime import datetime, timezone

E = html.escape
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "v3-preview")

with open(os.path.join(ROOT, "data", "properties.json"), encoding="utf-8") as f:
    PROPS_DATA = json.load(f)

PRICES_PATH = os.path.join(ROOT, "data", "prices.json")
PRICES_DATA = {}
if os.path.exists(PRICES_PATH):
    with open(PRICES_PATH, encoding="utf-8") as f:
        PRICES_DATA = json.load(f)

ORDER = ["603326", "603323", "728474"]
OWNER_TERMS = PROPS_DATA["ownerTerms"]
CONTACT = PROPS_DATA["contact"]
EMAIL = CONTACT["email"]
SOCIAL = CONTACT["social"]
PRIVACY = "https://oilgaterealty.com/en/privacy-policy"
PREVIEW_CHAT_ENDPOINT = "https://pepper-chat-v3-preview.oilgaterealty.workers.dev/chat"

# Verified free-licensed Wikimedia Commons Akron photography.
# Homepage uses lock3, main, cascade, skyline.
# Rental pages, /direct, and 404 each use DIFFERENT Akron photos from the homepage.
AKRON = {
    "lock3": {
        "label": "Lock 3 Canal",
        "path": "samples/img/akron-lock3-canal.webp",
        "w": 1400, "h": 1050,
        "alt": "Downtown Akron at dusk along the Lock 3 canal path and skyline",
        "credit": "Dillguy9, CC0",
        "url": "https://commons.wikimedia.org/wiki/File:Lock_3,_Canal_Square,_%26_Civic_Theatre.jpg",
    },
    "main": {
        "label": "Main Street",
        "path": "samples/img/akron-main-street.webp",
        "w": 1400, "h": 787,
        "alt": "Main Street in downtown Akron at dusk with historic brick buildings",
        "credit": "Dillguy9, CC0",
        "url": "https://commons.wikimedia.org/wiki/File:Main_Street_Akron.jpg",
    },
    "cascade": {
        "label": "Cascade Plaza",
        "path": "samples/img/akron-from-cascade-plaza.webp",
        "w": 1400, "h": 663,
        "alt": "Downtown Akron towers viewed from Cascade Plaza",
        "credit": "Dillguy9, CC0",
        "url": "https://commons.wikimedia.org/wiki/File:Downtown_Akron_from_Cascade_Plaza.jpg",
    },
    "skyline": {
        "label": "Canalway Skyline",
        "path": "samples/img/akron-canalway-skyline.webp",
        "w": 1400, "h": 398,
        "alt": "Panorama of the downtown Akron skyline from the Ohio and Erie Canalway",
        "credit": "Andre Carrotflower, CC BY-SA 4.0",
        "url": "https://commons.wikimedia.org/wiki/File:Downtown_skyline_panorama_as_seen_from_Ohio_%26_Erie_Canalway,_Akron,_Ohio_-_20200530.jpg",
    },
    "airdock": {
        "label": "Goodyear Airdock",
        "path": "samples/img/akron-goodyear-airdock.webp",
        "w": 1400, "h": 788,
        "alt": "The historic Goodyear Airdock in Akron, Ohio",
        "credit": "Dillguy9, CC0",
        "url": "https://commons.wikimedia.org/wiki/File:Goodyear_Airdock_July_2024.jpg",
    },
    "evening": {
        "label": "Evening Skyline",
        "path": "v3-preview/img/akron-evening-skyline.webp",
        "w": 1400, "h": 647,
        "alt": "Downtown Akron skyline illuminated at evening dusk",
        "credit": "Dillguy9, CC0",
        "url": "https://commons.wikimedia.org/wiki/File:Akron,_Ohio,_Evening_Skyline.jpg",
    },
    "museum": {
        "label": "Akron Art Museum",
        "path": "v3-preview/img/akron-art-museum.webp",
        "w": 1400, "h": 788,
        "alt": "Akron Art Museum glass and steel facade in downtown Akron",
        "credit": "Dillguy9, CC0",
        "url": "https://commons.wikimedia.org/wiki/File:Akron_Art_Museum_May_2024.jpg",
    },
    "stanhywet": {
        "label": "Stan Hywet Hall",
        "path": "v3-preview/img/akron-stan-hywet.webp",
        "w": 1400, "h": 933,
        "alt": "Historic Stan Hywet Hall and Gardens in Akron, Ohio",
        "credit": "Erik Drost, CC BY 2.0",
        "url": "https://commons.wikimedia.org/wiki/File:Stan_Hywet_Hall_and_Gardens_(21934506359).jpg",
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

# Rental metadata verified strictly against data/properties.json + LaVante's 2026-11-21 Parkgate override.
STAY_EXTRAS = {
    "603326": {
        "place": "Oakdale",
        "card_img": "samples/img/u1-06.webp",
        "card_alt": "Oakdale Unit 1 living room with original wood coffered ceilings",
        "thumb_img": "assets/oakdale-unit-1.webp",
        "thumb_alt": "Front exterior of the Oakdale duplex with its enclosed porch",
        "highlights": [
            "First-floor unit with original wood coffered ceilings",
            "Fire TV with free cable & workspace in each bedroom",
            "Full private kitchen & shared basement washer and dryer",
        ],
        "picker_summary": "3 bedrooms · 3 beds (2 double, 1 queen) · 1 bath · Up to 6 guests. Coffered-ceiling living room, Fire TV + cable, full private kitchen.",
        "hero_bg": "evening",
        "broll_bg": "airdock",
        "footer_bg": "evening",
    },
    "603323": {
        "place": "Oakdale",
        "card_img": "samples/img/u2-04.webp",
        "card_alt": "Oakdale Unit 2 dining room with wood table and seating",
        "thumb_img": "assets/oakdale-unit-2.webp",
        "thumb_alt": "Side view of the Oakdale duplex and front walkway",
        "highlights": [
            "Spacious upper-level unit with separate dining room",
            "Fire TV with free cable & desk in each bedroom",
            "Dedicated driveway parking & full private kitchen",
        ],
        "picker_summary": "3 bedrooms · 3 beds (2 double, 1 queen) · 1 bath · Up to 6 guests. Upper-level privacy, Fire TV + cable, driveway parking.",
        "hero_bg": "museum",
        "broll_bg": "skyline",
        "footer_bg": "museum",
    },
    "728474": {
        "place": "Parkgate",
        "card_img": "assets/parkgate-living.webp",
        "card_alt": "Parkgate living room with cream sofa, coffee table, and ceiling fan",
        "thumb_img": "assets/parkgate-living.webp",
        "thumb_alt": "Parkgate living room with cream sofa and ceiling fan",
        "highlights": [
            "Renovated home with 75-inch TV, free cable & smart lock",
            "Full kitchen with dishwasher & in-home washer and dryer",
            "Private deck, big yard & driveway or street parking",
        ],
        "picker_summary": "3 bedrooms · 3 beds (2 queen, 1 double) · 1 bath · Up to 6 guests. 75-inch TV + cable, smart lock, deck, big yard, dishwasher.",
        "hero_bg": "stanhywet",
        "broll_bg": "civic",
        "footer_bg": "stanhywet",
    },
}

MARQUEE_ITEMS = [
    "3-Bedroom Private Homes",
    "Akron, Ohio",
    "Full Private Kitchens",
    "Cable TV & Fast Wi-Fi",
    "Free Parking Included",
    "Direct Booking",
    "Minutes to Highland Square & Downtown",
]

RULES_SUMMARY = [
    ("Check-in & check-out", "Check in from 3:00 PM. Check out by 11:00 AM, Akron local time."),
    ("Guests 18+", "The person booking must be 18 or older."),
    ("No parties", "Up to 3 visitors at a time. No overnight visitors unless approved and paid for in advance."),
    ("Quiet hours", "10 PM to 10 AM, out of respect for neighbors and the other unit."),
    ("Smoke-free & pet-free", "No cigarette smoking in the home. No pets."),
    ("Parking", "Unit 2 uses the driveway; Unit 1 parks on the street. Parkgate guests may use the driveway or street."),
    ("Laundry", "Oakdale’s basement washer and dryer are shared by Unit 1 and Unit 2. Parkgate has an in-home washer and dryer."),
    ("Damage & liability", OWNER_TERMS["liability"]),
]

FAQ_ITEMS = [
    (
        "Am I booking a room or a private home?",
        "You book the whole private unit or home — never a shared bedroom. At Oakdale, only the basement laundry room is shared between Unit 1 and Unit 2.",
    ),
    (
        "Are there cleaning fees?",
        "No cleaning fees, ever — unless house rules are broken.",
    ),
    (
        "How old do I need to be to book?",
        "18 or older.",
    ),
    (
        "What time is check-in and check-out?",
        "Check-in is from 3:00 PM and check-out is by 11:00 AM, Akron local time.",
    ),
    (
        "Can I bring a pet?",
        "No. All three Akron rentals are pet-free.",
    ),
    (
        "Where will I see the full price and cancellation terms?",
        "Choose your rental, check-in and check-out dates, and guest count above, then click Proceed. Checkout displays your live stay total, payment schedule, and cancellation terms before you confirm.",
    ),
]


def rel(path_from_repo_root, depth=1):
    """Build relative path from v3-preview/ (depth=1) or v3-preview/direct/ (depth=2)."""
    if path_from_repo_root.startswith("http"):
        return path_from_repo_root
    if path_from_repo_root.startswith("v3-preview/"):
        sub = path_from_repo_root[len("v3-preview/"):]
        return ("../" * (depth - 1)) + sub
    return ("../" * depth) + path_from_repo_root


def prop_facts(p):
    return f"{p['bedrooms']} bedrooms · {p['beds']} beds · {p['bathrooms']} bathroom · up to {p['maxGuests']} guests"


def clean_description(text):
    # Remove Vrbo-specific security deposit paragraph and stale 2BR label.
    paras = [x.strip() for x in re.split(r"\n\s*\n", text or "") if x.strip()]
    paras = [re.sub(r"\b2BR\b", "3BR", x) for x in paras if not re.search(r"security deposit|pre-authorization", x, re.I)]
    return paras


def clean_amenities(p):
    # Lodgify maps Bathtub to "Hot Tub" in sanitary; publicFacts confirms Bathtub, not Hot Tub.
    has_bathtub_fact = any("bathtub" in (q.get("answer", "").lower()) for q in p.get("publicFacts", []))
    cleaned = {}
    for group, items in p.get("amenities", {}).items():
        vals = []
        for item in items:
            if item.strip().lower() == "hot tub" and has_bathtub_fact:
                vals.append("Bathtub")
            elif item.strip().lower() == "2 bedroom" and p["bedrooms"] == 3:
                vals.append("3 Bedroom")
            else:
                vals.append(item)
        if vals:
            cleaned[group] = vals
    return cleaned


def social_html():
    svg = {
        "Facebook": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6z"/></svg>',
        "Instagram": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM17.5 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>',
        "X": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg>',
        "Email": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1 3.2V17h16V8.2l-8 5.3zM5.2 7 12 11.5 18.8 7z"/></svg>',
    }
    links = [
        f'<a href="{E(s["url"])}" target="_blank" rel="noopener noreferrer" aria-label="Oilgate Realty on {E(s["name"])}">{svg[s["name"]]}</a>'
        for s in SOCIAL if s["name"] in svg
    ]
    links.append(f'<a href="mailto:{E(EMAIL)}" aria-label="Email Oilgate Realty">{svg["Email"]}</a>')
    return '<nav class="social" aria-label="Oilgate Realty social pages">' + "".join(links) + "</nav>"


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
        <li><a href="{prefix}#experience">The experience</a></li>
        <li><a href="{prefix}#compare">Real prices</a></li>
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
        grid_cls = "book-grid book-grid--single"
        heading = f"Book {E(p['name'])}"
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
                f'data-facts="{E(prop_facts(p))}" '
                f'data-img="{E(img_src)}" data-alt="{E(ex["thumb_alt"])}" '
                f'data-summary="{E(ex["picker_summary"])}">'
                f'<img class="stay-option-thumb" src="{E(img_src)}" width="120" height="80" alt="" aria-hidden="true">'
                f'<span class="stay-option-body"><strong>{E(p["name"])}</strong><span>{E(prop_facts(p))}</span></span>'
                f"</li>"
            )
        first_src = rel(first_ex["thumb_img"], depth)
        stay_block = f"""<div class="bfield bfield-stay">
          <span class="bfield-label" id="{prefix}-stay-lbl">Choose your stay</span>
          <div class="stay-picker" data-stay-picker>
            <input type="hidden" name="stay" value="{first_id}">
            <button type="button" class="stay-trigger" role="combobox" aria-labelledby="{prefix}-stay-lbl" aria-haspopup="listbox" aria-expanded="false" aria-controls="{prefix}-listbox">
              <img class="stay-trigger-thumb" src="{E(first_src)}" width="72" height="72" alt="{E(first_ex['thumb_alt'])}">
              <span class="stay-trigger-text">
                <span class="stay-trigger-name">{E(first_p['name'])}</span>
                <span class="stay-trigger-meta">{E(prop_facts(first_p))}</span>
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
        grid_cls = "book-grid"
        heading = "Find your dates"

    return f"""<div class="glass">
  <div class="glass-head">
    <h2 id="date-search-title">{heading}</h2>
    <p class="glass-sub">Direct checkout · USD · Instant date &amp; guest prefill</p>
  </div>
  <form data-book aria-labelledby="date-search-title">
    <fieldset class="{grid_cls}">
      <legend class="sr">{heading}</legend>
      {stay_block}
      <div class="bfield">
        <label for="{prefix}-in">Check-in</label>
        <input id="{prefix}-in" name="arrival" type="date" required>
      </div>
      <div class="bfield">
        <label for="{prefix}-out">Check-out</label>
        <input id="{prefix}-out" name="departure" type="date" required>
      </div>
      <div class="bfield">
        <label for="{prefix}-guests">Guests</label>
        <select id="{prefix}-guests" name="guests">{guests_opts}</select>
      </div>
      <button type="submit" class="btn-proceed">Proceed</button>
    </fieldset>
    <p class="book-msg" data-book-msg role="status" aria-live="polite"></p>
  </form>
  <p class="fine">Select your dates and guests, then click Proceed to jump straight to your reservation summary and contact details.</p>
</div>"""


def marquee_html():
    spans = "".join(f"<span>{E(item)} ✦</span>" for item in MARQUEE_ITEMS * 3)
    return f'<div class="marquee" aria-hidden="true"><div class="run">{spans}</div></div>'


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


def format_baked_cell(prop_id, channel):
    if not is_fresh_prices():
        return '<span class="price-val">—</span>', ""
    entry = PRICES_DATA.get("properties", {}).get(prop_id, {}).get("channels", {}).get(channel, {})
    avg = entry.get("averageNightly")
    if isinstance(avg, (int, float)) and avg > 0:
        title_attr = f' title="{E(entry.get("method", ""))}"' if entry.get("method") else ""
        return f'<span class="price-val">${round(avg)}</span><span class="price-unit">7-night avg / night</span>', title_attr
    return '<span class="price-val">—</span>', ""


def compare_section_html(depth=1, only_property_id=None):
    direct_href = "direct/index.html" if depth == 1 else "index.html"
    prices_url = rel("data/prices.json", depth)
    checked_at = PRICES_DATA.get("checkedAt", "")
    checked_date = PRICES_DATA.get("checkedDate", "")
    pretty_date = ""
    if checked_date and is_fresh_prices():
        try:
            pretty_date = "Checked " + datetime.strptime(checked_date, "%Y-%m-%d").strftime("%b %d, %Y").replace(" 0", " ")
        except Exception:
            pretty_date = f"Checked {checked_date}"
    win = PRICES_DATA.get("window", {})
    win_str = f"{win.get('startDate', '')} to {win.get('endDate', '')}" if win.get("startDate") else "Next 7 nights"

    prop_ids = [only_property_id] if only_property_id else ORDER
    cards = []
    for pid in prop_ids:
        p = PROPS_DATA["properties"][pid]
        rows = []
        channels = [
            ("direct", "Direct", "vacationrentals.oilgaterealty.com/direct", True),
            ("airbnb", "Airbnb", "", False),
            ("vrbo", "Vrbo", "", False),
            ("booking", "Booking.com", "", False),
        ]
        for ch_key, ch_name, ch_sub, is_direct in channels:
            cell_html, title_attr = format_baked_cell(pid, ch_key)
            if is_direct:
                label_cell = (
                    f'<a href="{direct_href}">{E(ch_name)}</a>'
                    f'<span class="site-url">{E(ch_sub)}</span>'
                )
            else:
                label_cell = E(ch_name)
            row_cls = ' class="is-direct"' if is_direct else ""
            rows.append(
                f'<tr{row_cls}>'
                f'<th scope="row">{label_cell}</th>'
                f'<td data-price-cell data-prop="{pid}" data-channel="{ch_key}"{title_attr}>{cell_html}</td>'
                f"</tr>"
            )
        cards.append(f"""<article class="price-card">
  <div class="price-card-head">
    <h3>{E(p['name'])}</h3>
    <span>7-night average</span>
  </div>
  <table class="price-table">
    <caption class="sr">{E(p['name'])} 7-night average nightly price by booking site</caption>
    <thead>
      <tr>
        <th scope="col">Booking site</th>
        <th scope="col">7-night avg / night (USD)</th>
      </tr>
    </thead>
    <tbody>
      {''.join(rows)}
    </tbody>
  </table>
</article>""")

    grid_cls = "price-grid price-grid--single" if only_property_id else "price-grid"
    return f"""<section class="compare-sec" id="compare" aria-labelledby="cmp-title" data-prices-url="{E(prices_url)}" data-baked-checked-at="{E(checked_at)}">
  <div class="compare-head">
    <div>
      <p class="label">Real prices</p>
      <h2 class="sec-title" id="cmp-title">Compare with real numbers</h2>
    </div>
    <div class="compare-meta-box">
      <strong>7-night average nightly price</strong>
      <span>Next 7 nights: <span data-prices-window>{E(win_str)}</span></span>
      <span>2 guests · USD · <span data-prices-checked>{E(pretty_date)}</span></span>
    </div>
  </div>
  <div class="{grid_cls}">
    {''.join(cards)}
  </div>
  <p class="compare-foot">Each rate shows the 7-night stay total divided by 7 nights for 2 guests in USD, refreshed daily from direct quotes and public listing pages. A dash means no live quote was returned at check time; data older than 48 hours is cleared automatically.</p>
</section>"""


def before_you_book_html(broll_key, depth=1):
    bg = AKRON[broll_key]
    rules_items = "".join(f"<div><dt>{E(t)}</dt><dd>{E(d)}</dd></div>" for t, d in RULES_SUMMARY)
    return f"""<section class="broll-band" id="rental-terms" aria-labelledby="rt">
  <img class="broll-bg" src="{E(rel(bg['path'], depth))}" width="{bg['w']}" height="{bg['h']}" alt="{E(bg['alt'])}" loading="lazy" decoding="async">
  <div class="squared-frame">
    <div class="info-grid">
      <div>
        <p class="label">Before you book</p>
        <h2 class="sec-title" id="rt">Rules and terms</h2>
        <p class="info-lead">The minimum booking age is {OWNER_TERMS['minimumAge']}.</p>
        <p>{E(OWNER_TERMS['liability'])}</p>
        <div class="promise-square">
          <p class="promise-main">{E(OWNER_TERMS['cleaning'])}</p>
          <p class="promise-exception"><b>★</b>{E(OWNER_TERMS['cleaningException'])}</p>
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
<section class="faqw" id="faq" aria-labelledby="fq">
  <p class="label">Good to know</p>
  <h2 class="sec-title" id="fq">Questions, answered</h2>
  <div class="faq">{items}</div>
</section>"""


def footer_html(credit_keys, footer_bg_key, depth=1):
    bg = AKRON[footer_bg_key]
    logo_src = rel("previews/img/ovr-secondary.webp", depth)
    prefix = "" if depth == 1 else "../"
    stay_links = "".join(
        f'<p><a href="{prefix}{E(PROPS_DATA["properties"][pid]["page"])}">{E(PROPS_DATA["properties"][pid]["name"])}</a></p>'
        for pid in ORDER
    )
    stay_links += f'<p><a href="{prefix}direct/index.html">Direct booking</a></p>'
    seen = []
    for k in credit_keys:
        if k not in seen:
            seen.append(k)
    akron_credits = " · ".join(f'<a href="{E(AKRON[k]["url"])}" target="_blank" rel="noopener noreferrer">{E(AKRON[k]["label"])} ({E(AKRON[k]["credit"])})</a>' for k in seen)
    return f"""<footer id="contact">
  <img class="footer-bg" src="{E(rel(bg['path'], depth))}" width="{bg['w']}" height="{bg['h']}" alt="{E(bg['alt'])}" loading="lazy" decoding="async">
  <div class="wrap">
    <div>
      <span class="plate"><img src="{logo_src}" width="720" height="198" alt="Oilgate Vacation Rentals"></span>
      <p style="margin-top:12px">Private 3-bedroom stays in Akron, Ohio.</p>
      {social_html()}
    </div>
    <div>
      <h2>Rentals</h2>
      {stay_links}
    </div>
    <div>
      <h2>Contact</h2>
      <p><a href="mailto:{E(EMAIL)}">{E(EMAIL)}</a></p>
      <p><a href="{E(PRIVACY)}" target="_blank" rel="noopener noreferrer">Privacy policy</a></p>
      <p>© 2026 Oilgate Realty</p>
    </div>
    <p class="credits">Akron photography via Wikimedia Commons: {akron_credits}. Property photography: Oilgate Realty listings.</p>
  </div>
</footer>"""


def page_shell(title, desc, body_html, credit_keys, footer_bg_key, depth=1, is_home=False, property_id="", og_img="assets/oakdale-unit-1.webp", float_href="#availability"):
    css_href = rel("v3-preview/assets/v3.css", depth)
    concierge_css = rel("v3-preview/assets/concierge.css", depth)
    js_href = rel("v3-preview/assets/v3.js", depth)
    concierge_js = rel("v3-preview/assets/concierge.js", depth)
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
<link rel="stylesheet" href="{E(concierge_css)}">
<script src="{E(js_href)}" defer></script>
<script type="module" src="{E(concierge_js)}"></script>
</head>
<body>
{header_html(depth=depth, is_home=is_home)}
<main id="main">
{body_html}
</main>
<a class="float-proceed" href="{E(float_href)}">Proceed</a>
{footer_html(credit_keys, footer_bg_key, depth=depth)}
<aside data-concierge data-property="{E(property_id)}" aria-label="Ask our concierge"></aside>
</body>
</html>
"""


def build_homepage():
    hero_bg = AKRON["lock3"]
    exp_bg = AKRON["main"]
    cards = []
    for pid in ORDER:
        p = PROPS_DATA["properties"][pid]
        ex = STAY_EXTRAS[pid]
        hi_li = "".join(f"<li>{E(h)}</li>" for h in ex["highlights"])
        cards.append(f"""<a class="card" href="{E(p['page'])}">
  <div class="card-media">
    <img src="{E(rel(ex['card_img'], 1))}" width="1050" height="1200" alt="{E(ex['card_alt'])}" loading="lazy" decoding="async">
    <span class="rib">{E(ex['place'].upper())}</span>
  </div>
  <div class="card-body">
    <h3>{E(p['name'])}</h3>
    <p class="card-facts">{E(prop_facts(p))}</p>
    <ul class="card-highlights">{hi_li}</ul>
    <span class="card-cta">Explore &amp; proceed →</span>
  </div>
</a>""")

    body = f"""<section class="hero date-search" id="availability" aria-labelledby="hero-title">
  <img class="hero-bg" src="{E(rel(hero_bg['path'], 1))}" width="{hero_bg['w']}" height="{hero_bg['h']}" alt="{E(hero_bg['alt'])}" fetchpriority="high">
  <div class="c">
    <h1 id="hero-title">Three Akron homes,<br>yours alone</h1>
    <p class="l">Three private 3-bedroom, 3-bed, 1-bath homes in Oakdale and Parkgate — each sleeping up to 6 with a full private kitchen, cable TV, fast Wi-Fi, and free parking.</p>
    {booking_form_html("home", depth=1)}
    <p class="chip"><b>★</b> No cleaning fees</p>
  </div>
</section>
{marquee_html()}
<section class="rentals-sec" id="rentals" aria-labelledby="st">
  <div>
    <p class="label">Rentals</p>
    <h2 class="sec-title" id="st">Pick your home base</h2>
    <div class="rule"></div>
    <p class="note">Two 3-bedroom Oakdale duplex units and the renovated 3-bedroom Parkgate home. Every rental offers 3 beds, 1 bathroom, and space for up to 6 guests.</p>
    <a class="btn-proceed" href="#availability">Proceed</a>
  </div>
  <div class="cards">{''.join(cards)}</div>
</section>
<section class="broll-band" id="experience" aria-labelledby="dy">
  <img class="broll-bg" src="{E(rel(exp_bg['path'], 1))}" width="{exp_bg['w']}" height="{exp_bg['h']}" alt="{E(exp_bg['alt'])}" loading="lazy" decoding="async">
  <div class="squared-frame">
    <div class="day-grid">
      <figure class="day-window">
        <img src="{E(rel('samples/img/u1-06.webp', 1))}" width="1050" height="1400" alt="Oakdale living room with original wood coffered ceiling" loading="lazy" decoding="async">
      </figure>
      <div>
        <p class="label">The experience</p>
        <h2 class="sec-title" id="dy">An easy Akron day</h2>
        <ol>
          <li><time>3:00 PM</time><div><strong>Check in</strong><p>Your private home is ready from 3:00 PM with straightforward entry.</p></div></li>
          <li><time>Evening</time><div><strong>Head out or stay in</strong><p>Minutes from Swensons, Highland Square, downtown Akron, and Sand Run Metro Park — or unwind with cable TV and a full private kitchen.</p></div></li>
          <li><time>10:00 PM</time><div><strong>Quiet hours</strong><p>10 PM to 10 AM, out of respect for the neighbors.</p></div></li>
          <li><time>11:00 AM</time><div><strong>Check out</strong><p>Easy 11:00 AM departure — tidy up, lock up, and you’re on your way.</p></div></li>
        </ol>
      </div>
    </div>
  </div>
</section>
{compare_section_html(depth=1)}
{before_you_book_html("cascade", depth=1)}
{faq_section_html()}"""

    html_doc = page_shell(
        title="Akron Vacation Rentals | Oilgate Realty",
        desc="Three private 3-bedroom Akron homes in Oakdale and Parkgate with full kitchens, cable TV, free parking, and no cleaning fees.",
        body_html=body,
        credit_keys=["lock3", "main", "cascade", "skyline"],
        footer_bg_key="skyline",
        depth=1,
        is_home=True,
    )
    with open(os.path.join(OUT, "index.html"), "w", encoding="utf-8") as f:
        f.write(html_doc)


def build_rental_page(pid):
    p = PROPS_DATA["properties"][pid]
    ex = STAY_EXTRAS[pid]
    hero_bg = AKRON[ex["hero_bg"]]
    photos = p["retainedPhotos"] if (pid == "728474" and p.get("retainedPhotos")) else p["photos"]
    paras = clean_description(p["description"])
    amenities = clean_amenities(p)
    rules = [re.sub(r"^\d+\.\s*", "", x.strip()) for x in re.split(r"\n\s*\n", p.get("houseRules", "")) if x.strip()]
    parking_rule = next((r for r in rules if "Park in designated" in r), "")
    policies = [(k, re.sub(r"\.([A-Z])", r". \1", v)) for k, v in p.get("policies", {}).items() if k != "Security deposit"]
    bed_line = " · ".join(p.get("bedTypes", []))

    gallery_items = []
    for i, ph in enumerate(photos, start=1):
        src = ph["url"] if ph["url"].startswith("http") else rel(ph["url"], 1)
        alt = ph.get("alt") or f"{p['name']} photo {i}"
        gallery_items.append(
            f'<figure><a href="{E(src)}" target="_blank" rel="noopener" aria-label="Open photo {i}: {E(alt)}">'
            f'<img src="{E(src)}" alt="{E(alt)}" loading="lazy" decoding="async" width="1200" height="850"></a>'
            f'<figcaption>{i:02d} / {E(alt)}</figcaption></figure>'
        )

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

    body = f"""<section class="hero hero--compact date-search" id="availability" aria-labelledby="hero-title">
  <img class="hero-bg" src="{E(rel(hero_bg['path'], 1))}" width="{hero_bg['w']}" height="{hero_bg['h']}" alt="{E(hero_bg['alt'])}" fetchpriority="high">
  <div class="c">
    <h1 id="hero-title">{E(p['name'])}</h1>
    <p class="l">{E(prop_facts(p))}{(" · " + E(bed_line)) if bed_line else ""}</p>
    <ul class="hero-stats">{hi_stats}</ul>
    {booking_form_html(f"stay-{pid}", depth=1, fixed_property_id=pid)}
    <p class="chip"><b>★</b> No cleaning fees</p>
  </div>
</section>
{marquee_html()}
<section class="detail-band" id="overview" aria-labelledby="ov-title">
  <div class="overview-grid">
    <div>
      <p class="label">Make yourself at home</p>
      <h2 class="sec-title" id="ov-title">About {E(p['name'])}</h2>
      <div class="rule"></div>
      {''.join(f'<p>{E(para)}</p>' for para in paras)}
      <p><a class="btn-proceed" href="#photos">See all {len(photos)} photos</a></p>
    </div>
    <aside class="arrival-card" aria-label="Arrival details">
      <h3>Plan your arrival</h3>
      <p><strong>Check-in:</strong> {E(p['checkin'])} · <strong>Check-out:</strong> {E(p['checkout'])} (Akron local time)</p>
      <p><strong>Layout:</strong> {E(prop_facts(p))}</p>
      {f'<p><strong>Beds:</strong> {E(bed_line)}</p>' if bed_line else ''}
      {f'<p><strong>Parking:</strong> {E(parking_rule)}</p>' if parking_rule else ''}
      <p><strong>Pets:</strong> Pets are not allowed.</p>
      <p><strong>Host email:</strong> <a href="mailto:{E(EMAIL)}">{E(EMAIL)}</a></p>
      <p style="margin-top:14px"><a class="btn-proceed" href="#availability">Proceed</a></p>
    </aside>
  </div>
</section>
<section class="detail-band detail-band--stone" id="photos" aria-labelledby="ph-title">
  <div class="detail-inner">
    <p class="label">Photo gallery</p>
    <h2 class="sec-title" id="ph-title">Every room, in view</h2>
    <p class="note">{len(photos)} real photos of {E(p['name'])}. Click any image to open full size.</p>
    <div class="gallery-grid">{''.join(gallery_items)}</div>
  </div>
</section>
<section class="detail-band" id="amenities" aria-labelledby="am-title">
  <p class="label">The details</p>
  <h2 class="sec-title" id="am-title">What’s included</h2>
  <div class="amenity-groups">{''.join(amenity_blocks)}</div>
</section>
<section class="detail-band detail-band--stone" id="house-rules" aria-labelledby="hr-title">
  <div class="detail-inner">
    <p class="label">A good stay starts here</p>
    <h2 class="sec-title" id="hr-title">House rules</h2>
    <p class="note">Check-in {E(p['checkin'])} · Check-out {E(p['checkout'])} (Akron local time)</p>
    <ol class="rules-bullets">{''.join(f'<li>{E(r)}</li>' for r in rules)}</ol>
  </div>
</section>
{before_you_book_html(ex["broll_bg"], depth=1)}
<section class="detail-band" id="policies" aria-labelledby="pol-title">
  <p class="label">Reservation terms</p>
  <h2 class="sec-title" id="pol-title">Booking policies</h2>
  <div class="policy-grid">{policy_blocks}</div>
  <p class="compare-foot">Public listing policies checked {E(PROPS_DATA.get('pulledAt', '')[:10])}. Exact payment, cancellation, and stay terms for your dates appear in checkout before you confirm.</p>
</section>
{compare_section_html(depth=1, only_property_id=pid)}
{faq_section_html()}"""

    og = "assets/parkgate-living.webp" if pid == "728474" else ("assets/oakdale-unit-2.webp" if pid == "603323" else "assets/oakdale-unit-1.webp")
    html_doc = page_shell(
        title=f"{p['name']} · {p['bedrooms']}-Bedroom Akron Rental | Oilgate Realty",
        desc=f"{p['name']}: {prop_facts(p)}. Explore {len(photos)} photos, amenities, house rules, and direct 7-night price comparison. No cleaning fees.",
        body_html=body,
        credit_keys=[ex["hero_bg"], ex["broll_bg"], ex["footer_bg"]],
        footer_bg_key=ex["footer_bg"],
        depth=1,
        is_home=False,
        property_id=pid,
        og_img=og,
    )
    with open(os.path.join(OUT, p["page"]), "w", encoding="utf-8") as f:
        f.write(html_doc)


def build_direct_page():
    direct_dir = os.path.join(OUT, "direct")
    os.makedirs(direct_dir, exist_ok=True)
    hero_bg = AKRON["civic"]
    body = f"""<section class="hero hero--compact date-search" id="availability" aria-labelledby="hero-title">
  <img class="hero-bg" src="{E(rel(hero_bg['path'], 2))}" width="{hero_bg['w']}" height="{hero_bg['h']}" alt="{E(hero_bg['alt'])}" fetchpriority="high">
  <div class="c">
    <h1 id="hero-title">Book direct in Akron</h1>
    <p class="l">vacationrentals.oilgaterealty.com/direct — Pick your 3-bedroom home, dates, and guests, then click Proceed to go straight to checkout.</p>
    {booking_form_html("direct", depth=2)}
    <p class="chip"><b>★</b> No cleaning fees</p>
  </div>
</section>
{marquee_html()}
{compare_section_html(depth=2)}
{before_you_book_html("airdock", depth=2)}"""

    html_doc = page_shell(
        title="Book Direct | Oilgate Vacation Rentals · Akron, Ohio",
        desc="Book direct at vacationrentals.oilgaterealty.com/direct for our three 3-bedroom Akron homes. Compare real 7-night average nightly rates.",
        body_html=body,
        credit_keys=["civic", "airdock"],
        footer_bg_key="civic",
        depth=2,
        is_home=False,
    )
    with open(os.path.join(direct_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(html_doc)


def build_404_page():
    hero_bg = AKRON["airdock"]
    links = "".join(
        f'<a class="btn-proceed" href="{E(PROPS_DATA["properties"][pid]["page"])}">{E(PROPS_DATA["properties"][pid]["name"])}</a>'
        for pid in ORDER
    )
    body = f"""<section class="hero hero--compact" id="availability" aria-labelledby="hero-title">
  <img class="hero-bg" src="{E(rel(hero_bg['path'], 1))}" width="{hero_bg['w']}" height="{hero_bg['h']}" alt="{E(hero_bg['alt'])}" fetchpriority="high">
  <div class="c">
    <h1 id="hero-title">Let’s get you back to Akron</h1>
    <p class="l">That page moved or the link isn’t quite right. Pick any of our three 3-bedroom Akron homes below, or head straight to direct booking.</p>
    <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:18px">
      <a class="btn-proceed" href="index.html">Back to homepage</a>
      <a class="btn-proceed" href="direct/index.html">Proceed to direct booking</a>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:14px">{links}</div>
    <p class="chip"><b>★</b> No cleaning fees</p>
  </div>
</section>
{before_you_book_html("civic", depth=1)}"""

    html_doc = page_shell(
        title="Page Not Found | Oilgate Vacation Rentals",
        desc="Return to Oilgate Vacation Rentals in Akron, Ohio — three private 3-bedroom homes with no cleaning fees.",
        body_html=body,
        credit_keys=["airdock", "civic"],
        footer_bg_key="airdock",
        depth=1,
        is_home=False,
        float_href="direct/index.html",
    )
    with open(os.path.join(OUT, "404.html"), "w", encoding="utf-8") as f:
        f.write(html_doc)


def build_concierge_knowledge():
    def short_time(t):
        return re.sub(r"^0", "", t).replace(":00", "")

    knowledge = {
        "version": PROPS_DATA.get("pulledAt", "")[:10],
        "liveChatEnabled": True,
        "chatEndpoint": PREVIEW_CHAT_ENDPOINT,
        "source": "Generated from data/properties.json with owner overrides (Parkgate 3BR/3 beds/1 bath, 2026-11-21).",
        "common": {
            "checkin": "Check-in is 3 PM and check-out is 11 AM, Akron local time. Contact your host to arrange arrival.",
            "pets": "Pets are not allowed at our Akron rentals. Please contact the host if you have a question about this policy.",
            "rules": f"Quiet hours are 10 PM to 10 AM, Akron local time. No parties, events, smoking, or pets. Minimum booking age {OWNER_TERMS['minimumAge']}. {OWNER_TERMS['liability']}",
            "contact": f"Email {EMAIL}, or use the Proceed to checkout link below to message the host and review reservation details. We never share personal phone numbers. Complete reservations and payments only through checkout.",
            "cleaning": f"{OWNER_TERMS['cleaning']}. {OWNER_TERMS['cleaningException']}",
        },
        "properties": {},
    }
    for pid in ORDER:
        p = PROPS_DATA["properties"][pid]
        rules = [re.sub(r"^\d+\.\s*", "", x.strip()) for x in re.split(r"\n\s*\n", p.get("houseRules", "")) if x.strip()]
        parking_rule = next((r for r in rules if "Park in designated" in r), "")
        parking = f"Parking: {parking_rule}" if parking_rule else "Free parking is available; check house rules for assigned spaces."
        amenities_flat = [v for vals in clean_amenities(p).values() for v in vals]
        knowledge["properties"][pid] = {
            "name": p["name"],
            "page": p["page"],
            "maxGuests": p["maxGuests"],
            "bedrooms": p["bedrooms"],
            "beds": p["beds"],
            "bathrooms": p["bathrooms"],
            "parking": parking,
            "checkin": f"Check-in is {short_time(p['checkin'])} and check-out is {short_time(p['checkout'])}, Akron local time. Contact your host to arrange arrival.",
            "pets": "Pets are not allowed at this rental. Please contact the host if you have a question about this policy.",
            "amenities": f"{prop_facts(p)}. {', '.join(amenities_flat)}.",
            "rules": f"Quiet hours are 10 PM to 10 AM, Akron local time. Up to {p['maxGuests']} overnight guests, all listed on the booking, and up to 3 visitors. No parties, events, smoking, or pets. Keep trash-can access clear from Sunday night through Monday. Minimum booking age {OWNER_TERMS['minimumAge']}. {OWNER_TERMS['liability']}",
            "description": "\n\n".join(clean_description(p["description"])),
        }

    assets_dir = os.path.join(OUT, "assets")
    os.makedirs(assets_dir, exist_ok=True)
    with open(os.path.join(assets_dir, "concierge-knowledge.json"), "w", encoding="utf-8") as f:
        json.dump(knowledge, f, indent=2)
        f.write("\n")


def main():
    os.makedirs(OUT, exist_ok=True)
    build_concierge_knowledge()
    build_homepage()
    for pid in ORDER:
        build_rental_page(pid)
    build_direct_page()
    build_404_page()
    print("Built v3-preview site: index.html, 3 rental pages, direct/index.html, 404.html, concierge-knowledge.json.")


if __name__ == "__main__":
    main()

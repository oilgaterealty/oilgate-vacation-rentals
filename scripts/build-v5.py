"""Build the complete Oilgate Vacation Rentals v5 site.

Combines v3's visual foundation (clear header, all-caps centered AKRON, OHIO with
fixed comma spacing, desktop hero framing, exact section photo backgrounds, sharp
v3 box radii, city footer) with v4's text, booking box order, unit copy, opaque
glass cards with gold hover glow, categorized auto-scrolling photo tours, Pepper
Grok concierge + 3D Pepper head launcher, light 21st.dev Wave Mesh animated
background on plain sections, and official Google Drive footer logos.

Usage:
  python scripts/build-v5.py              # builds into /v5-preview/
  python scripts/build-v5.py --live-root  # builds into live root (keeping /v3-preview/, /v4-preview/, /v5-preview/ intact)
"""
import argparse
import html
import json
import os
import re
from datetime import datetime, timezone

E = html.escape
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V5_PREVIEW = os.path.join(ROOT, "v5-preview")

with open(os.path.join(ROOT, "data", "properties.json"), encoding="utf-8") as f:
    PROPS_DATA = json.load(f)

PRICES_PATH = os.path.join(ROOT, "data", "prices.json")
PRICES_DATA = {}
if os.path.exists(PRICES_PATH):
    with open(PRICES_PATH, encoding="utf-8") as f:
        PRICES_DATA = json.load(f)

MANIFEST_PATH = os.path.join(ROOT, "v4-preview", "photos", "manifest.json")
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
        "alt": "Downtown Akron at dusk along the Lock 3 canal path with floral mural and skyline",
        "credit": "Dillguy9, CC0",
        "url": "https://commons.wikimedia.org/wiki/File:Lock_3,_Canal_Square,_%26_Civic_Theatre.jpg",
    },
    "main": {
        "label": "Main Street",
        "path": "samples/img/akron-main-street.webp",
        "w": 1400, "h": 787,
        "alt": "Main Street in downtown Akron at dusk featuring the PNC building and historic brick facades",
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
    "evening": {
        "label": "Evening Skyline",
        "path": "v3-preview/img/akron-evening-skyline.webp",
        "w": 1400, "h": 647,
        "alt": "Downtown Akron skyline illuminated at golden hour",
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
    """Build relative path from root (depth=0), /v5-preview/ or /direct/ (depth=1), or /v5-preview/direct/ (depth=2)."""
    if path_from_repo_root.startswith("http"):
        return path_from_repo_root
    prefix = "../" * depth
    return prefix + path_from_repo_root.lstrip("/")


def prop_facts_lower(p):
    return f"{p['bedrooms']} bedrooms · {p['beds']} beds · 1 bathroom · up to {p['maxGuests']} guests"


def prop_facts_booking_box(p):
    return f"{p['bedrooms']} Bedrooms · {p['beds']} Beds · 1 Bathroom · Up to {p['maxGuests']} guests"


def clean_amenities(p):
    out = {}
    for grp, vals in p.get("amenities", {}).items():
        cleaned = []
        for v in vals:
            if re.search(r"shared|basement laundry|shared washer", v, re.I):
                continue
            cleaned.append(v)
        if cleaned:
            out[grp] = cleaned
    if "essentials" in out:
        if not any("smart" in x.lower() for x in out["essentials"]):
            out["essentials"].insert(0, "Smart home entry")
    if "entertainment" in out:
        if not any("pay-per-view" in x.lower() for x in out["entertainment"]):
            out["entertainment"].insert(0, "Free cable TV including pay-per-view")
    return out


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
        entry = PRICES_DATA.get("allUnitsAverage", {}).get(channel, {})
        avg = entry.get("averageNightly")
        if not isinstance(avg, (int, float)) or avg <= 0:
            vals = [
                PRICES_DATA.get("properties", {}).get(pid, {}).get("channels", {}).get(channel, {}).get("averageNightly")
                for pid in ORDER
            ]
            vals = [v for v in vals if isinstance(v, (int, float)) and v > 0]
            avg = (sum(vals) / len(vals)) if vals else None
    else:
        entry = PRICES_DATA.get("properties", {}).get(prop_id_or_all, {}).get("channels", {}).get(channel, {})
        avg = entry.get("averageNightly")
    if isinstance(avg, (int, float)) and avg > 0:
        return f"${round(avg)}"
    return "—"


def social_html():
    svg = {
        "Facebook": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg>',
        "Instagram": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm5.2-2.6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z"/></svg>',
        "X": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
        "TikTok": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 3h-2.6v11.1a2.6 2.6 0 1 1-2-2.5V9a5.2 5.2 0 1 0 4.6 5.2V8.6a6.4 6.4 0 0 0 4 1.4V7.4A3.9 3.9 0 0 1 16 3z"/></svg>',
        "Email": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2v.4l8 4.8 8-4.8V8H4zm0 8h16v-5.3l-8 4.8-8-4.8V16z"/></svg>',
    }
    links = [
        f'<a href="{E(s["url"])}" target="_blank" rel="noopener noreferrer" aria-label="Oilgate Realty on {E(s["name"])}">{svg.get(s["name"], "")}</a>'
        for s in SOCIAL
    ]
    links.append(f'<a href="mailto:{E(EMAIL)}" aria-label="Email Oilgate Realty">{svg["Email"]}</a>')
    return '<nav class="social" aria-label="Oilgate Realty social pages">' + "".join(links) + "</nav>"


def header_html(depth=1, is_home=False, in_sub_direct=False):
    home_href = "../index.html" if in_sub_direct else "index.html"
    prefix = "" if is_home else home_href
    logo_src = rel("previews/img/ovr-primary.webp", depth)
    return f"""<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <div class="top-inner">
    <a class="plate" href="{home_href}" aria-label="Oilgate Vacation Rentals home">
      <img src="{E(logo_src)}" width="720" height="181" alt="Oilgate Vacation Rentals">
    </a>
    <p class="top-location">Akron<span class="loc-comma">,</span> Ohio</p>
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

    return f"""<section class="wave-band" id="pricing" aria-labelledby="cmp-title" data-prices-url="{E(prices_url)}" data-baked-checked-at="{E(checked_at)}">
  <canvas class="wave-mesh-canvas" aria-hidden="true"></canvas>
  <div class="band-inner compare-sec">
    <div class="glass-card compare-panel">
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
  </div>
</section>"""


def before_you_book_html(depth=1):
    bg = AKRON["cascade"]
    rules_items = "".join(f"<div><dt>{E(t)}</dt><dd>{E(d)}</dd></div>" for t, d in RULES_SUMMARY)
    return f"""<section class="broll-band" id="rental-terms" aria-labelledby="rt">
  <img class="broll-bg" src="{E(rel(bg['path'], depth))}" width="{bg['w']}" height="{bg['h']}" alt="{E(bg['alt'])}" loading="lazy" decoding="async">
  <div class="squared-frame">
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


def faq_section_html(depth=1):
    bg = AKRON["evening"]
    items = "".join(f"<details><summary>{E(q)}</summary><p>{E(a)}</p></details>" for q, a in FAQ_ITEMS)
    return f"""<span id="questions"></span>
<section class="broll-band" id="faq" aria-labelledby="fq">
  <img class="broll-bg" src="{E(rel(bg['path'], depth))}" width="{bg['w']}" height="{bg['h']}" alt="{E(bg['alt'])}" loading="lazy" decoding="async">
  <div class="squared-frame squared-frame--narrow">
    <p class="label">Good to know</p>
    <h2 class="sec-title" id="fq">Questions, answered</h2>
    <div class="faq">{items}</div>
  </div>
</section>"""


def footer_html(credit_keys, depth=1, in_sub_direct=False):
    bg = AKRON["skyline"]
    logo_ovr = rel("previews/img/ovr-secondary.webp", depth)
    logo_crew = rel("v5-preview/img/logo-crew.webp", depth)
    logo_realty = rel("v5-preview/img/logo-realty.webp", depth)
    logo_ai = rel("v5-preview/img/logo-ai.webp", depth)
    prefix = "../" if in_sub_direct else ""
    stay_links = "".join(
        f'<p><a href="{prefix}{E(PROPS_DATA["properties"][pid]["page"])}">{E(PROPS_DATA["properties"][pid]["name"])}</a></p>'
        for pid in ORDER
    )
    stay_links += f'<p><a href="{prefix}direct/index.html">Reserve direct</a></p>'

    seen = []
    for k in list(credit_keys) + ["skyline"]:
        if k in AKRON and k not in seen:
            seen.append(k)
    akron_credits = " · ".join(
        f'<a href="{E(AKRON[k]["url"])}" target="_blank" rel="noopener noreferrer">{E(AKRON[k]["label"])} ({E(AKRON[k]["credit"])})</a>'
        for k in seen
    )
    return f"""<footer class="site-footer" id="contact">
  <img class="footer-bg" src="{E(rel(bg['path'], depth))}" width="{bg['w']}" height="{bg['h']}" alt="{E(bg['alt'])}" loading="lazy" decoding="async">
  <div class="wrap">
    <div>
      <span class="plate"><img src="{E(logo_ovr)}" width="720" height="198" alt="Oilgate Vacation Rentals"></span>
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
  </div>
  <div class="footer-bottom-bar">
    <div class="footer-logos" aria-label="Oilgate Crew, Oilgate Realty, and Oilgate AI">
      <img class="logo-crew" src="{E(logo_crew)}" width="159" height="360" alt="Oilgate Crew" loading="lazy" decoding="async">
      <span class="footer-x" aria-hidden="true">×</span>
      <img class="logo-realty" src="{E(logo_realty)}" width="367" height="360" alt="Oilgate Realty" loading="lazy" decoding="async">
      <span class="footer-x" aria-hidden="true">×</span>
      <img class="logo-ai" src="{E(logo_ai)}" width="355" height="360" alt="Oilgate AI" loading="lazy" decoding="async">
    </div>
    <p class="footer-credits">Akron photography via Wikimedia Commons: {akron_credits}. Property photography: Oilgate Realty listings.</p>
  </div>
</footer>"""


def page_shell(title, desc, body_html, credit_keys, depth=1, is_home=False, in_sub_direct=False, property_id="", og_img="v5-preview/img/experience-oakdale-exterior.webp"):
    css_href = rel("v5-preview/assets/v5.css", depth)
    pepper_css = rel("v5-preview/assets/pepper.css", depth)
    js_href = rel("v5-preview/assets/v5.js", depth)
    pepper_js = rel("v5-preview/assets/pepper.js", depth)
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
{header_html(depth=depth, is_home=is_home, in_sub_direct=in_sub_direct)}
<main id="main">
{body_html}
</main>
{footer_html(credit_keys, depth=depth, in_sub_direct=in_sub_direct)}
<aside data-concierge data-property="{E(property_id)}" aria-label="Pepper concierge"></aside>
</body>
</html>
"""


def build_homepage(out_dir, base_depth):
    hero_bg = AKRON["lock3"]
    exp_bg = AKRON["main"]
    exp_photo = rel("v5-preview/img/experience-oakdale-exterior.webp", base_depth)
    cards = []
    for pid in ORDER:
        p = PROPS_DATA["properties"][pid]
        ex = STAY_EXTRAS[pid]
        hi_li = "".join(f"<li>{E(h)}</li>" for h in ex["highlights"])
        cards.append(f"""<a class="card" href="{E(p['page'])}">
  <div class="card-media">
    <img src="{E(rel(ex['card_img'], base_depth))}" width="1100" height="825" alt="{E(ex['card_alt'])}" loading="lazy" decoding="async">
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
  <img class="hero-bg" src="{E(rel(hero_bg['path'], base_depth))}" width="{hero_bg['w']}" height="{hero_bg['h']}" alt="{E(hero_bg['alt'])}" fetchpriority="high">
  <div class="c">
    <h1 id="hero-title">More than just a stay in Akron.</h1>
    <p class="l">Cable TV · Free pay-per-view · Fast Wi-Fi · Free parking</p>
    {booking_form_html("home", depth=base_depth)}
    <p class="slogan-chip"><b>★</b> No cleaning fees, ever.</p>
  </div>
</section>
{marquee_html()}
<section class="wave-band" id="rentals" aria-labelledby="st">
  <canvas class="wave-mesh-canvas" aria-hidden="true"></canvas>
  <div class="band-inner rentals-sec">
    <div class="glass-card rentals-intro">
      <p class="label">Rentals</p>
      <h2 class="sec-title" id="st">Pick your home base</h2>
      <div class="rule"></div>
      <p class="note">Two private 3-bedroom Oakdale units and our completely renovated 3-bedroom Parkgate home. Every stay includes 1 bathroom, smart home entry, and space for up to 6 guests.</p>
      <a class="btn-reserve" href="#availability">Reserve</a>
    </div>
    <div class="cards">{''.join(cards)}</div>
  </div>
</section>
<section class="broll-band" id="experience" aria-labelledby="dy">
  <img class="broll-bg" src="{E(rel(exp_bg['path'], base_depth))}" width="{exp_bg['w']}" height="{exp_bg['h']}" alt="{E(exp_bg['alt'])}" loading="lazy" decoding="async">
  <div class="squared-frame">
    <div class="day-grid">
      <figure class="day-window">
        <img src="{E(exp_photo)}" width="1280" height="853" alt="Sunny blue-sky exterior and cedar deck of our Oakdale home in Akron" loading="lazy" decoding="async">
        <figcaption>Our Oakdale home — private deck &amp; classic Akron charm</figcaption>
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
{pricing_section_html(depth=base_depth)}
{before_you_book_html(depth=base_depth)}
{faq_section_html(depth=base_depth)}"""

    html_doc = page_shell(
        title="Oilgate Vacation Rentals | More than just a stay in Akron.",
        desc="More than just a stay in Akron. Three private 3-bedroom homes with Cable TV, free pay-per-view, fast Wi-Fi, free parking, smart home entry, and no cleaning fees, ever.",
        body_html=body,
        credit_keys=["lock3", "main", "cascade", "evening", "skyline"],
        depth=base_depth,
        is_home=True,
    )
    with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(html_doc)


def build_photo_tour_html(pid, prop_name, base_depth):
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
        for ph in photos:
            src = rel(ph["src"], base_depth)
            alt = ph["alt"]
            cards.append(
                f'<figure class="kinetic-card">'
                f'<button type="button" data-lightbox-src="{E(src)}" data-lightbox-alt="{E(alt)}" data-lightbox-cat="{E(display_name)}" aria-label="View {E(alt)}">'
                f'<img src="{E(src)}" width="{ph["w"]}" height="{ph["h"]}" alt="{E(alt)}" decoding="async">'
                f'<figcaption>{E(alt)}</figcaption>'
                f"</button></figure>"
            )
            all_grid.append(
                f'<figure data-lightbox-src="{E(src)}" data-lightbox-alt="{E(alt)}" data-lightbox-cat="{E(display_name)}">'
                f'<img src="{E(src)}" width="{ph["w"]}" height="{ph["h"]}" alt="{E(alt)}" loading="lazy" decoding="async">'
                f'<figcaption><strong>{E(display_name)}</strong> · {E(alt)}</figcaption></figure>'
            )

        sections.append(f"""<div class="tour-category" id="tour-{E(cslug)}" data-kinetic-gallery data-photo-count="{len(photos)}">
  <div class="tour-cat-head">
    <h3>{E(display_name)}<span class="tour-cat-count">{len(photos)} photo{"s" if len(photos) != 1 else ""}</span></h3>
    <div class="kinetic-nav">
      <button type="button" class="kinetic-btn" data-kinetic-prev aria-label="Scroll {E(display_name)} left">‹</button>
      <button type="button" class="kinetic-btn" data-kinetic-next aria-label="Scroll {E(display_name)} right">›</button>
    </div>
  </div>
  <div class="kinetic-track" data-kinetic-track tabindex="0" aria-label="{E(display_name)} photo gallery">
    {''.join(cards)}
  </div>
</div>""")

    tour_html = f"""<section class="wave-band" id="photos" aria-labelledby="ph-title">
  <canvas class="wave-mesh-canvas" aria-hidden="true"></canvas>
  <div class="band-inner unit-sec">
    <div class="glass-card tour-panel">
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


def build_rental_page(pid, out_dir, base_depth):
    p = PROPS_DATA["properties"][pid]
    ex = STAY_EXTRAS[pid]
    manifest = PHOTO_MANIFEST[pid]
    hero_ph = manifest["hero"]
    about_ph = manifest["about"]
    amenities = clean_amenities(p)
    raw_rules = [re.sub(r"^\d+\.\s*", "", x.strip()) for x in re.split(r"\n\s*\n", p.get("houseRules", "")) if x.strip()]
    rules = [r for r in raw_rules if not re.search(r"shared|both units|other unit", r, re.I)]
    parking_rule = next((r for r in raw_rules if "Park in designated" in r), "Free on-site/street parking available.")
    policies = [(k, re.sub(r"\.([A-Z])", r". \1", v)) for k, v in p.get("policies", {}).items() if k != "Security deposit"]
    tour_html, total_photos = build_photo_tour_html(pid, p["name"], base_depth)

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
  <img class="hero-bg" src="{E(rel(hero_ph['src'], base_depth))}" width="{hero_ph['w']}" height="{hero_ph['h']}" alt="{E(hero_ph['alt'])}" fetchpriority="high">
  <div class="c">
    <h1 id="hero-title">{E(p['name'])}</h1>
    <p class="l">{E(prop_facts_lower(p))} · {E(ex['bed_summary'])} · Smart home entry</p>
    <ul class="hero-stats">{hi_stats}</ul>
    {booking_form_html(f"stay-{pid}", depth=base_depth, fixed_property_id=pid)}
    <p class="slogan-chip"><b>★</b> No cleaning fees, ever.</p>
  </div>
</section>
{marquee_html()}
<section class="wave-band" id="overview" aria-labelledby="ov-title">
  <canvas class="wave-mesh-canvas" aria-hidden="true"></canvas>
  <div class="band-inner unit-sec">
    <div class="overview-grid">
      <div class="glass-card about-box">
        <p class="label">Make yourself at home</p>
        <h2 class="sec-title" id="ov-title">About {E(p['name'])}</h2>
        <div class="rule"></div>
        {''.join(f'<p>{E(para)}</p>' for para in ex['about_paras'])}
        <figure class="about-photo">
          <img src="{E(rel(about_ph['src'], base_depth))}" width="{about_ph['w']}" height="{about_ph['h']}" alt="{E(about_ph['alt'])}" loading="lazy" decoding="async">
        </figure>
        <div style="display:flex;flex-wrap:wrap;gap:12px">
          <a class="btn-reserve" href="#photos">Tour all {total_photos} photos</a>
          <button type="button" class="btn-ghost" data-open-all-photos>See all photos</button>
        </div>
      </div>
      <aside class="arrival-card" aria-label="Arrival details">
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
  </div>
</section>
{tour_html}
<section class="wave-band" id="amenities" aria-labelledby="am-title">
  <canvas class="wave-mesh-canvas" aria-hidden="true"></canvas>
  <div class="band-inner unit-sec">
    <div class="glass-card" style="padding:clamp(22px,3.2vw,38px);border-top:4px solid var(--gold)">
      <p class="label">The details</p>
      <h2 class="sec-title" id="am-title">What’s included</h2>
      <div class="amenity-groups">{''.join(amenity_blocks)}</div>
    </div>
  </div>
</section>
{pricing_section_html(depth=base_depth, only_property_id=pid)}
<section class="wave-band" id="house-rules" aria-labelledby="hr-title">
  <canvas class="wave-mesh-canvas" aria-hidden="true"></canvas>
  <div class="band-inner unit-sec">
    <div class="glass-card" style="padding:clamp(22px,3.2vw,38px);border-top:4px solid var(--gold)">
      <p class="label">A good stay starts here</p>
      <h2 class="sec-title" id="hr-title">House rules</h2>
      <p class="note">Door code sent 2:45 PM · Check-in 3:00 PM · Checkout 11:00 AM (Akron local time)</p>
      <ol class="rules-bullets">{''.join(f'<li>{E(r)}</li>' for r in rules)}</ol>
    </div>
  </div>
</section>
{before_you_book_html(depth=base_depth)}
<section class="wave-band" id="policies" aria-labelledby="pol-title">
  <canvas class="wave-mesh-canvas" aria-hidden="true"></canvas>
  <div class="band-inner unit-sec">
    <div class="glass-card" style="padding:clamp(22px,3.2vw,38px);border-top:4px solid var(--gold)">
      <p class="label">Reservation terms</p>
      <h2 class="sec-title" id="pol-title">Booking policies</h2>
      <div class="policy-grid">{policy_blocks}</div>
    </div>
  </div>
</section>
{faq_section_html(depth=base_depth)}"""

    html_doc = page_shell(
        title=f"{p['name']} · 3-Bedroom Akron Rental | Oilgate Vacation Rentals",
        desc=f"{p['name']}: {prop_facts_lower(p)}. Categorized room photo tour, Cable TV + free pay-per-view, smart home entry, and no cleaning fees, ever.",
        body_html=body,
        credit_keys=["cascade", "evening", "skyline"],
        depth=base_depth,
        is_home=False,
        property_id=pid,
        og_img=hero_ph["src"],
    )
    with open(os.path.join(out_dir, p["page"]), "w", encoding="utf-8") as f:
        f.write(html_doc)


def build_direct_page(out_dir, base_depth):
    direct_dir = os.path.join(out_dir, "direct")
    os.makedirs(direct_dir, exist_ok=True)
    d_depth = base_depth + 1
    hero_bg = AKRON["evening"]
    body = f"""<section class="hero hero--compact" id="availability" aria-labelledby="hero-title">
  <img class="hero-bg" src="{E(rel(hero_bg['path'], d_depth))}" width="{hero_bg['w']}" height="{hero_bg['h']}" alt="{E(hero_bg['alt'])}" fetchpriority="high">
  <div class="c">
    <h1 id="hero-title">More than just a stay in Akron.</h1>
    <p class="l">Cable TV · Free pay-per-view · Fast Wi-Fi · Free parking</p>
    {booking_form_html("direct", depth=d_depth)}
    <p class="slogan-chip"><b>★</b> No cleaning fees, ever.</p>
  </div>
</section>
{marquee_html()}
{pricing_section_html(depth=d_depth)}
{before_you_book_html(depth=d_depth)}"""

    html_doc = page_shell(
        title="Reserve Direct | Oilgate Vacation Rentals · Akron, Ohio",
        desc="Book directly at vacationrentals.oilgaterealty.com for three private 3-bedroom Akron homes with no cleaning fees, ever.",
        body_html=body,
        credit_keys=["evening", "cascade", "skyline"],
        depth=d_depth,
        is_home=False,
        in_sub_direct=True,
    )
    with open(os.path.join(direct_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(html_doc)


def build_404_page(out_dir, base_depth):
    hero_bg = AKRON["civic"]
    links = "".join(
        f'<a class="btn-ghost" href="{E(PROPS_DATA["properties"][pid]["page"])}">{E(PROPS_DATA["properties"][pid]["name"])}</a>'
        for pid in ORDER
    )
    body = f"""<section class="hero hero--compact" id="availability" aria-labelledby="hero-title">
  <img class="hero-bg" src="{E(rel(hero_bg['path'], base_depth))}" width="{hero_bg['w']}" height="{hero_bg['h']}" alt="{E(hero_bg['alt'])}" fetchpriority="high">
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
{before_you_book_html(depth=base_depth)}"""

    html_doc = page_shell(
        title="Page Not Found | Oilgate Vacation Rentals",
        desc="Return to Oilgate Vacation Rentals in Akron, Ohio.",
        body_html=body,
        credit_keys=["civic", "cascade", "skyline"],
        depth=base_depth,
        is_home=False,
    )
    with open(os.path.join(out_dir, "404.html"), "w", encoding="utf-8") as f:
        f.write(html_doc)


def build_pepper_knowledge():
    knowledge = {
        "version": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "source": "Generated from data/properties.json and LaVante's Nov 22 v5 updates.",
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
    assets_dir = os.path.join(V5_PREVIEW, "assets")
    os.makedirs(assets_dir, exist_ok=True)
    with open(os.path.join(assets_dir, "pepper-knowledge.json"), "w", encoding="utf-8") as f:
        json.dump(knowledge, f, indent=2)
        f.write("\n")


def build_target(out_dir, base_depth):
    os.makedirs(out_dir, exist_ok=True)
    build_homepage(out_dir, base_depth)
    for pid in ORDER:
        build_rental_page(pid, out_dir, base_depth)
    build_direct_page(out_dir, base_depth)
    build_404_page(out_dir, base_depth)


def main():
    parser = argparse.ArgumentParser(description="Build Oilgate Vacation Rentals v5.")
    parser.add_argument("--live-root", action="store_true", help="Also build v5 directly to repo root (depth=0).")
    args = parser.parse_args()

    build_pepper_knowledge()
    build_target(V5_PREVIEW, base_depth=1)
    print("Built /v5-preview/ (index.html, 3 rental pages, direct/index.html, 404.html, pepper-knowledge.json).")
    if args.live_root:
        build_target(ROOT, base_depth=0)
        print("Built live root / (index.html, 3 rental pages, direct/index.html, 404.html).")


if __name__ == "__main__":
    main()

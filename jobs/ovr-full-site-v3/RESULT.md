DONE

**State:** Preview live at https://oilgaterealty.github.io/oilgate-vacation-rentals/v3-preview/ (live root pages, `CNAME`, Spaceship DNS, and production `pepper-chat` Worker untouched).

## Preview URLs (all verified HTTP 200 live)

- Homepage: https://oilgaterealty.github.io/oilgate-vacation-rentals/v3-preview/
- Oakdale / Unit 1: https://oilgaterealty.github.io/oilgate-vacation-rentals/v3-preview/unit-1-at-oilgate-at-oakdale.html
- Oakdale / Unit 2: https://oilgaterealty.github.io/oilgate-vacation-rentals/v3-preview/unit-2-at-oilgate-at-oakdale.html
- Oilgate at Parkgate: https://oilgaterealty.github.io/oilgate-vacation-rentals/v3-preview/oilgate-at-parkgate.html
- Direct booking: https://oilgaterealty.github.io/oilgate-vacation-rentals/v3-preview/direct/
- 404 page: https://oilgaterealty.github.io/oilgate-vacation-rentals/v3-preview/404.html
- Preview concierge Worker: `https://pepper-chat-v3-preview.oilgaterealty.workers.dev/chat` (separate free Worker; production `pepper-chat` untouched)
- Screenshots: `jobs/ovr-full-site-v3/screens/` (all 6 pages at `1440px` and `390px`, plus picker-open and concierge-open shots)

## Commits & untouched live blobs

- Preview build commit: `f5bda7e` (`f5bda7e5df38802de1ce0b32e4cd37bca35d0adf`)
- Report commit: pushed immediately after this file (see `git log -n 2` on `main`)
- Live root blobs before and after push (identical byte-for-byte):
  - `HEAD:index.html` = `13ddee7061023a805bb4a0aeed1871338d4e6f2f`
  - `HEAD:unit-1-at-oilgate-at-oakdale.html` = `d70f5767ce056503838307b308bcadea1b8cbd79`
  - `HEAD:unit-2-at-oilgate-at-oakdale.html` = `ae8517b6050434c9909df76f4d2ec6d229d156c0`
  - `HEAD:oilgate-at-parkgate.html` = `2069ce345a3ef249a10f4400ab1a58c5fc7587b6`

## Numbered summary (one action each)

1. Pulled fresh listing facts from Lodgify (`npm run content:pull`) and added LaVante's Parkgate owner override (`3 bedrooms, 3 beds, 1 bath`, source `LaVante, 2026-11-21`) in `scripts/pull-properties.mjs` and `data/properties.json`.
2. Updated Parkgate to `3 bedrooms / 3 beds / 1 bath` in `pepper-knowledge.json`, `README.md`, and `v3-preview/assets/concierge-knowledge.json`.
3. Built the no-AI daily price fetcher (`scripts/prices/fetch-prices.mjs`, `scripts/prices/listings.json`) and ran it live to generate `data/prices.json` for `2026-11-23` through `2026-11-30`.
4. Added free daily GitHub Actions workflow `.github/workflows/daily-prices.yml` (`contents: write` on that job only, commits only `data/prices.json`) plus local CHRONUS44 fallback script `scripts/prices/register-windows-task.ps1`.
5. Downloaded 4 additional free-licensed Wikimedia Commons Akron photos (CC0 / CC BY 2.0) to `v3-preview/img/` so every rental page, `/direct`, and `404` uses different Akron photography from the homepage.
6. Built the shared v3 site generator (`scripts/build-v3.py`, `v3-preview/assets/v3.css`, `v3-preview/assets/v3.js`) generating all 6 `/v3-preview/` pages from `data/properties.json` and `data/prices.json`, and updated `scripts/build-properties.mjs` so it can never bring back the old Cobalt Fieldnotes theme.
7. Built the v3 concierge (`v3-preview/assets/concierge.js`, `concierge-core.js`, `concierge.css`, `concierge-knowledge.json`) renamed "Ask our concierge", styled as a compact reverse-Proceed square button with `sessionStorage` chat history and multi-turn follow-up memory.
8. Deployed a separate free preview Worker (`worker/src/preview.js`, `worker/wrangler.preview.jsonc` -> `pepper-chat-v3-preview.oilgaterealty.workers.dev/chat`) after passing `npm test` and `npm run test:redteam`.
9. Verified all 6 preview pages in Playwright at `1440px` and `390px`, fixed a mobile 8px horizontal overflow and `.arrival-card` button contrast caught in screenshots, re-tested, pushed to `main`, and verified the live preview URLs in a real browser.

## Checklist (JOB.md Section 3, items 1–27)

- [x] **1. Centered larger gold "Akron, Ohio" on logo line:** `v3-preview/assets/v3.css` (`.top-inner`, `.top-location`), rendered in `scripts/build-v3.py` (`header_html`) on all 6 pages.
- [x] **2. Bigger logo at top left:** `v3-preview/assets/v3.css` (`.plate img { height: 54px }`), official `previews/img/ovr-primary.webp`, never recolored.
- [x] **3. No empty gap where "Akron, Ohio" used to sit:** `v3-preview/assets/v3.css` (`.hero` shifted up directly below `.top`).
- [x] **4. Replace headline & retire "whole":** Hero H1 `"Three Akron homes, yours alone"` (selected via Jev `ovr-v3-hero-headline`); `"whole"` appears 0 times on `/direct` & `404` and 1 time on homepage/rental pages (only in the single FAQ answering room vs. private unit).
- [x] **5. Real rental info on hero and cards:** `scripts/build-v3.py` (`STAY_EXTRAS`, `prop_facts`) displays `3 bedrooms · 3 beds · 1 bathroom · up to 6 guests` plus 3 data-backed highlights per rental from `data/properties.json`.
- [x] **6. Larger "No cleaning fees, ever" in middle blue square:** `v3-preview/assets/v3.css` (`.promise-square`, `.promise-main` at `clamp(34px, 4vw, 48px)`).
- [x] **7. "Unless house rules are broken." small in bottom right with star:** `v3-preview/assets/v3.css` (`.promise-exception` bottom-right with gold `★`).
- [x] **8. Top star badge reads only "No cleaning fees":** `scripts/build-v3.py` (`.chip`: `★ No cleaning fees`).
- [x] **9. Hook in at most two places:** Top star badge + middle blue square only (removed from marquee and "An easy Akron day").
- [x] **10. Zero Lodgify wording anywhere guest-visible/audible:** Verified 0 matches (`grep -i lodgify`) across all 6 HTML pages, `concierge-knowledge.json`, and `concierge-core.js`.
- [x] **11. Removed "Open secure Lodgify checkout":** Replaced by unified `Proceed` submit button.
- [x] **12. "Check dates" -> "Proceed" everywhere:** Hero form, Rentals CTA, floating button, rental pages, and `/direct/`.
- [x] **13. Combined booking bar (`Proceed`):** `v3-preview/assets/v3.js` builds `https://checkout.lodgify.com/en/ogr/{id}/reservation?currency=USD&adults={guests}&arrival={arrival}&departure={departure}` directly from rental + dates + guests; verified URL contract against Lodgify's own `renderPortableSearchBar.js` and tested for all 3 rentals.
- [x] **14. Accessible rental picker with hover/focus photos:** `v3-preview/assets/v3.js` + `scripts/build-v3.py` (`role="combobox"`, `role="listbox"`, `role="option"`, keyboard navigation, live preview photo card on hover/focus; selected thumbnail on phones).
- [x] **15. Renamed nav & sections:** `Rentals`, `The experience`, `Real prices` (selected via Jev `ovr-v3-compare-nav-label`), `FAQ`.
- [x] **16. Better comparison table heading (top-right):** `.compare-meta-box` states `"7-night average nightly price"`, exact 7-night window, `2 guests · USD`, and checked date.
- [x] **17. Hotel-grade gold marquee (rules replaced, all true for all 3 rentals):** `3-Bedroom Private Homes`, `Akron, Ohio`, `Full Private Kitchens`, `Cable TV & Fast Wi-Fi`, `Free Parking Included`, `Direct Booking`, `Minutes to Highland Square & Downtown`.
- [x] **18. Fixed marquee-to-Rentals gap:** `.rentals-sec` tightened to `clamp(38px, 4.8vw, 58px)`.
- [x] **19. Tightened Rentals-to-Experience gap:** Balanced `clamp(38px, 4.8vw, 58px)` band rhythm.
- [x] **20. Tightened Experience-to-Real Prices gap:** Matching `clamp(38px, 4.8vw, 58px)` band rhythm.
- [x] **21. "Before you book" squared out with Akron b-roll:** `.broll-band` + `.squared-frame` (`border-radius: 0`) over `akron-from-cascade-plaza.webp` (homepage) and distinct Akron photos on each subpage.
- [x] **22. "The experience / An easy Akron day" squared out, keeping window, with Akron b-roll:** `.broll-band` + `.squared-frame` keeping arched `.day-window` over `akron-main-street.webp`.
- [x] **23. Strong free-licensed Akron photography with footer credits:** 9 verified Wikimedia Commons CC0 / CC BY / CC BY-SA Akron photos across pages; rental pages use `akron-evening-skyline.webp`, `akron-art-museum.webp`, `akron-stan-hywet.webp`, `akron-civic-stage.webp`, `akron-goodyear-airdock.webp` — different from homepage.
- [x] **24. Renamed "Ask our concierge" everywhere:** Button `aria-label`, panel heading, greeting, and `<aside>` label.
- [x] **25. Compact square concierge button styled as reverse of Proceed:** `.concierge-fab` (`72x72px` desktop, `64x64px` mobile; navy `#012342` fill, gold `#FEA802` icon/label/border, opposite of gold/navy Proceed); zero overlap on `390px` and `1440px`.
- [x] **26. Full browser-tab chat memory + follow-up understanding + tests:** `v3-preview/assets/concierge.js` persists full thread in `sessionStorage`, sends bounded recent turns (max 10) to Worker, updates privacy text truthfully, keeps AI intent-only safety rules; unit tests added in `tests/pepper.test.mjs` and verified live.
- [x] **27. Separate free preview Worker deployed:** `pepper-chat-v3-preview.oilgaterealty.workers.dev/chat` (`worker/wrangler.preview.jsonc`), verified HTTP 200 live follow-up reply using free Cloudflare Workers AI (`@cf/google/gemma-4-26b-a4b-it`). Production `pepper-chat` untouched.

## Real data findings (Section 4)

### 4.1 Rental facts & Lodgify API check (`2026-11-22`)
- **Oakdale / Unit 1 (`603326`):** confirmed `3 bedrooms · 3 beds (2 Double, 1 Queen) · 1 bathroom · up to 6 guests`, 37 CDN photos.
- **Oakdale / Unit 2 (`603323`):** confirmed `3 bedrooms · 3 beds (2 Double, 1 Queen) · 1 bathroom · up to 6 guests`, 47 CDN photos.
- **Oilgate at Parkgate (`728474`):** Lodgify API now returns `3 bedrooms · 3 beds (1 Double, 2 Queen) · 1 bathroom · up to 6 guests`, 29 local photos; owner override (`LaVante, 2026-11-21`) also recorded in `data/properties.json`. **Lodgify listing text note for LaVante:** Parkgate's Lodgify description text still says `"Completely renovated 2BR home"` (displayed as `3BR` on v3 preview; update in Lodgify when convenient).

### 4.2 Real 7-night price script run (`data/prices.json`, window `2026-11-23` to `2026-11-30`, 2 guests, USD)

| Rental | Direct (`vacationrentals.oilgaterealty.com/direct`) | Airbnb | Vrbo | Booking.com |
|---|---:|---:|---:|---:|
| **Oakdale / Unit 1** | **$147.02/night** ($1,029.11 / 7n) | **$154.86/night** ($1,084 / 7n) | — (`blocked_or_unpriced`) | — (`blocked_http_202`) |
| **Oakdale / Unit 2** | **$142.27/night** ($995.88 / 7n) | **$149.86/night** ($1,049 / 7n) | — (`blocked_http_429`) | — (`blocked_http_202`) |
| **Oilgate at Parkgate** | **$143.55/night** ($1,004.86 / 7n) | — (`unavailable_http_410`) | — (`no_url`) | — (`blocked_http_202`) |

- **Direct is lowest on every rental where a live OTA comparison returned a price.**
- **Missing URL for LaVante:** Parkgate Vrbo public listing URL was not found in Vault or `str-watch` (`scripts/prices/listings.json` has `"vrbo": null`). Add it there once confirmed.
- **Blocked/unavailable channels (not bypassed):** Booking.com returned HTTP 202 AWS WAF challenge; Vrbo returned HTTP 429 (`Bot or Not?`) on Unit 2 and hid live pricing on Unit 1; Parkgate Airbnb returned HTTP 410. All render cleanly as `—` with zero explanation text on the site.

## Secrets for LaVante to set (never committed, never set by agent)

1. **GitHub Actions repository secret** (Repo Settings -> Secrets and variables -> Actions):
   - `LODGIFY_API_KEY` — required by `.github/workflows/daily-prices.yml` for the daily 7-night Direct quote refresh.
   - If GitHub Actions runners hit Lodgify HTTP 429, run `scripts/prices/register-windows-task.ps1 -Register` on CHRONUS44 to schedule the same script daily from this PC.
2. **Optional preview Worker secrets** (only if you want Gemini primary or live Lodgify quotes on `pepper-chat-v3-preview`; free Cloudflare Workers AI already works without secrets):
   - `GEMINI_API_KEY`
   - `LODGIFY_KEY`

## Checks run & outputs

- `npm test`: **43/43 passed** (`0 failed`), including v3-preview page checks, `data/prices.json` checks, and v3 concierge follow-up memory & prompt-injection tests.
- `npm run test:redteam`: **18/18 passed (100%)**.
- `npm run test:browser`: **3/3 live rental pages passed**.
- Grep check on all 6 `v3-preview/` HTML files (`lodgify`, `tel:`, `call your host`, `suspended`, `not entered`, `prices not`, `ask pepper`, `check dates`, `hot tub`): **0 matches**. Duplicate IDs: **0**.
- Secret scan across all 47 changed/new files: **0 secret hits**.
- Playwright local check on all 6 `v3-preview/` pages at `1440px` and `390px`: **overflow=false, overlap=false, broken=0, errs=0** on every page; rental picker hover photo, `Proceed` checkout URL prefill for all 3 rentals, and concierge `sessionStorage` reload persistence all verified `true`.
- Live GitHub Pages browser check (`https://oilgaterealty.github.io/oilgate-vacation-rentals/v3-preview/`): **HTTP 200 on all 6 pages + `data/prices.json`**, `errs=0`, hydrated prices `$147, $155, —, —, $142, $150, —, —, $144, —, —, —`, live preview Worker follow-up answered Unit 2 driveway parking (`true`).

## Time

- **Start:** `2026-11-22 02:52:27 MST` (`09:52:27 UTC`)
- **End:** `2026-11-22 03:29 MST` (`10:29 UTC`)
- **Total:** ~37 minutes
- **Where time was lost:** First Vault/OneDrive OTA URL scan timed out at 2 minutes before narrowing directly to `.oilgate/str-watch/`; `npm ci` took ~1 minute; one screenshot review pass caught and fixed a 390px 8px `.bfield` grid overflow and `.arrival-card` Proceed link color specificity.

## NOT VERIFIED

1. **Lodgify checkout UI rendering after `Proceed`:** Headless Chromium hit Cloudflare's "Performing security verification" page on `checkout.lodgify.com` (not bypassed). The exact query parameter contract (`currency=USD&adults=...&arrival=...&departure=...`) was verified directly from Lodgify's own `renderPortableSearchBar.js` bundle and tested end-to-end up to navigation for all 3 rentals; please do one human click-through on `Proceed` from the live preview to visually confirm Lodgify's checkout form prefills cleanly.
2. **GitHub Actions `daily-prices.yml` remote run:** Not triggered yet because `LODGIFY_API_KEY` is not yet in GitHub Actions secrets (and agents must not set secrets). Local run of the exact same script succeeded cleanly.
3. **Parkgate Vrbo listing URL:** Not found in Vault or `str-watch`, so left `null` rather than guessed.
4. **Booking.com & Vrbo automated public prices:** Both served anti-bot responses (`HTTP 202` / `HTTP 429`) during the script run and were not bypassed; cells stay blank (`—`).
5. **CI run `45012480970` (`Pepper safety and failover`) on commit `f5bda7e`:** Was still running (`56s`) when checked; local `npm test`, `npm run test:redteam`, and `npm run test:browser` all passed 100% on the same tree.

## Switch-over steps (AFTER LaVante signs off — do not run before sign-off)

1. Promote `/v3-preview/` to the repo root: update `scripts/build-v3.py` output target to `.` (fixing asset paths for root depth 0 and `direct/` depth 1), regenerate `index.html`, the 3 rental pages, `direct/index.html`, `404.html`, and `pepper-knowledge.json`, and update `tests/content.test.mjs` / `tests/browser.mjs` to assert the promoted root pages.
2. Promote the preview Worker: point `worker/wrangler.jsonc` (`pepper-chat`) to the v3 Worker code (`worker/src/preview.js`), set `chatEndpoint` in `concierge-knowledge.json` back to `https://pepper-chat.oilgaterealty.workers.dev/chat`, verify `npm test` + `npm run test:redteam`, and run `npm run deploy:worker`.
3. Add `CNAME` at repo root containing `vacationrentals.oilgaterealty.com`, commit and push to `main`.
4. In Spaceship DNS for `oilgaterealty.com`, add a `CNAME` record: Host `vacationrentals` -> Target `oilgaterealty.github.io` (leaving apex `oilgaterealty.com` on Lodgify untouched).
5. In GitHub repo Settings -> Pages, confirm Custom domain `vacationrentals.oilgaterealty.com` and enable Enforce HTTPS once DNS propagates.
6. Add `LODGIFY_API_KEY` to GitHub Actions secrets and run `Daily 7-night price comparison` once via `workflow_dispatch` (or register `scripts/prices/register-windows-task.ps1 -Register` on CHRONUS44 if GitHub runners receive HTTP 429 from Lodgify).

## One next action

Open https://oilgaterealty.github.io/oilgate-vacation-rentals/v3-preview/ on desktop and phone, click `Proceed` once to verify checkout prefill in your browser, and reply with sign-off (or any tweaks) before promoting to root and `vacationrentals.oilgaterealty.com`.

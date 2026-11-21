# Oilgate AI Website Creation Workflow

First real run: OVR design previews v2, Nov 21, 2026. Reuse these steps for the next site.

## 0. Ground rules for the job
- Push only new files under the agreed folder (here `/previews/`), straight to the default branch. No PR, no force-push, touch nothing else.
- Record the live homepage's git blob before and after the push; they must match.
- Real content only: read it from the repo's data file (here `data/properties.json`). Never invent prices, deposits or phone numbers.
- Free hosting only (GitHub Pages). Free fonts (Google Fonts). Free-licensed photos with credits.

## 1. Study each reference live (about 2 min each)
1. Open the Awwwards page, then the real site, in the browser.
2. Capture a desktop screenshot (1440 wide) and a phone screenshot (narrowest the browser allows; 500 here).
3. Write `research/<site>.md`: layout, type scale, fonts and close free matches, palette, spacing, motion, image treatment, nav pattern, and what makes it recognizable.
4. Note anything you could not see (popups, sign-in walls) instead of guessing.
5. Do not copy the reference's own headlines or text; copy the structure.

## 2. Build a shared content layer once
- `tools/content.py` holds every real fact (stays, rules, FAQ, booking channels, contact, photo credits) and small HTML helpers (booking form, compare list, rules, FAQ, social icons, credits).
- `assets/book.js` is the one booking search: stay + dates + guests opens the real checkout (Lodgify) with those values. No price is shown or guessed.
- Logos: crop the official transparent PNGs to their bounding box and save as WebP in `img/`. On dark designs put the logo on a white plate; never recolor it.

## 3. Build one design per reference
- `tools/build.py` has one function per design, each with its own CSS and layout, all fed by `content.py`.
- Every page has, in this order: booking date search at the very top, hero, the stays, compare booking options, rules and terms, FAQ, footer.
- Must include: the cleaning promise and its exception, the 18+ rule. Must not include: phone numbers, a "Call your host" tab, deposits, prices, "Prices in USD".
- Accessibility basics on every page: skip link, real labels, focus ring, alt text, `prefers-reduced-motion`, gold only as a fill behind navy text.
- Run: `python3 previews/tools/build.py`

## 4. Build the preview page
- `index.html` lists every design with its name, reference, a one-line description, an "Open full page" link, and two live frames: desktop (1280×800) and phone (390×844), scaled with a ResizeObserver so they fit any screen. Frames lazy-load.

## 5. Check before pushing
```
cd previews
grep -il 'tel:\|call your host\|prices in usd\|deposit' 0*.html   # must print nothing
grep -c '\$' 0*.html                                             # must be 0 for every file
grep -c 'No cleaning fees, ever' 0*.html                         # must be 1+ for every file
```
- Parse each page for unclosed tags and duplicate ids (small Python HTMLParser check).

## 6. Publish
```
git rev-parse HEAD:index.html          # before
git add previews && git status --short # only previews/ lines
git commit -m "Add six homepage design previews under /previews/"
git -c push.negotiate=true push origin main
git rev-parse HEAD:index.html          # after, must equal before
```
- Then open the live preview URL and the live homepage in the browser and confirm both load.

## 7. Report
- `HANDOFF.md`: preview URL, page URLs, commit, research notes, start/end/total time, where time was lost.
- `WAKE.md`: what the next bot should do.
- Wake the reviewer bot (Pepper) with the wake script on the PC.

## Lessons from this run
- Sites with popups in iframes can't be dismissed by the automation browser: capture the hero and read the page structure instead.
- The container's network blocks Wikimedia and the Lodgify image CDN, so reuse photos already in the repo and keep their credits.
- A sign-in wall (oilgatelinks.com/app) means building from the owner's description, not from the page.
- The PC wake script can't run from the cloud container; the coordinator or LaVante's PC has to run it.

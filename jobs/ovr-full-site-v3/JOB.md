# JOB: OVR full site v3 (every page in the Oilgate Signature theme, real price comparison)

- **Builder:** Antigravity (Neon), as orchestrator. LaVante, 2026-11-21: "go give this to Neon as an orchestrator, anti-gravity, to really get to work on it." Grok never codes.
- **Owner:** LaVante. **Area:** Momo (UI/UX & Web Design) for Pepper's short-term rentals.
- **Written:** 2026-11-21 by Claude Duet (uxui-web-design-momo channel), from LaVante's own messages of 2026-11-21 20:41 and 21:05 UTC.
- **Repo:** `oilgaterealty/oilgate-vacation-rentals`, branch `main`, GitHub Pages from `main` at `/`.
- **Live now:** https://oilgaterealty.github.io/oilgate-vacation-rentals/ (design 6 "Oilgate Signature" is the live homepage since commits `21485a2`..`9e47e54`). Old homepage: `backup/index-2026-11-21.html`. Design previews: `/previews/`.

## 0. Before you start

1. Read the live Oilgate Index, then Core Agent Rules, then Daily Memory and Notes Rules. Run your compliance bootstrap as agent `antigravity`. Use Jev for real judgment calls (not for anything this file already decides).
2. Write `jobs/ovr-full-site-v3/PROGRESS.md` with the start time. Add a line after each step, so an interruption loses nothing.
3. Record the live homepage blob: `git rev-parse HEAD:index.html`. It must be the same at the end (see section 6).
4. Read these first, they explain how the site works today:
   - `previews/HANDOFF.md`, `previews/WORKFLOW.md` (how design 6 was built and checked)
   - `scripts/build-home.py` (builds the live homepage from design 6) and `previews/tools/content.py`
   - `scripts/build-properties.mjs` (builds the three rental pages; they are still in the OLD "Cobalt Fieldnotes" look: `styles.css`, `.masthead`)
   - `data/properties.json` (all listing facts), `PEPPER.md`, `pepper.js`, `worker/src/index.js`
   - `previews/assets/book.js` (own booking form that opens checkout with stay, dates and guests)

## 1. LaVante's words (the source of truth for this job)

> "we this we need all of the unit pages to also be in the same fucking theme as the as the homepage. I didn't want just a homepage created. I wanted everything created. Um, Homepage can be the motivation. Maybe we just yeah, that can be the motivation. We use different stock images for that page."

> "I want to move the Akron, Ohio text to be centered at the top. You know, same line as the logo on the far left, but larger. And I mean, we can create a better saying than a whole home right in Akron. Like what? What the hell? Booked whole. Like it's just whole is the word whole is all over this. It's like you got no fucking info on the actual unit at all."

> "no cleaning fees ever, unless house rules are broken. Two places on the website, just too much. Um, like we can have it in both places. Uh, but where it's at in the middle of the screen should be larger, unless house rules are broken. Can be. I feel like this is the perfect place for it to truly go in the bottom right, with a star of that blue square. Uh, Smaller text. The no cleaning fees ever is still the hook, the main hook, and then where it's up at the top where it says no cleaning fees ever unless house rules are broken. Uh, at the top, it should just say no cleaning fees where it has the star."

> "obviously, after we do the actual on top of the stay changes, it won't say open secure log and logify anymore. That's dumb. ... even if it was like this, we don't need to mention logify. Check dates is not like not even check dates. Like it should just be proceed. Because once I book it, it shows, the next page anyway. ... worst case if we couldn't combine them, that's how it would be. It would just jump straight to contact next."

> "when you do the drop down for the units and choose your stay, we should have images of the units, like when you scroll over them at least. And Parkgate is not fucking 2 beds; it's ... 3 beds, 3 bedrooms, 1 bath"

> "Units sounds pretty plain. Rentals maybe, probably rentals, and then the experience maybe next, and then compare with real numbers and better text for the top right corner too ... Table heading."

> "after we move the yellow Akron, Ohio up, we can obviously move everything else up, so there's not a random gap. And I feel like the logo can be bigger ... top left. ... We can change the scroll bar to shit other than rules. ... Just think like a actual fucking hotel."

> "the gap between that scroll bar and the stays is a little big, or what was previously known as the stays is a little too small. Um, the gap between pick your home base and your stay and easy Akron day, like that gap is also too big. Same with the next one, just the gap's too large."

> "it feels like we should have one more like cool image. ... I think the before you book section should be squared out, the text, and then another cool uh, image from that site there, and then I think the your stay and easy Akron day, that shit can be squared out while still keeping that window and keeping it and putting a cool b-roll image from Akron behind that too."

> "I asked Pepper a question ... It's not following the convo, man. ... Should be able to see what you said before. uh the button just looks like it doesn't belong in the app. ... like ask our assistant or something. And it should be a much smaller square. ... It should be in the same theme as the check dates button, but maybe the reverse instead to switch it up."

> "we need to get that script done ... the state comparison ... needs to be a functioning feature of the site. ... oilgatevacationrentals.com/direct, that's what it should say. ... if it gives the average night for the next, you know, week, and probably specify that that's what it's giving ... it's just saying real shit like, oh, it's suspended until February 5th. Like, it's only suspended at Airbnb, so there's no fucking reason to mention that. And yeah, it should probably just be the average of all, because the idea is that Oilgate Realty is always going to be the lowest. But yeah, that has to work. It's not for bullshit, for fun."

His answers to the six questions (21:05 UTC):
> "vacationrentals.oilgaterealty.com should be the real domain. oilgaterealty.com But Oilgate Realty is currently on Logify. There's a process for getting that switched. So for the interim, oilgaterealty.com will be vacationrentals.oilgaterealty.com does that make sense? 2 yes 3 yes. 4 all br 1 bath 5. ok 6 use Neon as an orchestrator."

Meaning of those answers:
- Domain: the site will live at **vacationrentals.oilgaterealty.com**. `oilgaterealty.com` stays on Lodgify for now. You do not touch DNS (section 6).
- Q2 yes: price compare = average nightly price for the next 7 nights, per rental, on Direct, Airbnb, Vrbo and Booking.com, each labeled as a 7-night average, no suspension or other notes.
- Q3 yes: a plain no-AI script on a free daily schedule updates the prices.
- Q4: every rental has 1 bathroom. Parkgate is 3 bedrooms, 3 beds, 1 bath (his words). Oakdale counts come from Lodgify.
- Q5 ok: Pepper becomes "Ask our concierge", a small button styled as the reverse of the Proceed button, and remembers the whole chat.

## 2. Scope

Every page of the site, rebuilt in the design 6 "Oilgate Signature" theme, with the homepage as the model:
- `index.html` (homepage)
- `unit-1-at-oilgate-at-oakdale.html`
- `unit-2-at-oilgate-at-oakdale.html`
- `oilgate-at-parkgate.html`
- `404.html`
- new `direct/index.html` (see 4.3)
- any other public page you find (`lodgify-widget.html` is an internal frame; keep it working, restyle nothing visible there unless needed)

The rental pages keep all their real content: every real photo in their galleries (Oakdale 1 and 2 use the Lodgify CDN photos, Parkgate the 29 local photos), amenities, house rules, check-in and check-out, policies shown today, the per-rental booking box and Pepper. They get the homepage's header, type, colors, buttons, spacing and footer, plus **different Akron stock photos from the homepage** (free-licensed, credited, see 5).

Build them from code, not by hand: extend `scripts/build-home.py` / `previews/tools/content.py` (or one new build script) so all pages come from `data/properties.json` and one shared layout. `scripts/build-properties.mjs` must not bring the old look back.

## 3. Visual and copy checklist (do every item; tick each in RESULT.md)

Header and hero
1. Put "Akron, Ohio" (the gold text) **centered at the top, on the same line as the logo**, larger than it is now.
2. Make the logo **bigger** at top left. Keep the official logo files (`previews/img/ovr-*.webp`), never recolor them.
3. After moving "Akron, Ohio" up, move everything else up so there is **no empty gap** where it was.
4. Replace "A whole home, right in Akron" with a better headline. **Retire the word "whole"** across the site ("booked whole", "Whole homes", "whole-unit", "whole place", "Your whole home is ready"...). Use it at most once, only where it answers a real question (for example the FAQ about booking a room vs the full unit).
5. Give **real rental info** instead: on each rental card and in the hero line, bedrooms, beds, bathrooms, max guests and two or three true highlights taken from `data/properties.json` (for example private kitchen, FireTV with cable in each bedroom, washer and dryer, driveway parking). Only claims the data supports for that rental.

The cleaning-fee hook
6. The hook "No cleaning fees, ever" stays the **main hook**. Where it sits in the middle of the screen, make it **larger**.
7. "Unless house rules are broken" moves to the **bottom right** of that blue square, in **smaller text**, with a **star** on the blue square.
8. Where it appears at the top with the star, it reads just **"No cleaning fees"**.
9. Overall: the hook in no more than two places, each with one job (big hook, small star badge). His wording is in section 1; compare against the live page so the placement matches what he described.

Booking
10. **No mention of Lodgify anywhere a guest can see or hear**: page text, buttons, links, captions, fine print, FAQ answers, meta description, Pepper's panel, and accessible names (iframe titles, aria-labels). The checkout itself still runs on Lodgify; just don't name it.
11. Remove "Open secure Lodgify checkout".
12. "Check dates" becomes **"Proceed"** everywhere (hero, cards, floating button, rental pages).
13. Combine the steps: rental + check-in + check-out + guests + **Proceed** opens the checkout with those values already filled, so the guest lands straight on the contact/checkout step. Start from `previews/assets/book.js`. Test that the checkout really receives the dates and guests for all three rentals. If it can't, fall back to the date widget, renamed, with no Lodgify wording (his "worst case").
14. The rental picker ("choose your stay") shows **photos of each rental on hover** (and on keyboard focus). On phones, show the selected rental's photo. It must stay keyboard and screen-reader friendly, so build a real accessible listbox, not a hover-only trick.

Navigation and sections
15. Rename the nav and section labels: **Stays -> Rentals**, **Your stay -> The experience** (next), **Compare -> compare with real numbers** (pick short final wording, for example "Real prices"). Keep FAQ.
16. Write a **better table heading** for the comparison (the "top right corner" he pointed at). Say plainly what it shows: the 7-night average nightly price, per rental, per booking site, and the date it was checked.
17. The gold scrolling bar (marquee): **replace the rules** in it with what a good hotel would say. Every item must be true for every rental it covers, per `data/properties.json` (no shared walls, hot tubs or other claims the data doesn't back for all three).

Spacing
18. Fix the gap between the gold scrolling bar and the Rentals section ("a little big" / "a little too small", match it to the rest of the rhythm).
19. Tighten the gap between "Pick your home base" and "Your stay / An easy Akron day". It is too big.
20. Tighten the gap after that one too ("Same with the next one").

Images and boxes
21. **"Before you book"** (rules and terms): put the text in a squared box, with a strong Akron b-roll photo beside or behind it.
22. **"Your stay / An easy Akron day"**: square it out too, keep its window, and put an Akron b-roll photo behind it.
23. Add one more strong image where the page feels thin (he suggested these two sections). Free-licensed photos only, credited in the footer like today.

Concierge (Pepper)
24. Rename "Ask Pepper" to **"Ask our concierge"** everywhere a guest sees it (button, panel title, greeting). The bot can still be Pepper internally.
25. Make the button a **much smaller square**, styled as the **reverse of the Proceed button** (for example, if Proceed is gold with navy text, the concierge button is navy or white with gold), so it looks like it belongs to the site. It must not cover the Proceed button on phones (see `6f13937`).
26. It must **remember the whole conversation** in the browser tab: keep the turns in `sessionStorage`, show them, and send the recent turns (bounded, for example the last 10) to the Worker so follow-up questions are understood. Keep the safety design in `PEPPER.md`: AI still only classifies intent; answers are still assembled in code; no prices it can't verify; card numbers still rejected. Update the privacy line so it stays true (history kept only in this browser tab, cleared when it closes). Add tests for a follow-up question that needs the earlier turn.
27. Worker: prefer a separate free preview Worker for the preview pages, so the live chat isn't changed before sign-off. If that isn't possible on the free plan, keep the change backward compatible and deploy only after `npm test` and `npm run test:redteam` pass.

## 4. Real data

### 4.1 Rental facts
- Every rental: **1 bathroom**.
- **Parkgate: 3 bedrooms, 3 beds, 1 bathroom** (LaVante, 2026-11-21). Lodgify's API still says 2 bedrooms / 2 beds, so add an owner override in `data/properties.json` with its source and date. The owner's words win over the API. Don't change the Lodgify listing; list the mismatch in RESULT.md so LaVante can fix the listing himself.
- **Oakdale Unit 1 and Unit 2:** pull bedrooms, beds (with types) and max guests from Lodgify with `npm run content:pull` (needs `LODGIFY_API_KEY` in the process environment on the PC). The last pull (2026-11-21 00:57 UTC) said both are 3 bedrooms, 3 beds (2 double, 1 queen), 1 bath, up to 6 guests. Confirm with a fresh pull; **never guess**. If the pull fails, keep the last pulled values and say so.
- Parkgate max guests: from Lodgify (last pull: 6).
- Fix every place that says Parkgate is 2 bedrooms or 2 beds (titles, meta, cards, Pepper knowledge `pepper-knowledge.json`, README).

### 4.2 Price comparison (a real feature, not a placeholder)
Replace the whole "Comparison layout only — prices not entered" box.

What the page shows, per rental:
- One row per booking site: **Direct** (labeled `vacationrentals.oilgaterealty.com/direct`), **Airbnb**, **Vrbo**, **Booking.com**.
- The **average nightly price for the next 7 nights** on that site, clearly labeled as a 7-night average, with the date it was checked.
- **No suspension notes, no deposit notes, no "not verified" text.** If a site can't be read for a rental, show nothing for that cell (an empty or "—" cell, no explanation). Never a made-up or estimated number.
- Show the truth. If Direct is not the lowest for some rental, the numbers still show as read, and RESULT.md says so for LaVante.

The script:
- Plain code, **no AI**. Lives in `scripts/prices/` (Node or Python stdlib). Writes `data/prices.json` with, per rental and site: the 7 nightly prices it averaged, the average, the source URL it read, and the time.
- The page reads `data/prices.json`. Data older than 48 hours shows nothing (stale = blank, not old numbers).
- **Direct:** from Lodgify (rates or quote for each of the next 7 nights, same rental, 1 night each or the 7-night quote divided by 7; say which in the label tooltip or fine print). USD.
- **Airbnb, Vrbo, Booking.com:** each rental's own public listing page. Find the listing URLs from sources LaVante already has (Lodgify channel connections, the STR automation scripts on the PC, Super Lab STR pages, his mail). **Never guess a listing URL.** If one can't be found, leave it blank and list it in RESULT.md for LaVante. Read only public prices with no sign-in. Do not get around bot checks, CAPTCHAs or rate limits; if a site blocks the script, that cell stays blank and RESULT.md says which site blocked it.
- **Schedule:** GitHub Actions, daily (free), with `workflow_dispatch` for a manual run. It commits only `data/prices.json` to `main` when it changed. Permissions: `contents: write` for that job only.
- **Secrets** only in GitHub Actions secrets (for example `LODGIFY_API_KEY`). Never in the repo, logs or the page. Never print them.
- Known risk (see `PEPPER.md`): Lodgify answered HTTP 429 to Cloudflare's servers as an unregistered API user, while direct reads from the PC worked. If GitHub's runners get the same 429, run the **same script** from a Windows scheduled task on CHRONUS44 instead (daily, plain script, commits `data/prices.json`), and say so in RESULT.md. Don't route around Lodgify's block any other way.
- Run it **once successfully** before you call the job done, and show the output in RESULT.md.

### 4.3 The /direct page
Create `direct/index.html` so the label `vacationrentals.oilgaterealty.com/direct` is a real address: a short page in the same theme that goes straight to the booking box (rental, dates, guests, Proceed). Link the Direct row to it.

## 5. Rules that still apply

- No phone numbers, no "Call your host", no `tel:` links.
- No made-up prices, deposits or claims. Every fact comes from `data/properties.json`, Lodgify, a page the script read, or LaVante's words in section 1.
- Guests 18+ stays on every page. Keep the rental terms (damage and liability line) in "Before you book".
- Keep the booking flow working end to end on every page.
- **Free tools only.** Free hosting (GitHub Pages), free fonts, free-licensed photos with credits. No paid services, no trials, no paid APIs. Nothing bought.
- **Do NOT use the Oilgate website design standard or its checker** for this job (LaVante, Nov 21: its templates make sites look generic).
- Keep accessibility basics: skip link, real labels, visible focus, alt text, `prefers-reduced-motion`, gold only as a fill behind navy text.
- Update the repo's tests to the new copy instead of deleting coverage. `npm test` must pass.
- No AI waking AI. No outside messages to guests, Lodgify, channels or anyone.

## 6. Delivery (preview first)

1. Build everything to a **preview path: `/v3-preview/`** (homepage, three rental pages, `/v3-preview/direct/`, 404). Relative links inside the preview stay inside the preview.
2. The **live homepage, the live rental pages, the domain and DNS stay untouched** until LaVante signs off. `git rev-parse HEAD:index.html` and the blobs of the three live rental pages must be the same before and after your pushes. The price workflow may write `data/prices.json`, which the live pages don't read yet.
3. Commit to `main` and push. Never force-push. No pull request. Never put a token in a remote URL. Check `git status` shows only your intended files before each commit, and check the diff for secrets.
4. **Final domain: `vacationrentals.oilgaterealty.com`.** `oilgaterealty.com` stays on Lodgify for now. **Do not touch Spaceship DNS** and don't add a `CNAME` file yet. After sign-off, LaVante decides the switch: promote `/v3-preview/` to the root, then add `CNAME` and the DNS record. Write the exact steps for that in RESULT.md, but don't do them.

## 7. Done means

1. Every page in section 2 is in the new theme on `/v3-preview/`, checked in a real browser at **1440 wide and phone width (390 or 500)**, with screenshots saved under `jobs/ovr-full-site-v3/screens/`.
2. Every item 1-27 in section 3 is ticked in RESULT.md with where it is.
3. Booking reaches the checkout with the right rental, dates and guests from every page (all three rentals).
4. The price script ran once successfully; `data/prices.json` exists; the comparison shows real numbers or blanks, never placeholders.
5. Grep checks print nothing on the preview pages: `lodgify` (case-insensitive, visible text and attributes), `tel:`, `call your host`, `suspended`, `not entered`, `prices not`.
6. `npm test` passes. Live homepage and rental-page blobs unchanged.
7. RESULT.md lists anything not verified.

## 8. Report

- Write `jobs/ovr-full-site-v3/RESULT.md` in the i-have-adhd shape: first line DONE, STUCK or NEEDS LAVANTE; numbered steps, one action each; state (preview live / pushed not live / blocked on X); the preview URL https://oilgaterealty.github.io/oilgate-vacation-rentals/v3-preview/; commit hashes; checks run with output; start, end, total time and where time was lost; NOT VERIFIED list; the switch-over steps for after sign-off; one next action.
- Commit and push RESULT.md (and `screens/`) to `main`, so Claude Duet in the Momo channel can read it from the repo.
- Append a dated entry to today's Oilgate daily note through the normal governed route.
- Do **not** wake, message or start any other AI or bot when you finish (no AI waking AI). LaVante or Claude Duet reads RESULT.md.

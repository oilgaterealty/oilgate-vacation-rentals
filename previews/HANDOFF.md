# Handoff: OVR design previews v2

Job: six full OVR homepage designs on one preview page (first real run of the Oilgate AI Website Creation Workflow, see WORKFLOW.md).

## Links
- Preview page: https://oilgaterealty.github.io/oilgate-vacation-rentals/previews/
- 1 Castle Calm (Schlosshotel Kitzbühel): https://oilgaterealty.github.io/oilgate-vacation-rentals/previews/01-castle-calm.html
- 2 Rubber City Club (Club Charlestown): https://oilgaterealty.github.io/oilgate-vacation-rentals/previews/02-rubber-city-club.html
- 3 Key Stay (Key): https://oilgaterealty.github.io/oilgate-vacation-rentals/previews/03-key-stay.html
- 4 Akron Linked (LaVante's oilgatelinks.com theme): https://oilgaterealty.github.io/oilgate-vacation-rentals/previews/04-akron-linked.html
- 5 Akron Photo (free Akron photos): https://oilgaterealty.github.io/oilgate-vacation-rentals/previews/05-akron-photo.html
- 6 Oilgate Signature (best of 1-3, imagery of 4): https://oilgaterealty.github.io/oilgate-vacation-rentals/previews/06-oilgate-signature.html
- Research notes: https://oilgaterealty.github.io/oilgate-vacation-rentals/previews/research/ (and research/*.md in the repo)

## Commits (main, previews/ only)
- 989cbed: six designs, preview page, research, tools.
- c4cad1a: copy fixes (logo CSS on 1, removed claims not in the listing data), HANDOFF.md, WAKE.md. See `git log -- previews`.
- Live homepage blob `index.html` = dd700094348469bf8b42bc38294b230debf1e737 before and after both pushes.

## Checks run
- No `tel:`, "Call your host", "Prices in USD", "deposit", or `$` in any design.
- "No cleaning fees, ever" plus "unless house rules are broken" and the 18+ rule on every design.
- HTML parse: no unclosed tags, no duplicate ids.
- Viewed live in a browser: all six designs at 1440 wide, preview page at 500 wide.

## Time
- Start: 14:08 UTC, Nov 21 2026.
- End: 14:30 UTC, Nov 21 2026 (second push deployed and checked).
- Total: 22 minutes.

## Where time was lost
- Reference sites: cookie and booking popups inside iframes the automation browser can't close.
- oilgatelinks.com/app is behind a sign-in; design 4 was built from LaVante's description, not the live page.
- Container proxy blocks Wikimedia and the Lodgify image CDN, so photos came from files already in the repo.
- GitHub Pages deploy wait (about 1 minute per push, page 404s until it finishes).
- Two copy passes to remove claims the listing data doesn't support (shared walls, washer and dryer at every home, blackout curtains in every bedroom, own front door).

## Not done
- Pepper wake: the wake script runs on LaVante's PC (PowerShell). This cloud session has no PC shell, so it was not run. Run:
  `powershell -File C:\Users\vtae4\.oilgate\wake\wake-bot.ps1 -Bot pepper -AgentId 9a9d43c9-c0f7-4a93-b0fb-fbdc3cd626e2 -Job "OVR design previews v2" -File <job>\WAKE.md`
- Bridge photo for design 4 not found in the repo; used the Lock 3 canal photo instead.
- Design 5 has no Adobe Stock link (no verified URL); it uses free Wikimedia Commons photos with credits.

## Update: design 6 is now the live homepage (Nov 21, 15:4x UTC)
LaVante asked for design 6 over the real site.
- Old homepage saved at `backup/index-2026-11-21.html`. Roll back: `git show <this commit>~1:index.html > index.html`, or copy the backup over index.html, then commit and push.
- New homepage is built by `python3 scripts/build-home.py` (design 6 layout, real content from data/properties.json).
- Carried over from the old page: the real Lodgify date widget and stay picker (property-ui.js), the "Open secure Lodgify checkout" link, the owner's comparison box word for word, the rental terms (18+, liability), Pepper guest assistant, title, description and og tags, favicon, email and social links.
- `scripts/build-properties.mjs` no longer overwrites index.html, so a content rebuild won't bring the old homepage back.
- Repo tests: `npm test` 39 of 39 pass, including the homepage content test.

Follow-ups (Nov 21): 6f13937 lifts the "Check dates" button above Pepper on phones (they overlapped at 500px). 19b4287 adds a #questions anchor so stay pages' "Good to know" links still land on the homepage FAQ. Live checks at 1440 and 500 wide: page loads, Lodgify widget loads, stay picker switches widget and checkout link (Parkgate -> 728474), three stays show, Parkgate stay page still loads. CI "Pepper safety and failover" passed on 21485a2.

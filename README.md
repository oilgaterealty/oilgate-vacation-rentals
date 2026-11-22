# Oilgate Vacation Rentals

Static site for three real whole-unit stays in Akron, Ohio, hosted on GitHub Pages. Pepper provides listing facts, live chat, date-bound quotes and native Lodgify widgets through the existing Worker. See [PEPPER.md](PEPPER.md) for safety and deployment. No credentials are stored in the frontend.

Booking links open existing Lodgify checkouts in USD. Current prices, deposits and cancellation terms come from Lodgify checkout or fresh request-bound quotes. Parkgate is excluded from Airbnb comparisons while suspended (source date November 16, 2026; recheck after February 5, 2027).

Design: Cobalt Fieldnotes, original static HTML/CSS with two font families. References are cited in each page's footer HTML comment. Publication here does not change oilgaterealty.com, DNS, or Lodgify settings.

## Assets

Property photographs are the owner-supplied local copies of existing public Lodgify CDN media in the November 16 draft. Optimized to WebP without invented or AI-generated property scenes. The excluded generated Parkgate image is not shipped. Captions and alt text preserve inspected source descriptions. Property use is authorized by the owner's site-redesign request; no third-party stock photographs are used.

DM Sans is locally hosted under the SIL Open Font License; see assets/OFL.txt. Georgia uses the viewer's installed font.

## Maintenance

`data/properties.json` is the shared source for all four rental pages and `pepper-knowledge.json`. Run `npm run content:pull` with the existing process environment `LODGIFY_API_KEY`, then `npm run build`. The pull uses only the three approved property IDs, strips host telephone fields, and stores public listing facts rather than raw API responses. Lodgify API facts win over stale public page facts; owner-supplied cleaning and rental terms are attributed separately. Missing facts remain blank and are reported in the data file.

Oakdale galleries display all 37 and 47 real Lodgify CDN photos; Parkgate retains the existing 29 local photos. Photo links open the original image. Parkgate is 2 bedrooms / 2 beds. Financial terms require current checkout verification; source deposit snapshots are not advertised as fixed amounts. The comparison boxes retain their unverified placeholders because no matching cross-channel quotes were pulled.

Run `npm run design:check`, `npm test`, `npm run test:browser`, `npm run test:redteam`, `npm run test:live`, and `npm run test:content`. Set `PEPPER_SITE` to the GitHub Pages URL for live browser verification and `CONTENT_PROOF_DIR` for screenshots and proof JSON. The content verifier checks exact live HTML bytes, all gallery counts, top widget placement, expanded calendar height, phone privacy, terms, and all 113 source image URLs. Run the shared Oilgate website design checker separately when available.

Relative links support the GitHub Pages project path. Pages deploys `main` at `/`. Deploy the existing Pepper Worker after rebuilding its bundled knowledge. No site domain/DNS/CNAME change is part of this release. The external Lodgify widget currently renders its controls but its vendor APIs can return HTTP 403 in automated browsers; the secure checkout link remains available. Record this separately from site-owned test results.

## Oilgate Signature v3 (preview only)

`npm run build` generates the six pages under `v3-preview/`. It does not rewrite the live pages. Parkgate capacity in this preview is three bedrooms, two queen beds and one full bed, one bath, up to six guests. Oakdale capacity was rechecked against the booking provider.

`python3 scripts/prices/collect.py` refreshes only the public comparison snapshot. Set `LODGIFY_API_KEY` as a GitHub Actions repository secret for the scheduled direct data read. External listings without a verifiable dated USD offer are left empty. Never add keys or raw responses to Git. Concierge is deterministic unless a separately deployed preview Worker is explicitly configured.

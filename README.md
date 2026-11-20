# Oilgate Vacation Rentals

Static site for three real whole-unit stays in Akron, Ohio, hosted on GitHub Pages. Pepper provides listing facts and native Lodgify widgets; its Worker source is included but live chat activation is gated. See [PEPPER.md](PEPPER.md) for safety, tests, deployment and current blockers. No credentials are stored in the frontend.

Booking links open existing Lodgify checkouts in USD. Current prices, deposits and cancellation terms come from Lodgify checkout or fresh request-bound quotes. Parkgate is excluded from Airbnb comparisons while suspended (source date November 16, 2026; recheck after February 5, 2027).

Design: Cobalt Fieldnotes, original static HTML/CSS with two font families. References are cited in each page's footer HTML comment. Publication here does not change oilgaterealty.com, DNS, or Lodgify settings.

## Assets

Property photographs are the owner-supplied local copies of existing public Lodgify CDN media in the November 16 draft. Optimized to WebP without invented or AI-generated property scenes. The excluded generated Parkgate image is not shipped. Captions and alt text preserve inspected source descriptions. Property use is authorized by the owner's site-redesign request; no third-party stock photographs are used.

DM Sans is locally hosted under the SIL Open Font License; see assets/OFL.txt. Georgia uses the viewer's installed font.

## Maintenance

Edit HTML, styles.css, tokens.css and pepper-knowledge.json. Relative links support the GitHub Pages project path. No site DNS/CNAME migration is configured. The Pepper Worker custom domain is separately authorized by its build specification and remains setup-gated.

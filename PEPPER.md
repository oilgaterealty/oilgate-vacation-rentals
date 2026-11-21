# Pepper guest assistant

Pepper's static quick answers and Lodgify widgets are available independently of the Worker. `pepper-knowledge.json` is the shared source for listing facts; unknown pet policies refer guests to the host. Chat is active at `https://pepper-chat.oilgaterealty.workers.dev/chat`, restricted to the GitHub Pages origin. Live financial data remains blocked as described below.

## Safety design

AI classifies a guest question into eight allowed intents. It cannot write guest-facing prose. Every answer is assembled in code from the shared knowledge or a fresh, request-bound Lodgify response. Model output outside the intent allowlist is a failure and triggers failover. Sensitive requests refer guests to the host. No chat history, full IPs, provider error bodies, or messages are logged. Card-number patterns are rejected before an AI call. Never send personal information.

The Worker uses GET-only Lodgify quote and availability routes, fixed host and property allowlists, redirect refusal, input/body limits, and no reservation/payment tools. Quote context must match rental, dates, room type and guest count. It does not sum taxes, fees, deposits or totals. Only USD values supplied by the quote can appear as money. Recognized provider cancellation wording is copied by code; unknown policies are deferred to checkout. Outage responses do not estimate prices or claim dates are held.

Verified Lodgify mapping: Oakdale 1 `603326` / room `670117`; Oakdale 2 `603323` / room `670114`; Parkgate `728474` / room `795590`. Booking widgets use public website ID `517856`, recovered from the existing public Lodgify site, not a credential. Each native Lodgify external search widget is isolated in a same-origin frame to prevent its global styles changing the site. Direct USD checkout links remain usable when the vendor script fails.

## Failover and free-service boundary

1. Gemini `gemini-2.5-flash`, when its Worker secret exists; any error, quota hit, invalid output or eight-second timeout advances the chain.
2. Workers AI `@cf/google/gemma-4-26b-a4b-it`, then `@cf/zai-org/glm-4.7-flash`, each with an eight-second timeout.
3. HTTPS OpenAI-compatible home lab hook, fifteen-second timeout, disabled by default. Requires `HOME_LAB_ENABLED=true`, URL, model and secret; never guest-controlled.
4. Deterministic facts/contact and independent Lodgify booking widgets.

Cloudflare lists both requested models as available on Workers Free: https://developers.cloudflare.com/changelog/post/2026-07-28-models-require-workers-paid/ . No paid models, billing changes, or upgrades are authorized. Free Workers AI allowance can exhaust; the static layer remains available. The eight-second timeout cannot cancel an already dispatched Workers AI binding operation, so a timed-out inference may finish within the free quota.

The configured Workers Rate Limiting binding applies approximately ten requests per minute to session plus IP and separately to IP to resist session resets. Cloudflare documents that limits are approximate and local to a location, not a global accounting system: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/ . Binding absence/failure disables backend replies, rather than silently substituting an ineffective process-local counter. The binding deployed successfully without a paid upgrade.

Known Gemini terms risk: Google describes use as professional/business purposes, "not for consumer use." Automatic Cloudflare failover does not resolve terms suitability by itself. Free Gemini is also skipped for EEA/UK/Swiss visitors according to request country. Review permitted audience/regions before adding the key. https://aistudio.google.com/docs/terms

## Run checks

`npm ci`, `npm test`, `npm run test:redteam`, `npx playwright install chromium`, `npm run test:browser`.

`npm run test:live` requires `LODGIFY_KEY` or `LODGIFY_API_KEY` in the process environment. It makes read-only quote and availability requests on all three properties for March 8–11, 2027, two guests. It prints only public mapping/rendered quote fields, not guest records or credentials. Failures exit nonzero.

The 18-case promptfoo suite is a curated adversarial regression against the actual handler with forced Gemini failure and hostile mocked model output. It uses no paid generation or grading. It does not claim live model red-team coverage. CI runs it on pushes, pull requests, manual requests and every Monday at 10:17 UTC. Browser checks force chat outage, verify all taps across all rentals, native widget checkout routing and USD, mobile overflow and own-script errors. Third-party widget network errors are reported separately.

## Deployment and current acceptance

Deploy with `npm run deploy:worker`. Install `GEMINI_API_KEY` and `LODGIFY_KEY` with `wrangler secret put --config worker/wrangler.jsonc`; pipe trimmed values from protected sources without echoing them. No DNS, nameserver, account-plan or billing changes are part of this deployment. The owner directed workers.dev deployment and waived the blocked reviewer as a launch gate on November 20. Billing-read HTTP 403 remains informational. Home lab stays off.

Gemini primary inference and real Cloudflare Gemma failover were verified. Gemini thinking is disabled for classification; Cloudflare models receive enough completion budget to reach their final intent. Provider reasoning is never rendered. Worker fetch uses manual redirects and rejects non-success status so API credentials are never forwarded to a redirected host.

**Live Lodgify price acceptance is blocked:** Lodgify returns HTTP 429 to this Worker's Cloudflare egress IP, identifying it as an unregistered API user requesting data for multiple Lodgify end users. Direct PC quote and availability reads with the same secret succeed on all three rentals. Resolve through Lodgify's supported API registration/IP process; do not route around the block. Until resolved, Pepper shows checkout guidance and no estimated or stale price.

Run `node scripts/verify-live-chat.mjs` to check the published site, natural-language AI reply, all three property-page quotes, contact removal and CORS. Optional `PEPPER_PROOF_DIR` stores public test replies and screenshots. Any unavailable live quote makes this verification exit nonzero after collecting evidence for all properties. The launch is not fully accepted until it passes.

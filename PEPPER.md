# Pepper guest assistant

Pepper's static quick answers and Lodgify widgets are available independently of the Worker. `pepper-knowledge.json` is the shared source for listing facts; unknown pet policies refer guests to the host. Chat activation is explicitly disabled until the backend release gates below are satisfied.

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

The configured Workers Rate Limiting binding applies approximately ten requests per minute to session plus IP and separately to IP to resist session resets. Cloudflare documents that limits are approximate and local to a location, not a global accounting system: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/ . Binding absence/failure disables backend replies, rather than silently substituting an ineffective process-local counter. Local Wrangler configuration validation is verified; actual free-account deployment support remains a release gate.

Known Gemini terms risk: Google describes use as professional/business purposes, "not for consumer use." Automatic Cloudflare failover does not resolve terms suitability by itself. Free Gemini is also skipped for EEA/UK/Swiss visitors according to request country. Review permitted audience/regions before adding the key. https://aistudio.google.com/docs/terms

## Run checks

`npm ci`, `npm test`, `npm run test:redteam`, `npx playwright install chromium`, `npm run test:browser`.

`npm run test:live` requires `LODGIFY_KEY` or `LODGIFY_API_KEY` in the process environment. It makes read-only quote and availability requests on all three properties for March 8–11, 2027, two guests. It prints only public mapping/rendered quote fields, not guest records or credentials. Failures exit nonzero.

The 18-case promptfoo suite is a curated adversarial regression against the actual handler with forced Gemini failure and hostile mocked model output. It uses no paid generation or grading. It does not claim live model red-team coverage. CI runs it on pushes, pull requests, manual requests and every Monday at 10:17 UTC. Browser checks force chat outage, verify all taps across all rentals, native widget checkout routing and USD, mobile overflow and own-script errors. Third-party widget network errors are reported separately.

## Backend activation checklist

1. Confirm the account is Workers Free with billing disabled; existing OAuth billing-read calls return 403.
2. Make the `oilgateai.com` Cloudflare zone accessible to the deployment identity, or provide its authorized routing setup. The current identity lists no matching zone. Do not migrate nameservers or alter unrelated DNS.
3. Complete an independent review of the final backend artifact. The attempted reviewer was blocked before reading files by `hook_task_binding_unproven`; no PASS exists.
4. Deploy with `npm run deploy:worker`. Add `LODGIFY_KEY` and, when terms and audience are suitable, `GEMINI_KEY` using Worker secrets, never frontend files. Never echo values. Home lab stays off.
5. Verify the real endpoint, quote/availability on all rentals, rate limiting and live provider failover. Only then set `liveChatEnabled` to true, run checks, commit and push main.

The static fallback release is useful but does not constitute live backend acceptance. Missing Gemini key, custom-domain access, verified free account, independent review and live model acceptance must be reported separately.

# aisearchstudy-site

Public static site for the Princeton study "Information and AI Settings in
Search Engines" (IRB #20278), served by GitHub Pages at
https://aisearchstudy.org.

```
index.html  setup page for both arms, chosen by tag:
              aisearchstudy.org/#web  "Google Web"     (udm=14)
              aisearchstudy.org/#ai   "Google AI Mode" (udm=50)
            no tag: neutral page, no OpenSearch link
web/ ai/    easy-to-type addresses (aisearchstudy.org/web, /ai) whose
            Continue button opens /#web or /#ai
osdd/       versioned OpenSearch descriptions (search URL on www.google.com)
CNAME       custom domain for GitHub Pages
```

Why one root page: Chrome only adds a site's search engine from a page whose
URL has no path, and the `#` tag is not part of the path. Both search templates
and the weather activation link use `www.google.com/search`, matching
the actual Google destination instead of relying on a redirect from google.com.
Both arms use the exact activation URL
`https://www.google.com/search?q=weather#q=` in a native, user-clicked anchor
with `target="_blank"` and `rel="noopener"`. Preserve the empty `q=` fragment:
in instrumented Chrome 155 testing (revision `5e88606f83`), ordinary weather
navigation matched the built-in Google engine and the study engine but credited
the built-in engine. The fragment navigation credited the study engine and made
it visible in Settings. The fragment is only for activation; leave all OpenSearch
search templates unchanged (Web `udm=14`, AI `udm=50`, no fragment).
The activation search deliberately has no `udm=50`: Chromium excludes AI Mode
visits from search-engine visit attribution.

Chrome can skip fetching an already-known originating descriptor URL. The page
therefore links to `web-v2.xml` / `ai-v2.xml`; bump these filenames and links
together when changing templates. Legacy `web.xml` / `ai.xml` remain available
with the corrected templates. Keep stable participant links `/#web` and `/#ai`.

This fixes a known host mismatch, but is not a universal compatibility guarantee.
Other Google engines share the canonical host; Chromium credits one matching
engine, and iOS settings require a recent credited visit. The exact fragment URL has been confirmed for both arms on physical stock
iPhone Chrome, including correct address-bar results and persistence after
closing and reopening. Full public setup-flow acceptance remains required after
publication, along with Android acceptance. Both arms share the site keyword;
an already selected study engine can complicate switching-arm tests. This is
not evidence of durability across all Chrome versions. Do not reset participant codes or
browser settings as part of deployment.

Regression checks: `python tests/descriptors.py` and `node --test tests/routing.cjs`
(stdlib only; GitHub CI runs both). They check descriptor XML, host/path, arm
parameters, versioned links, activation links, neutral routing and Continue pages.
They cannot prove Chrome discovery or phone settings visibility.

Source references (Chrome 155.0.8059.37):
- https://github.com/chromium/chromium/blob/155.0.8059.37/components/search_engines/template_url_service.cc#L2944-L3002
- https://github.com/chromium/chromium/blob/155.0.8059.37/components/search_engines/template_url_fetcher.cc#L248-L270

2026-10-12 choice: canonical host plus versioned descriptors. Rationale: reported
regular iPhone Chrome 155 visits land on www.google.com, while old templates used
google.com. Alternatives: changing the activation query to AI Mode would lose
visit attribution; new hosts/routing would broaden the change without phone
evidence. Publication continues through the existing GitHub Pages main branch.

No server code; no participant data passes through this site. Never rename
an OpenSearch `ShortName` or change the domain after launch: participants
see both in Chrome's settings.

2026-10-17: consolidated the two identical activation anchors into one shared
button before the device-specific sections. Both arms retain the exact native
weather URL, target, rel, descriptors and routing. No participant-state changes.

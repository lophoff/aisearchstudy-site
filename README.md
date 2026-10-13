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
and the ordinary weather activation link use `www.google.com/search`, matching
the actual Google destination instead of relying on a redirect from google.com.
The activation search deliberately has no `udm=50`: Chromium excludes AI Mode
visits from search-engine visit attribution.

Chrome can skip fetching an already-known originating descriptor URL. The page
therefore links to `web-v2.xml` / `ai-v2.xml`; bump these filenames and links
together when changing templates. Legacy `web.xml` / `ai.xml` remain available
with the corrected templates. Keep stable participant links `/#web` and `/#ai`.

This fixes a known host mismatch, but is not a universal compatibility guarantee.
Other Google engines share the canonical host; Chromium credits one matching
engine, and iOS settings require a recent credited visit. Physical iPhone and
Android acceptance remains required after publication, including checking the
selected arm and its address-bar results. Do not reset participant codes or
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

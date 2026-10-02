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
osdd/       the two OpenSearch descriptions (search URL on google.com)
CNAME       custom domain for GitHub Pages
```

Why one root page: Chrome only adds a site's search engine from a page whose
URL has no path, and the `#` tag is not part of the path. The search URLs
use `google.com`, not `www.google.com`, so no built-in engine shares the
host; the page's "Search once on Google" link then credits the visit to the
new engine, which makes it appear under "Recently visited".

No server code; no participant data passes through this site. Never rename
an OpenSearch `ShortName` or change the domain after launch: participants
see both in Chrome's settings.

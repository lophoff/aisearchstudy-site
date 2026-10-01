# aisearchstudy-site

Public static site for the Princeton study "Information and AI Settings in
Search Engines" (IRB #20278), served by GitHub Pages at
https://aisearchstudy.org.

```
index.html  neutral page for the bare domain; links to neither setup page
web/        "Google Web" setup page + OpenSearch description (udm=14)
aimode/     "Google AI Mode" setup page + OpenSearch description (udm=50)
CNAME       custom domain for GitHub Pages
```

No server code; no participant data passes through this site. The pages
only tell Chrome which Google search URL to use.

Never rename an OpenSearch `ShortName` or change the domain after launch:
participants see both in Chrome's settings.

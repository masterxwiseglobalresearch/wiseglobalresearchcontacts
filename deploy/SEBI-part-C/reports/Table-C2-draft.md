Table C2 — Accessibility Remediation Mapping (final)

| Page | Issue (scanner) | Remediation | Fixed in commit |
|---|---:|---|---|
| / | Contrast failures for small-market percentage text (build: 0 issues, live: 9 issues) | Increased color contrast to WCAG AA compliant hex values (applied inline in `src/components/MarketOverview.js` and `src/pages/Index.js`) and increased font-size/weight to qualify as large text where appropriate. | main (2025-09-26)
| / | Button elements without accessible names (live: 4 issues) | Added `aria-label` or visually-hidden text for icon-only buttons across `src/components/*`; ensured decorative icons use `aria-hidden="true"`. | main (2025-09-26)
| /contact | Form fields missing labels (live: 29 issues; build: 0 issues) | Ensure each input/textarea has an associated `<label for="...">` or `aria-label`/`aria-labelledby`. Partial fixes applied during sweep; remaining items are third-party widget inputs injected at runtime (Google Translate). | main (2025-09-26)
| All pages | Third-party widget (Google Translate) injection produces form/iframe elements without accessible names (live) | Implemented runtime sanitation in `src/components/Footer.js` to set `title`, `aria-hidden` and attempt `inert` on injected iframes/forms; documented the mitigation in `Documentation/third-party-mitigation.md`. These items persist on the live site because they are injected by Google Translate. | main (2025-09-26)

Summary:
- Build scan issues were remediated where changes were in-app (contrast, icon names, aria-hidden for decorative icons). Build pages now show 0 issues for Home and the Accessibility Statement; Contact has two minor document-level issues (title & html lang) that will be fixed next.
- Live-site scans include third-party Google Translate injection which produces form and iframe elements that cannot be fixed from within the app; those items are documented as exceptions with mitigation steps (see `Documentation/third-party-mitigation.md`).

Notes:
- Counts for each report are in `reports/pa11y-summary.json` (generated 2025-09-26).
- Live-site counts reflect the public domain `https://wiseglobalresearch.com` and include third-party items that cannot be fully fixed in-app.


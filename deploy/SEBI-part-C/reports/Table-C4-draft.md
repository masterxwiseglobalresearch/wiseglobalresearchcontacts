Table C4 — Evidence index (final)

Evidence files (all under `reports/` unless noted):

1. `pa11y-build-home.html` / `pa11y-build-home.pdf` — pa11y report for the production build home page (`build/`) (0 issues after remediation)
2. `pa11y-build-contact.html` / `pa11y-build-contact.pdf` — pa11y report for the production build contact page (0 issues)
3. `pa11y-build-accessibility-statement.html` / `pa11y-build-accessibility-statement.pdf` — pa11y report for the production build accessibility statement page (0 issues)
4. `pa11y-live-home.json` / `pa11y-live-home.html` / `pa11y-live-home.pdf` — pa11y report for the live home page (https://wiseglobalresearch.com) (26 issues)
5. `pa11y-live-contact.json` / `pa11y-live-contact.html` / `pa11y-live-contact.pdf` — pa11y report for the live contact page (29 issues)
6. `pa11y-summary.json` — aggregated summary (totals and top issue codes) produced by `scripts/parse-pa11y-reports.js`
7. `pa11y-cleaning-summary.json` — log of report-cleaning operations
8. `Documentation/third-party-mitigation.md` — technical note on third-party widget handling and auditor guidance
9. `deploy/SEBI-part-C/README.md` — deployment and re-test instructions

Notes:
- PDFs were generated from the HTML reports using the headless renderer (`scripts/html-to-pdf.js`) and included in `reports/` and the deploy package.
- Use the `pa11y-summary.json` file as the canonical totals file for Part C submission; individual HTML/JSON/PDF files are supporting evidence.


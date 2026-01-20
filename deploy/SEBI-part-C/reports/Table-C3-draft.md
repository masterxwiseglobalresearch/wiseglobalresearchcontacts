Table C3 — Test results index (final)

| Page | Scanner run | File (reports/) | Issues | Status |
|---|---|---:|---:|---|
| / (build) | pa11y build scan | `pa11y-build-home.json` / `.html` | 0 | passed (after remediation)
| / (live) | pa11y live scan | `pa11y-live-home.json` / `.html` | 26 | action required (third-party injections, missing accessible names)
| /contact (build) | pa11y build scan | `pa11y-build-contact.json` / `.html` | 0 | passed
| /contact (live) | pa11y live scan | `pa11y-live-contact.json` / `.html` | 29 | action required (form labels, anchor text)
| /accessibility-statement (build) | pa11y build scan | `pa11y-build-accessibility-statement.json` / `.html` | 0 | passed

Notes:
- Counts come from `reports/pa11y-summary.json` (generated on 2025-09-26).
- "Live" scans reflect the public site (https://wiseglobalresearch.com) and include third-party widget issues (Google Translate) that are documented in `Documentation/third-party-mitigation.md`.


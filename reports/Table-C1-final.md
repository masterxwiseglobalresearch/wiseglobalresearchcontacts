# Table C1 — Information about Digital Platforms of the RE (Final)

Date: 30 September 2025

RE Registered Name: WISE GLOBAL RESEARCH SERVICES PRIVATE LIMITED
SEBI Registration No: INH000016719
Category (assumed): Research Analyst (Non-Individual)
Designated contact for accessibility / SEBI correspondence:
- Name: Hemraj Singh Sikarwar
- Email: support@wiseglobalresearch.com
- Phone: +91 9977909494

---

Purpose: This Table C1 lists the digital platforms operated by the RE and a short statement of their current accessibility status. Public automated accessibility snapshots are available in the `reports/` directory (pa11y-build-*.json / .html). Authenticated platforms (if any) will be included in a separate submission when their accessibility audits are complete.

| S/N | Name of digital platform of RE | URL | Purpose | Remarks on current accessibility status of the platform |
|---:|---|---|---|---|
| 1 | Public website (marketing & information) | https://wiseglobalresearch.com/ | Investor information, disclosures, blog, contact & signup | Accessibility statement page present. Automated pa11y snapshots for homepage, contact, and accessibility-statement returned no blocking issues. Small cosmetic issues observed (promotional banner contrast in certain viewports). Overall: largely compliant with WCAG 2.1 AA on sampled pages. Remediation for contrast issues planned; ETA: 2025-10-15. Audit evidence: see `reports/pa11y-build-home.json`, `reports/pa11y-build-contact.json`, `reports/pa11y-build-accessibility-statement.json`.
| 2 | Accessibility statement & feedback page | https://wiseglobalresearch.com/accessibility-statement and /accessibility-feedback | Accessibility statement and feedback form for users to report issues | Publicly available; pa11y snapshot returned no blocking issues. Feedback path present; include records of any accessibility complaints in submission if available.
| 3 | Contact / complaint pages | https://wiseglobalresearch.com/contact and /complaint | Contact and complaint submission for general and accessibility issues | Publicly available; pa11y snapshot returned no blocking issues. Complaint handling process should be referenced in submission (use footer contact or provide separate complaint contact if desired).
| 4 | Embedded third-party widgets on public pages (TradingView, MyFxBook, etc.) | n/a (embedded on public pages) | Market charts and widgets embedded on the public website | Some third-party frames and widgets have known accessibility limitations. Footer script attempts to add titles/aria-hidden to decorative frames. Document fallbacks and user guidance in the submission.

---

Exclusion note:
- The authenticated client portal (`/client-panel`) is intentionally excluded from this submission at the RE's request. It will be submitted separately once a dedicated accessibility audit is completed.

Notes and assumptions
- The table is derived from the codebase (public routes in `src/App.js`, links in `public/index.html`) and pa11y snapshot reports in `reports/`.
- "Largely compliant" means the automated pa11y snapshots for sampled public pages showed no blocking issues; it is not a substitute for a full manual accessibility audit.
- Authenticated areas (client portal) are excluded from this submission per RE instruction and should be audited and documented separately.

Attachments recommended for SEBI submission
- pa11y JSON and HTML snapshots from `reports/` (pa11y-build-*.json and .html)
- Accessibility statement page URL and exported PDF (if available)
- Remediation plan and timelines for items listed (contrast fixes, widget fallbacks)

Prepared by: Automated repository extraction and pa11y summary

---

(If you want me to modify any remark text or add more platforms, tell me and I'll update this final file.)
SEBI Part-C Submission - Artifacts and Repro Steps

This folder contains the evidence and artefacts gathered for the SEBI Part-C submission.

Files included
- build.zip                 : Production build of the site (unzips to `build/`).
- reports/                  : pa11y HTML, JSON, cleaning summary, parsed summary, and optional PDFs (if generated).
- reports.zip               : Zip of the `reports/` folder.
- final-submission.zip      : Build + reports packaged together.
- reports_manifest.txt      : Short manifest of files included.

Useful scripts (workspace)
- scripts/serve-build-simple.js  : Simple Node static server for `build/` on port 56900.
- scripts/clean-pa11y-json.js    : Cleans pa11y JSON outputs (handles BOM/UTF-16 and fenced blocks).
- scripts/parse-pa11y-reports.js : Aggregates pa11y JSONs into `reports/pa11y-summary.json`.
- scripts/html-to-pdf.js         : (optional) convert pa11y HTML reports to PDFs using Puppeteer.

How to reproduce the build + pa11y evidence (Windows PowerShell)

1) Install dependencies and build

   npm ci
   npm run build

2) Serve the build (in a new terminal)

   node scripts/serve-build-simple.js

   The server listens on http://localhost:56900 by default.

3) Run pa11y manually (PowerShell-safe form)

   npx pa11y http://localhost:56900/ --reporter html > reports/pa11y-build-home.html
   npx pa11y http://localhost:56900/ --reporter json > reports/pa11y-build-home.json

   npx pa11y http://localhost:56900/contact --reporter html > reports/pa11y-build-contact.html
   npx pa11y http://localhost:56900/contact --reporter json > reports/pa11y-build-contact.json

   npx pa11y http://localhost:56900/accessibility-statement --reporter html > reports/pa11y-build-accessibility-statement.html
   npx pa11y http://localhost:56900/accessibility-statement --reporter json > reports/pa11y-build-accessibility-statement.json

Notes: pa11y exits with non-zero when issues are found. That is expected; the JSON and HTML files are still produced.

4) Clean & aggregate the reports

   node scripts/clean-pa11y-json.js reports/*.json
   node scripts/parse-pa11y-reports.js

5) (Optional) Generate PDFs from the pa11y HTML reports

   The repository includes `scripts/html-to-pdf.js` which uses Puppeteer to render HTML -> PDF.

   Installing Puppeteer may cause dependency resolution errors in this repo because of peer conflicts.
   Recommended approaches:

   A) Install with legacy peer deps (quick, may produce warnings):

      npm install puppeteer --legacy-peer-deps
      node scripts/html-to-pdf.js

   B) Use Docker to avoid modifying host deps. Example Dockerfile and steps are not included here, but you can create a small Node image that installs puppeteer and runs `node scripts/html-to-pdf.js` inside the container.

   C) If you prefer not to install puppeteer, open the HTML reports in a browser and print -> Save as PDF manually.

Known issues & notes
- The project already contains `reports/pa11y-live-*.json` (live site scans) which have higher counts than the static build; we include both as evidence.
- We attempted to add an Express-based `serve-build.js`, but it caused a dependency error in this environment; `serve-build-simple.js` is included as a dependency-free fallback.
- If you automate the pa11y workflow in CI, ensure the runner has Chrome available for puppeteer or use pa11y-ci which can manage Chrome.

Contact
If you want me to finish generating PDFs here, I can try installing puppeteer with `--legacy-peer-deps` and run the conversion, but npm may still fail due to peer conflicts present in this repo's dependencies. Let me know if you want me to attempt it.
SEBI Part C deployment artifacts
================================

Contents
--------
- build.zip — production build archive (zip of `build/`)
- reports/ — pa11y JSON and HTML reports used as evidence
   - Included reports: see `reports/` (pa11y build + live HTML/JSON)
   - Summary: `reports/pa11y-summary.json` (aggregated counts)
   - Table drafts: `reports/Table-C2-draft.md`, `reports/Table-C3-draft.md`, `reports/Table-C4-draft.md`
- README.md — this file

How to use
----------
1. Unzip `build.zip` and confirm `index.html` is present.
2. Deploy to your hosting (Firebase Hosting or Netlify recommended). Example Firebase deploy steps:

   - firebase deploy --only hosting

3. After deployment, run the live-site pa11y scans described in the root README to capture final evidence.

Notes
-----
Keep the `reports/` folder with the pa11y HTML/JSON files when submitting to SEBI as Part C evidence.

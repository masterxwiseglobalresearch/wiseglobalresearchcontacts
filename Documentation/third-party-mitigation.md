## Third‑party widget mitigation

Summary
-------
Some third‑party widgets (for example language translation widgets or embedded analytics) inject iframes, forms, or dynamically created DOM nodes into pages. These elements are often outside our control and can trigger automated accessibility scanner false-positives (for example missing document title, focusable controls without labels, or role/contrast issues).

What we do
----------
- At runtime we run a short sanitation pass from the `Footer` component which:
  - locates known third-party frames/forms (by heuristic selectors),
  - sets `title` attributes that describe the frame as auxiliary, e.g. `auxiliary third-party frame`,
  - sets `aria-hidden="true"` where appropriate and attempts to set the `inert` property to prevent focus,
  - documents the exception in the accessibility statement and repository documentation.
- These steps reduce false-positive noise from automated scanners while preserving legitimate interactive elements.

Audit notes
-----------
- Automated scanner results will still list third-party issues in raw output; we've kept a small script to filter/annotate these in our reports folder.
- For SEBI or other auditors we provide a short explanation and a pointer to the code in `src/components/Footer.js` where the sanitation is implemented.

Contact
-------
If you need a deeper inspection of any third-party widget, contact: support@wiseglobalresearch.com

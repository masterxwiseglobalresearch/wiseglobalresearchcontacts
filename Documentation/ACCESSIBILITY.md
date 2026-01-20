# Accessibility Playbook

This project targets WCAG 2.1 AA, GIGW, and IS 17802 items. Key workflows:

## Automated
- ESLint a11y: plugin:jsx-a11y/recommended
- jest-axe smoke test: `npm run test:a11y`
- Pa11y CI (local):
  1. In one terminal run: `npm start`
  2. In another run: `npm run pa11y`

## Manual checks
- Keyboard-only: Tab/Shift+Tab through all interactive elements. Ensure no traps.
- Focus: Visible focus rings everywhere.
- Zoom 200%: Layout remains usable, no loss of content or functionality.
- Reflow 320px: Check mobile view; content reflows without two-dimensional scroll where possible.
- Screen reader: NVDA (Windows) or VoiceOver (macOS/iOS). Verify headings, landmarks, link/button names, form errors.
- Contrast: Check body/links/controls and hover/focus states. Target 4.5:1 (normal), 3:1 (large/bold).
- Media: Provide captions/transcripts; add notes if third-party embeds lack controls.

## Content hooks
- Accessibility Statement: `/accessibility-statement`
- Accessibility Feedback: `/accessibility-feedback`
- Search: `/search`

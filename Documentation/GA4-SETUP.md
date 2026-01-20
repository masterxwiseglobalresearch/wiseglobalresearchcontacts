# GA4 & GTM Setup (Wise Global Research)

This document explains how to finish configuring Google Analytics 4 (GA4) and Google Tag Manager (GTM) for this project, how to add events, and how to test them.

## Current state
- The project loads a GTM container in `public/index.html` (GTM-KMZN36W7). Analytics events are pushed to `dataLayer` by the page scaffold.

## Goals
- Track page views and engagement for the "Best Free Trading" pillar page and supporting cluster pages.
- Track conversions: form submissions, downloads, compare-button clicks.
- Ensure tracking works via GTM and/or GA4 without duplicate pageviews.

## Steps to finish setup

1. GA4 Measurement ID
   - If you prefer GA4 via GTM, add a GA4 Configuration tag inside GTM (recommended).
   - If you prefer direct `gtag.js`, *remove* GTM to avoid duplicates. This repo currently uses GTM.

2. Common events to create in GTM (event names used in code):
   - viewed_pillar_page (trigger: Page Path contains `/best-free-trading-platforms`)
   - clicked_compare_button (trigger: Click - All Elements; use CSS selector or Click ID)
   - form_submit (trigger: Form Submission or DOM event)
   - downloaded_comparison_report (trigger: Link Click where URL matches `\.pdf$|\.csv$`)

3. Implement event tags in GTM
   - Tag type: GA4 Event
   - Configuration Tag: GA4 Configuration (create first, provide Measurement ID G-XXXXXXX)
   - Event name: use the names above (e.g., `viewed_pillar_page`)
   - Parameters: page_path, page_title, button_text, form_id, etc.

4. Mark conversions
   - In GA4 UI: Configure → Events → mark `form_submit` and `downloaded_comparison_report` (and others) as Conversions.

5. Use `src/lib/analytics.js` in the React app
   - Example usage in a component:
     ```js
     import { clickedCompareButton } from 'src/lib/analytics';

     function onClick(){
       clickedCompareButton({ button_text: 'Compare Now', page_path: window.location.pathname });
       // then your action
     }
     ```

6. Testing
   - Use GTM Preview mode to verify tags fire.
   - GA4 DebugView will show events in realtime (open DevTools console and run with gtag debug). If using GTM Preview, DebugView will still show events pushed to GA4.

7. Reporting
   - Create a Looker Studio (Data Studio) dashboard pulling GA4 + Search Console (link both) showing: Organic Impressions, Clicks, Sessions, Conversions per Page.

## Quick checklist
- [ ] Create GA4 Configuration tag in GTM and add Measurement ID
- [ ] Create GA4 Event tags for the events listed above
- [ ] Publish GTM container
- [ ] Test via GTM Preview and GA4 DebugView
- [ ] Mark events as Conversions in GA4
- [ ] Build a Looker Studio dashboard

## Contact / Next steps
If you'd like, I can:
- create the GTM tag definitions and a published container draft (requires GTM access)
- add Measurement ID directly into the repo and enable `gtag.js` (requires decision to remove GTM)
- implement example wiring in a specific page/component (tell me the URL path/component name)

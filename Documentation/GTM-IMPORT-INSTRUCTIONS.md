# GTM Import / Create Instructions (Wise Global Research)

This guide helps you import/create the recommended GTM tags, triggers and variables for tracking the "Best Free Trading" pillar and site-wide events.

Files included:
- `gtm-tags-definition.json` — human-readable definitions (not a direct GTM export). Use it as a reference or copy the names/regex into GTM UI.

## Quick import steps (preferred: manual create from definitions)
1. Sign in to Google Tag Manager and select your container (GTM-KMZN36W7).
2. **Create Variables** (Built-in variables): Enable Page Path, Page URL, Click ID, Click Text, Click URL.
3. **Create Triggers**:
   - All Pages (Page View) — Built-in All Pages trigger.
   - Pillar Page View — Page View → Some Page Views → Page Path contains `/best-free-trading-platforms`.
   - CTA Clicks — Click → All Elements → Some Clicks → Click Element matches CSS selector `.btn, .cta, [data-analytics]` (use CSS selector match).
   - Download Clicks — Click → Just Links → Some Link Clicks → Click URL matches RegEx: `\.(pdf|csv|xlsx|zip)(\?|$)`.
   - Outbound Clicks — Click → Just Links → Some Link Clicks → Click URL does not contain `wiseglobalresearch.com` (or use RegEx to exclude your domain).
   - Form Submission — Form Submission → All Forms or choose specific Form ID.

4. **Create Tags**:
   - GA4 Configuration
     - Tag Type: Google Analytics: GA4 Configuration
     - Measurement ID: `G-NT0CQ6VRFF`
     - Trigger: All Pages

   - GA4 Event tags (one per event)
     - Tag Type: Google Analytics: GA4 Event
     - Configuration Tag: select the GA4 Configuration tag you created
     - Event name: `viewed_pillar_page` → Trigger: Pillar Page View. Parameters: `page_path` ({{Page Path}}), `page_title` ({{Page Title}}).
     - Event name: `clicked_button` → Trigger: CTA Clicks. Parameters: `button_text` ({{Click Text}}), `button_id` ({{Click ID}}), `page_path` ({{Page Path}}).
     - Event name: `download` → Trigger: Download Clicks. Parameters: `file_url` ({{Click URL}}), `file_name` (JS variable or use Lookup Table), `page_path` ({{Page Path}}).
     - Event name: `outbound_click` → Trigger: Outbound Clicks. Parameters: `url` ({{Click URL}}), `link_text` ({{Click Text}}), `page_path` ({{Page Path}}).
     - Event name: `form_submit` → Trigger: Form Submission. Parameters: `form_id`, `form_action`, `page_path`.
     - Event name: `attribution_captured` → Trigger: All Pages. Parameters: map UTM variables if you push them to dataLayer (e.g., utm_source).

5. **Preview & Debug**:
   - Click Preview in GTM, enter your site URL, and start the preview.
   - Perform actions on your site (navigate, click CTA, submit forms, download files) and verify tags fire in the GTM preview panel.
   - In GA4 DebugView check events appear.

6. **Publish** when verified.

## Notes & tips
- If you already push events to `dataLayer` from your site (this repo does), consider creating GA4 Event tags that fire on Custom Event (e.g., event name `clicked_button`) and map parameters from dataLayer variables — this avoids duplicate firing.
- Use consistent event names (we used `clicked_button`, `download`, `form_submit`, `outbound_click`, `viewed_pillar_page`, `attribution_captured`).
- After publishing, go to GA4 > Configure > Events and mark `form_submit` and `download` as Conversions.

If you want, I can now: (A) generate a real GTM container export JSON (requires a GTM workspace with Editor access to produce), or (B) walk you through importing the above manually step-by-step while you share screenshots.

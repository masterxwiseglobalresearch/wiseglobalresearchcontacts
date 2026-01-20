# dataLayer Helpers & Auto-Instrumentation

This file explains the client-side helpers added to `public/index.html` to make dataLayer events and simple conversion instrumentation easier even before GTM changes are applied.

## What was added
- `window.analyticsPush(eventName, payload)` — convenience wrapper to push standardized events into `dataLayer`.
- Automatic form instrumentation: any form with `data-gtm-event` attribute will push a custom event on submit. Example:

```html
<form id="contactForm" data-gtm-event="lead_submit" data-gtm-value="0">
  <!-- form fields -->
</form>
```
This will push:

```js
{ event: 'lead_submit', formId: 'contactForm', formAction: '...', value: 0 }
```

- `window.gtmInstrumentForms()` — call this to re-scan dynamically added forms.
- Consent mode scaffold:
  - `window.setConsentDefaults()` — pushes a safe default where ad/analytics storage are denied.
  - `window.updateConsent(consentObj)` — push updated consent state; GTM's Consent Mode tag can read these events.

## How to use
1. To push custom events from code:

```js
window.analyticsPush('video_play', { videoId: 'abc123', duration: 30 });
```

2. To instrument a form, add `data-gtm-event` attribute to the form element.

3. If using a CMP, when the user gives consent call:

```js
window.updateConsent({ ad_storage: 'granted', analytics_storage: 'granted' });
```

## Next steps (recommended)
- In GTM create a Custom Event trigger to listen for `lead_submit`, `consent_update`, etc., and map variables from the pushed payload.
- Use those triggers to fire GA4 event tags and Google Ads conversion tags.

If you want, I can add `dataLayer.push()` examples into specific React components or pages — tell me the paths (e.g., `src/pages/Contact.js`).
# GTM Setup & Migration Steps (Hindi)

Niche diye gaye steps follow karke aap GA4 aur Google Ads (AW) ko GTM mein migrate kar sakte hain aur site se hard-coded gtag hata sakte hain.

## Overview
- GTM container ID: `GTM-KMZN36W7`
- GA4 Measurement ID: `G-NT0CQ6VRFF`
- Google Ads (Conversion/Measurement) ID: `AW-16988798063`

## 1) Kyon migrate karein
- Centralized tag management (GTM) se duplicate loads avoid hote hain.
- Non-technical users tags ko GTM UI se manage kar sakte hain.
- DataLayer events trigger mapping asaan hota hai.

## 2) Code changes (already applied)
- `public/index.html` se hard-coded `gtag` script remove kar diya gaya.
- Minimal `dataLayer` initialization add kiya gaya:

```html
<script>
  window.dataLayer = window.dataLayer || [];
  // Example: dataLayer.push({ event: 'page_view', page_path: location.pathname });
</script>
```

## 3) GTM UI: Create Tags
1. Login to Google Tag Manager and open container `GTM-KMZN36W7`.
2. Create Tag: **GA4 Configuration**
   - Tag type: Google Analytics: GA4 Configuration
   - Measurement ID: `G-NT0CQ6VRFF`
   - Trigger: All Pages
3. Create Tag: **Google Ads Conversion / Measurement**
   - Tag type: Google Ads Conversion Tracking or Google Ads Remarketing (choose based on need)
   - Conversion/Measurement ID: `AW-16988798063`
   - Trigger: All Pages (for general measurement) or specific conversion triggers for conversions.

## 4) dataLayer events for conversions
- For form submissions / conversions, use:

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'lead_submit',
  formId: 'contactForm',
  value: 0,
  currency: 'INR'
});
```

- In GTM, create a Custom Event trigger for `lead_submit` and use it to fire conversion tags.

## 5) Test & Publish
1. Use GTM Preview mode and visit staging site; check Tags fired list.
2. Use Chrome DevTools Network tab and filter for `gtm.js`, `collect`, or `ads` endpoints.
3. Optional: use Ghostery / ad blockers disabled while testing.
4. When confirmed, Publish GTM container.

## 6) Validation after publish
- Use Google Tag Assistant and GA/Ads realtime reports to confirm events.
- Check for duplicate requests in Network panel.

## 7) Consent Mode (optional)
- If you have EU/UK users, implement Google Consent Mode and integrate with CMP.
- See Google official docs: https://developers.google.com/tag-platform/devguides/consent

## Notes
- I cannot create tags inside your GTM account without access. Agar aap GTM access denge (add user with "Edit" permission), main GTM workspace mein tags bana ke aapko verify karke publish kar sakta hoon.

---

If you want me to continue, reply with:
- "I will give GTM access" (then provide account/email invite), or
- "Do it myself" (I will provide exact steps / screenshots to copy), or
- "Create dataLayer events" (I will add code examples to specific pages/components).
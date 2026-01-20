How to change the popup image

1) Admin uploader component

- File: `src/components/AdminPopupImage.js`
- Purpose: small admin UI that lets you upload an image file or enter an external URL. It saves the value into localStorage key `popupImage`.

Usage: mount the component in your admin panel (only accessible to admins). Example:

  // Simple: place this button anywhere in your admin/dashboard layout
  import AdminPopupLauncher from './AdminPopupLauncher';

  <AdminPopupLauncher />

  // Or, if you already have an admin settings page and want the uploader inline:
  <AdminPopupImage />

When you upload or save a URL it will be stored in the browser's localStorage for that origin. The value may be a data URL (from a file) or an external URL.

2) PopupForm behavior

- File: `src/components/PopupForm.js`
- Behavior: chooses image in this order:
  1. `imageUrl` prop passed to `PopupForm`
 2. `localStorage.getItem('popupImage')` (if present)
  3. bundled asset `src/assets/images/wiseglobalresearch_4.png`

Notes and caveats
- localStorage is per-browser and per-origin. If you need a global server-side setting you'll need to extend this to save the image to your backend and fetch it in the app.
- The admin uploader is intentionally simple and client-side only.
- To clear the custom image, use the Clear button in the admin uploader or remove the `popupImage` key from the browser devtools.

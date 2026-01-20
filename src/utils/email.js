// EmailJS helper for popup lead + fallback queue logic
// Uses environment variables so keys are not hard-coded in repo
// Required env vars (in .env.local):
// REACT_APP_EMAILJS_SERVICE_ID=service_8u6ie54
// REACT_APP_EMAILJS_TEMPLATE_ID=template_7n0xtk5
// REACT_APP_EMAILJS_PUBLIC_KEY=w5yR_iWzyUmxBia07

import emailjs from '@emailjs/browser';

// Basic validation / sanitization
function clean(v) {
  if (!v) return '';
  return String(v).trim().slice(0, 500);
}

export function buildPopupTemplateParams(data = {}) {
  const now = new Date();
  return {
    name: clean(data.name),
    email: clean(data.email),
    phone: clean(data.phone),
    message: clean(data.message),
    source: clean(data.source || 'popup'),
    submitted_at: now.toISOString(),
    submitted_date_local: now.toLocaleString('en-IN', { hour12: false }),
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    page_url: typeof window !== 'undefined' ? window.location.href : '',
  };
}

export function buildSubject(params) {
  // Example: New Lead (Popup) - Name | 2025-09-08 14:32
  const datePart = params.submitted_at?.substring(0,16).replace('T',' ') || '';
  const namePart = params.name || 'Unknown';
  return `New Lead (Popup) - ${namePart} | ${datePart}`;
}

export async function sendPopupEmail(rawData) {
  const params = buildPopupTemplateParams(rawData);
  // EmailJS subject can be dynamic if template uses {{subject}} variable
  params.subject = buildSubject(params);

  const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    return Promise.reject(new Error('EmailJS env vars missing'));
  }

  try {
    const res = await emailjs.send(serviceId, templateId, params, { publicKey });
    return res;
  } catch (err) {
    console.error('[EmailJS] send failed', err);
    throw err;
  }
}

// Optional: safe wrapper with one retry
export async function sendPopupEmailWithRetry(data, { retries = 1, delayMs = 1500 } = {}) {
  let attempt = 0;
  while (true) {
    try {
      return await sendPopupEmail(data);
    } catch (e) {
      if (attempt >= retries) throw e;
      attempt++;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

// Minimal web-vitals reporter helper
import {getCLS, getFID, getLCP, getFCP, getTTFB} from 'web-vitals';

function sendToAnalytics(metric) {
  // Default: do not log to the browser console.
  // To enable local debug logging, set the env var REACT_APP_WEBVITALS_LOG=true
  // (Create React App will inline this at build time). In production this
  // should remain disabled so metrics don't appear in users' consoles.
  try {
    if (process.env.REACT_APP_WEBVITALS_LOG === 'true' && process.env.NODE_ENV !== 'production') {
      console.log('Web Vitals metric', metric);
    }
    // Otherwise, no-op (replace with a fetch/XHR to send metrics to your
    // analytics endpoint if desired)
  } catch (e) {
    // swallow logging errors
  }
}

export default function reportWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getLCP(sendToAnalytics);
  getFCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}

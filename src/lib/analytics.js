// Lightweight analytics helper - pushes to dataLayer and falls back to gtag if present.
// Usage: import { sendEvent, sendPageView } from 'src/lib/analytics';

export function dataLayerPush(obj){
  try{
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(obj);
    return true;
  }catch(e){
    console.error('dataLayer push failed', e);
    return false;
  }
}

export function sendEvent(eventName, params){
  const payload = Object.assign({ event: eventName }, params || {});
  // Push to dataLayer for GTM listeners
  dataLayerPush(payload);

  // Also send to gtag if present (safe-guard when GTM isn't used)
  try{
    if (typeof window.gtag === 'function'){
      // Use recommended GA4 event naming
      const gtagParams = Object.assign({}, params || {});
      window.gtag('event', eventName, gtagParams);
    }
  }catch(e){ /* ignore */ }
}

export function sendPageView(path, title){
  try{
    sendEvent('page_view', { page_path: path || window.location.pathname, page_title: title || document.title });
  }catch(e){ /* ignore */ }
}

// Convenience wrappers for common events
export const viewedPillarPage = (opts) => sendEvent('viewed_pillar_page', opts);
export const clickedCompareButton = (opts) => sendEvent('clicked_compare_button', opts);
export const formSubmit = (opts) => sendEvent('form_submit', opts);

const analytics = { dataLayerPush, sendEvent, sendPageView, viewedPillarPage, clickedCompareButton, formSubmit };

export default analytics;

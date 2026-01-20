import { sendPageView, sendEvent } from '../lib/analytics';

// Simple UTM capture & persistence
function captureUtmParams(){
  try{
    var params = new URLSearchParams(window.location.search);
    var utm = {};
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid'].forEach(function(k){
      if (params.has(k)) utm[k] = params.get(k);
    });
    if (Object.keys(utm).length){
      utm.__captured_at = Date.now();
      try{ localStorage.setItem('wgr_utm', JSON.stringify(utm)); }catch(e){}
      // push an event for attribution capture
      sendEvent('attribution_captured', utm);
    }
  }catch(e){ /* ignore */ }
}

function getStoredUtm(){
  try{ return JSON.parse(localStorage.getItem('wgr_utm') || '{}'); }catch(e){ return {}; }
}

// SPA route change detection (wrap pushState/replaceState)
function enableRouteListener(){
  try{
    const _wr = function(type){
      const orig = window.history[type];
      return function(){
        const rv = orig.apply(this, arguments);
        const ev = new Event('locationchange');
        window.dispatchEvent(ev);
        return rv;
      };
    };
    window.history.pushState = _wr('pushState');
    window.history.replaceState = _wr('replaceState');
    window.addEventListener('popstate', function(){ window.dispatchEvent(new Event('locationchange')); });
  }catch(e){ /* ignore */ }
}

// Send page_view on route change
function enablePageViewOnRoute(){
  const send = function(){
    try{
      sendPageView(window.location.pathname + window.location.search, document.title);
    }catch(e){}
  };
  window.addEventListener('locationchange', send);
  // initial
  send();
}

// Click instrumentation for CTAs / outbound / downloads
function enableClickListeners(){
  document.addEventListener('click', function(e){
    try{
      var el = e.target.closest && e.target.closest('[data-analytics]');
      if (!el) {
        // match common CTA/button selectors
        el = e.target.closest && e.target.closest('a.btn, button.btn, a.cta, button.cta');
      }
      if (!el) return;

      var tag = (el.tagName || '').toLowerCase();
      var href = el.getAttribute && el.getAttribute('href');
      var text = (el.innerText || el.textContent || '').trim().slice(0,200);
      var id = el.id || el.getAttribute('data-id') || null;

      // Downloads
      if (href && /\.(pdf|csv|xlsx|zip)(\?|$)/i.test(href)){
        sendEvent('download', { file_url: href, file_name: href.split('/').pop(), page_path: window.location.pathname });
        return;
      }

      // Outbound links
      if (href && !href.match(window.location.hostname) && href.indexOf('http') === 0){
        sendEvent('outbound_click', { url: href, link_text: text, page_path: window.location.pathname });
        return;
      }

      // Generic CTA/button click
      sendEvent('clicked_button', { button_id: id, button_text: text, tag: tag, page_path: window.location.pathname });
    }catch(err){ /* ignore */ }
  }, {passive:true});
}

// Form fallback: ensure forms fire an event (there is also existing instrumentation in index.html)
function enableFormListener(){
  document.addEventListener('submit', function(e){
    try{
      var form = e.target;
      if (!form) return;
      var id = form.id || form.getAttribute('name') || null;
      var action = form.action || null;
      sendEvent('form_submit', { form_id: id, form_action: action, page_path: window.location.pathname });
    }catch(err){}
  }, true);
}

export function initAnalytics(){
  try{
    captureUtmParams();
    enableRouteListener();
    enablePageViewOnRoute();
    enableClickListeners();
    enableFormListener();
    // optional: expose helper
    window.wgrGetUtm = getStoredUtm;
  }catch(e){ console.error('analytics init error', e); }
}

export default initAnalytics;

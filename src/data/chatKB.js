// Small local knowledge base for ChatWidget.
// This module exports a KB array and a helper to find the best matching answer
// using simple keyword overlap scoring. It's intentionally lightweight and
// runs fully on-client so no secrets or servers are required.

const KB = [
  {
    id: 'about',
    title: 'About Wise Global Research Services',
    keywords: ['wise global', 'about', 'company', 'who', 'what'],
    answer:
      "Wise Global Research Services is a SEBI-registered research firm based in Indore. We provide market research, reports, datasets and analytics — educational information and research products, not personalised investment advice.",
    answer_hi: 'Wise Global Research Services एक SEBI-registered रिसर्च फर्म है। हम इंडौर स्थित हैं और मार्केट रिसर्च, रिपोर्ट्स, डेटा सेट और एनालिटिक्स प्रदान करते हैं। यह शैक्षिक सामग्री है, व्यक्तिगत निवेश सलाह नहीं।',
  },
  {
    id: 'services',
    title: 'Services offered',
    keywords: ['service', 'services', 'offer', 'what do you do', 'research', 'reports', 'analytics', 'data'],
    answer:
      "We offer market research, custom research reports, datasets (CSV/Excel), analytics and research briefs. Typical deliverables include sample reports, timelines and pricing on request.",
    answer_hi: 'हम मार्केट रिसर्च, कस्टम रिसर्च रिपोर्ट, डेटा सेट (CSV/Excel), एनालिटिक्स और रिसर्च ब्रीफ प्रदान करते हैं। साधारण डिलिवरेबल्स में सैंपल रिपोर्ट, टाईमलाइन और प्राइसिंग शामिल हैं — अनुरोध पर दी जाएगी।',
  },
  {
    id: 'location',
    title: 'Location',
    keywords: ['where', 'location', 'indore', 'address'],
    answer: "We are located in Indore, India. For specific contact or office address please ask or use the contact form on the website.",
    answer_hi: 'हम भारत के इंदौर में स्थित हैं। कार्यालय का सटीक पता जानने के लिए चैट में पूछें या वेबसाइट के संपर्क पृष्ठ का उपयोग करें।',
  },
  {
    id: 'contact',
    title: 'Contact and leads',
    keywords: ['contact', 'phone', 'mobile', 'email', 'reach'],
    answer:
      "You can share your mobile number in the chat and our team will reach out. For email or formal inquiries please use the contact page or support email provided on the site.",
    answer_hi: 'आप यहां चैट में अपना मोबाइल नंबर साझा कर सकते हैं; हमारी टीम आपसे संपर्क करेगी। ईमेल या औपचारिक पूछताछ के लिए साइट के कॉन्टैक्ट पेज या support@wiseglobalresearch.com का उपयोग करें।',
  },
  {
    id: 'samples',
    title: 'Sample reports and timelines',
    keywords: ['sample', 'sample report', 'timeline', 'turnaround', 'delivery', 'timeline'],
    answer:
      "We provide sample reports on request and typical timelines depend on scope — small reports 2-5 business days, larger engagements vary. Ask for a sample and timeline and we'll respond with specifics.",
    answer_hi: 'सैंपल रिपोर्ट अनुरोध पर उपलब्ध हैं। सामान्यतः छोटे रिपोर्ट 2-5 कार्यदिवस में तैयार हो सकती हैं; बड़े प्रोजेक्ट की समयसीमा अलग होगी — अपने स्कोप बताइए, हम टाइमलाइन बताएँगे।',
  },
  {
    id: 'pricing',
    title: 'Pricing',
    keywords: ['price', 'pricing', 'cost', 'charge', 'fee'],
    answer:
      "Pricing depends on scope and delivery format. For a quote, please share the required deliverable and timeline and our team will provide pricing details.",
    answer_hi: 'कीमत आपकी जरूरत और डिलिवरी फॉर्मेट पर निर्भर करती है। एक सटीक कोट पाने के लिए अहम् डिलिवरेबल और टाइमलाइन साझा करें; हमारी टीम प्राइसिंग बताएगी।',
  },
  {
    id: 'regulatory',
    title: 'Regulatory / SEBI',
    keywords: ['sebi', 'registered', 'registration', 'compliance'],
    answer: "We are SEBI-registered research services and our published materials are educational in nature; we do not provide personalised investment advice.",
    answer_hi: 'हम SEBI-registered रिसर्च सर्विसेस हैं। हमारी प्रकाशित सामग्री शैक्षिक है; यह व्यक्तिगत निवेश सलाह नहीं है।',
  },
  // --- Additional automated FAQ entries derived from repo pages ---
  {
    id: 'infinityclub',
    title: 'Infinity Club (membership)',
    keywords: ['infinity', 'infinity club', 'infinityclub', 'infinity club pricing', 'infinity club membership'],
    answer:
      "Infinity Club provides futures & options intraday recommendations with clear targets and stop-loss levels. It is designed for traders who want high-quality, research-backed trades. Pricing plans and GST notes are available on the Infinity Club page.",
  },
  {
    id: 'universalcash',
    title: 'Universal Cash service',
    keywords: ['universal cash', 'universalcash', 'cash segment', 'cash recommendations', 'cash pack'],
    answer:
      "Universal Cash delivers cash-segment recommendations (intraday / BTST / positional) for NSE with targets and stop-losses. Recommendations are shared via your registered contact channel. See the Universal Cash page for pricing and delivery details.",
  },
  {
    id: 'research_reports',
    title: 'Research reports and samples',
    keywords: ['research report', 'reports', 'sample report', 'sample', 'report sample'],
    answer:
      "We create research reports and briefs — sample reports are available on request. Timelines depend on scope: small reports typically 2-5 business days; larger engagements vary. Ask the chat for a sample and expected timeline for your request.",
  },
  {
    id: 'pricing_gst',
    title: 'Pricing and GST',
    keywords: ['gst', 'pricing plan', 'pricing', 'price', 'cost', 'fee', 'price gst'],
    answer:
      "Pricing depends on the chosen pack and scope; note that pricing pages indicate GST (18%) is excluded where applicable. For an accurate quote, share the required deliverable and timeline.",
  },
  {
    id: 'refunds',
    title: 'Refund policy',
    keywords: ['refund', 'refund policy', 'cancel', 'cancellation', 'refunds policy'],
    answer:
      "Refunds are handled per our refund policy: sales are generally final, and refunds (if any) are pro-rata for unused subscription periods per SEBI guidelines. For refund assistance, contact support@wiseglobalresearch.com or visit the Refund page.",
  },
  {
    id: 'contact_channels',
    title: 'How we contact you (delivery)',
    keywords: ['sms', 'email', 'contact channel', 'deliver', 'delivery', 'reach out', 'contact'],
    answer:
      "Recommendations and alerts are sent via your registered contact channel (e.g., SMS). For formal queries, use the contact page or support email. If messages fail due to DND or account settings, delivery logs may still show messages were sent.",
  },
  {
    id: 'media_edu',
    title: 'Media and educational content',
    keywords: ['media', 'educational', 'videos', 'education', 'learning', 'guide for investing'],
    answer:
      "We publish educational videos and media to help users learn trading and investing basics. See the Media page and the 'Guide for Investing' for beginner-friendly resources and transcripts.",
  },
  {
    id: 'terms_and_conditions',
    title: 'Terms & Conditions',
    keywords: ['terms', 'terms and conditions', 'tnc', 'policy'],
    answer:
      "Please refer to our Terms page for legal terms, disclaimers and service conditions. Key points: recommendations are research-based, not guaranteed, and users should understand associated risks.",
  },
  {
    id: 'vision',
    title: 'Company vision',
    keywords: ['vision', 'about', 'mission', 'commitment'],
    answer:
      "Our vision focuses on SEBI-compliant, transparent research and tools for Indian traders — combining technical and fundamental analysis to deliver research-backed recommendations.",
  },
  {
    id: 'how_to_subscribe',
    title: 'How to subscribe or get a quote',
    keywords: ['subscribe', 'subscribe service', 'buy', 'purchase', 'quote', 'how to buy'],
    answer:
      "To subscribe or request pricing, share the desired service and timeline in chat or visit the Services / Contact pages. We will respond with pricing and next steps. For large/custom projects please request a quote with scope details.",
  },
  {
    id: 'disclaimer',
    title: 'Legal disclaimer',
    keywords: ['disclaimer', 'legal', 'advice', 'investment advice'],
    answer:
      "All published materials are educational and research-based. We do not provide personalised investment advice; users should consult a financial adviser before acting on recommendations.",
  },
];

// Basic tokenizer and score by keyword overlap.
function tokenize(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[\W_]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export function findBestAnswer(query) {
  if (!query) return null;
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return null;

  // score each KB entry by keyword matches and token overlap
  let best = null;
  let bestScore = 0;
  for (const entry of KB) {
    let score = 0;
    // match explicit keywords first
    for (const kw of entry.keywords) {
      if (query.toLowerCase().includes(kw)) score += 3;
    }
    // token overlap between query and title/answer
    const text = (entry.title + ' ' + entry.answer).toLowerCase();
    const textTokens = new Set(tokenize(text));
    for (const t of qTokens) if (textTokens.has(t)) score += 1;

    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  // require at least some score to consider it a hit
  if (best && bestScore >= 2) return best.answer;
  return null;
}

export default KB;

// Merge with auto-generated KB if present
let AUTO_KB = [];
try {
  // eslint-disable-next-line import/no-dynamic-require
  // require path relative to project
  // this file will be generated by scripts/generate-kb.js as chatKB.auto.js
  // If not present, ignore silently.
  // Use require so build tooling can include it if present.
  // NOTE: in dev, you must run `node scripts/generate-kb.js` to create the file.
  // Attempt to require; if it fails, ignore.
  // This is safe because front-end bundlers will ignore dynamic require when file absent.
  // eslint-disable-next-line no-undef
  const maybe = require('./chatKB.auto');
  if (Array.isArray(maybe)) AUTO_KB = maybe;
} catch (e) {
  // no auto KB available
}

// final merged KB used by helpers (manual entries first, then auto)
export const MERGED_KB = [...KB, ...AUTO_KB];

// helper that prefers merged entries
export function findBestAnswerMerged(query) {
  if (!query) return null;
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return null;

  let best = null;
  let bestScore = 0;
  for (const entry of MERGED_KB) {
    let score = 0;
    for (const kw of (entry.keywords || [])) {
      if (query.toLowerCase().includes(kw)) score += 3;
    }
    const text = ((entry.title || '') + ' ' + (entry.answer || '')).toLowerCase();
    const textTokens = new Set(tokenize(text));
    for (const t of qTokens) if (textTokens.has(t)) score += 1;
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  if (best && bestScore >= 2) return best.answer;
  return null;
}

// language-aware getter: 'hi' returns Hindi answer if available, otherwise English.
export function getAnswerForLanguage(query, lang = 'en') {
  const ans = findBestAnswerMerged(query);
  if (!ans) return null;
  // if merged entry exists, try to return language-specific answer
  // find the matching entry to get its language variant
  const qTokens = tokenize(query);
  let best = null;
  let bestScore = 0;
  for (const entry of MERGED_KB) {
    let score = 0;
    for (const kw of (entry.keywords || [])) if (query.toLowerCase().includes(kw)) score += 3;
    const text = ((entry.title || '') + ' ' + (entry.answer || '')).toLowerCase();
    const textTokens = new Set(tokenize(text));
    for (const t of qTokens) if (textTokens.has(t)) score += 1;
    if (score > bestScore) { bestScore = score; best = entry; }
  }
  if (!best) return ans;
  if (lang && lang.toLowerCase().startsWith('hi')) {
    return best.answer_hi || best.answer || ans;
  }
  return best.answer || ans;
}

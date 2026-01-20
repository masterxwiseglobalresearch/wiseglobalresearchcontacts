// Central SEO configuration for routes
export const SITE_NAME = 'Wise Global Research';
export const BASE_URL = 'https://wiseglobalresearch.com';

export const DEFAULT_META = {
  title: `${SITE_NAME} – SEBI Registered Research Analyst`,
  description:
    'Wise Global Research is a SEBI Registered Research Analyst firm providing equity, MCX, index options, and investment insights for traders and investors in India.',
  keywords:
    'Wise Global Research, SEBI Registered Research Analyst, stock market research, equity, MCX, Nifty, Sensex, options trading, futures, portfolio, investment advisory, trading tips, intraday, commodity, currency, forex',
  image: `${BASE_URL}/og-image.jpg`,
  robots: 'index, follow',
};

// Route-specific meta (keys must match the configured routes in App.js)
export const ROUTE_META = {
  "/": {
    "title": "Wise Global Research – Stock Market Research & Advisory (...",
    "description": "SEBI-registered research and actionable insights for equity, MCX & index options. Improve your trading performance with disciplined strategies and risk...",
    "keywords": "SEBI research analyst, stock market tips, equity research, MCX advisory, index options, intraday trading, swing trading, investment insights"
  },
  "/about": {
    "title": "About Us | Wise Global Research",
    "description": "Learn about Wise Global Research, our SEBI registration, mission, methodology, and commitment to transparent, disciplined research for traders & investors.",
    "keywords": "about Wise Global Research, SEBI RA, research methodology, investment research firm"
  },
  "/services": {
    "title": "Our Services | Equity, MCX, Options, Research",
    "description": "Explore equity cash & F&O, MCX commodities, index options, and specialized premium advisory services tailored for traders and investors.",
    "keywords": "equity services, options advisory, MCX services, research reports, premium services"
  },
  "/contact": {
    "title": "Contact Wise Global Research",
    "description": "Get in touch with our research and support team for onboarding, queries, and compliance-related assistance.",
    "keywords": "contact research analyst, support, onboarding, customer service"
  },
  "/legal": {
    "title": "Legal | Disclosures, Compliance & Registrations",
    "description": "Legal disclosures, compliance information, SEBI registration details, and risk disclaimers for Wise Global Research.",
    "keywords": "legal, disclosures, SEBI registration, compliance, disclaimers"
  },
  "/disclosure": {
    "title": "Disclosure | Wise Global Research",
    "description": "Important disclosures and disclaimers related to investment risks and research services.",
    "keywords": "investment risk disclosure, research disclosure, disclaimer"
  },
  "/team": {
    "title": "Our Team | Wise Global Research",
    "description": "Meet our analysts and operations team—market professionals focused on disciplined research and risk management.",
    "keywords": "research team, analysts, operations team, investment experts"
  },
  "/vision": {
    "title": "Vision & Values | Wise Global Research",
    "description": "Our vision is to empower traders with transparent, data-driven research and robust risk management.",
    "keywords": "vision, mission, values, research principles"
  },
  "/blogs": {
    "title": "Blogs & Insights | Wise Global Research",
    "description": "Articles and insights on markets, strategies, risk control, and trader psychology.",
    "keywords": "market insights, trading blogs, research articles, strategies"
  },
  "/market-news": {
    "title": "Market News | Wise Global Research",
    "description": "Latest market updates, events, and macro developments impacting equity and commodities.",
    "keywords": "market news, macro events, earnings, commodities update"
  },
  "/research-reports": {
    "title": "Research Reports | Equity & MCX",
    "description": "In-depth equity and commodity research reports to support informed decisions.",
    "keywords": "equity reports, commodity research, market reports"
  },
  "/payment": {
    "title": "Payment Information | Wise Global Research",
    "description": "Secure payment methods and billing information for Wise Global Research services.",
    "keywords": "payment info, billing, pricing, subscription"
  },
  "/terms": {
    "title": "Terms & Conditions | Wise Global Research",
    "description": "Terms of service governing the use of Wise Global Research services and content.",
    "keywords": "terms of service, user agreement, conditions"
  },
  "/privacy": {
    "title": "Privacy Policy | Wise Global Research",
    "description": "How we collect, process, and protect your data, aligned with compliance and security standards.",
    "keywords": "privacy policy, data protection, compliance"
  },
  "/refund": {
    "title": "Refund & Cancellation Policy",
    "description": "Refund terms and cancellation policy for subscriptions and advisory services.",
    "keywords": "refund policy, cancellation, billing support"
  },
  "/complaint": {
    "title": "Lodge a Complaint | Wise Global Research",
    "description": "Submit grievances or issues for quick resolution. We prioritize transparency and customer support.",
    "keywords": "complaint, grievance redressal, support"
  },
  "/grievance-redressal-process": {
    "title": "Grievance Redressal Process",
    "description": "Our 3-step grievance redressal process with SLAs, escalation matrix, and regulatory channels.",
    "keywords": "grievance redressal, escalation, SEBI SCORES"
  },
  "/guide": {
    "title": "Guide for Investing | Wise Global",
    "description": "Beginner-friendly investing guide covering risk management, diversification, and strategy.",
    "keywords": "investing guide, risk management, diversification"
  },
  "/demo": {
    "title": "Request a Demo | Wise Global Research",
    "description": "Experience our research delivery, dashboards, and alerts with a quick demo.",
    "keywords": "demo, trial, product walkthrough"
  },
  "/user-login": {
    "title": "Client Login | Wise Global Research",
    "description": "Access your client dashboard, research calls, and reports securely.",
    "keywords": "client login, dashboard, research access"
  },
  "/client-panel": {
    "title": "Client Panel | Wise Global Research",
    "description": "Manage your subscriptions, research feed, and preferences from the client panel.",
    "keywords": "client panel, subscription management, research feed"
  },
  "/livechart": {
    "title": "Live Chart | Wise Global Research",
    "description": "TradingView-powered live charts for major indices, equities, and commodities.",
    "keywords": "live chart, TradingView, market data"
  },
  "/ticker": {
    "title": "Market Ticker | Wise Global Research",
    "description": "Real-time market ticker for indices, equities, and commodities.",
    "keywords": "market ticker, live quotes, indices"
  },
  "/equity": {
    "title": "Equity Research & Strategies",
    "description": "Disciplined equity research for cash and F&O with focus on risk-adjusted performance.",
    "keywords": "equity research, stock analysis, F&O strategies"
  },
  "/intraday": {
    "title": "Intraday Strategies | Equity & Index",
    "description": "Rule-based intraday strategies for equities and index derivatives with risk control.",
    "keywords": "intraday trading, day trading strategies, index scalping"
  },
  "/mcx": {
    "title": "MCX Commodity Research",
    "description": "Actionable research on bullion, energy, and metals with strict risk management.",
    "keywords": "MCX research, commodity trading, bullion, energy, metals"
  },
  "/services/equity/stock-option": {
    "title": "Stock Options Advisory",
    "description": "SEBI-registered stock options strategies with proper sizing and risk control.",
    "keywords": "stock options advisory, options trading, call put strategies"
  },
  "/services/equity/delivery": {
    "title": "Delivery (Positional) Equity Calls",
    "description": "Positional delivery ideas based on fundamentals and technical structure.",
    "keywords": "delivery calls, positional trading, equity investing"
  },
  "/services/equity/index": {
    "title": "Index Strategies | NIFTY & BANKNIFTY",
    "description": "Systematic index strategies across NIFTY, BANKNIFTY with defined risk.",
    "keywords": "index trading, NIFTY, BANKNIFTY, options"
  },
  "/services/equity/future": {
    "title": "Equity Futures Advisory",
    "description": "Directional and hedged futures strategies with risk-managed entries and exits.",
    "keywords": "futures trading, hedging, equity futures"
  },
  "/services/equity/stock-index-option": {
    "title": "Stock Index Options",
    "description": "Index options strategies with disciplined risk rules for consistency.",
    "keywords": "index options, options spreads, trading strategies"
  },
  "/services/equity/btst": {
    "title": "BTST Ideas (Buy Today Sell Tomorrow)",
    "description": "Short-term momentum ideas with tight risk control for BTST setups.",
    "keywords": "BTST, short-term trading, momentum"
  },
  "/services/equity/cash": {
    "title": "Cash Segment Ideas",
    "description": "High-conviction stock ideas in the cash segment based on sound research.",
    "keywords": "cash segment, stock picks, equity ideas"
  },
  "/services/mcx/bullions": {
    "title": "Bullions (Gold & Silver) | MCX",
    "description": "MCX bullion strategies for gold and silver with risk-first approach.",
    "keywords": "MCX bullion, gold, silver, commodity trading"
  },
  "/services/mcx/energy": {
    "title": "Energy (Crude Oil & Natural Gas) | MCX",
    "description": "Research for MCX Crude Oil and Natural Gas—levels, structure, and risk.",
    "keywords": "MCX energy, crude oil, natural gas"
  },
  "/services/mcx/metal": {
    "title": "Metals (Copper, Zinc, etc.) | MCX",
    "description": "Tactically managed trades in base metals with risk discipline.",
    "keywords": "MCX metals, copper, zinc, lead, nickel"
  },
  "/services/mcx/mcx-option": {
    "title": "MCX Options Strategies",
    "description": "Options on MCX commodities with defined risk and reward profiles.",
    "keywords": "MCX options, commodity options, strategies"
  },
  "/services/ncdex": {
    "title": "NCDEX Research",
    "description": "Research for agricultural commodities traded on NCDEX.",
    "keywords": "NCDEX, agri commodities, research"
  },
  "/services/forex": {
    "title": "Forex Research & Strategies",
    "description": "Currency pairs analysis and strategies with prudent risk management.",
    "keywords": "forex research, currency pairs, FX strategies"
  },
  "/services/currency": {
    "title": "Currency Derivatives",
    "description": "USDINR, EURINR, GBPINR ideas with structured risk frameworks.",
    "keywords": "currency derivatives, USDINR, EURINR, GBPINR"
  },
  "/services/comex": {
    "title": "COMEX Research",
    "description": "International commodities research aligned with domestic contracts.",
    "keywords": "COMEX research, commodities, gold, crude"
  },
  "/SmartCash": {
    "title": "SmartCash – Premium Equity Cash Service",
    "description": "Premium cash-segment service for disciplined equity investing and trading.",
    "keywords": "SmartCash, premium equity cash, stock ideas"
  },
  "/EvaluationIndexOptions": {
    "title": "Evaluation Index Options – Backtested Strategies",
    "description": "Curated index options strategies with evaluation metrics and risk parameters.",
    "keywords": "index options evaluation, backtesting, strategies"
  },
  "/EvaluationStockCash": {
    "title": "Evaluation Stock Cash – Curated Equity Picks",
    "description": "Evaluated stock picks with data-backed rationale and risk levels.",
    "keywords": "evaluation stock cash, curated picks, equity research"
  },
  "/EvaluationStockOption": {
    "title": "Evaluation Stock Option – Options on Stocks",
    "description": "Structured stock options strategies reviewed for consistency and drawdown.",
    "keywords": "stock options evaluation, options research"
  },
  "/SmartFuture": {
    "title": "SmartFuture – Futures Strategies",
    "description": "Premium futures service with risk-managed directional and hedged trades.",
    "keywords": "futures strategies, premium futures, hedging"
  },
  "/SmartOptions": {
    "title": "SmartOptions – Options Strategies",
    "description": "Premium options strategies for consistent performance and drawdown control.",
    "keywords": "options strategies, premium options, spreads"
  },
  "/ImpulseIndexOptions": {
    "title": "Impulse Index Options – Momentum Options",
    "description": "Momentum-driven index options strategies with strict risk controls.",
    "keywords": "momentum options, index options, impulse"
  },
  "/ImpulseOption": {
    "title": "ImpulseOption – Momentum Strategies",
    "description": "Momentum-focused options strategies across equities and indices.",
    "keywords": "impulse option, momentum trading, options"
  },
  "/MCXSupreme": {
    "title": "MCXSupreme – Premium MCX Service",
    "description": "Premium MCX strategies across bullion, energy, and metals with tight risk.",
    "keywords": "MCX supreme, premium commodity service, MCX research"
  },
  "/GalaxyMCX": {
    "title": "GalaxyMCX – Comprehensive Commodity Service",
    "description": "Full-spectrum MCX strategies with diversification and risk discipline.",
    "keywords": "Galaxy MCX, commodity strategies, MCX service"
  },
  "/UniversalCash": {
    "title": "UniversalCash – Multi-Sector Cash Ideas",
    "description": "Broad-based cash segment ideas across sectors with clear risk levels.",
    "keywords": "UniversalCash, equity cash service, stock ideas"
  },
  "/InfinityClub": {
    "title": "InfinityClub – Exclusive Advisory",
    "description": "Exclusive advisory program with personalized research and reviews.",
    "keywords": "InfinityClub, exclusive advisory, personalized research"
  },
  "/NCDEX": {
    "title": "NCDEX Research",
    "description": "Agricultural commodities insights and trade ideas.",
    "keywords": "NCDEX research, agri commodities"
  },
  "/Forex": {
    "title": "Forex Research",
    "description": "FX strategies and currency analysis with risk-first approach.",
    "keywords": "forex, currency research, FX strategies"
  },
  "/Currency": {
    "title": "Currency Derivatives",
    "description": "Currency derivatives ideas (USDINR, EURINR, GBPINR).",
    "keywords": "currency derivatives, USDINR, EURINR, GBPINR"
  },
  "/Comex": {
    "title": "COMEX Research",
    "description": "International commodities research aligned with MCX.",
    "keywords": "COMEX research, commodities"
  },
  "/Career": {
    "title": "Careers at Wise Global Research",
    "description": "Join a disciplined, research-focused team building investor-first solutions.",
    "keywords": "careers, jobs, research analyst jobs"
  },
  "/Training": {
    "title": "Training & Mentorship",
    "description": "Workshops and mentorship programs on trading discipline and risk management.",
    "keywords": "trading training, mentorship, workshops"
  },
  "/InvestorChart": {
    "title": "Investor Chart",
    "description": "Charts and dashboards for investor performance tracking.",
    "keywords": "investor chart, dashboards, performance"
  },
  "/anti-money-laundering": {
    "title": "Anti-Money Laundering Policy",
    "description": "AML policy outlining customer due diligence and compliance measures.",
    "keywords": "AML policy, anti-money laundering, compliance"
  },
  "/daily": {
    "title": "Daily Recommendation",
    "description": "Daily research recommendations and key levels.",
    "keywords": "daily recommendation, research levels, calls"
  }
};;

export const isNoIndexPath = (pathname) => {
  return pathname.startsWith('/admin');
};

// // src/pages/Services.js
// import React, { useState, useRef } from 'react';
// import { Trans, useTranslation } from '../i18nShim';
// import { Link } from 'react-router-dom';
// import { FaPlus, FaMinus, FaChartLine, FaRegLightbulb, FaStar, FaShieldAlt } from 'react-icons/fa';
// import { Helmet } from 'react-helmet-async';

// // Local images (from src/assets/images)
// // Replaced local images with hosted image URLs to reduce bundle size and use CDN images
// // Local image imports removed as requested. Use the imagesMap / localImagesUrls below instead.

// // Services data reflecting a SEBI Registered Research Analyst firm
// export const services = [
//   {
//     category: 'Equity Cash',
//     name: 'Smart Cash',
//     description: 'In-depth research and analysis for intraday and positional trading opportunities in the cash segment.',
//     icon: <FaChartLine className="text-indigo-600" />
//   },
//   {
//     category: 'Equity Cash',
//     name: 'Evaluation Stock Cash',
//     description: 'Fundamental analysis and research reports on quality stocks for long-term investment.',
//     icon: <FaChartLine className="text-indigo-600" />
//   },
//   {
//     category: 'Derivatives',
//     name: 'Smart Options',
//     description: 'Data-driven research on high-probability options strategies to help you navigate the derivatives market.',
//     icon: <FaRegLightbulb className="text-indigo-600" />
//   },
//   {
//     category: 'Derivatives',
//     name: 'Impulse Option',
//     description: 'Momentum-based research for agile traders looking to capitalize on short-term market movements in options.',
//     icon: <FaRegLightbulb className="text-indigo-600" />
//   },
//   {
//     category: 'Derivatives',
//     name: 'Smart Future',
//     description: 'Strategic research and analysis for futures trading, focusing on risk management and potential opportunities.',
//     icon: <FaRegLightbulb className="text-indigo-600" />
//   },
//   {
//     category: 'Derivatives',
//     name: 'Evaluation Stock Option',
//     description: 'A synergistic approach combining fundamental stock analysis with strategic options research for balanced growth.',
//     icon: <FaRegLightbulb className="text-indigo-600" />
//   },
//   {
//     category: 'Index',
//     name: 'Evaluation Index Options',
//     description: 'Specialized research on major indices like Nifty and Bank Nifty to identify strategic option trades.',
//     icon: <FaStar className="text-indigo-600" />
//   },
//   {
//     category: 'Index',
//     name: 'Impulse Index Options',
//     description: 'Harness market volatility with our timely research on high-impact trading opportunities in index options.',
//     icon: <FaStar className="text-indigo-600" />
//   },
//   {
//     category: 'Index',
//     name: 'Smart Index Option',
//     description: 'Consistent and stable research strategies for navigating the complexities of the index options market.',
//     icon: <FaStar className="text-indigo-600" />
//   },
//   {
//     category: 'Commodities',
//     name: 'MCX Supreme',
//     description: 'Premium research and analysis on the commodities market to give you a competitive edge in MCX.',
//     icon: <FaShieldAlt className="text-indigo-600" />
//   },
//   {
//     category: 'Commodities',
//     name: 'Galaxy MCX',
//     description: 'Diversified research reports covering a broad spectrum of commodities.',
//     icon: <FaShieldAlt className="text-indigo-600" />
//   },
//   {
//     category: 'Customized',
//     name: 'Universal Cash',
//     description: 'Flexible and adaptive research plans for the cash market, tailored to various trading styles and risk profiles.',
//     icon: <FaShieldAlt className="text-indigo-600" />
//   },
//   {
//     category: 'Premium',
//     name: 'Infinity Club',
//     description: 'Exclusive access to our most premium research, in-depth market reports, and direct analyst support.',
//     icon: <FaShieldAlt className="text-indigo-600" />
//   },
// ];

// // No external images: use gradient header blocks with centered icons instead of images

// // Helper to map service names to specific routes
// const getServicePath = (name) => {
//   const routeName = name.toLowerCase().replace(/\s+/g, '-');
//   switch (name) {
//     case 'MCX Supreme':
//   return '/MCXSupreme';
//     case 'Galaxy MCX':
//       return '/GalaxyMCX';
//     default:
//       return `/services/${routeName}`;
//   }
// };

// // Main Services Page Component
// const ServicesPage = () => {
//   const { t } = useTranslation();

//   const [expandedService, setExpandedService] = useState(null);
//   const expandedRefs = useRef({});

//   const toggleService = (index) => {
//     setExpandedService(expandedService === index ? null : index);
//     // focus the expanded panel for keyboard users
//     setTimeout(() => {
//       const el = expandedRefs.current[index];
//       if (el) el.focus();
//     }, 120);
//   };

//   return (
//     <>
//       <Helmet>
//         <title>{t('pages.Services.our-services-wise-global-research', 'Our Services | Wise Global Research')}</title>
//         <meta name="description" content="Explore Wise Global Research's SEBI registered research services: equity, derivatives, MCX, Nifty, Sensex, and more. Trusted by thousands of investors and traders in India." />
//         <meta property="og:title" content="Our Services | Wise Global Research" />
//         <meta property="og:description" content="SEBI registered research services: equity, derivatives, MCX, Nifty, Sensex, and more. Trusted by thousands of investors and traders in India." />
//         <meta property="og:url" content="https://wiseglobalresearch.com/services" />
//         <meta property="og:image" content="https://wiseglobalresearch.com/og-image.jpg" />
//         <meta name="twitter:title" content="Our Services | Wise Global Research" />
//         <meta name="twitter:description" content="SEBI registered research services: equity, derivatives, MCX, Nifty, Sensex, and more. Trusted by thousands of investors and traders in India." />
//         <meta name="twitter:image" content="https://wiseglobalresearch.com/og-image.jpg" />
//       </Helmet>
//       <div className="min-h-screen bg-white text-black">
//         <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//           <div className="rounded-2xl shadow-2xl p-6 sm:p-10 bg-white border-2" style={{ border: '2px solid #6366f1', boxShadow: '0 8px 32px rgba(2,6,23,0.08)' }}>
//           {/* Small hero CTA to drive conversions */}
//           <div className="rounded-2xl p-6 mb-8 bg-white" style={{ border: '2px solid #6366f1' }}>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//               <div className="w-full sm:w-auto">
//                 <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-700">{t('pages.Services.get-started-with-our-research','Get started with Wise Global Research')}</h2>
//                 {/* Intro paragraph removed as requested */}
//               </div>
//               <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
//                 <a href="#plans" className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2 btn-purple text-white font-semibold rounded-lg shadow hover:opacity-95 transition">{t('pages.Services.view-plans','View Plans')}</a>
//                 <Link to="/contact" className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 rounded-lg border border-indigo-300 hover:bg-indigo-50 transition text-black">{t('pages.Services.contact-us','Contact Us')}</Link>
//               </div>
//             </div>
//           </div>
        
//           <div className="py-2">
//             {/* anchor for CTA */}
//             <div id="plans"></div>
//           </div>

//           <div className="py-2">
//           {/* Header Section */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight max-w-4xl mx-auto text-indigo-700">
//               <Trans i18nKey="pages.Services.our-research-services">Our Research Services</Trans>
//             </h1>
//             <p className="mt-4 text-base sm:text-lg max-w-3xl mx-auto px-2 sm:px-0 text-black">
//               <Trans i18nKey="pages.Services.wise-global-research-services-is-a-sebi-"><Trans i18nKey="pages.Services.wise-global-research-services-is-a-sebi--1">Wise Global Research Services is a SEBI Registered Research Analyst firm, committed to providing unbiased, data-driven insights to empower your financial decisions.</Trans></Trans>
//             </p>
//           </div>

//           </div>

//           {/* Services Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 auto-rows-fr" id="plans-grid">
//             {services.map((service, index) => {
//               // Simple category -> image mapping using Unsplash search queries as placeholders
//               // Use the source.unsplash.com featured endpoint with size + keywords so it reliably returns an image
//               // Map local images cyclically so every card has a local, reliable image
//               // Allow specific overrides for certain services
//               if (service.name === 'Smart Cash') return (
//                 <article
//                   key={index}
//                   className="relative rounded-2xl overflow-hidden transform hover:-translate-y-2 focus-within:-translate-y-2 transition-all duration-300 ease-in-out w-full bg-white h-full flex flex-col shadow-2xl"
//                   style={{ border: `2px solid #6366f1` }}
//                 >
//                   {/* Free Trial ribbon removed as requested */}
//                   <div className="flex flex-col h-full">
//                     <div className="w-full h-44 sm:h-48 md:h-52 overflow-hidden flex items-center justify-center bg-indigo-50">
//                       <div className="text-5xl sm:text-6xl text-indigo-600" aria-hidden>{service.icon}</div>
//                     </div>
//                     <div className="p-6 flex flex-col flex-grow h-full">
//                       <div className="flex items-center mb-3">
//                         <div className="text-2xl sm:text-3xl mr-3 text-indigo-600">{service.icon}</div>
//                         <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-700">{service.name}</h2>
//                       </div>
//                       <p className="mb-4 flex-grow text-sm sm:text-base leading-relaxed text-black">{service.description}</p>
//                       <div className="flex items-center justify-between mt-auto">
//                         <Link
//                           to={getServicePath(service.name)}
//                           className="inline-flex items-center px-5 py-2 btn-purple text-white font-semibold rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                         ><Trans i18nKey="pages.Services.view-plan">View Plan</Trans></Link>
//                         <button
//                           onClick={() => toggleService(index)}
//                           aria-expanded={expandedService === index}
//                           aria-controls={`service-details-${index}`}
//                           className="flex items-center font-semibold transition-colors duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 rounded text-indigo-700"
//                         >
//                           {expandedService === index ? <FaMinus className="mr-2 text-indigo-700" /> : <FaPlus className="mr-2 text-indigo-700" />}
//                           <span>Details</span>
//                         </button>
//                       </div>
//                       <div
//                         id={`service-details-${index}`}
//                         ref={(el) => (expandedRefs.current[index] = el)}
//                         tabIndex={-1}
//                         className={`mt-4 overflow-hidden transition-all duration-300 ${expandedService === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
//                         style={{ borderTop: `1px solid var(--bg-border)`, paddingTop: expandedService === index ? '1rem' : '0' }}
//                         aria-hidden={expandedService === index ? 'false' : 'true'}
//                       >
//                         <p className="text-sm text-black"><Trans i18nKey="pages.Services.this-research-service-falls-under-the"><Trans i18nKey="pages.Services.this-research-service-falls-under-the-1">This research service falls under the</Trans></Trans> <span className="font-semibold">{service.category}</span> <Trans i18nKey="pages.Services.category-our-analysis-is-based-on-rigoro"><Trans i18nKey="pages.Services.category-our-analysis-is-based-on-rigoro-1">category. Our analysis is based on rigorous methodologies and market data.</Trans></Trans></p>
//                       </div>
//                     </div>
//                   </div>
//                 </article>
//               );

//               if (service.name === 'MCX Supreme') return (
//                 <article
//                   key={index}
//                   className="relative rounded-2xl overflow-hidden transform hover:-translate-y-2 focus-within:-translate-y-2 transition-all duration-300 ease-in-out w-full bg-white h-full flex flex-col shadow-2xl"
//                   style={{ border: `2px solid #6366f1` }}
//                 >
//                   <div className="absolute top-3 left-3 bg-indigo-500 text-xs font-semibold text-white uppercase px-2 py-1 rounded">Premium</div>
//                   <div className="flex flex-col h-full">
//                     <div className="w-full h-44 sm:h-48 md:h-52 overflow-hidden flex items-center justify-center bg-indigo-50">
//                       <div className="text-5xl sm:text-6xl text-indigo-600" aria-hidden>{service.icon}</div>
//                     </div>
//                     <div className="p-6 flex flex-col flex-grow h-full">
//                       <div className="flex items-center mb-3">
//                         <div className="text-2xl sm:text-3xl mr-3 text-indigo-600">{service.icon}</div>
//                         <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-700">{service.name}</h2>
//                       </div>
//                       <p className="mb-4 flex-grow text-sm sm:text-base leading-relaxed text-black">{service.description}</p>
//                       <div className="flex items-center justify-between mt-auto">
//                         <Link
//                           to={getServicePath(service.name)}
//                           className="inline-flex items-center px-5 py-2 btn-purple text-white font-semibold rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                         ><Trans i18nKey="pages.Services.view-plan">View Plan</Trans></Link>
//                         <button
//                           onClick={() => toggleService(index)}
//                           aria-expanded={expandedService === index}
//                           aria-controls={`service-details-${index}`}
//                           className="flex items-center font-semibold transition-colors duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 rounded text-indigo-700"
//                         >
//                           {expandedService === index ? <FaMinus className="mr-2 text-indigo-700" /> : <FaPlus className="mr-2 text-indigo-700" />}
//                           <span>Details</span>
//                         </button>
//                       </div>
//                       <div
//                         id={`service-details-${index}`}
//                         ref={(el) => (expandedRefs.current[index] = el)}
//                         tabIndex={-1}
//                         className={`mt-4 overflow-hidden transition-all duration-300 ${expandedService === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
//                         style={{ borderTop: `1px solid var(--bg-border)`, paddingTop: expandedService === index ? '1rem' : '0' }}
//                         aria-hidden={expandedService === index ? 'false' : 'true'}
//                       >
//                         <p className="text-sm text-black"><Trans i18nKey="pages.Services.this-research-service-falls-under-the"><Trans i18nKey="pages.Services.this-research-service-falls-under-the-1">This research service falls under the</Trans></Trans> <span className="font-semibold">{service.category}</span> <Trans i18nKey="pages.Services.category-our-analysis-is-based-on-rigoro"><Trans i18nKey="pages.Services.category-our-analysis-is-based-on-rigoro-1">category. Our analysis is based on rigorous methodologies and market data.</Trans></Trans></p>
//                       </div>
//                     </div>
//                   </div>
//                 </article>
//               );

//               if (service.name === 'Galaxy MCX') return (
//                 <article
//                   key={index}
//                   className="relative rounded-2xl overflow-hidden transform hover:-translate-y-2 focus-within:-translate-y-2 transition-all duration-300 ease-in-out w-full bg-white h-full flex flex-col shadow-2xl"
//                   style={{ border: `2px solid #6366f1` }}
//                 >
//                   <div className="absolute top-3 left-3 bg-indigo-400 text-xs font-semibold text-white uppercase px-2 py-1 rounded">Popular</div>
//                   <div className="flex flex-col h-full">
//                     <div className="w-full h-44 sm:h-48 md:h-52 overflow-hidden flex items-center justify-center bg-indigo-50">
//                       <div className="text-5xl sm:text-6xl text-indigo-600" aria-hidden>{service.icon}</div>
//                     </div>
//                     <div className="p-6 flex flex-col flex-grow h-full">
//                       <div className="flex items-center mb-3">
//                         <div className="text-2xl sm:text-3xl mr-3 text-indigo-600">{service.icon}</div>
//                         <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-700">{service.name}</h2>
//                       </div>
//                       <p className="mb-4 flex-grow text-sm sm:text-base leading-relaxed text-black">{service.description}</p>
//                       <div className="flex items-center justify-between mt-auto">
//                         <Link
//                           to={getServicePath(service.name)}
//                           className="inline-flex items-center px-5 py-2 btn-purple text-white font-semibold rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                         ><Trans i18nKey="pages.Services.view-plan">View Plan</Trans></Link>
//                         <button
//                           onClick={() => toggleService(index)}
//                           aria-expanded={expandedService === index}
//                           aria-controls={`service-details-${index}`}
//                           className="flex items-center font-semibold transition-colors duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 rounded text-indigo-700"
//                         >
//                           {expandedService === index ? <FaMinus className="mr-2 text-indigo-700" /> : <FaPlus className="mr-2 text-indigo-700" />}
//                           <span>Details</span>
//                         </button>
//                       </div>
//                       <div
//                         id={`service-details-${index}`}
//                         ref={(el) => (expandedRefs.current[index] = el)}
//                         tabIndex={-1}
//                         className={`mt-4 overflow-hidden transition-all duration-300 ${expandedService === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
//                         style={{ borderTop: `1px solid var(--bg-border)`, paddingTop: expandedService === index ? '1rem' : '0' }}
//                         aria-hidden={expandedService === index ? 'false' : 'true'}
//                       >
//                         <p className="text-sm text-black"><Trans i18nKey="pages.Services.this-research-service-falls-under-the"><Trans i18nKey="pages.Services.this-research-service-falls-under-the-1">This research service falls under the</Trans></Trans> <span className="font-semibold">{service.category}</span> <Trans i18nKey="pages.Services.category-our-analysis-is-based-on-rigoro"><Trans i18nKey="pages.Services.category-our-analysis-is-based-on-rigoro-1">category. Our analysis is based on rigorous methodologies and market data.</Trans></Trans></p>
//                       </div>
//                     </div>
//                   </div>
//                 </article>
//               );

//               // header is replaced with a gradient + icon block
//               return (
//                 <article
//                   key={index}
//                   className="relative rounded-2xl overflow-hidden transform hover:-translate-y-2 focus-within:-translate-y-2 transition-all duration-300 ease-in-out w-full bg-white h-full flex flex-col shadow-2xl"
//                   style={{ border: `2px solid #6366f1` }}
//                 >
//                   {/* 'Free' badge removed as requested */}
//                   <div className="flex flex-col h-full">
//                     <div className="w-full h-40 sm:h-44 md:h-48 overflow-hidden flex items-center justify-center bg-indigo-50">
//                       <div className="text-4xl sm:text-5xl text-indigo-600" aria-hidden>{service.icon}</div>
//                     </div>
//                     <div className="p-6 flex flex-col flex-grow h-full">
//                       <div className="flex items-center mb-3">
//                         <div className="text-2xl sm:text-3xl mr-3 text-indigo-600">{service.icon}</div>
//                         <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-700">{service.name}</h2>
//                       </div>
//                       <p className="mb-4 flex-grow text-sm sm:text-base leading-relaxed text-black">{service.description}</p>
//                       <div className="flex items-center justify-between mt-auto">
//                         <Link
//                           to={getServicePath(service.name)}
//                           className="inline-flex items-center px-5 py-2 btn-purple text-white font-semibold rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                         ><Trans i18nKey="pages.Services.view-plan">View Plan</Trans></Link>
//                         <button
//                           onClick={() => toggleService(index)}
//                           aria-expanded={expandedService === index}
//                           aria-controls={`service-details-${index}`}
//                           className="flex items-center font-semibold transition-colors duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 rounded text-indigo-700"
//                         >
//                           {expandedService === index ? <FaMinus className="mr-2 text-indigo-700" /> : <FaPlus className="mr-2 text-indigo-700" />}
//                           <span>Details</span>
//                         </button>
//                       </div>
//                       <div
//                         id={`service-details-${index}`}
//                         ref={(el) => (expandedRefs.current[index] = el)}
//                         tabIndex={-1}
//                         className={`mt-4 overflow-hidden transition-all duration-300 ${expandedService === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
//                         style={{ borderTop: `1px solid var(--bg-border)`, paddingTop: expandedService === index ? '1rem' : '0' }}
//                         aria-hidden={expandedService === index ? 'false' : 'true'}
//                       >
//                         <p className="text-sm text-black"><Trans i18nKey="pages.Services.this-research-service-falls-under-the"><Trans i18nKey="pages.Services.this-research-service-falls-under-the-1">This research service falls under the</Trans></Trans> <span className="font-semibold">{service.category}</span> <Trans i18nKey="pages.Services.category-our-analysis-is-based-on-rigoro"><Trans i18nKey="pages.Services.category-our-analysis-is-based-on-rigoro-1">category. Our analysis is based on rigorous methodologies and market data.</Trans></Trans></p>
//                       </div>
//                     </div>
//                   </div>
//                 </article>
//               );
//             })}
//           </div>

//           {/* SEBI Disclaimer Section */}
//           <div className="text-center p-6 sm:p-8 rounded-2xl shadow-2xl bg-white" style={{ border: '2px solid #6366f1' }}>
//             <h3 className="text-xl sm:text-2xl font-bold mb-4 text-indigo-700"><Trans i18nKey="pages.Services.important-disclosures">Important Disclosures</Trans></h3>
//             <div className="max-w-4xl mx-auto text-sm sm:text-base space-y-2 px-2 sm:px-0 text-black">
//               <p>
//                 <span className="font-semibold"><Trans i18nKey="pages.Services.wise-global-research-services"><Trans i18nKey="pages.Services.wise-global-research-services-1">Wise Global Research Services</Trans></Trans></span><Trans i18nKey="pages.Services.is-a-sebi-registered-research-analyst"><Trans i18nKey="pages.Services.is-a-sebi-registered-research-analyst-1">is a SEBI Registered Research Analyst.</Trans></Trans><strong className="block mt-1"><Trans i18nKey="pages.Services.sebi-registration-no-inh000016719"><Trans i18nKey="pages.Services.sebi-registration-no-inh000016719-1">SEBI Registration No:INH000016719</Trans></Trans></strong>
//               </p>
//               <p><Trans i18nKey="pages.Services.the-content-and-research-reports-provide"><Trans i18nKey="pages.Services.the-content-and-research-reports-provide-1">The content and research reports provided are for informational purposes only and do not constitute investment advice. Investments in the securities market are subject to market risks. Please read all related documents carefully before investing.</Trans></Trans></p>
//               <p><Trans i18nKey="pages.Services.the-securities-quoted-are-for-illustrati"><Trans i18nKey="pages.Services.the-securities-quoted-are-for-illustrati-1">The securities quoted are for illustration only and are not recommendatory. Past performance is not indicative of future results.</Trans></Trans></p>
//             </div>
//           </div>
//   </div>
//   </div>
//       </div>
//     </>
//   );
// };

// export default ServicesPage;
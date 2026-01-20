import { useRef, useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { containerVariants } from '../utils/animationVariants';
import HeroSection from '../components/HeroSection';
import ErrorBoundary from '../components/ErrorBoundary';
import AlertBar from '../components/AlertBar';
import WhyChooseUs from '../components/WhyChooseUs';
import MarketOverview from '../components/MarketOverview';
import EconomicCalendar from '../components/EconomicCalendar';

import MarketInsights from '../components/MarketInsights';
import MethodologySection from '../components/MethodologySection';
// import TeamSection from '../components/TeamSection'; // Temporarily disabled on Home page
// import TradingViewTicker from '../components/TradingViewTicker';

// import SubscriptionPlans from '../components/SubscriptionPlans';
import CallToAction from '../components/CallToAction';
// import TimelineSection from '../components/TimelineSection';
import CertificationsSection from '../components/CertificationsSection';
import ContactFormSection from '../components/ContactFormSection';
import ComplaintTable from '../components/ComplaintTable';
import PopupForm from '../components/PopupForm';
import PopupDisclaimer from '../components/PopupDisclaimer';
import WhatsAppButton from '../components/WhatsAppButton';

const Home = () => {
  const contactFormRef = useRef(null);
  const [showScroll, setShowScroll] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const scrollToContactForm = () => {
    contactFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkScrollTop = useCallback(() => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  }, [showScroll]); // Dependencies for checkScrollTop


  

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [checkScrollTop]); // checkScrollTop is now stable

  // Show the popupForm only after the disclaimer is accepted in this session.
  const handleDisclaimerAccepted = () => {
    setDisclaimerAccepted(true);
    // show the image popup immediately after disclaimer accepted
    setShowPopup(true);
  };


  return (
    <>
      <Helmet>
        <title>Wise Global Research — Nifty & Sensex analysis, Stock Recommendations</title>
        <meta name="description" content="SEBI-registered stock market research: live Nifty & Sensex updates, intraday tips, stock recommendations, and futures/options analysis for Indian traders." />
        <link rel="canonical" href="https://wiseglobalresearch.com/" />
        <meta property="og:title" content="Wise Global Research — Nifty & Sensex analysis, Stock Recommendations" />
        <meta property="og:description" content="Live market updates, high-probability stock recommendations, and research-backed trading strategies for NSE, BSE and MCX." />
        <meta property="og:url" content="https://wiseglobalresearch.com/" />
        <meta property="og:image" content="https://wiseglobalresearch.com/og-image.jpg" />
        <meta name="twitter:title" content="Wise Global Research — Market Research & Stock Tips" />
        <meta name="twitter:description" content="Get Nifty & Sensex updates, intraday signals, and research-backed stock recommendations for Indian investors." />
        <meta name="twitter:image" content="https://wiseglobalresearch.com/og-image.jpg" />
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://wiseglobalresearch.com/#org",
                "name": "Wise Global Research",
                "url": "https://wiseglobalresearch.com/",
                "logo": "https://wiseglobalresearch.com/og-image.jpg",
                "sameAs": []
              },
              {
                "@type": "WebSite",
                "@id": "https://wiseglobalresearch.com/#website",
                "url": "https://wiseglobalresearch.com/",
                "name": "Wise Global Research",
                "publisher": { "@id": "https://wiseglobalresearch.com/#org" },
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://wiseglobalresearch.com/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@type": "WebPage",
                "@id": "https://wiseglobalresearch.com/#homepage",
                "url": "https://wiseglobalresearch.com/",
                "name": "Wise Global Research — Home",
                "isPartOf": { "@id": "https://wiseglobalresearch.com/#website" },
                "description": "SEBI-registered stock market research, live market updates, intraday tips, and stock recommendations for Indian traders."
              }
            ]
          }`}
        </script>
      </Helmet>
      <motion.div
        className="min-h-screen bg-transparent text-white relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
  {/* Disclaimer should appear first; only after accepted do we show the image popup */}
  <PopupDisclaimer onAccept={handleDisclaimerAccepted} showBackdrop={false} />
  {disclaimerAccepted && showPopup && <PopupForm onClose={() => setShowPopup(false)} forceShow={true} showBackdrop={false} />}
   {/* <TradingViewTicker suppressHelmet={true} /> */}
        <ErrorBoundary>
          {/* Inline (non-sticky) alert shown at top of hero */}
          <AlertBar variant="inline" />
          <HeroSection />
        </ErrorBoundary>
        <WhyChooseUs />
        <MarketOverview />
  <EconomicCalendar embedUrl="https://widget.myfxbook.com/widget/calendar.html" requireClickToLoad={true} />
  {/* <ServicesSection /> */}
        <MarketInsights />
        <MethodologySection />
  {/* <TeamSection /> */}
        <CallToAction scrollToContactForm={scrollToContactForm} />
         {/* <TimelineSection /> */}
        <CertificationsSection />
        <ContactFormSection contactFormRef={contactFormRef} />
        <ComplaintTable />
        {/* WhatsApp Chat Button on Main Screen */}
        <WhatsAppButton />
      </motion.div>
    </>
  );
};

export default Home;

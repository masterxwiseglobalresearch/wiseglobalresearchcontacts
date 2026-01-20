// src/pages/Blogs.js
import React, { useState } from 'react';
import { Trans, useTranslation } from '../i18nShim';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import analytics from '../lib/analytics';
import { FaBookOpen, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Animation variants for container
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

// Alias for containerVariants to fix the error
const containerVariants = staggerContainer;

// Animation for cards
const cardVariants = {
  hidden: { scale: 0.8, opacity: 0, rotateX: 60 },
  visible: { scale: 1, opacity: 1, rotateX: 0, transition: { duration: 0.6 } },
  hover: { scale: 1.05, rotateY: 10, boxShadow: '0 15px 30px rgba(255, 252, 252, 0.21)' },
};

// Blog posts data with Indian context
const posts = [
  {
    id: 1,
    title: 'Top 5 Investment Strategies for Indian Markets in 2025',
    date: 'July 12, 2025',
    excerpt: 'Explore proven strategies to grow your wealth in NSE, BSE, and MCX markets.',
    full: 'This in-depth post covers asset allocation, diversification, risk tolerance, and long-term compounding for Indian investors, with a focus on NIFTY, BANKNIFTY, and stocks like RELIANCE.',
    author: 'Arjun Malhotra',
    authorBio: 'Arjun, based in Mumbai, is a Senior Analyst with 10+ years in Indian stock markets.',
    readTime: '5 min read',
    category: 'Investment Strategies',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600',
    relatedPosts: [2, 3],
  },
  {
    id: 2,
    title: 'Global Economic Outlook: Impact on Indian Markets',
    date: 'July 8, 2025',
    excerpt: 'Our macro analysts break down global trends affecting NSE and BSE.',
    full: 'From RBI’s monetary policies to global inflation trends, this article analyzes macroeconomic indicators influencing Indian markets, including NIFTY and MCX commodities like GOLD.',
    author: 'Priya Chopra',
    authorBio: 'Priya, from Delhi, leads our Macro Strategy Team with expertise in SEBI-compliant analysis.',
    readTime: '7 min read',
    category: 'Market Trends',
    image: 'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=600',
    relatedPosts: [1, 4],
  },
  {
    id: 3,
    title: 'SEBI Guidelines for Retail Investors Explained',
    date: 'July 1, 2025',
    excerpt: 'Understand how SEBI regulations protect Indian investors.',
    full: 'We outline key SEBI regulations including risk profiling, suitability standards, disclosures, and grievance redressal frameworks, ensuring transparency for NSE and BSE traders.',
    author: 'Sanjay Verma',
    authorBio: 'Sanjay, from Lucknow, is our Compliance Officer specializing in SEBI regulations.',
    readTime: '4 min read',
    category: 'Regulatory Insights',
    image: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=600',
    relatedPosts: [1, 5],
  },
  {
    id: 4,
    title: 'The Rise of ESG Investing in India',
    date: 'June 25, 2025',
    excerpt: 'How ESG factors are shaping investment decisions in Indian markets.',
    full: 'ESG investing is gaining traction in India, driven by demand for sustainability and corporate accountability. Learn how to integrate ESG into your NSE and BSE portfolios.',
    author: 'Ananya Menon',
    authorBio: 'Ananya, from Bengaluru, heads our Sustainable Investing Team.',
    readTime: '6 min read',
    category: 'Sustainable Investing',
    image: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=600',
    relatedPosts: [2, 6],
  },
  {
    id: 5,
    title: 'Tech Stocks Analysis: Growth vs Value in BSE',
    date: 'June 18, 2025',
    excerpt: 'Evaluating valuation metrics for Indian tech stocks.',
    full: 'Growth tech stocks like INFOSYS dominate BSE, but value investing opportunities are emerging. Learn how to navigate this shift in Indian markets.',
    author: 'Rohan Gupta',
    authorBio: 'Rohan, from Ahmedabad, is our Head of Trading Strategies.',
    readTime: '8 min read',
    category: 'Equity Analysis',
    image: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=600',
    relatedPosts: [3, 6],
  },
  {
    id: 6,
    title: 'Fixed Income Strategies for Volatile Indian Markets',
    date: 'June 10, 2025',
    excerpt: 'Navigate RBI rate changes with smart bond portfolio management.',
    full: 'Key focus areas include bond laddering, duration targeting, and credit risk management to protect capital in volatile NSE and MCX markets.',
    author: 'Neha Vohra',
    authorBio: 'Neha, from Chennai, leads our Fixed Income Desk.',
    readTime: '5 min read',
    category: 'Fixed Income',
    image: 'https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg?auto=compress&cs=tinysrgb&w=600',
    relatedPosts: [4, 5],
  },
];

// Blog categories
const categories = [
  { id: 1, name: 'Investment Strategies', description: 'Proven methods to grow wealth in NSE and BSE markets.' },
  { id: 2, name: 'Market Trends', description: 'Insights into global and Indian market dynamics.' },
  { id: 3, name: 'Regulatory Insights', description: 'Understanding SEBI and compliance for traders.' },
  { id: 4, name: 'Sustainable Investing', description: 'Focus on ESG and responsible investing in India.' },
  { id: 5, name: 'Equity Analysis', description: 'In-depth analysis of Indian stocks like RELIANCE.' },
  { id: 6, name: 'Fixed Income', description: 'Strategies for bonds and fixed-income securities.' },
];

// Featured post
const featuredPost = posts[0];

// Fallback image
const fallbackImage = 'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=600';

const Blogs = () => {
  const { t } = useTranslation();
  const [expandedIndex, setExpandedIndex] = useState(null);

  React.useEffect(() => {
    try {
      // explicit page_view for GA4/GTM and a custom "viewed_pillar_page" event
      analytics.sendPageView(window.location.pathname, document.title);
      analytics.sendEvent('viewed_pillar_page', {
        page_title: document.title,
        page_path: window.location.pathname,
      });
    } catch (e) {
      // fail silently - analytics should be best-effort
      // console.debug('analytics init error', e);
    }
  }, []);


  // Image error handling
  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

  return (
    <>
      <Helmet>
        <title>{t('pages.Blogs.blogs-wise-global-research', 'Blogs | Wise Global Research')}</title>
        <meta name="description" content="Read expert blogs from Wise Global Research on stock market strategies, SEBI compliance, and investment tips for Indian investors." />
        <meta property="og:title" content="Blogs | Wise Global Research" />
        <meta property="og:description" content="Read expert blogs from Wise Global Research on stock market strategies, SEBI compliance, and investment tips for Indian investors." />
        <meta property="og:url" content="https://wiseglobalresearch.com/blogs" />
        <meta property="og:image" content="https://wiseglobalresearch.com/og-image.jpg" />
        <meta name="twitter:title" content="Blogs | Wise Global Research" />
        <meta name="twitter:description" content="Read expert blogs from Wise Global Research on stock market strategies, SEBI compliance, and investment tips for Indian investors." />
        <meta name="twitter:image" content="https://wiseglobalresearch.com/og-image.jpg" />
      </Helmet>
      <motion.section
        className="relative py-8 sm:py-10 lg:py-14 px-4 sm:px-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container max-w-4xl mx-auto relative z-10">
          <motion.div
            className="mb-6 rounded-2xl p-4 sm:p-6 shadow-2xl"
            style={{
              background: '#fff',
              border: '2px solid #6366f1',
              boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)'
            }}
          >
            <div style={{ color: '#0b1220' }}>
              <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center" style={{ color: '#6366f1' }}>Blogs</h1>
              <div className="space-y-5 text-sm sm:text-base leading-relaxed">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 text-center"><Trans i18nKey="pages.Blogs.investment-insights-market-trends"><Trans i18nKey="pages.Blogs.investment-insights-market-trends-1">Investment Insights & Market Trends</Trans></Trans></h2>
                  <div className="bg-gray-100 border-2 border-indigo-500 rounded-lg p-4">
                    <p className="text-lg text-gray-900 text-center"><Trans i18nKey="pages.Blogs.stay-informed-with-sebi-compliant-resear"><Trans i18nKey="pages.Blogs.stay-informed-with-sebi-compliant-resear-1">Stay informed with SEBI-compliant research articles curated by </Trans></Trans>                    <span className="font-semibold text-indigo-600"><Trans i18nKey="pages.Blogs.wise-global-research">Wise Global Research </Trans></span><Trans i18nKey="pages.Blogs.for-indian-traders">for Indian traders.</Trans></p>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center"><Trans i18nKey="pages.Blogs.featured-post">Featured Post</Trans></h2>
                  <motion.div
                    className="bg-gray-100 border border-gray-300 rounded-xl p-8"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="w-full md:w-1/3 h-48 sm:h-64 object-cover rounded-lg"
                        onError={handleImageError}
                      />
                      <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 text-center">{featuredPost.title}</h3>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-gray-900">{featuredPost.date}</span>
                          <span className="text-sm text-gray-900">{featuredPost.readTime}</span>
                        </div>
                        <p className="text-gray-900 mb-4 text-center">{featuredPost.full}</p>
                        <p className="text-gray-900 text-sm">By {featuredPost.author} - {featuredPost.authorBio}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center"><Trans i18nKey="pages.Blogs.explore-categories">Explore Categories</Trans></h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories.map((category) => (
                      <motion.div
                        key={category.id}
                        className="bg-gray-100 border border-gray-300 rounded-xl shadow-lg p-6 border-t-4 border-indigo-500 text-center"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <FaBookOpen className="text-indigo-500 text-4xl mb-4 mx-auto" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                        <p className="text-gray-900">{category.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center"><Trans i18nKey="pages.Blogs.recent-posts">Recent Posts</Trans></h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        className="bg-gray-100 border border-gray-300 rounded-xl shadow-lg p-6 border-t-4 border-indigo-500 flex flex-col"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                          onError={handleImageError}
                        />
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-xs font-medium bg-indigo-500 px-2 py-1 rounded text-white">{post.readTime}</span>
                          <span className="text-xs text-gray-900">{post.date}</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 text-center">{post.title}</h3>
                        <p className="text-gray-900 mb-4 text-xs sm:text-sm flex-1 text-center">
                          {expandedIndex === index ? post.full : post.excerpt}
                        </p>
                        <div className="mt-auto">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-900">By {post.author}</span>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setExpandedIndex(index === expandedIndex ? null : index)}
                              className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition border border-indigo-300"
                            >
                              {expandedIndex === index ? 'Show Less' : 'Read More'}
                            </motion.button>
                          </div>
                          <p className="text-gray-900 text-sm">{post.authorBio}</p>
                          {expandedIndex === index && post.relatedPosts && (
                            <div className="mt-4">
                              <h4 className="text-lg font-semibold text-gray-900 mb-2"><Trans i18nKey="pages.Blogs.related-posts">Related Posts</Trans></h4>
                              <ul className="list-disc pl-6 text-gray-900 text-sm">
                                {post.relatedPosts.map((relatedId) => {
                                  const relatedPost = posts.find((p) => p.id === relatedId);
                                  return (
                                    <li key={relatedId}>
                                      <button
                                        onClick={() => console.log(`Clicked on related post: ${relatedPost?.title}`)}
                                        className="text-indigo-600 hover:text-indigo-800"
                                        style={{
                                          textDecoration: 'none',
                                          padding: 0,
                                          border: 'none',
                                          background: 'none',
                                          cursor: 'pointer',
                                        }}
                                      >
                                        {relatedPost?.title}
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
                  <div className="bg-gray-100 border border-gray-300 rounded-xl p-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Ahead with Wise Global</h2>
                    <p className="text-gray-900 max-w-2xl mx-auto mb-6">Contact our team to explore trading solutions like Smart Options and MCX Supreme, tailored for Indian markets.</p>
                    <Link
                      to="/contact"
                      className="inline-block bg-indigo-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-600 transition"
                    >Enquiry Now<FaArrowRight className="inline ml-2" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
};
export default Blogs;

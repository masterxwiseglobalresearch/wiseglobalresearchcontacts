import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trans } from '../i18nShim';
import { FiClock, FiBookmark, FiShare2 } from 'react-icons/fi';
import { BsArrowUpRight } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';

function MarketNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [bookmarked, setBookmarked] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');


  // Detect dark mode preference (removed for simplicity)

  // Map UI categories to mediastack API categories/keywords
  const categories = [
    { id: 'all', name: 'All News', query: '' },
    { id: 'business', name: 'Market Trends', query: 'business' },
    { id: 'stocks', name: 'Stocks', query: 'stock OR stocks OR share market' },
    { id: 'economy', name: 'Economy', query: 'economy OR economic' },
    { id: 'commodities', name: 'Commodities', query: 'commodities OR gold OR oil OR silver' },
    { id: 'regulations', name: 'Regulations', query: 'regulation OR policy OR government' }
  ];

  useEffect(() => {
    setLoading(true);
    // Find selected category's query
    const selected = categories.find(cat => cat.id === activeCategory);
    // For 'all' category, fetch maximum allowed news (limit=100)
    let url = `https://api.mediastack.com/v1/news?access_key=a75cd5c17277b76a94b3a426f7966eaf&languages=en&limit=${activeCategory === 'all' ? 100 : 20}`;
    if (selected && selected.query) {
      url += `&keywords=${encodeURIComponent(selected.query)}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.data)) {
          const mapped = data.data.map((item, idx) => ({
            id: idx + 1,
            title: item.title,
            source: item.source || 'mediastack',
            time: item.published_at ? new Date(item.published_at).toLocaleTimeString() : 'Just now',
            category: item.category || 'general',
            impact: 'medium',
            summary: item.description || '',
            image: item.image || '',
            url: item.url || '#',
            author: item.author,
            published_at: item.published_at,
            country: item.country,
            language: item.language
          }));
          setNews(mapped);
          setLastUpdated(new Date().toLocaleTimeString());
        } else {
          setNews([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setNews([]);
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [activeCategory]);

  // ...existing code...

  const toggleBookmark = (id) => {
    if (bookmarked.includes(id)) setBookmarked(bookmarked.filter(item => item !== id));
    else setBookmarked([...bookmarked, id]);
  };

  const filteredNews = activeCategory === 'all' ? news : news.filter(item => item.category === activeCategory);

  const jsonLdGraph = React.useMemo(() => {
    const org = { '@type': 'Organization', name: 'Wise Global Research', url: 'https://wiseglobalresearch.com/', '@id': 'https://wiseglobalresearch.com/#org' };
    const collection = { '@type': 'CollectionPage', name: 'Live Market News', description: 'Live stock market news and updates covering Nifty, Sensex, stocks, commodities and economic headlines.', url: 'https://wiseglobalresearch.com/market-news', isPartOf: { '@id': 'https://wiseglobalresearch.com/#org' } };

    const parseRelativeTime = (timeStr) => {
      if (!timeStr) return null;
      const m = timeStr.match(/(\d+)\s*min/i);
      if (m) return new Date(Date.now() - parseInt(m[1], 10) * 60000).toISOString();
      if (/just now/i.test(timeStr)) return new Date().toISOString();
      return null;
    };

    const collectionTime = new Date().toISOString();
    const articles = (news || []).map(item => {
      const published = parseRelativeTime(item.time) || collectionTime;
      return {
        '@type': 'NewsArticle',
        headline: item.title,
        description: item.summary,
        datePublished: published,
        dateModified: published,
        author: { '@type': 'Person', name: item.source || 'Wise Global Research' },
        image: item.image ? [item.image] : undefined,
        mainEntityOfPage: { '@type': 'WebPage', '@id': item.url && item.url !== '#' ? item.url : `https://wiseglobalresearch.com/market-news#news-${item.id}` },
        publisher: { '@type': 'Organization', name: 'Wise Global Research', logo: { '@type': 'ImageObject', url: 'https://wiseglobalresearch.com/assets/images/logo.png' } }
      };
    });

    return { '@context': 'https://schema.org', '@graph': [org, collection, ...articles] };
  }, [news]);

  const colors = {
    primary: '#6366f1',
    secondary: '#6366f1',
    background: '#ffffff',
    cardBg: 'bg-gray-100',
    textPrimary: '#111827',
    textSecondary: '#4b5563',
    border: '#d1d5db',
    highImpact: '#ef4444',
    mediumImpact: '#f59e0b'
  };

  return (
    <>
      <Helmet>
        <title>Live Market News - Wise Global Research</title>
        <meta name="description" content="Live stock market news, Nifty & Sensex updates, and real-time market headlines from Wise Global Research. Stay informed for better trading decisions." />
        <link rel="canonical" href="https://wiseglobalresearch.com/market-news" />
        {news && news.length > 0 && news[0] && news[0].time && (
          <meta name="article:published_time" content={(news && news[0] && news[0].time) ? (news[0].time.match(/(\d+)\s*min/i) ? new Date(Date.now() - parseInt(news[0].time.match(/(\d+)\s*min/i)[1],10)*60000).toISOString() : ( /just now/i.test(news[0].time) ? new Date().toISOString() : new Date().toISOString() )) : new Date().toISOString()} />
        )}
        <meta property="og:title" content="Live Market News - Wise Global Research" />
        <meta property="og:description" content="Live stock market news, Nifty & Sensex updates, and real-time market headlines from Wise Global Research." />
        <script type="application/ld+json">{JSON.stringify(jsonLdGraph)}</script>
      </Helmet>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-white border-2 border-indigo-500 rounded-2xl shadow-2xl" style={{ backgroundColor: colors.background }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-2xl md:text-3xl font-bold text-center" style={{ color: colors.primary }}>
              <Trans i18nKey="pages.MarketNews.live-market-news">Live Market News</Trans>
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }} className="ml-2 text-xs px-2 py-1 rounded-full bg-indigo-500 text-white">
                <Trans i18nKey="pages.MarketNews.real-time">REAL-TIME</Trans>
              </motion.span>
            </motion.h1>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4 md:mt-0 flex items-center">
            <FiClock className="mr-2" style={{ color: colors.textSecondary }} />
            <span className="text-sm text-gray-600">Last updated: {lastUpdated}</span>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map((category, index) => (
            <motion.button key={category.id} onClick={() => setActiveCategory(category.id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 + (index * 0.1) }} className={`px-4 py-2 mr-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === category.id ? 'text-white bg-indigo-500' : 'text-gray-700 bg-gray-200'}`}>
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg className="animate-spin h-12 w-12 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <div className="text-indigo-600 font-semibold text-lg">Loading news...</div>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p>No news found. API may be down or unavailable.</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-6">
              {filteredNews.map((item, index) => (
                <motion.div key={item.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }} className="bg-white border border-gray-300 rounded-2xl shadow-lg p-4 md:p-6 text-left max-w-2xl mx-auto" whileHover={{ y: -4 }}>
                  <div className="flex flex-col md:flex-row gap-4">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-full md:w-48 h-32 object-cover rounded-xl border mb-2 md:mb-0" />
                    )}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700 font-semibold">{item.category || 'General'}</span>
                          {item.country && <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">{item.country.toUpperCase()}</span>}
                          {item.language && <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">{item.language.toUpperCase()}</span>}
                          <span className="text-xs text-gray-500 ml-auto">{item.time}</span>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold mb-1 text-gray-900">{item.title}</h3>
                        <p className="mb-2 text-gray-700 text-sm">{item.summary}</p>
                        {item.author && <div className="text-xs text-gray-500 mb-1">Author: <span className="font-medium text-gray-800">{item.author}</span></div>}
                        <div className="text-xs text-gray-500 mb-1">Source: <span className="font-medium text-gray-800">{item.source}</span></div>
                        {item.published_at && <div className="text-xs text-gray-500 mb-1">Published: <span className="font-medium text-gray-800">{new Date(item.published_at).toLocaleString()}</span></div>}
                        {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-indigo-600 hover:underline text-sm font-medium">Read full story <BsArrowUpRight className="inline ml-1" /></a>}
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <motion.button type="button" onClick={() => toggleBookmark(item.id)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full text-indigo-500" title={bookmarked.includes(item.id) ? 'Remove bookmark' : 'Add bookmark'} aria-label={bookmarked.includes(item.id) ? 'Remove bookmark' : 'Add bookmark'}>
                          <FiBookmark aria-hidden="true" className={bookmarked.includes(item.id) ? 'fill-current' : ''} />
                        </motion.button>
                        <motion.button type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full text-indigo-500" title="Share news" aria-label="Share news">
                          <FiShare2 aria-hidden="true" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </motion.div>
    </>
  );
}

export default MarketNews;
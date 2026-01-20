// src/pages/servicesprices.js

import React, { useState } from 'react';

// Grouped data by category, with descriptions and icons
const serviceCategories = [
  {
    key: 'cash',
    label: 'Cash',
    icon: '💵',
    color: 'from-green-100 to-green-50',
    description: 'Best for those who want to trade in cash segment with reliable stock recommendations and flexible plans.',
    plans: [
      { name: 'Evaluation Stock Cash', weekly: '₹5,100', monthly: '', quarterly: '', pay: true, desc: 'Short-term evaluation for cash segment traders.', calls: '2-3 per day', type: 'Intraday', delivery: 'SMS' },
      { name: 'Smart Cash', weekly: '', monthly: '₹12,500', quarterly: '₹35,500', pay: true, desc: 'Smart picks for consistent returns.', calls: '2-3 per day', type: 'Intraday', delivery: 'SMS' },
    ],
  },
  {
    key: 'option',
    label: 'Option',
    icon: '📈',
    color: 'from-indigo-100 to-indigo-50',
    description: 'For option traders seeking expert calls and strategies for maximum profit in the options market.',
    plans: [
      { name: 'Evaluation Stock Option', weekly: '₹5,100', monthly: '', quarterly: '', pay: true, desc: 'Evaluate our option strategies for a week with support.', calls: '1-2 per day', type: 'Intraday', delivery: 'SMS' },
      { name: 'Impulse Option', weekly: '', monthly: '₹49,000', quarterly: '', pay: true, desc: 'High momentum option trades for aggressive traders.', calls: '1-2 per day', type: 'Intraday', delivery: 'SMS' },
      { name: 'Smart Options', weekly: '', monthly: '₹12,500', quarterly: '₹35,500', pay: true, desc: 'Balanced option strategies for steady growth with support.', calls: '1-2 per day', type: 'Intraday', delivery: 'SMS' },
      { name: 'Smart Future', weekly: '', monthly: '₹12,500', quarterly: '₹35,500', pay: true, desc: 'Smart future and option combo for diversified trading.', calls: '1-2 per day', type: 'Intraday', delivery: 'SMS' },
    ],
  },
  {
    key: 'usp',
    label: 'USP',
    icon: '🌟',
    color: 'from-pink-100 to-pink-50',
    description: 'Exclusive, high-value plans for elite traders who want the best of our expertise and support.',
    plans: [
      { name: 'Infinity Club', weekly: '', monthly: '', quarterly: '₹1,51,000', pay: true, desc: 'Elite club for premium clients with exclusive benefits.', calls: '1-2 per day', type: 'Intraday', delivery: 'SMS' },
      { name: 'Universal Cash', weekly: '', monthly: '', quarterly: '₹1,51,000', pay: true, desc: 'Premium quarterly plan for high-value cash traders.', calls: '2-3 per day', type: 'Intraday/positional', delivery: 'SMS' },
    ],
  },
  {
    key: 'index',
    label: 'Index',
    icon: '📊',
    color: 'from-yellow-100 to-yellow-50',
    description: 'Index-based trading plans for those who prefer Nifty, BankNifty, and other indices.',
    plans: [
      { name: 'Evaluation Index Options', weekly: '₹5,100', monthly: '', quarterly: '', pay: true, desc: 'Try our index option strategies for a week with support.', calls: '1-2 per day', type: 'Intraday', delivery: 'SMS' },
      { name: 'Impulse Index Options', weekly: '', monthly: '₹49,000', quarterly: '', pay: true, desc: 'Fast-moving index option trades for quick profits.', calls: '1-2 per day', type: 'Intraday', delivery: 'SMS' },
      { name: 'Smart Index Option', weekly: '', monthly: '₹12,500', quarterly: '₹35,500', pay: true, desc: 'Smart index strategies for consistent returns.', calls: '1-2 per day', type: 'Intraday', delivery: 'SMS' },
    ],
  },
  {
    key: 'mcx',
    label: 'MCX',
    icon: '🪙',
    color: 'from-blue-100 to-blue-50',
    description: 'MCX commodity trading plans for those who want to diversify into metals and energy.',
    plans: [
      { name: 'MCX Supreme', weekly: '', monthly: '₹12,500', quarterly: '₹35,500', pay: true, desc: 'Supreme plan for MCX commodity traders.', calls: '1-2 per day', type: 'Intraday', delivery: 'SMS' },
      { name: 'Galaxy MCX', weekly: '', monthly: '', quarterly: '₹1,51,000', pay: true, desc: 'Galaxy plan for high-volume MCX traders with support.', calls: '1-2 per day', type: 'Intraday', delivery: 'SMS' },
    ],
  },
];

const tabButtonStyle = (active, color) =>
  `px-4 py-2 rounded-t-xl font-bold text-base md:text-lg transition-all duration-200 border-b-4 ${active ? 'border-indigo-600 bg-white shadow-lg text-indigo-700' : 'border-transparent bg-gradient-to-b ' + color + ' text-gray-500 hover:text-indigo-700 hover:bg-white/80'}`;

const ServicesPricesPage = () => {
  const [activeTab, setActiveTab] = useState(serviceCategories[0].key);

  const activeCategory = serviceCategories.find((cat) => cat.key === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 text-black flex items-center justify-center">
      <div className="w-full max-w-4xl px-2 sm:px-4 md:px-8 py-8 sm:py-12">
        <div className="rounded-2xl shadow-2xl p-4 sm:p-8 bg-white border-2 border-indigo-200" style={{ boxShadow: '0 8px 32px rgba(2,6,23,0.10)' }}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-700 text-center mb-6 sm:mb-8 tracking-tight">All Services & Prices</h1>
          <p className="text-center text-sm md:text-base text-red-700 font-semibold mb-4 flex items-center justify-center gap-2">
            <span role="img" aria-label="info" className="text-xl">ℹ️</span>
            All prices listed are exclusive of GST (18%).
          </p>
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {serviceCategories.map((cat) => (
              <button
                key={cat.key}
                className={tabButtonStyle(activeTab === cat.key, cat.color)}
                onClick={() => setActiveTab(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          <div className={`rounded-xl bg-gradient-to-br ${activeCategory.color} p-6 shadow-inner transition-all duration-300`}> 
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl md:text-4xl">{activeCategory.icon}</span>
              <span className="text-lg md:text-xl font-semibold text-indigo-800">{activeCategory.label}</span>
            </div>
            <div className="mb-6 text-gray-700 text-sm md:text-base font-medium">{activeCategory.description}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {activeCategory.plans.map((plan, idx) => {
                // Find the lowest price for 'Starting at'
                const prices = [plan.weekly, plan.monthly, plan.quarterly].filter(Boolean).map(p => p.replace(/[^\d]/g, '')).map(Number);
                const minPrice = prices.length ? Math.min(...prices) : null;
                return (
                  <div key={plan.name + idx} className="rounded-xl bg-white/90 border-2 border-indigo-100 shadow-lg p-6 flex flex-col gap-3 hover:scale-[1.03] hover:shadow-indigo-200 transition-all duration-200 relative">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">✨</span>
                      <span className="font-bold text-lg text-indigo-700">{plan.name}</span>
                    </div>
                    <div className="text-gray-600 text-xs md:text-sm mb-1">{plan.desc || 'Best suited for this category.'}</div>
                    <div className="flex flex-wrap gap-3 text-xs md:text-sm mb-1">
                      {plan.calls && <div><span className="font-semibold text-gray-600">Number Of Calls:</span> <span className="text-indigo-700 font-semibold">{plan.calls}</span></div>}
                      {plan.delivery && <div><span className="font-semibold text-gray-600">Mode of Delivery:</span> <span className="text-indigo-700 font-semibold">{plan.delivery}</span></div>}
                      {plan.name === 'Universal Cash' && plan.type && (
                        <div><span className="font-semibold text-gray-600">Type:</span> <span className="text-indigo-700 font-semibold">{plan.type}</span></div>
                      )}
                    </div>
                    {plan.name !== 'Universal Cash' && plan.type && (
                      <div className="text-xs md:text-sm mb-1">
                        <span className="font-semibold text-gray-600">Type:</span>
                        <span className="text-indigo-700 font-semibold ml-1">{plan.type}</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-1 text-sm md:text-base">
                      {plan.weekly && <div><span className="font-semibold text-gray-600">Weekly:</span> <span className="text-indigo-700 font-bold">{plan.weekly}</span></div>}
                      {plan.monthly && <div><span className="font-semibold text-gray-600">Monthly:</span> <span className="text-indigo-700 font-bold">{plan.monthly}</span></div>}
                      {plan.quarterly && <div><span className="font-semibold text-gray-600">Quarterly:</span> <span className="text-indigo-700 font-bold">{plan.quarterly}</span></div>}
                    </div>
                    {minPrice && (
                      <div className="mt-1 text-xs text-green-700 font-semibold">Starting at ₹{minPrice.toLocaleString('en-IN')}</div>
                    )}
                    {plan.pay && (
                      <a
                        href="https://u.payu.in/hr313T3SHfRR"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Pay securely online"
                        className="mt-3 inline-flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-bold rounded-xl shadow hover:scale-105 hover:from-indigo-600 hover:to-indigo-800 transition-all duration-300 text-base border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        <span className="text-lg">💳</span> Pay Now
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPricesPage;

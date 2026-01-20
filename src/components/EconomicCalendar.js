import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Small error boundary to prevent third-party widget errors from breaking the app
class CalendarBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch() { /* no-op: isolate third-party issues */ }
      render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-sm text-black bg-red-800/60 rounded-md">
          Third-party calendar failed to load. Please refresh the page.
        </div>
      );
    }
    return this.props.children;
  }
}

const EconomicCalendar = ({ embedUrl = 'https://widget.myfxbook.com/widget/calendar.html', requireClickToLoad = false }) => {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(!requireClickToLoad); // show immediately unless click-to-load requested
  const [failed, setFailed] = useState(false);
  // Using fixed indigo/white theme for this widget container

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6" ref={containerRef}>
      <div className="container max-w-3xl mx-auto">
        <motion.div className="mb-6 rounded-2xl p-6 shadow-2xl" style={{ background: '#fff', border: '2px solid #6366f1', boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)' }}>
          <div style={{ color: '#0b1220' }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-800">Economic Calendar</h2>
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden bg-white shadow-2xl" style={{ border: '2px solid #6366f1' }}>
                <div className="px-4 py-3">
                  <CalendarBoundary>
                    {failed ? (
                      <div className="p-4 text-sm text-black bg-red-800/60 rounded-md">
                        Calendar is temporarily unavailable. Please try again later.
                      </div>
                    ) : visible ? (
                      <>
                        <div className="rounded-lg overflow-hidden" style={{ border: '2px solid #6366f1' }}>
                          <iframe
                            title="Economic Calendar Widget"
                            src={embedUrl}
                            className="block w-full h-[50vh] sm:h-[55vh] min-h-[220px] sm:min-h-[280px] border-0"
                            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                            // loading eager so navigation-ready widgets start quickly when visible
                            loading="eager"
                            referrerPolicy="no-referrer"
                            aria-label="Embedded economic calendar"
                            onLoad={() => {
                              setFailed(false);
                            }}
                            onError={() => setFailed(true)}
                          />
                        </div>
                        <div className="mt-2 text-right">
                          <a href={embedUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline text-indigo-700 hover:text-indigo-900">Open calendar in a new tab</a>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-[220px] sm:h-[260px] text-adaptive">
                        {requireClickToLoad ? (
                          <div className="text-center">
                            <p className="mb-2" style={{ color: '#000' }}>Third-party calendar is available but requires your consent to load.</p>
                            <button
                              type="button"
                              onClick={() => setVisible(true)}
                              className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                              Load calendar
                            </button>
                          </div>
                        ) : (
                          'Loading calendar…'
                        )}
                      </div>
                    )}
                  </CalendarBoundary>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EconomicCalendar;
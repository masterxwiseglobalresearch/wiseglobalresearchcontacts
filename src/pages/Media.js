import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import analytics from '../lib/analytics';
import YouTubeEmbed from '../components/YouTubeEmbed';
import AccessibleMedia from '../components/AccessibleMedia';
import '../styles/headings.css';

// Minimal YouTube ID extractor (keeps iframe hidden until valid)
function extractYouTubeId(input = '') {
  if (!input) return '';
  // If only an ID is passed
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
  try {
    const url = new URL(input);
    const v = url.searchParams.get('v');
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
    const shortId = url.hostname.includes('youtu.be') ? url.pathname.slice(1) : '';
    if (shortId && /^[a-zA-Z0-9_-]{11}$/.test(shortId)) return shortId;
    const parts = url.pathname.split('/');
    const embedIndex = parts.indexOf('embed');
    if (embedIndex !== -1 && parts[embedIndex + 1] && /^[a-zA-Z0-9_-]{11}$/.test(parts[embedIndex + 1])) {
      return parts[embedIndex + 1];
    }
  } catch {
    // ignore parse errors
  }
  return '';
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Media() {
  const [ytUrl, setYtUrl] = useState('https://www.youtube.com/watch?v=ERN3abYzriw');
  const ytId = useMemo(() => extractYouTubeId(ytUrl), [ytUrl]);
  const isValidYt = ytUrl ? Boolean(ytId) : true; // empty allowed, else must be valid

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
  return (
    <>
      <Helmet>
        <title>Media & Educational Videos - Wise Global Research</title>
        <meta name="description" content="Educational videos and accessible media from Wise Global Research. Video embeds, captions, and transcripts for financial literacy." />
        <link rel="canonical" href="https://wiseglobalresearch.com/media" />
      </Helmet>
      <motion.section
        className="relative py-8 sm:py-10 lg:py-14 px-4 sm:px-6"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container max-w-4xl mx-auto relative z-10">
          <motion.div
            className="mb-6 rounded-2xl p-4 sm:p-6 shadow-2xl text-black"
            style={{
              background: '#fff',
              border: '2px solid #6366f1',
              boxShadow: '0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(99,102,241,0.10)'
            }}
          >
            <div>
              <motion.h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-indigo-700" variants={fadeIn}>Media Page</motion.h1>
              <div className="space-y-5 text-sm sm:text-base leading-relaxed">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
                  <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold heading-purple">Education: Video / Audio</h2>
                  <p className="text-xs sm:text-sm md:text-base text-black/80">
                    This page is for educational purposes only. It is not investment advice. Please consult a registered adviser before making any investment decision. For SEBI compliance, no performance/return claims are made.
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-black">
                    Optional: When available, a separate video with Indian Sign Language (ISL) interpretation will be provided here. Captions and transcripts will be provided for all media; ISL interpretation is provided alongside when applicable.
                  </p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                  <h2 className="text-base sm:text-lg font-semibold heading-purple">YouTube (privacy‑enhanced) embed</h2>
                  <p id="yt-help" className="text-xs sm:text-sm text-black/80">
                    Paste your YouTube link below. We use youtube-nocookie.com. You can turn on CC (captions) from the YouTube player.
                  </p>
                  <label htmlFor="yt-url" className="sr-only">YouTube video URL</label>
                  <div className="flex flex-col xs:flex-row gap-2 items-center w-full">
                    <input
                      id="yt-url"
                      type="url"
                      className="flex-1 rounded-md bg-white border border-indigo-300 px-2 py-2 text-xs sm:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 min-w-0 text-black placeholder-gray-500"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={ytUrl}
                      onChange={(e) => setYtUrl(e.target.value)}
                      aria-describedby={isValidYt ? 'yt-help' : 'yt-help yt-error'}
                      aria-invalid={!isValidYt}
                      inputMode="url"
                      required
                    />
                  </div>
                  {!isValidYt && ytUrl ? (
                    <p id="yt-error" role="alert" aria-live="polite" className="text-xs sm:text-sm text-red-500">
                      Please enter a valid YouTube URL.
                    </p>
                  ) : null}
                  {isValidYt && ytUrl ? (
                    <YouTubeEmbed url={ytUrl} title="Education: Topic Introduction" />
                  ) : null}
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
                  <AccessibleMedia
                    type="video"
                    title="Sample training clip (placeholder)"
                    description="Demo component showing where captions, transcript and ISL interpretation would appear."
                    poster={undefined}
                    downloads={[
                      { label: 'MP4 720p', href: '#', size: '50 MB' },
                      { label: 'MP3 128 kbps', href: '#', size: '10 MB' },
                    ]}
                    chapters={[
                      { time: '00:00', label: 'Intro' },
                      { time: '01:30', label: 'Key concept' },
                      { time: '03:45', label: 'Summary' },
                    ]}
                  />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
                  <h2 className="text-lg sm:text-xl font-semibold heading-purple">Accessibility guidelines</h2>
                  <ul className="list-disc ml-4 sm:ml-5 text-xs sm:text-sm space-y-1 text-black/80">
                    <li>Provide captions for all videos (YouTube CC or your own .vtt captions).</li>
                    <li>Provide a transcript where possible. Briefly describe key visual content.</li>
                    <li>Offer Indian Sign Language (ISL) interpretation where required.</li>
                    <li>Avoid rapid flashing/flicker; playback must be operable by keyboard (play/pause).</li>
                    <li>For feedback, see the <a className="underline text-indigo-600 hover:text-indigo-700 font-semibold" href="/accessibility-feedback">Accessibility Feedback</a> page.</li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}

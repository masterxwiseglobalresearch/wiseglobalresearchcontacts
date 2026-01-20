
import React, { useMemo } from 'react';

// Minimal YouTube ID extractor (copied from Media.js)
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

export default function YouTubeEmbed({ url, videoId, title = 'YouTube video', start = 0 }) {
  const id = useMemo(() => videoId || extractYouTubeId(url), [videoId, url]);
  if (!id) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white/80">
        Provide a valid YouTube URL or 11-character videoId.
      </div>
    );
  }
  const src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1${start ? `&start=${start}` : ''}`;
  const watchUrl = `https://www.youtube.com/watch?v=${id}`;
  return (
    <section aria-label={title} className="space-y-2">
      <div className="relative w-full overflow-hidden rounded-lg border border-white/10 shadow" style={{ aspectRatio: '16 / 9' }}>
        <iframe
          title={title}
          src={src}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <p className="text-xs text-white/70">
        Privacy-enhanced mode enabled (youtube-nocookie.com).{' '}
        <a
          className="underline"
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#6366f1', borderColor: '#6366f1', fontWeight: 600 }}
        >
          Watch on YouTube
        </a>.
      </p>
    </section>
  );
}

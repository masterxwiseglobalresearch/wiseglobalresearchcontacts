import React from 'react';
export default function AccessibleMedia({
  type = 'video',
  title = 'Media placeholder',
  description,
  src,
  captionsSrc,
  transcript,
  islSrc,
  poster,
  downloads = [], // [{label, href, size?}]
  chapters = [], // [{time, label}]
}) {
  return (
    <section aria-labelledby="media-title" className="rounded-xl border border-white/10 bg-white/5 p-4 md:p-5">
      <a href="#media-after" className="sr-only focus:not-sr-only focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400">
        Skip transcript and ISL
      </a>
      <h3 id="media-title" className="text-lg font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-white/80 mb-3">{description}</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <figure>
          {type === 'video' ? (
            <video
              controls
              className="w-full rounded-lg"
              aria-describedby="media-caption"
              poster={poster}
            >
              {src ? <source src={src} /> : null}
              {captionsSrc ? (
                <track kind="captions" srcLang="en" src={captionsSrc} label="English captions" default />
              ) : (
                <track kind="captions" src="" label="Captions (placeholder)" />
              )}
              Your browser does not support the video tag.
            </video>
          ) : (
            <audio controls className="w-full" aria-describedby="media-caption">
              {src ? <source src={src} /> : null}
              Your browser does not support the audio element.
            </audio>
          )}
          <figcaption id="media-caption" className="mt-2 text-xs text-white/70">
            Captions and transcript will be provided for all media. ISL interpretation is provided alongside when applicable.
          </figcaption>
        </figure>

        <div className="space-y-3">
          <details className="rounded-md bg-white/10 p-3">
            <summary className="cursor-pointer font-medium">Transcript (placeholder)</summary>
            <div className="mt-2 text-sm text-black">
              {transcript || (
                <p>
                  A detailed, time-aligned transcript of the media will appear here, including speaker
                  labels, descriptions of important visuals, and links to referenced resources.
                </p>
              )}
            </div>
          </details>

          {chapters?.length > 0 && (
            <div className="rounded-md bg-white/10 p-3">
              <h4 className="font-medium mb-2">Chapters</h4>
              <ol className="list-decimal ml-4 sm:ml-5 text-xs sm:text-sm space-y-1">
                {chapters.map((c, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      className="underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
                      aria-label={`Jump to ${c.label} at ${c.time}`}
                      style={{ color: '#6366f1', borderColor: '#6366f1', fontWeight: 600 }}
                      // Placeholder: hook up with real player when available
                      onClick={() => {
                        // no-op placeholder
                      }}
                    >
                      <span className="tabular-nums mr-2">{c.time}</span>
                      <span>{c.label}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="rounded-md bg-white/10 p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">ISL Interpretation (placeholder)</h4>
              <span className="text-[11px] text-white/60">Optional</span>
            </div>
            {islSrc ? (
              <video controls className="w-full rounded-md">
                <source src={islSrc} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p className="text-sm text-black">
                When available, a separate video with Indian Sign Language interpretation will be provided here.
              </p>
            )}
          </div>

          {downloads?.length > 0 && (
            <div className="rounded-md bg-white/10 p-3">
              <h4 className="font-medium mb-2">Download</h4>
              <ul className="list-disc ml-4 sm:ml-5 text-xs sm:text-sm space-y-1">
                {downloads.map((d, i) => (
                  <li key={i}>
                    <a
                      className="underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
                      href={d.href}
                      download
                      style={{ color: '#6366f1', borderColor: '#6366f1', fontWeight: 600 }}
                    >
                      {d.label}{d.size ? ` — ${d.size}` : ''}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div id="media-after" />
    </section>
  );
}

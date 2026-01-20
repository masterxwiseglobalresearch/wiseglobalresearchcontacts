import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { BASE_URL, DEFAULT_META, ROUTE_META, isNoIndexPath } from './seo-config';

const toAbsoluteUrl = (path) => {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  // ensure single slash between BASE_URL and path
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${p}`;
};

export default function SeoHelmet() {
  const { pathname } = useLocation();
  const routeMeta = ROUTE_META[pathname] || {};
  const title = routeMeta.title || DEFAULT_META.title;
  const description = routeMeta.description || DEFAULT_META.description;
  const keywords = routeMeta.keywords || DEFAULT_META.keywords;
  const robots = isNoIndexPath(pathname) ? 'noindex, nofollow' : (routeMeta.robots || DEFAULT_META.robots);
  const canonical = toAbsoluteUrl(pathname === '/' ? '' : pathname);
  const ogImage = toAbsoluteUrl(routeMeta.image || DEFAULT_META.image);
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Wise Global Research',
    url: BASE_URL,
    logo: toAbsoluteUrl('/favicon.ico'),
  };
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Wise Global Research',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {robots && <meta name="robots" content={robots} />}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
  <meta property="og:type" content={pathname === '/market-news' ? 'article' : 'website'} />
  <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}

  {/* JSON-LD structured data */}
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
  {/* Minimal NewsArticle JSON-LD for market-news to help rich results */}
  {pathname === '/market-news' && (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: title,
          description,
          url: canonical,
          image: ogImage ? [ogImage] : undefined,
          datePublished: new Date().toISOString(),
          publisher: {
            '@type': 'Organization',
            name: 'Wise Global Research',
            logo: { '@type': 'ImageObject', url: toAbsoluteUrl('/assets/images/logo.png') }
          }
        })
      }}
    />
  )}
    </Helmet>
  );
}

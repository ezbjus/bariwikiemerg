import React from 'react';
import { Helmet } from 'react-helmet-async';

// Use window.location.origin for SEO URLs in production
const getSiteUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://parnellwellness.com';
};

const SITE_NAME = 'BariWiki by Parnell Wellness';

/**
 * SEO Component for comprehensive meta tags
 * Supports SEO, Open Graph, Twitter Cards, and structured data
 */
const SEO = ({
  title,
  description,
  canonical,
  type = 'website',
  image = null,
  article = null,
  noindex = false,
  structuredData = null,
  speakable = null
}) => {
  const SITE_URL = getSiteUrl();
  const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
  const imageUrl = image || DEFAULT_IMAGE;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `BariWiki - Bariatric Surgery Encyclopedia | ${SITE_NAME}`;
  const fullUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Article specific tags */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:section" content={article.section} />
          {article.tags?.map((tag, i) => (
            <meta key={i} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Speakable for Voice Search */}
      {speakable && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": title,
            "speakable": {
              "@type": "SpeakableSpecification",
              "cssSelector": speakable
            },
            "url": fullUrl
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

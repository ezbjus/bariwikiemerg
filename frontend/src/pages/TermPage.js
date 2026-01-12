import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, Tag } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import TocSidebar from '../components/TocSidebar';
import RelatedTerms from '../components/RelatedTerms';
import AuthorityLinks from '../components/AuthorityLinks';
import CategoryBadge from '../components/CategoryBadge';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';
const SITE_URL = 'https://parnellwellness.com';

const TermPage = () => {
  const { slug } = useParams();
  const [term, setTerm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    const fetchTerm = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/terms/slug/${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Term not found');
          } else {
            setError('Failed to load term');
          }
          return;
        }
        const data = await response.json();
        setTerm(data);

        // Extract headings from description for ToC
        setTimeout(() => {
          const h2Elements = document.querySelectorAll('.term-description h2');
          const extractedHeadings = Array.from(h2Elements).map((h, i) => {
            const id = `section-${i}`;
            h.id = id;
            return { id, text: h.textContent };
          });
          setHeadings(extractedHeadings);
        }, 100);
      } catch (err) {
        setError('Failed to load term');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTerm();
  }, [slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="skeleton h-4 w-48 mb-4" />
        <div className="skeleton h-12 w-3/4 mb-4" />
        <div className="skeleton h-4 w-full mb-2" />
        <div className="skeleton h-4 w-full mb-2" />
        <div className="skeleton h-4 w-2/3" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-2">{error}</h1>
          <p className="text-neutral-600 mb-4">The term you're looking for doesn't exist.</p>
          <Link to="/" className="text-blue-600 hover:underline">Return to home</Link>
        </div>
      </main>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // JSON-LD structured data for MedicalEntity
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalEntity",
    "name": term?.name,
    "description": term?.short_description || term?.meta_description,
    "url": `${SITE_URL}/wiki/${term?.slug}`,
    "sameAs": term?.authority_links?.map(l => l.url) || [],
    "medicineSystem": "WesternConventional",
    "relevantSpecialty": {
      "@type": "MedicalSpecialty",
      "name": "Bariatric Surgery"
    }
  };

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": SITE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": term?.category || "Terms",
        "item": `${SITE_URL}/category/${encodeURIComponent(term?.category || 'Uncategorized')}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": term?.name,
        "item": `${SITE_URL}/wiki/${term?.slug}`
      }
    ]
  };

  // Article structured data for better SEO
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": term?.name,
    "description": term?.short_description,
    "author": {
      "@type": "Organization",
      "name": "Parnell Wellness"
    },
    "publisher": {
      "@type": "Organization",
      "name": "BariWiki by Parnell Wellness",
      "url": SITE_URL
    },
    "dateModified": term?.updated_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/wiki/${term?.slug}`
    }
  };

  // Speakable for voice search
  const speakableJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": term?.name,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".short-description", ".term-description p:first-of-type", "h1"]
    },
    "url": `${SITE_URL}/wiki/${term?.slug}`
  };

  return (
    <>
      <Helmet>
        <title>{term?.meta_title || `${term?.name} - BariWiki`}</title>
        <meta name="description" content={term?.meta_description || term?.short_description} />
        <link rel="canonical" href={`https://bari-wiki.preview.emergentagent.com/wiki/${term?.slug}`} />
        <meta property="og:title" content={term?.name} />
        <meta property="og:description" content={term?.short_description} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <main id="main" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[
          { label: term?.category || 'Terms', href: `/category/${encodeURIComponent(term?.category || 'Uncategorized')}` },
          { label: term?.name }
        ]} />

        <article className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <header>
              <h1 
                className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900"
                data-testid="term-title"
              >
                {term?.name}
              </h1>

              {term?.short_description && (
                <p 
                  className="mt-3 text-lg text-neutral-700 reading-width"
                  data-testid="term-definition"
                >
                  {term.short_description}
                </p>
              )}

              {/* Meta Info */}
              <div 
                className="mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-500"
                data-testid="term-meta"
              >
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Last updated: {formatDate(term?.updated_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <CategoryBadge category={term?.category} />
                </div>
              </div>
            </header>

            <hr className="my-6" />

            {/* Key Facts for LLM/AEO */}
            {term?.short_description && (
              <dl 
                className="bg-blue-50 rounded-lg p-4 mb-6"
                data-testid="key-facts"
              >
                <dt className="font-semibold text-blue-900">Definition</dt>
                <dd className="text-blue-800">{term.short_description}</dd>
                {term?.category && (
                  <>
                    <dt className="font-semibold text-blue-900 mt-2">Category</dt>
                    <dd className="text-blue-800">{term.category}</dd>
                  </>
                )}
              </dl>
            )}

            {/* Description */}
            {term?.description ? (
              <div 
                className="term-description prose prose-neutral max-w-none"
                dangerouslySetInnerHTML={{ __html: term.description }}
                data-testid="term-description"
              />
            ) : (
              <div className="text-neutral-500 italic" data-testid="term-description">
                <p>Description coming soon. This term is being reviewed by our medical team.</p>
              </div>
            )}

            {/* References Section */}
            {term?.authority_links?.length > 0 && (
              <section id="references" className="mt-8">
                <h2 className="text-xl font-semibold mb-4">References</h2>
                <ol className="list-decimal pl-6 space-y-2">
                  {term.authority_links.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                        data-testid="authority-link"
                      >
                        {link.title || link.source}
                      </a>
                      {link.source && link.title && (
                        <span className="text-neutral-500"> - {link.source}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div data-testid="toc-container">
              <TocSidebar headings={headings} />
            </div>
            <RelatedTerms terms={term?.related_terms} />
            <AuthorityLinks links={term?.authority_links} />
          </aside>
        </article>
      </main>
    </>
  );
};

export default TermPage;

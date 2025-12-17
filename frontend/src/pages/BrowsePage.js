import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Breadcrumbs from '../components/Breadcrumbs';
import CategoryBadge from '../components/CategoryBadge';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const BrowsePage = () => {
  const { letter } = useParams();
  const upperLetter = letter?.toUpperCase() || 'A';
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/terms/letter/${upperLetter}`);
        const data = await response.json();
        setTerms(data.terms || []);
      } catch (error) {
        console.error('Failed to fetch terms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, [upperLetter]);

  return (
    <>
      <Helmet>
        <title>Terms Starting with {upperLetter} - BariWiki</title>
        <meta name="description" content={`Browse all bariatric surgery terms starting with the letter ${upperLetter}. Find definitions, procedures, and medical information.`} />
        <link rel="canonical" href={`https://bari-wiki.preview.emergentagent.com/browse/${letter}`} />
      </Helmet>

      <main id="main" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[
          { label: 'Browse A-Z', href: '/' },
          { label: `Letter ${upperLetter}` }
        ]} />

        <header className="py-6">
          <h1 
            className="text-3xl font-semibold tracking-tight"
            data-testid="browse-title"
          >
            All Terms · {upperLetter}
          </h1>
          <p className="text-neutral-600 mt-1">
            {loading ? 'Loading...' : `${terms.length} terms found`}
          </p>
        </header>

        <section className="pb-12" data-testid="az-section">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(12).fill(0).map((_, i) => (
                <div key={i} className="skeleton h-16 rounded-md" />
              ))}
            </div>
          ) : terms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {terms.map((term) => (
                <Link
                  key={term._id}
                  to={`/wiki/${term.slug}`}
                  className="block p-4 border rounded-md hover:bg-neutral-50 transition-colors group"
                  data-testid={`term-link-${term.slug}`}
                >
                  <div className="font-medium text-neutral-800 group-hover:text-blue-600 transition-colors">
                    {term.name}
                  </div>
                  {term.short_description && (
                    <div className="text-sm text-neutral-500 mt-1 line-clamp-2">
                      {term.short_description}
                    </div>
                  )}
                  {term.category && term.category !== 'Uncategorized' && (
                    <div className="mt-2">
                      <CategoryBadge category={term.category} linkable={false} />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-500">No terms starting with "{upperLetter}" found.</p>
              <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
                Browse all terms
              </Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default BrowsePage;

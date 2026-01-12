import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Breadcrumbs from '../components/Breadcrumbs';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';
const SITE_URL = 'https://parnellwellness.com';

const CategoryPage = () => {
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category);
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/terms/category/${encodeURIComponent(decodedCategory)}`);
        const data = await response.json();
        setTerms(data.terms || []);
      } catch (error) {
        console.error('Failed to fetch terms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, [decodedCategory]);

  // Group terms by first letter
  const groupedTerms = terms.reduce((acc, term) => {
    const letter = term.first_letter || '#';
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(term);
    return acc;
  }, {});

  const sortedLetters = Object.keys(groupedTerms).sort();

  return (
    <>
      <Helmet>
        <title>{decodedCategory} - Bariatric Surgery Category | BariWiki</title>
        <meta name="description" content={`Browse all ${decodedCategory.toLowerCase()} related to bariatric surgery. Find definitions, procedures, and medical information for weight loss surgery.`} />
        <link rel="canonical" href={`${SITE_URL}/category/${category}`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`${decodedCategory} - BariWiki`} />
        <meta property="og:description" content={`Browse ${decodedCategory.toLowerCase()} in bariatric surgery`} />
        <meta property="og:url" content={`${SITE_URL}/category/${category}`} />
      </Helmet>

      <main id="main" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[
          { label: 'Categories', href: '/' },
          { label: decodedCategory }
        ]} />

        <header className="py-6">
          <h1 
            className="text-3xl font-semibold tracking-tight"
            data-testid="category-title"
          >
            {decodedCategory}
          </h1>
          <p className="text-neutral-600 mt-1">
            {loading ? 'Loading...' : `${terms.length} terms in this category`}
          </p>
        </header>

        <section className="pb-12">
          {loading ? (
            <div className="space-y-8">
              {Array(3).fill(0).map((_, i) => (
                <div key={i}>
                  <div className="skeleton h-6 w-8 mb-3" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {Array(6).fill(0).map((_, j) => (
                      <div key={j} className="skeleton h-6" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : terms.length > 0 ? (
            <div className="space-y-8">
              {sortedLetters.map(letter => (
                <div key={letter}>
                  <h2 className="text-lg font-semibold text-neutral-500 border-b pb-1 mb-3">
                    {letter}
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                    {groupedTerms[letter].map(term => (
                      <li key={term._id}>
                        <Link
                          to={`/wiki/${term.slug}`}
                          className="text-blue-600 hover:underline"
                          data-testid={`term-link-${term.slug}`}
                        >
                          {term.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-500">No terms found in this category.</p>
              <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
                Browse all categories
              </Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default CategoryPage;

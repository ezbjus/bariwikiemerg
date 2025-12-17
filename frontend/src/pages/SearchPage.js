import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import Breadcrumbs from '../components/Breadcrumbs';
import CategoryBadge from '../components/CategoryBadge';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setSearched(true);
    try {
      const response = await fetch(`${API_URL}/api/terms/search?q=${encodeURIComponent(searchQuery)}&limit=50`);
      const data = await response.json();
      setResults(data.terms || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      performSearch(query.trim());
    }
  };

  return (
    <>
      <Helmet>
        <title>{initialQuery ? `Search: ${initialQuery}` : 'Search'} - BariWiki</title>
        <meta name="description" content="Search the BariWiki encyclopedia for bariatric surgery terms, procedures, and medical information." />
      </Helmet>

      <main id="main" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Search' }]} />

        <header className="py-6">
          <h1 className="text-3xl font-semibold tracking-tight" data-testid="search-title">
            Search
          </h1>
        </header>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <Input
              type="search"
              placeholder="Search for terms..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-12 pl-10 text-base"
              data-testid="search-input"
            />
          </div>
          <Button type="submit" size="lg" className="h-12" data-testid="search-submit">
            Search
          </Button>
        </form>

        {/* Results */}
        <section className="pb-12" data-testid="search-results">
          {loading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="skeleton h-20 rounded-md" />
              ))}
            </div>
          ) : searched ? (
            results.length > 0 ? (
              <>
                <p className="text-neutral-600 mb-4">
                  Found {results.length} result{results.length !== 1 ? 's' : ''} for "{initialQuery}"
                </p>
                <div className="space-y-4">
                  {results.map((term) => (
                    <Link
                      key={term._id}
                      to={`/wiki/${term.slug}`}
                      className="block p-4 border rounded-md hover:bg-neutral-50 transition-colors"
                      data-testid={`search-result-${term.slug}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="font-medium text-lg text-blue-600 hover:underline">
                            {term.name}
                          </h2>
                          {term.short_description && (
                            <p className="text-neutral-600 mt-1 line-clamp-2">
                              {term.short_description}
                            </p>
                          )}
                        </div>
                        {term.category && term.category !== 'Uncategorized' && (
                          <CategoryBadge category={term.category} linkable={false} />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-500 mb-2">No results found for "{initialQuery}"</p>
                <p className="text-sm text-neutral-400">
                  Try different keywords or browse by letter
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-12 text-neutral-500">
              Enter a search term to find related bariatric surgery terms.
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default SearchPage;

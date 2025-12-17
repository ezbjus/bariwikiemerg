import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Search, Layers, TrendingUp } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const HomePage = () => {
  const [stats, setStats] = useState({ total_terms: 0, published: 0, categories: 0 });
  const [categories, setCategories] = useState([]);
  const [recentTerms, setRecentTerms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, categoriesRes, termsRes] = await Promise.all([
          fetch(`${API_URL}/api/stats`),
          fetch(`${API_URL}/api/terms/categories`),
          fetch(`${API_URL}/api/terms?limit=10&status=published`)
        ]);

        const statsData = await statsRes.json();
        const categoriesData = await categoriesRes.json();
        const termsData = await termsRes.json();

        setStats(statsData);
        setCategories(categoriesData.categories || []);
        setRecentTerms(termsData.terms || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <Helmet>
        <title>BariWiki - Bariatric Surgery Encyclopedia</title>
        <meta name="description" content="Comprehensive encyclopedia of bariatric surgery terms, procedures, and medical information. Your authoritative resource for weight loss surgery knowledge." />
        <link rel="canonical" href="https://bari-wiki.preview.emergentagent.com/" />
      </Helmet>

      <main id="main" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center py-12 md:py-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
          <h1 
            className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900 mb-4"
            data-testid="home-title"
          >
            BariWiki
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
            The comprehensive encyclopedia of bariatric surgery terms, procedures, and medical information.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <Input
                type="search"
                placeholder="Search for any bariatric surgery term..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-10 text-base"
                data-testid="home-search-input"
              />
            </div>
            <Button type="submit" size="lg" className="h-12" data-testid="home-search-button">
              Search
            </Button>
          </form>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-semibold text-blue-700" data-testid="stat-total">
              {loading ? '-' : stats.published.toLocaleString()}
            </div>
            <div className="text-sm text-blue-600">Terms</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-semibold text-green-700" data-testid="stat-categories">
              {loading ? '-' : stats.categories}
            </div>
            <div className="text-sm text-green-600">Categories</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-semibold text-purple-700">26</div>
            <div className="text-sm text-purple-600">A-Z Sections</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-semibold text-amber-700">
              <TrendingUp className="h-8 w-8 mx-auto" />
            </div>
            <div className="text-sm text-amber-600">Growing Daily</div>
          </div>
        </section>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Categories */}
          <section className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-5 w-5 text-neutral-600" />
              <h2 className="text-xl font-semibold">Browse by Category</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="skeleton h-12 rounded-md" />
                ))
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <Link
                    key={cat.category}
                    to={`/category/${encodeURIComponent(cat.category)}`}
                    className="flex items-center justify-between p-3 rounded-md border hover:bg-neutral-50 transition-colors"
                    data-testid={`category-link-${cat.category}`}
                  >
                    <span className="font-medium text-neutral-800">{cat.category}</span>
                    <span className="text-sm text-neutral-500">{cat.count} terms</span>
                  </Link>
                ))
              ) : (
                <p className="text-neutral-500 col-span-2">No categories yet. Import terms to get started.</p>
              )}
            </div>
          </section>

          {/* Recent Terms */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-neutral-600" />
              <h2 className="text-xl font-semibold">Recent Terms</h2>
            </div>
            <div className="border rounded-md divide-y">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="p-3">
                    <div className="skeleton h-4 w-3/4 mb-1" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                ))
              ) : recentTerms.length > 0 ? (
                recentTerms.slice(0, 8).map((term) => (
                  <Link
                    key={term._id}
                    to={`/wiki/${term.slug}`}
                    className="block p-3 hover:bg-neutral-50 transition-colors"
                    data-testid={`recent-term-${term.slug}`}
                  >
                    <div className="font-medium text-neutral-800">{term.name}</div>
                    {term.short_description && (
                      <div className="text-sm text-neutral-500 truncate">
                        {term.short_description}
                      </div>
                    )}
                  </Link>
                ))
              ) : (
                <p className="p-3 text-neutral-500">No terms yet.</p>
              )}
            </div>
          </section>
        </div>

        {/* SEO Content */}
        <section className="mt-12 prose prose-neutral max-w-none">
          <h2 className="text-xl font-semibold mb-4">About BariWiki</h2>
          <p className="text-neutral-600 reading-width">
            BariWiki is a comprehensive medical reference for bariatric surgery terminology. 
            Our encyclopedia covers surgical procedures, post-operative care, nutritional guidelines, 
            potential complications, and everything related to weight loss surgery. Each entry is 
            carefully curated to provide accurate, medically-reviewed information for healthcare 
            professionals, patients, and researchers.
          </p>
        </section>
      </main>
    </>
  );
};

export default HomePage;

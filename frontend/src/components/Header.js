import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, BookOpen } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import AlphabetBar from './AlphabetBar';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Get current letter from URL if on browse page
  const currentLetter = location.pathname.startsWith('/browse/')
    ? location.pathname.split('/')[2]?.toUpperCase()
    : null;

  return (
    <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur border-b transition-shadow ${isScrolled ? 'header-scrolled' : ''}`}>
      {/* Skip to content link */}
      <a href="#main" className="skip-link" data-testid="skip-to-content">
        Skip to content
      </a>

      {/* Main Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 text-neutral-800 hover:no-underline"
          data-testid="header-home-link"
        >
          <BookOpen className="h-6 w-6 text-blue-600" />
          <span className="text-[15px] font-semibold tracking-tight hidden sm:inline">
            BariWiki
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              type="search"
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 sm:w-72 h-9 pl-9 text-sm"
              data-testid="global-search-input"
            />
          </div>
          <Button 
            type="submit" 
            size="sm" 
            className="h-9"
            data-testid="global-search-button"
          >
            Search
          </Button>
        </form>
      </div>

      {/* A-Z Navigation */}
      <div className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AlphabetBar currentLetter={currentLetter} />
        </div>
      </div>
    </header>
  );
};

export default Header;

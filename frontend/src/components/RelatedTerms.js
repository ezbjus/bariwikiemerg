import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const RelatedTerms = ({ terms = [] }) => {
  if (terms.length === 0) return null;

  // Convert term names to slugs for linking
  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[-\s]+/g, '-');
  };

  return (
    <div 
      className="rounded-md border bg-white p-4"
      data-testid="related-terms"
    >
      <h3 className="font-medium text-neutral-800 mb-3">Related Terms</h3>
      <ul className="space-y-2">
        {terms.slice(0, 6).map((term, index) => (
          <li key={index}>
            <Link 
              to={`/wiki/${slugify(term)}`}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 group"
              data-testid={`related-term-${index}`}
            >
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span>{term}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedTerms;

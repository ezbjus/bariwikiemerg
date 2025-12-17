import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ items }) => {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className="py-3 text-sm text-neutral-600"
      data-testid="breadcrumbs"
    >
      <ol className="flex items-center gap-1 flex-wrap">
        <li>
          <Link 
            to="/" 
            className="flex items-center gap-1 hover:text-neutral-900"
            data-testid="breadcrumb-home"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <ChevronRight className="h-4 w-4 text-neutral-400" />
            {item.href ? (
              <Link 
                to={item.href} 
                className="hover:text-neutral-900"
                data-testid={`breadcrumb-${index}`}
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-neutral-900" data-testid={`breadcrumb-${index}`}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

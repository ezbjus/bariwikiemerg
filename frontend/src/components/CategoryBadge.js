import React from 'react';
import { Link } from 'react-router-dom';

const getCategoryClass = (category) => {
  const normalized = category?.toLowerCase().replace(/\s+/g, '-') || 'uncategorized';
  const classMap = {
    'procedures': 'category-badge-procedures',
    'complications': 'category-badge-complications',
    'anatomy': 'category-badge-anatomy',
    'nutrition': 'category-badge-nutrition',
    'medications': 'category-badge-medications',
    'conditions': 'category-badge-conditions',
    'diagnostic-tests': 'category-badge-diagnostic-tests',
    'patient-care': 'category-badge-patient-care',
    'equipment': 'category-badge-equipment',
    'outcomes': 'category-badge-outcomes',
    'uncategorized': 'category-badge-uncategorized'
  };
  return classMap[normalized] || 'category-badge-uncategorized';
};

const CategoryBadge = ({ category, linkable = true }) => {
  const badgeClass = `inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${getCategoryClass(category)}`;
  
  if (linkable) {
    return (
      <Link 
        to={`/category/${encodeURIComponent(category)}`}
        className={badgeClass}
        data-testid="category-badge"
      >
        {category || 'Uncategorized'}
      </Link>
    );
  }

  return (
    <span className={badgeClass} data-testid="category-badge">
      {category || 'Uncategorized'}
    </span>
  );
};

export default CategoryBadge;

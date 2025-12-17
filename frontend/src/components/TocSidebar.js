import React, { useEffect, useState } from 'react';

const TocSidebar = ({ headings = [] }) => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map(h => document.getElementById(h.id))
      .filter(Boolean);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        
        if (visible) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: [0.1, 0.5, 1] }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside 
      className="sticky top-20 hidden lg:block w-64 text-sm" 
      aria-label="Table of contents"
      data-testid="toc-sidebar"
    >
      <div className="font-medium mb-2 text-neutral-700">On this page</div>
      <nav className="space-y-1">
        {headings.map(h => (
          <a
            key={h.id}
            href={`#${h.id}`}
            className={`block px-2 py-1 rounded transition-colors ${
              activeId === h.id 
                ? 'bg-blue-50 text-blue-700 font-medium' 
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
            data-testid={`toc-link-${h.id}`}
            aria-current={activeId === h.id ? 'true' : undefined}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default TocSidebar;

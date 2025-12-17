import React from 'react';
import { ExternalLink } from 'lucide-react';

const AuthorityLinks = ({ links = [] }) => {
  if (links.length === 0) return null;

  return (
    <div 
      className="rounded-md border bg-white p-4"
      data-testid="authority-links"
    >
      <h3 className="font-medium text-neutral-800 mb-3">References</h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <a 
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-sm text-blue-600 hover:text-blue-800"
              data-testid={`authority-link-${index}`}
            >
              <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                <span className="font-medium">{link.source}</span>
                {link.title && <span className="text-neutral-600"> - {link.title}</span>}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuthorityLinks;

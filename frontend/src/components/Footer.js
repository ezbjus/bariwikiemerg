import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 border-t mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-neutral-800 hover:no-underline mb-3">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">BariWiki</span>
            </Link>
            <p className="text-sm text-neutral-600 max-w-md">
              A comprehensive encyclopedia of bariatric surgery terms, procedures, and medical 
              information for healthcare professionals, patients, and researchers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-neutral-800 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-neutral-600 hover:text-neutral-900">Home</Link>
              </li>
              <li>
                <Link to="/browse/a" className="text-neutral-600 hover:text-neutral-900">Browse A-Z</Link>
              </li>
              <li>
                <Link to="/resources" className="text-neutral-600 hover:text-neutral-900">Resources</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-neutral-800 mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/disclaimer" className="text-neutral-600 hover:text-neutral-900">Medical Disclaimer</Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-neutral-600 hover:text-neutral-900">FDA Disclaimer</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-500">
              © {currentYear} BariWiki. All rights reserved.
            </p>
            <p className="text-xs text-neutral-400 text-center sm:text-right max-w-xl">
              The information on this website is for educational purposes only and is not intended 
              as medical advice. Always consult your healthcare provider.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

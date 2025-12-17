import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const AlphabetBar = ({ currentLetter }) => {
  const [letterCounts, setLetterCounts] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/api/terms/letters`)
      .then(res => res.json())
      .then(data => setLetterCounts(data.letters || {}))
      .catch(console.error);
  }, []);

  return (
    <nav 
      aria-label="A–Z index" 
      className="alphabet-bar py-2" 
      data-testid="az-nav"
    >
      {LETTERS.map(letter => {
        const count = letterCounts[letter] || 0;
        const isDisabled = count === 0;
        const isActive = currentLetter === letter;

        return (
          <Link
            key={letter}
            to={`/browse/${letter.toLowerCase()}`}
            className={`alphabet-item ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
            data-testid={`alphabet-item-${letter.toLowerCase()}`}
            aria-label={`Show terms starting with ${letter}${count > 0 ? ` (${count} terms)` : ''}`}
            aria-disabled={isDisabled}
            onClick={(e) => isDisabled && e.preventDefault()}
          >
            {letter}
          </Link>
        );
      })}
    </nav>
  );
};

export default AlphabetBar;

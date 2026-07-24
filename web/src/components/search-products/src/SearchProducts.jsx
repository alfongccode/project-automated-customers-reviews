import React, { useEffect, useState, useRef } from 'react';
import './SearchProducts.styles.css';

const DEBOUNCE_MS = 300;

function SearchProducts({ onSearch }) {
  const [term, setTerm] = useState('');
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchRef.current?.(term.trim());
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [term]);

  return (
    <div className="search-box">
      <div className="search-label">&gt; SEARCH_PRODUCT.EXE</div>
      <div className="search-input">
        <span className="cash">$</span>
        <input
          type="text"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="type what you hate..."
          aria-label="Search products"
        />
      </div>
    </div>
  );
}

export default SearchProducts;

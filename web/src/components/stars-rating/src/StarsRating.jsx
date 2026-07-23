import React from 'react';
import './StarsRating.styles.css';
import { useState } from 'react';

function StarsRating({ value, onChange }) {
  const STARS_VALUES = [1, 2, 3, 4, 5];
  const [hovered, setHovered] = useState(0);

  return (
    <div
      className="star-rating-container"
      role="radiogroup"
      aria-label="Rating"
    >
      {STARS_VALUES.map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            className={`star-button${filled ? ' star-button--filled' : ''}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
          >
            {filled ? '★' : '☆'}
          </button>
        );
      })}
    </div>
  );
}

export default StarsRating;

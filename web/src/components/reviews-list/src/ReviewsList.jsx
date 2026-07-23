import React from 'react';
import './ReviewsList.styles.css';

const STARS_VALUES = [1, 2, 3, 4, 5];

function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString();
}

function ReviewsList({ reviews = [], isLoading = false, error = null }) {
  if (isLoading) {
    return (
      <div className="reviews-list-container">
        <p className="reviews-list-status">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reviews-list-container">
        <p className="reviews-list-status reviews-list-status--error">
          {error}
        </p>
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="reviews-list-container">
        <p className="reviews-list-status">
          This product does not yet have any reviews.
        </p>
      </div>
    );
  }

  return (
    <div className="reviews-list-container">
      <ul className="reviews-list" role="list">
        {reviews.map((review) => {
          const date = formatDate(review.created_at);

          return (
            <li key={review.id} className="review-card">
              <div className="review-card-header">
                <h3 className="review-card-title">{review.title}</h3>
                <p className="review-card-sentiment">{review.sentiment}</p>
              </div>

              {review.content ? (
                <p className="review-card-content">{review.content}</p>
              ) : null}

              {date ? <p className="review-card-date">{date}</p> : null}
              <div
                className="review-card-rating"
                role="img"
                aria-label={`${review.rating} out of 5 stars`}
              >
                {STARS_VALUES.map((star) => (
                  <span
                    key={star}
                    className={`review-card-star${
                      star <= review.rating ? ' review-card-star--filled' : ''
                    }`}
                  >
                    {star <= review.rating ? '★' : '☆'}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ReviewsList;

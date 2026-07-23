import React from 'react';
import './ReviewsSummaryCard.styles.css';

function ReviewsSummaryCard({ summary, isLoading = false, error = null }) {
  if (isLoading) {
    return (
      <div className="reviews-summary-card-container">
        <p className="reviews-summary-card-status">Summarizing reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reviews-summary-card-container">
        <p className="reviews-summary-card-status reviews-summary-card-status--error">
          {error}
        </p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="reviews-summary-card-container">
        <p className="reviews-summary-card-status">
          No summary is available for this product yet.
        </p>
      </div>
    );
  }

  const {
    product_name: productName,
    summary: summaryText,
    positive = [],
    negative = [],
    sentiment_counts: sentimentCounts,
    total_reviews: totalReviews,
  } = summary;

  return (
    <div className="reviews-summary-card-container">
      <div className="reviews-summary-card-header">
        <h3 className="reviews-summary-card-title">
          {productName ? `${productName} — Reviews summary` : 'Reviews summary'}
        </h3>
        {typeof totalReviews === 'number' ? (
          <p className="reviews-summary-card-total">
            Based on {totalReviews} review{totalReviews === 1 ? '' : 's'}
          </p>
        ) : null}
      </div>

      {summaryText ? (
        <p className="reviews-summary-card-text">{summaryText}</p>
      ) : null}

      {sentimentCounts ? (
        <div className="reviews-summary-card-sentiments">
          <span className="reviews-summary-card-pill reviews-summary-card-pill--positive">
            {sentimentCounts.positive ?? 0} positive
          </span>
          <span className="reviews-summary-card-pill reviews-summary-card-pill--neutral">
            {sentimentCounts.neutral ?? 0} neutral
          </span>
          <span className="reviews-summary-card-pill reviews-summary-card-pill--negative">
            {sentimentCounts.negative ?? 0} negative
          </span>
        </div>
      ) : null}

      <div className="reviews-summary-card-columns">
        <div className="reviews-summary-card-column">
          <h4 className="reviews-summary-card-column-title">
            What customers value
          </h4>
          {positive.length ? (
            <ul className="reviews-summary-card-list" role="list">
              {positive.map((point, index) => (
                <li
                  key={`positive-${index}`}
                  className="reviews-summary-card-list-item reviews-summary-card-list-item--positive"
                >
                  {point}
                </li>
              ))}
            </ul>
          ) : (
            <p className="reviews-summary-card-empty">No highlights yet.</p>
          )}
        </div>

        <div className="reviews-summary-card-column">
          <h4 className="reviews-summary-card-column-title">
            Areas to improve
          </h4>
          {negative.length ? (
            <ul className="reviews-summary-card-list" role="list">
              {negative.map((point, index) => (
                <li
                  key={`negative-${index}`}
                  className="reviews-summary-card-list-item reviews-summary-card-list-item--negative"
                >
                  {point}
                </li>
              ))}
            </ul>
          ) : (
            <p className="reviews-summary-card-empty">
              No recurring complaints yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewsSummaryCard;

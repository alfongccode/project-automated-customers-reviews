import React from 'react';
import './ReviewsList.styles.css';
import { useState, useEffect } from 'react';

function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString();
}

const SENTIMENT_STATUS = {
  POSITIVE: 'positive',
  NEUTRAL: 'neutral',
  NEGATIVE: 'negative',
};

function getReviewSentimentClassName(sentiment) {
  return {
    [SENTIMENT_STATUS.POSITIVE]: 'love',
    [SENTIMENT_STATUS.NEUTRAL]: 'meh',
    [SENTIMENT_STATUS.NEGATIVE]: 'hate',
  }[sentiment];
}

function getReviewSentimentText(sentiment) {
  return {
    [SENTIMENT_STATUS.POSITIVE]: '+ LOVE',
    [SENTIMENT_STATUS.NEUTRAL]: '~ MEH',
    [SENTIMENT_STATUS.NEGATIVE]: '- HATE',
  }[sentiment];
}

function getReviewSentimentBadge(sentiment) {
  return {
    [SENTIMENT_STATUS.POSITIVE]: 'APPROVED BY THE HORDE',
    [SENTIMENT_STATUS.NEUTRAL]: 'WHATEVER',
    [SENTIMENT_STATUS.NEGATIVE]: 'TO THE DUMPSTER',
  }[sentiment];
}

function ReviewsList({ reviews = [] }) {
  const [currentFilter, setCurrentFilter] = useState(null);
  const [filterReviews, setFilterReviews] = useState([]);

  function applyFilterOnReviews(sentiment) {
    return reviews.filter((review) => review?.sentiment === sentiment);
  }

  useEffect(() => {
    setFilterReviews(
      currentFilter ? [...applyFilterOnReviews(currentFilter)] : [...reviews]
    );
  }, [reviews, currentFilter]);

  return (
    <div className="review-wall">
      <div className="wall-head">
        <span className="file-tag">// REVIEW_WALL //</span>
        <div className="filters">
          <button
            className={`filter-btn ${!currentFilter && 'active'}`}
            onClick={() => setCurrentFilter(null)}
          >
            all
          </button>
          <button
            className={`filter-btn love ${currentFilter === SENTIMENT_STATUS.POSITIVE && 'active'}`}
            onClick={() => setCurrentFilter(SENTIMENT_STATUS.POSITIVE)}
          >
            + love
          </button>
          <button
            className={`filter-btn meh ${currentFilter === SENTIMENT_STATUS.NEUTRAL && 'active'}`}
            onClick={() => setCurrentFilter(SENTIMENT_STATUS.NEUTRAL)}
          >
            ~ meh
          </button>
          <button
            className={`filter-btn hate ${currentFilter === SENTIMENT_STATUS.NEGATIVE && 'active'}`}
            onClick={() => setCurrentFilter(SENTIMENT_STATUS.NEGATIVE)}
          >
            - hate
          </button>
        </div>
      </div>

      {filterReviews.length === 0 && <div>There are no reviews</div>}

      {filterReviews.map((review) => (
        <div className="review-row">
          <div
            className={`verdict-slab ${getReviewSentimentClassName(review?.sentiment)}`}
          >
            {getReviewSentimentText(review?.sentiment)}
            <span className="date">{formatDate(review?.updated_at)}</span>
          </div>
          <div className="review-body">
            <div className="review-top">
              <span className="review-title">{review?.title}</span>
              <div className="review-meta">
                <span className="review-user">@{review?.user?.username}</span>
                <span className="badge">
                  {getReviewSentimentBadge(review?.sentiment)}
                </span>
              </div>
            </div>
            <div className="review-text">{review?.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReviewsList;

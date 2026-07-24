import React from 'react';
import './ProductSummaryCard.styles.css';

function ProductSummaryCard({ product = {} }) {
  const positive = product?.metadata?.sentiment_counts?.positive ?? 0;
  const neutral = product?.metadata?.sentiment_counts?.neutral ?? 0;
  const negative = product?.metadata?.sentiment_counts?.negative ?? 0;
  const total =
    product?.metadata?.total_reviews || positive + neutral + negative;

  const lovePct = total > 0 ? (positive / total) * 100 : 0;
  const mehPct = total > 0 ? (neutral / total) * 100 : 0;
  const hatePct = total > 0 ? (negative / total) * 100 : 0;

  return (
    <div className="karma-file">
      <div className="file-tag">
        <span className="file-tag-label">// KARMA_FILE //</span>
        <span className="file-id">ID::P1</span>
      </div>

      <div className="karma-file-body">
        <div className="karma-file-header">
          <div className="file-cat-row">
            <div className="file-cat">{product?.brand}</div>
            {product?.category && (
              <span className="category-badge">{product.category}</span>
            )}
          </div>
          <div className="file-title">{product?.name}</div>
          <div className="file-tagline">{product?.description}</div>
        </div>

        <div className="karma-file-side">
          <div className="certified-stamp">CERTIFIED BY THE STREET</div>
          <div className="karma-score-box">
            <div className="label">KARMA_SCORE</div>
            <div className="score">
              {product?.metadata?.sentiment_counts?.positive -
                product?.metadata?.sentiment_counts?.negative}
            </div>
            <div className="verdict">SHADY</div>
          </div>
        </div>
      </div>

      <div className="verdict-summary">
        <div className="summary-label">STREET VERDICT</div>
        <p className="summary-text">
          {product?.metadata?.summary || 'No summary available yet.'}
        </p>

        <div className="pros-cons-grid">
          <div className="pros-cons-col positive">
            <div className="pros-cons-heading">+ WHAT THEY LOVED</div>
            <ul>
              {(product?.metadata?.positive ?? []).length > 0 ? (
                product.metadata.positive.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))
              ) : (
                <li className="empty">Nothing reported yet.</li>
              )}
            </ul>
          </div>
          <div className="pros-cons-col negative">
            <div className="pros-cons-heading">- WHAT THEY HATED</div>
            <ul>
              {(product?.metadata?.negative ?? []).length > 0 ? (
                product.metadata.negative.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))
              ) : (
                <li className="empty">Nothing reported yet.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="karma-file-details">
        <div className="poison-row">
          <span>POISON DISTRIBUTION</span>
          <span className="reviews-count">
            {product?.metadata?.total_reviews} REVIEWS
          </span>
        </div>
        <div className="poison-bar">
          <span className="bar-love" style={{ width: `${lovePct}%` }}></span>
          <span className="bar-meh" style={{ width: `${mehPct}%` }}></span>
          <span className="bar-hate" style={{ width: `${hatePct}%` }}></span>
        </div>

        <div className="tally-row">
          <div className="tally love">
            <div className="num">
              {product?.metadata?.sentiment_counts?.positive}
            </div>
            <div className="lab">LOVE</div>
          </div>
          <div className="tally meh">
            <div className="num">
              {product?.metadata?.sentiment_counts?.neutral}
            </div>
            <div className="lab">MEH</div>
          </div>
          <div className="tally hate">
            <div className="num">
              {product?.metadata?.sentiment_counts?.negative}
            </div>
            <div className="lab">HATE</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSummaryCard;

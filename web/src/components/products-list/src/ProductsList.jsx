import React from 'react';
import './ProductsList.styles.css';

function getKarmaScore(metadata) {
  const positive = metadata?.sentiment_counts?.positive;
  const negative = metadata?.sentiment_counts?.negative;

  if (typeof positive !== 'number' || typeof negative !== 'number') {
    return null;
  }

  return positive - negative;
}

function ProductsList({ products = [], onClickProduct }) {
  return products.map((product) => {
    const score = getKarmaScore(product?.metadata);

    return (
      <div
        key={product?.id ?? product?.sku}
        className="product-card"
        role="button"
        tabIndex={0}
        onClick={() => onClickProduct?.(product)}
        onKeyDown={(ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            onClickProduct?.(product);
          }
        }}
      >
        <span className="score-chip">{score ?? '--'}</span>
        <div className="cat">{product?.brand}</div>
        <div className="pname">
          {product?.name} - {product?.sku} - {product?.category}
        </div>
        <div className="vote-row">
          <span className="vote love">
            +{product?.metadata?.sentiment_counts?.positive ?? 0}
          </span>
          <span className="vote meh">
            ~{product?.metadata?.sentiment_counts?.neutral ?? 0}
          </span>
          <span className="vote hate">
            -{product?.metadata?.sentiment_counts?.negative ?? 0}
          </span>
        </div>
      </div>
    );
  });
}

export default ProductsList;

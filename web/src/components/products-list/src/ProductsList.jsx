import React from 'react';
import './ProductsList.styles.css';

function ProductsList({ products = [], onClickProduct }) {
  return products.map((product) => (
    <div className="product-card" onClick={(ev) => onClickProduct(product)}>
      <span className="score-chip">
        {product?.metadata?.sentiment_counts?.positive -
          product?.metadata?.sentiment_counts?.negative}
      </span>
      <div className="cat">{product?.brand}</div>
      <div className="pname">
        {product?.name} - {product?.sku} - {product?.category}
      </div>
      <div className="vote-row">
        <span className="vote love">
          +{product?.metadata?.sentiment_counts?.positive}
        </span>
        <span className="vote meh">
          ~{product?.metadata?.sentiment_counts?.neutral}
        </span>
        <span className="vote hate">
          -{product?.metadata?.sentiment_counts?.negative}
        </span>
      </div>
    </div>
  ));
}

export default ProductsList;

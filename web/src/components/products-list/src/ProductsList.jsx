import React from 'react';
import './ProductsList.styles.css';
import { useState } from 'react';

function ProductsList({
  products = [],
  isLoading = false,
  error = null,
  onViewReviews,
}) {
  const [expandedId, setExpandedId] = useState(null);

  if (isLoading) {
    return (
      <div className="products-list-container">
        <p className="products-list-status">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-list-container">
        <p className="products-list-status products-list-status--error">
          {error}
        </p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="products-list-container">
        <p className="products-list-status">
          There are no products to display.
        </p>
      </div>
    );
  }

  const toggleExpanded = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <div className="products-list-container">
      <ul className="products-list" role="list">
        {products.map((product) => {
          const productId = product.id ?? product.sku;
          const isExpanded = expandedId === productId;
          const tags = (product.tags ?? '')
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);

          return (
            <li key={productId} className="product-row-wrapper">
              <button
                type="button"
                className="product-row"
                aria-expanded={isExpanded}
                onClick={() => toggleExpanded(productId)}
              >
                <span className="product-row-title">
                  {product.name} - {product.sku}
                </span>
                {product.category ? (
                  <span className="product-row-category">
                    {product.category}
                  </span>
                ) : null}
              </button>

              {isExpanded ? (
                <div className="product-detail-card">
                  {product.description ? (
                    <p className="product-detail-description">
                      {product.description}
                    </p>
                  ) : null}

                  {tags.length ? (
                    <div className="product-detail-tags">
                      {tags.map((tag) => (
                        <span key={tag} className="product-detail-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {onViewReviews ? (
                    <button
                      type="button"
                      className="product-detail-reviews-button"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onViewReviews(product.id);
                      }}
                    >
                      Ver reseñas
                    </button>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ProductsList;

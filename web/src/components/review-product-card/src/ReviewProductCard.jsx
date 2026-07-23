import React from 'react';
import './ReviewProductCard.styles.css';
import ReviewForm from '../../review-form';
import { useState } from 'react';

function ReviewProductCard({ product, onSubmit }) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  function handleSubmit(data) {
    onSubmit(data);
    setIsFormOpen(false);
  }

  return (
    <div className="review-product-card-container">
      {isFormOpen ? (
        <>
          <ReviewForm onSubmit={handleSubmit} />
          <button
            type="button"
            className="review-product-card-cancel-button"
            onClick={() => setIsFormOpen(false)}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <p className="review-product-card-message">
            {product?.name
              ? `Have you tried ${product?.name} yet? Tell us what you think.`
              : 'Have you tried this product yet? Tell us what you think.'}
          </p>
          <button
            type="button"
            className="review-product-card-add-button"
            onClick={() => setIsFormOpen(true)}
          >
            Add new review
          </button>
        </>
      )}
    </div>
  );
}

export default ReviewProductCard;

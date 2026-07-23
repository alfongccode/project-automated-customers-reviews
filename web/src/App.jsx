import { useEffect, useState } from 'react';
import './App.css';
import ProductsList from './components/products-list';
import ReviewsSummaryCard from './components/reviews-summary-card';
import ReviewsList from './components/reviews-list';
import ReviewProductCard from './components/review-product-card';
import {
  create_new_review,
  get_products_list,
  get_products_reviews_list,
  get_products_reviews_summary,
  get_review_sentiment,
} from './providers';

function App() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewsSummary, setReviewsSummary] = useState(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  function create_test_user_fastapi() {
    return fetch('/api/user/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'test',
        email: 'test@example.com',
        password: 'test?1234',
      }),
    }).then((response) => response.json());
  }

  function onLoadComponent() {
    return get_products_list().then((products) => setProducts([...products]));
  }

  async function handleShowProductReviews(product_id) {
    const product = products.find((product) => product.id === product_id);
    setProduct(product);
    setIsSummaryLoading(true);
    setSummaryError(null);
    await get_products_reviews_summary(product_id)
      .then((summary) => setReviewsSummary(summary))
      .catch(() => setSummaryError('Could not summarize the reviews.'))
      .finally(() => setIsSummaryLoading(false));

    return get_products_reviews_list(product_id).then((reviews) =>
      setReviews([...reviews])
    );
  }

  function handleCreateNewReview(data) {
    return create_new_review(data).then((response) => console.log('created'));
  }

  useEffect(onLoadComponent, []);

  return (
    <>
      <ProductsList
        products={products}
        onViewReviews={handleShowProductReviews}
      />
      <ReviewsSummaryCard
        summary={reviewsSummary}
        isLoading={isSummaryLoading}
        error={summaryError}
      />
      <ReviewsList reviews={reviews} />
      <ReviewProductCard product={product} onSubmit={handleCreateNewReview} />
    </>
  );
}

export default App;

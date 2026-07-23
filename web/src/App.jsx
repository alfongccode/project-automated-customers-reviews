import { useEffect, useState } from 'react';
import './App.css';
import ProductsList from './components/products-list';
import ReviewsList from './components/reviews-list';
import ReviewProductCard from './components/review-product-card';
import {
  create_new_review,
  get_products_list,
  get_products_reviews_list,
  get_review_sentiment,
} from './providers';

function App() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [apiResponse, setApiResponse] = useState('');

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

  function handleSentimentAnalysis(review_id) {
    return get_review_sentiment(30).then((response) =>
      setApiResponse(response)
    );
  }

  function handleShowProductReviews(product_id) {
    const product = products.find((product) => product.id === product_id);
    setProduct(product);
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
      <ReviewsList reviews={reviews} />
      <ReviewProductCard product={product} onSubmit={handleCreateNewReview} />
    </>
  );
}

export default App;

import { useEffect, useState } from 'react';
import './App.css';
import MainHeader from './components/main-header';
import SearchProducts from './components/search-products';
import ProductsList from './components/products-list';
import ReviewsList from './components/reviews-list';
import ProductSummaryCard from './components/product-summary-card';
import ReviewForm from './components/review-form';
import MainFooter from './components/main-footer';
import {
  create_new_review,
  get_products_list,
  get_products_reviews_list,
  get_products_reviews_summary,
  get_review_sentiment,
  get_user_by_id,
} from './providers';

function App() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});

  function handleSelectListProduct(product) {
    setProduct(product);
  }

  function handleSearchProducts(value) {
    const term = value.trim().toLowerCase();
    setProducts(
      term
        ? allProducts.filter((product) =>
            product?.name?.toLowerCase().startsWith(term)
          )
        : [...allProducts]
    );
  }

  function handleCreateNewReview(data) {
    return create_new_review(data).then((response) => loadProducts());
  }

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      const currProducts = await get_products_list();

      const newProducts = await Promise.all(
        currProducts.map(async (currProduct) => {
          const rawReviews = await get_products_reviews_list(currProduct?.id);

          const currReviews = await Promise.all(
            rawReviews.map(async (review) => {
              const user = await get_user_by_id(review?.user_id);
              return {
                ...review,
                user: {
                  username: user?.username,
                  email: user?.email,
                  join_date: user?.created_at,
                },
              };
            })
          );

          const metadata = await get_products_reviews_summary(currProduct?.id);

          return {
            ...currProduct,
            reviews: currReviews,
            metadata,
          };
        })
      );

      if (!cancelled) setAllProducts(newProducts);
    }

    loadProducts().catch(console.error);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <MainHeader />
      <div class="hazard-strip"></div>
      <SearchProducts onSearch={handleSearchProducts} />
      <ProductsList
        products={products}
        onClickProduct={handleSelectListProduct}
      />
      <ProductSummaryCard
        product={Object.keys(product).length ? product : allProducts[0]}
      />
      <ReviewsList
        reviews={
          Object.keys(product).length
            ? product?.reviews
            : allProducts[0]?.reviews
        }
      />
      <ReviewForm
        product={Object.keys(product).length ? product : allProducts[0]}
        onSubmit={handleCreateNewReview}
      />
      <MainFooter />
    </>
  );
}

export default App;

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  get_user_by_id,
} from './providers';

async function hydrateProduct(currProduct, { signal } = {}) {
  const [rawReviews, metadata] = await Promise.all([
    get_products_reviews_list(currProduct?.id, { signal }),
    get_products_reviews_summary(currProduct?.id, { signal }),
  ]);

  const reviews = await Promise.all(
    (rawReviews ?? []).map(async (review) => {
      const user = await get_user_by_id(review?.user_id, { signal }).catch(
        () => null
      );

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

  return { ...currProduct, reviews, metadata };
}

function App() {
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  const abortRef = useRef(null);

  const loadProducts = useCallback(async ({ signal } = {}) => {
    try {
      const currProducts = (await get_products_list({ signal })) ?? [];

      const newProducts = await Promise.all(
        currProducts.map((currProduct) =>
          hydrateProduct(currProduct, { signal })
        )
      );

      if (signal?.aborted) return;

      setAllProducts(newProducts);
      setError(null);
      setStatus('ready');
    } catch (err) {
      if (err?.name === 'AbortError' || signal?.aborted) return;

      console.error(err);
      setError(err);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    loadProducts({ signal: controller.signal });

    return () => controller.abort();
  }, [loadProducts]);

  const products = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return allProducts;

    return allProducts.filter((product) =>
      product?.name?.toLowerCase().startsWith(term)
    );
  }, [allProducts, searchTerm]);

  const selectedProduct = useMemo(() => {
    if (selectedProductId === null) return allProducts[0] ?? null;

    return (
      allProducts.find((product) => product?.id === selectedProductId) ??
      allProducts[0] ??
      null
    );
  }, [allProducts, selectedProductId]);

  const handleSelectListProduct = useCallback((product) => {
    setSelectedProductId(product?.id ?? null);
  }, []);

  const handleSearchProducts = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleCreateNewReview = useCallback(
    async (data) => {
      await create_new_review(data);
      await loadProducts({ signal: abortRef.current?.signal });
    },
    [loadProducts]
  );

  return (
    <>
      <MainHeader />
      <div className="hazard-strip"></div>
      <SearchProducts onSearch={handleSearchProducts} />

      {status === 'error' && (
        <div className="app-status app-status-error" role="alert">
          &gt; CONNECTION_LOST. {error?.message ?? 'Unknown error.'}
          <button
            type="button"
            onClick={() => {
              setStatus('loading');
              loadProducts({ signal: abortRef.current?.signal });
            }}
          >
            RETRY
          </button>
        </div>
      )}

      {status === 'loading' && (
        <div className="app-status" role="status">
          &gt; LOADING_DATA...
        </div>
      )}

      {status === 'ready' && (
        <>
          <ProductsList
            products={products}
            onClickProduct={handleSelectListProduct}
          />
          <ProductSummaryCard product={selectedProduct} />
          <ReviewsList reviews={selectedProduct?.reviews} />
          <ReviewForm
            product={selectedProduct}
            onSubmit={handleCreateNewReview}
          />
        </>
      )}

      <MainFooter />
    </>
  );
}

export default App;

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import LoadingSpinner from './components/loading-spinner';
import MainHeader from './components/main-header';
import InfiniteScrollWrapper from './components/infinite-scroll-wrapper';
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
} from './providers';

const EMPTY_PAGE = { items: [], page: 0, total: 0 };

async function hydrateProduct(currProduct, { signal } = {}) {
  const { items: reviews } = await get_products_reviews_list(currProduct?.id, {
    signal,
  });
  return { ...currProduct, reviews };
}

function App() {
  const [allProducts, setAllProducts] = useState(EMPTY_PAGE);
  const [allReviews, setAllReviews] = useState(EMPTY_PAGE);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  const productsAbortRef = useRef(null);
  const reviewsAbortRef = useRef(null);

  const loadProducts = useCallback(
    async ({ page = 1, size } = {}, { signal } = {}) => {
      try {
        const {
          items: currProducts = [],
          page: nextPage = page,
          total = 0,
        } = (await get_products_list({ page, size }, { signal })) ?? {};

        const newProducts = await Promise.all(
          currProducts.map((currProduct) =>
            hydrateProduct(currProduct, { signal })
          )
        );

        if (signal?.aborted) return;

        setAllProducts((prev) => {
          // Si es la primera página, reemplaza; si no, concatena.
          const items =
            page <= 1 ? newProducts : [...prev.items, ...newProducts];
          setHasMoreProducts(items.length < total);
          return { items, page: nextPage, total };
        });
        setError(null);
        setStatus('ready');
      } catch (err) {
        if (err?.name === 'AbortError' || signal?.aborted) return;
        console.error(err);
        setError(err);
        setStatus('error');
      }
    },
    []
  );

  const loadReviews = useCallback(
    async (productId, { page = 1, size } = {}, { signal } = {}) => {
      if (productId == null) return;
      try {
        const {
          items: currReviews = [],
          page: nextPage = page,
          total = 0,
        } = (await get_products_reviews_list(
          productId,
          { page, size },
          { signal }
        )) ?? {};

        if (signal?.aborted) return;

        setAllReviews((prev) => {
          const items =
            page <= 1 ? currReviews : [...prev.items, ...currReviews];
          setHasMoreReviews(items.length < total);
          return { items, page: nextPage, total };
        });
        setError(null);
        setStatus('ready');
      } catch (err) {
        if (err?.name === 'AbortError' || signal?.aborted) return;
        console.error(err);
        setError(err);
        setStatus('error');
      }
    },
    []
  );

  // Carga inicial de productos
  useEffect(() => {
    const controller = new AbortController();
    productsAbortRef.current = controller;
    loadProducts({ page: 1 }, { signal: controller.signal });
    return () => controller.abort();
  }, [loadProducts]);

  const selectedProduct = useMemo(() => {
    const items = allProducts?.items ?? [];
    if (selectedProductId === null) return items[0] ?? null;
    return (
      items.find((product) => product?.id === selectedProductId) ??
      items[0] ??
      null
    );
  }, [allProducts, selectedProductId]);

  useEffect(() => {
    const productId = selectedProduct?.id ?? null;
    if (productId == null) return;

    const controller = new AbortController();
    reviewsAbortRef.current = controller;

    setAllReviews(EMPTY_PAGE);
    setHasMoreReviews(true);
    loadReviews(productId, { page: 1 }, { signal: controller.signal });

    return () => controller.abort();
  }, [selectedProduct?.id, loadReviews]);

  const products = useMemo(() => {
    const items = allProducts?.items ?? [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return items;
    return items.filter((product) =>
      product?.name?.toLowerCase().startsWith(term)
    );
  }, [allProducts, searchTerm]);

  const handleSelectListProduct = useCallback((product) => {
    setSelectedProductId(product?.id ?? null);
  }, []);

  const handleSearchProducts = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleCreateNewReview = useCallback(
    async (data) => {
      setStatus('loading');
      await create_new_review(data);
      const productId = selectedProduct?.id ?? null;
      if (productId != null) {
        setAllReviews(EMPTY_PAGE);
        setHasMoreReviews(true);
        await loadReviews(
          productId,
          { page: 1 },
          { signal: reviewsAbortRef.current?.signal }
        );
      }
    },
    [loadReviews, selectedProduct?.id]
  );

  const handleLoadMoreProductsData = useCallback(async () => {
    if (!hasMoreProducts) return;
    setStatus('loading');
    await loadProducts(
      { page: (allProducts?.page ?? 0) + 1 },
      { signal: productsAbortRef.current?.signal }
    );
  }, [loadProducts, allProducts?.page, hasMoreProducts]);

  const handleLoadMoreReviewsData = useCallback(async () => {
    if (!hasMoreReviews) return;
    const productId = selectedProduct?.id ?? null;
    if (productId == null) return;
    setStatus('loading');
    await loadReviews(
      productId,
      { page: (allReviews?.page ?? 0) + 1 },
      { signal: reviewsAbortRef.current?.signal }
    );
  }, [loadReviews, allReviews?.page, hasMoreReviews, selectedProduct?.id]);

  return (
    <>
      <header>
        <MainHeader />
        <div className="hazard-strip"></div>
      </header>
      <main className="app-main">
        <SearchProducts onSearch={handleSearchProducts} />

        {status === 'error' && (
          <div className="app-status app-status-error" role="alert">
            &gt; CONNECTION_LOST. {error?.message ?? 'Unknown error.'}
            <button
              type="button"
              onClick={() => {
                setStatus('loading');
                loadProducts(
                  { page: 1 },
                  { signal: productsAbortRef.current?.signal }
                );
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
            <div className="app-content">
              <InfiniteScrollWrapper
                hasMore={hasMoreProducts}
                isLoading={status === 'loading'}
                onLoadMore={handleLoadMoreProductsData}
              >
                <ProductsList
                  products={products}
                  onClickProduct={handleSelectListProduct}
                />
              </InfiniteScrollWrapper>

              <ProductSummaryCard product={selectedProduct} />

              <div className="app-reviews-list">
                <InfiniteScrollWrapper
                  hasMore={hasMoreReviews}
                  isLoading={status === 'loading'}
                  onLoadMore={handleLoadMoreReviewsData}
                >
                  <ReviewsList reviews={allReviews.items} />
                </InfiniteScrollWrapper>
              </div>
            </div>

            <ReviewForm
              product={selectedProduct}
              onSubmit={handleCreateNewReview}
            />
          </>
        )}
      </main>
      <MainFooter />
      <LoadingSpinner active={status === 'loading'} />
    </>
  );
}

export default App;

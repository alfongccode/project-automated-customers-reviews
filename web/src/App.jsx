import React, { useState, useCallback, useEffect, useRef } from 'react';
import './App.css';
import LoadingSpinner from './components/loading-spinner';
import AppLayout from './components/app-layout';
import MainHeader from './components/main-header';
import SearchProducts from './components/search-products';
import InfiniteScrollWrapper from './components/infinite-scroll-wrapper';
import ProductsList from './components/products-list';
import ProductSummaryCard from './components/product-summary-card';
import ReviewsList from './components/reviews-list';
import ReviewForm from './components/review-form';
import MainFooter from './components/main-footer';
import {
  create_new_review,
  get_products_list,
  get_products_reviews_list,
} from './providers';

const PAGE_SIZE = 5;
const EMPTY_PAGE = { items: [], page: 0, size: PAGE_SIZE, prefix: '' };
const MIN_TERM_LENGTH = 3;

function checkSameParams(ref, params = {}) {
  return !Object.entries(params).some(
    ([key, value]) => ref.current[key] !== value
  );
}

function App() {
  /* PRODUCTS STATUS */
  const [products, setProducts] = useState(EMPTY_PAGE);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  /* REVIEWS STATUS */
  const [reviews, setReviews] = useState(EMPTY_PAGE);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);

  const productsSearchRef = useRef({ page: 0, prefix: '', sort_by: null });
  const reviewsSearchRef = useRef({
    productId: null,
    page: 0,
    prefix: '',
    sort_by: null,
  });
  const [status, setStatus] = useState('loading');
  const retryRef = useRef(null);

  /* COMPONENTS REFERENCES */
  const feedRef = useRef(null);
  const karmaRef = useRef(null);
  const manifestoRef = useRef(null);

  const handleLoadError = useCallback((error, retryFn) => {
    if (error?.name === 'AbortError') return;
    console.error(error);
    retryRef.current = retryFn;
    setStatus('error');
  }, []);

  const handleRetry = useCallback(async () => {
    const action = retryRef.current;
    if (!action) return;
    setStatus('loading');
    try {
      await action();
      setStatus('ready');
    } catch (error) {
      handleLoadError(error, action);
    }
  }, [handleLoadError]);

  const loadProducts = useCallback(async (params = {}, { signal } = {}) => {
    const isSameSearch = checkSameParams(productsSearchRef, params);
    const page = isSameSearch ? productsSearchRef.current.page + 1 : 1;
    const size = params?.size ?? PAGE_SIZE;
    const requestParams = { ...params, page, size };

    setIsLoadingProducts(true);
    try {
      const {
        items: currProducts = [], // Items on page
        page: nextPage = page, // Page number
        size: pageSize, // Total elements per page
        total: totalProducts = 0, // Total record on database
      } = (await get_products_list({ signal, params: requestParams })) ?? {};

      if (signal?.aborted) return;

      productsSearchRef.current = { ...params, page: nextPage };

      setProducts((prev) => ({
        items: isSameSearch ? [...prev?.items, ...currProducts] : currProducts,
        page: nextPage,
        size: pageSize,
        prefix: params?.prefix ?? '',
      }));
      setHasMoreProducts(nextPage * pageSize < totalProducts);

      if (page === 1 && currProducts.length > 0) {
        setSelectedProduct(currProducts[0]);
      }
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const handleSearchProducts = useCallback(
    async (term = '') => {
      const controller = new AbortController();
      if (term.length > 0 && term.length < MIN_TERM_LENGTH) return;
      const run = () =>
        loadProducts(
          { prefix: term, sort_by: 'metadata.negative' },
          { signal: controller?.signal }
        );
      try {
        await run();
      } catch (error) {
        handleLoadError(error, run);
      }
    },
    [loadProducts, handleLoadError]
  );

  const handleLoadMoreProductsData = useCallback(async () => {
    const controller = new AbortController();
    if (!hasMoreProducts) return;
    const run = () =>
      loadProducts(
        { prefix: products?.prefix, sort_by: 'metadata.negative' },
        { signal: controller?.signal }
      );
    try {
      await run();
    } catch (error) {
      handleLoadError(error, run);
    }
    return () => controller.abort();
  }, [loadProducts, hasMoreProducts, products?.prefix, handleLoadError]);

  const handleSelectedProduct = useCallback((product) => {
    setSelectedProduct(product ?? null);
  }, []);

  const loadReviews = useCallback(
    async (productId, params = {}, { signal } = {}) => {
      const isSameSearch =
        productId === reviewsSearchRef.current.productId &&
        checkSameParams(reviewsSearchRef, params);
      const page = isSameSearch ? reviewsSearchRef.current.page + 1 : 1;

      if (productId == null) return;

      setIsLoadingReviews(true);
      try {
        const {
          items: currReviews = [],
          page: nextPage = page,
          size: pageSize,
          total: totalReviews = 0,
        } = (await get_products_reviews_list(productId, {
          signal,
          params,
        })) ?? {};

        if (signal?.aborted) return;

        reviewsSearchRef.current = { ...params, productId, page: nextPage };

        setReviews((prev) => {
          const items =
            page <= 1 ? currReviews : [...prev.items, ...currReviews];
          return { items, page: nextPage, size: PAGE_SIZE };
        });
        setHasMoreReviews(nextPage * pageSize < totalReviews);
      } finally {
        setIsLoadingReviews(false);
      }
    },
    []
  );

  const handleLoadMoreReviewsData = useCallback(async () => {
    const controller = new AbortController();
    if (!hasMoreReviews) return;
    const productId = selectedProduct?.id ?? null;

    if (productId == null) return;

    const run = () =>
      loadReviews(
        productId,
        { page: (reviews?.page ?? 0) + 1 },
        { signal: controller?.signal }
      );
    try {
      await run();
    } catch (error) {
      handleLoadError(error, run);
    }
  }, [
    loadReviews,
    reviews?.page,
    hasMoreReviews,
    selectedProduct,
    handleLoadError,
  ]);

  const handleCreateNewReview = useCallback(
    async (data) => {
      setStatus('loading');
      const run = async () => {
        await create_new_review(data);
        const productId = selectedProduct?.id ?? null;
        if (productId != null) {
          setReviews(EMPTY_PAGE);
          setHasMoreReviews(true);
          await loadReviews(productId, { page: 1 });
        }
      };
      try {
        await run();
        setStatus('ready');
      } catch (error) {
        handleLoadError(error, run);
      }
    },
    [loadReviews, selectedProduct?.id, handleLoadError]
  );

  const handleLoadFilterReviews = useCallback(
    async (currentFilter) => {
      const controller = new AbortController();
      if (!hasMoreReviews) return;
      const productId = selectedProduct?.id ?? null;

      if (productId == null) return;

      const run = () =>
        loadReviews(
          productId,
          {
            page: (reviews?.page ?? 0) + 1,
            sort_by: currentFilter ? `metadata.${currentFilter}` : null,
          },
          { signal: controller?.signal }
        );
      try {
        await run();
      } catch (error) {
        handleLoadError(error, run);
      }
    },
    [
      loadReviews,
      reviews?.page,
      hasMoreReviews,
      selectedProduct,
      handleLoadError,
    ]
  );

  const handleClickFeed = useCallback((event) => {
    event?.preventDefault();
    feedRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [])

  const handleClickKarma = useCallback((event) => {
    event?.preventDefault();
    karmaRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [])

  const handleClickManifesto = useCallback((event) => {
    event?.preventDefault();
    manifestoRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [])

  useEffect(() => {
    const productId = selectedProduct?.id ?? null;
    if (productId == null) return;

    const controller = new AbortController();

    setReviews(EMPTY_PAGE);
    setHasMoreReviews(true);

    const run = () =>
      loadReviews(productId, { page: 1 }, { signal: controller.signal });
    run()
      .then(() => setStatus('ready'))
      .catch((error) => handleLoadError(error, run));

    return () => controller.abort();
  }, [selectedProduct?.id, loadReviews, handleLoadError]);

  return (
    <>
      <LoadingSpinner active={status === 'loading'} />
      <AppLayout
        header={<MainHeader
          onClickFeed={handleClickFeed}
          onClickKarma={handleClickKarma}
          onClickManifesto={handleClickManifesto}
        />}
        content={
          status === 'error' ? (
            <div className="app-error" role="alert">
              <span className="app-error__tag">// SYSTEM_FAILURE //</span>
              <p className="app-error__message">
                &gt; CONNECTION_LOST. SOMETHING BROKE WHILE FETCHING DATA.
              </p>
              <button
                type="button"
                className="app-error__retry"
                onClick={handleRetry}
              >
                &gt;&gt; RETRY
              </button>
            </div>
          ) : (
            <>
              <aside className="app-layout__left">
                <SearchProducts onSearch={handleSearchProducts} />

                <div className="app-layout__scroll-area app-layout__scroll-area--no-scrollbar">
                  <InfiniteScrollWrapper
                    ref={feedRef}
                    hasMore={hasMoreProducts}
                    isLoading={isLoadingProducts}
                    onLoadMore={handleLoadMoreProductsData}
                  >
                    <ProductsList
                      products={products?.items}
                      onClickProduct={handleSelectedProduct}
                    />
                  </InfiniteScrollWrapper>
                </div>
              </aside>
              <section className="app-layout__content">
                <ProductSummaryCard ref={karmaRef} product={selectedProduct} />

                <div className="app-layout__scroll-area app-layout__scroll-area--no-scrollbar">
                  <InfiniteScrollWrapper
                    hasMore={hasMoreReviews}
                    isLoading={isLoadingReviews}
                    onLoadMore={handleLoadMoreReviewsData}
                  >
                    <ReviewsList
                      reviews={reviews?.items}
                      onLoadFilterReviews={handleLoadFilterReviews}
                    />
                  </InfiniteScrollWrapper>
                  <ReviewForm
                    product={selectedProduct}
                    onSubmit={handleCreateNewReview}
                  />
                </div>
              </section>
            </>
          )
        }
        footer={<MainFooter ref={manifestoRef} />}
      ></AppLayout>
    </>
  );
}

export default App;

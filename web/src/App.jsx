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

  const productsSearchRef = useRef({ page: 0, prefix: '' });
  const [status, setStatus] = useState('loading');

  const loadProducts = useCallback(async (params = {}, { signal } = {}) => {
    const prefix = params?.prefix ?? null;
    const sort_by = params?.sort_by ?? null;
    const size = params?.size ?? PAGE_SIZE;
    const isSameSearch = prefix === productsSearchRef.current.prefix;
    const page = isSameSearch ? productsSearchRef.current.page + 1 : 1;
    const filtered_params = Object.entries(params).reduce(
      (acc, [key, value]) => (value && { ...acc, [key]: value }) || acc,
      {}
    );

    setIsLoadingProducts(true);
    const {
      items: currProducts = [], // Items on page
      page: nextPage = page, // Page number
      size: pageSize, // Total elements per page
      total: totalProducts = 0, // Total record on database
    } = (await get_products_list(filtered_params, { signal })) ?? {};

    if (signal?.aborted) return;

    productsSearchRef.current = { page: nextPage, prefix };

    setProducts((prev) => ({
      items: isSameSearch ? [...prev?.items, ...currProducts] : currProducts,
      page: nextPage,
      size: pageSize,
      prefix,
    }));
    setHasMoreProducts(nextPage * pageSize < totalProducts);
    setIsLoadingProducts(false);

    if (page === 1 && currProducts.length > 0) {
      setSelectedProduct(currProducts[0]);
    }
  }, []);

  const handleSearchProducts = useCallback(
    async (term = '') => {
      const controller = new AbortController();
      if (term.length > 0 && term.length < MIN_TERM_LENGTH) return;
      await loadProducts(
        { prefix: term, sort_by: 'metadata.negative' },
        { signal: controller?.signal }
      );
    },
    [loadProducts]
  );

  const handleLoadMoreProductsData = useCallback(async () => {
    const controller = new AbortController();
    if (!hasMoreProducts) return;
    await loadProducts(
      { prefix: products?.prefix, sort_by: 'metadata.negative' },
      { signal: controller?.signal }
    );
    return () => controller.abort();
  }, [loadProducts, hasMoreProducts, products?.prefix]);

  const handleSelectedProduct = useCallback((product) => {
    setSelectedProduct(product ?? null);
  }, []);

  const loadReviews = useCallback(
    async (productId, { page = 1, size } = {}, { signal } = {}) => {
      if (productId == null) return;

      setIsLoadingReviews(true);

      const {
        items: currReviews = [],
        page: nextPage = page,
        size: pageSize,
        total: totalReviews = 0,
      } = (await get_products_reviews_list(
        productId,
        { page, size: PAGE_SIZE },
        { signal }
      )) ?? {};

      if (signal?.aborted) return;

      setReviews((prev) => {
        const items = page <= 1 ? currReviews : [...prev.items, ...currReviews];
        return { items, page: nextPage, size: PAGE_SIZE };
      });
      setHasMoreReviews(nextPage * pageSize < totalReviews);
      setIsLoadingReviews(false);
    },
    []
  );

  const handleLoadMoreReviewsData = useCallback(async () => {
    const controller = new AbortController();
    if (!hasMoreReviews) return;
    const productId = selectedProduct?.id ?? null;

    if (productId == null) return;

    await loadReviews(
      productId,
      { page: (reviews?.page ?? 0) + 1 },
      { signal: controller?.signal }
    );
  }, [loadReviews, reviews?.page, hasMoreReviews, selectedProduct]);

  const handleCreateNewReview = useCallback(
    async (data) => {
      setStatus('loading');
      try {
        await create_new_review(data);
        const productId = selectedProduct?.id ?? null;
        if (productId != null) {
          setReviews(EMPTY_PAGE);
          setHasMoreReviews(true);
          await loadReviews(productId, { page: 1 });
        }
      } finally {
        setStatus('ready');
      }
    },
    [loadReviews, selectedProduct?.id]
  );

  useEffect(() => {
    const productId = selectedProduct?.id ?? null;
    if (productId == null) return;

    const controller = new AbortController();

    setReviews(EMPTY_PAGE);
    setHasMoreReviews(true);
    loadReviews(productId, { page: 1 }, { signal: controller.signal }).finally(
      () => setStatus('ready')
    );

    return () => controller.abort();
  }, [selectedProduct?.id, loadReviews]);

  return (
    <>
      <LoadingSpinner active={status === 'loading'} />
      <AppLayout
        header={<MainHeader />}
        left={
          <>
            <SearchProducts onSearch={handleSearchProducts} />

            <div className="app-layout__scroll-area app-layout__scroll-area--no-scrollbar">
              <InfiniteScrollWrapper
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
          </>
        }
        content={
          <>
            <ProductSummaryCard product={selectedProduct} />

            <div className="app-layout__scroll-area app-layout__scroll-area--no-scrollbar">
              <InfiniteScrollWrapper
                hasMore={hasMoreReviews}
                isLoading={isLoadingReviews}
                onLoadMore={handleLoadMoreReviewsData}
              >
                <ReviewsList reviews={reviews?.items} />
              </InfiniteScrollWrapper>
              <ReviewForm
                product={selectedProduct}
                onSubmit={handleCreateNewReview}
              />
            </div>
          </>
        }
        footer={<MainFooter />}
      ></AppLayout>
    </>
  );
}

export default App;

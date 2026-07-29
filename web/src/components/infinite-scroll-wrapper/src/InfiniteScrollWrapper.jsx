import React, { useEffect, useRef } from 'react';
import './InfiniteScrollWrapper.styles.css';

function InfiniteScrollWrapper({ children, hasMore, isLoading, onLoadMore, ref }) {
  const triggerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      {
        root: null, // Get target ancestor
        rootMargin: '100px', // Execite 100px before reach end
        threshold: 0.1,
      }
    );

    if (triggerRef.current) observer.observe(triggerRef.current);

    return () => {
      if (triggerRef.current) observer.unobserve(triggerRef.current);
    };
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div className="infinite-scroll-wrapper-container" ref={ref}>
      {children}
      <div ref={triggerRef} className="infinite-scroll-wrapper-trigger"></div>
    </div>
  );
}

export default InfiniteScrollWrapper;

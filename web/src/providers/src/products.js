import { get, post } from './http.js';

function get_products_list({ signal } = {}) {
  return get('/api/products', { signal });
}

function get_products_reviews_list(product_id, { signal } = {}) {
  return get(`/api/products/${product_id}/reviews`, { signal });
}

function get_products_reviews_summary(product_id, { signal } = {}) {
  return get(`/api/products/${product_id}/reviews/summarize`, { signal });
}

function create_new_product(data, { signal } = {}) {
  return post(
    '/api/products',
    {
      user: 1,
      name: data.name,
      sku: data.sku,
      tags: data.tags,
      description: data.description,
    },
    { signal }
  );
}

export {
  create_new_product,
  get_products_list,
  get_products_reviews_list,
  get_products_reviews_summary,
};

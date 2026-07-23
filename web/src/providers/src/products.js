function get_products_list() {
  return fetch('/api/products').then((response) => response.json());
}

function get_products_reviews_list(product_id) {
  return fetch(`/api/products/${product_id}/reviews`).then((response) =>
    response.json()
  );
}

function create_new_product(data) {
  return fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user: 1,
      name: data.name,
      sku: data.sku,
      tags: data.tags,
      description: data.description,
    }),
  });
}

export { create_new_product, get_products_list, get_products_reviews_list };

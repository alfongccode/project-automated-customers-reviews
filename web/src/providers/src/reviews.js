import { get, post } from './http.js';

function get_review_sentiment(review_id, { signal } = {}) {
  return get(`/api/reviews/${review_id}/sentiment`, { signal });
}

function create_new_review(data, { signal } = {}) {
  return post(
    '/api/reviews',
    {
      username: data.username,
      product_id: data.product_id,
      title: data.title,
      content: data.content,
      rating: data.rating,
    },
    { signal }
  );
}

export { create_new_review, get_review_sentiment };

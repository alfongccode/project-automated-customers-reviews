function get_review_sentiment(review_id) {
  return fetch(`/api/reviews/${review_id}/sentiment`)
    .then((response) => response.json())
    .then((data) => setApiResponse(JSON.stringify(data)));
}

function create_new_review(data) {
  return fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user: 1,
      product: 1,
      title: data.title,
      content: data.content,
      rating: data.rating,
    }),
  });
}

export { create_new_review, get_review_sentiment };

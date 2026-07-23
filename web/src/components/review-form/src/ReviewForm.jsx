import React from 'react';
import './ReviewForm.styles.css';
import StarsRating from '../../stars-rating'
import { useState } from 'react';

function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(0);

  function handleSubmitForm(ev) {
    ev.preventDefault();
    const form = ev.target;
    const formData = new FormData(form);

    onSubmit({
      'title': formData.get('title'),
      'content': formData.get('content'),
      'rating': rating
    });
  }

  return (
    <div className="review-form-container">
      <form className="register-form" onSubmit={handleSubmitForm}>
        <input
          id="title"
          name="title"
          className="title"
          type="text"
          placeholder="Write your review title here"
        />
        <textarea
          id="content"
          name="content"
          className="content"
          placeholder="Write your review here"
          rows={4}
        />
        <StarsRating value={rating} onChange={setRating} />
        <div className="buttons-toolbar">
          <button className="btn-clear" type="reset">
            Clear
          </button>
          <button className="btn-send" type="submit">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;

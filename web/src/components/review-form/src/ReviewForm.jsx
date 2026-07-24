import React, { useState } from 'react';
import './ReviewForm.styles.css';
import KarmaBar from '../../karma-bar';

const SENTIMENT_STATUS = {
  POSITIVE: 'positive',
  NEUTRAL: 'neutral',
  NEGATIVE: 'negative',
};

const TITLE_MAX_LENGTH = 100;
const CONTENT_MAX_LENGTH = 500;

function ReviewForm({ product, onSubmit }) {
  const safeProduct = product ?? {};
  const [alias, setAlias] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);

  function handleSubmitForm(ev) {
    ev.preventDefault();
    onSubmit?.({
      product_id: safeProduct?.id,
      username: alias.trim(),
      title: title.trim(),
      content: content.trim(),
      rating: rating,
    });

    setAlias('');
    setTitle('');
    setContent('');
    setRating(0);
  }

  function handleKarmaRating(value) {
    setRating(value);
  }

  return (
    <form className="review-form-container" onSubmit={handleSubmitForm}>
      <div className="review-form-head">
        <h2>SPIT OUT A REVIEW</h2>
        <span className="tag">NO MODERATION</span>
      </div>
      <div className="review-form-body">
        <div className="field">
          <label>TARGET</label>
          <input type="text" value={`> ${safeProduct?.name ?? ''}`} readOnly />
        </div>
        <div className="field">
          <label>ALIAS</label>
          <input
            type="text"
            placeholder="e.g. urban_rat"
            value={alias}
            onChange={(ev) => setAlias(ev.target.value)}
          />
        </div>
        <div className="field">
          <label>TITLE (MAX {TITLE_MAX_LENGTH})</label>
          <input
            type="text"
            placeholder="Summarize this like a movie synopsis where humanity's fate is on the line."
            value={title}
            maxLength={TITLE_MAX_LENGTH}
            onChange={(ev) => setTitle(ev.target.value)}
          />
          <div className="char-count">
            {title.length}/{TITLE_MAX_LENGTH}
          </div>
        </div>
        <div className="field">
          <label>VERDICT (MAX {CONTENT_MAX_LENGTH})</label>
          <textarea
            placeholder="tell what happened. no filters. no suits reading."
            value={content}
            maxLength={CONTENT_MAX_LENGTH}
            onChange={(ev) => setContent(ev.target.value)}
          ></textarea>
          <div className="char-count">
            {content.length}/{CONTENT_MAX_LENGTH}
          </div>
        </div>

        <div className="karma-bar">
          <label>KARMA</label>
          <KarmaBar name="rating" value={rating} onChange={handleKarmaRating} />
        </div>

        <button type="submit" className="post-btn">
          &gt;&gt; POST WITHOUT REGRET
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;

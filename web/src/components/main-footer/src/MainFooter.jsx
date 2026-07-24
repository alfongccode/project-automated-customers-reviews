import React from 'react';
import './MainFooter.styles.css';

function MainFooter() {
  return (
    <footer>
      <h3>WE ARE NOT TRUSTPILOT.</h3>
      <p>
        No gold stars here, no smiling CEOs. Just karma spray-painted by
        anonymous users with too much free time. It's all satire. Almost all of
        it.
      </p>
      <div className="foot-tags">
        <span className="foot-tag">NO COOKIES</span>
        <span className="foot-tag dark">NO FILTERS</span>
        <span className="foot-tag red">NO MERCY</span>
        <span className="foot-tag yellow">NO LAWYERS (YET)</span>
      </div>
    </footer>
  );
}

export default MainFooter;

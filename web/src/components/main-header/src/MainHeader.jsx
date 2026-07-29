import React from 'react';
import './MainHeader.styles.css';

function MainHeader({onClickFeed, onClickKarma, onClickManifesto }) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">K//D</div>
        <div className="brand-text">
          <div className="title">KARMA//DUMP</div>
          <div className="subtitle">
            THE REVIEW LANDFILL &nbsp;·&nbsp; V0.6.6
          </div>
        </div>
      </div>
      <nav className="mainnav">
        <a href="#" onClick={onClickFeed}>FEED</a>
        <a href="#" onClick={onClickKarma}>KARMA</a>
        <a href="#" onClick={onClickManifesto}>MANIFESTO</a>
        <button className="btn-login">LOGIN? NAH.</button>
      </nav>
    </header>
  );
}

export default MainHeader;

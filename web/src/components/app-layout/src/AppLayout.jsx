import React from 'react';
import './AppLayout.styles.css';

function AppLayout({ header, left, content, footer }) {
  return (
    <div className="app-layout-container">
      <header className="app-layout__header">
        {header}
        <div className="hazard-strip"></div>
      </header>
      <main className="app-layout__main">
        <aside className="app-layout__left">{left}</aside>
        <section className="app-layout__content">{content}</section>
      </main>
      <footer className="app-layout__footer">{footer}</footer>
    </div>
  );
}

export default AppLayout;

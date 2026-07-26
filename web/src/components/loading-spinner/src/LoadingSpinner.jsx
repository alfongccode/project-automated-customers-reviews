import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { LOADING_MESSAGES, FLAME_LAYERS, SPARKS, FADE_MS } from './const.js';
import './LoadingSpinner.styles.css';

function useRotatingMessage(messages, baseDuration, active) {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * messages.length)
  );
  const [visible, setVisible] = useState(true);
  const timers = useRef([]);

  useEffect(() => {
    if (!active || messages.length < 2) return;

    const nextDelay = () => {
      const base = Number(baseDuration) || 3000;
      const min = Math.max(1200, base - 600);
      const max = base + 600;
      return min + Math.random() * (max - min);
    };

    const schedule = () => {
      timers.current.push(
        setTimeout(() => {
          setVisible(false);
          timers.current.push(
            setTimeout(() => {
              setIndex((current) => {
                let next = current;
                while (next === current)
                  next = Math.floor(Math.random() * messages.length);
                return next;
              });
              setVisible(true);
              schedule();
            }, FADE_MS)
          );
        }, nextDelay())
      );
    };

    setVisible(true);
    schedule();

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [active, baseDuration, messages]);

  return { message: messages[index], visible };
}

export function LoadingSpinner({
  active = true,
  messages = LOADING_MESSAGES,
  messageDuration = 3000,
  dimOpacity = 0.74,
  blurRadius = 7,
  scanlines = true,
  flameScale = 1,
  eyebrow = '> LOADING_DATA...',
  label = 'Loading data',
}) {
  const { message, visible } = useRotatingMessage(
    messages,
    messageDuration,
    active
  );

  if (!active) return null;

  return (
    <div
      className="loading-overlay"
      aria-busy="true"
      style={{
        '--loading-dim': dimOpacity,
        '--loading-blur': `${blurRadius}px`,
        '--loading-flame-scale': flameScale,
      }}
    >
      {scanlines ? (
        <div className="loading-scanlines" aria-hidden="true" />
      ) : null}

      <div className="loading-wordmark">
        <div className="loading-wordmark-text">KARMA</div>

        <div className="loading-flame" aria-hidden="true">
          <div className="loading-ember" />

          {SPARKS.map((spark, i) => (
            <div key={`spark-${i}`} className="loading-spark" style={spark} />
          ))}

          {FLAME_LAYERS.map((layer) => (
            <div
              key={layer.className}
              className={`loading-layer ${layer.className}`}
            >
              {layer.rows.map((width, i) => (
                <div
                  key={`${layer.className}-${i}`}
                  className="loading-row"
                  style={{ width, background: layer.color }}
                />
              ))}
            </div>
          ))}

          <div className="loading-core loading-core-low" />
          <div className="loading-core loading-core-high" />
        </div>

        <div className="loading-wordmark-text">DUMP</div>
      </div>

      <div className="loading-readout">
        <div className="loading-card">
          <span className="loading-eyebrow">{eyebrow}</span>
          {/* The joke text is decoration and it changes every ~3s. Announcing it
              would mean a screen reader interrupting itself indefinitely, so the
              live region below carries the real status instead. */}
          <p
            className="loading-message"
            data-loading-visible={String(visible)}
            aria-hidden="true"
          >
            {message}
          </p>
        </div>
      </div>

      <span className="loading-sr" role="status" aria-live="polite">
        {label}
      </span>
    </div>
  );
}

export function LoadingBoundary({
  active = false,
  children,
  className = '',
  ...loaderProps
}) {
  const contentRef = useRef(null);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    if ('inert' in HTMLElement.prototype) {
      node.inert = active;
      return () => {
        node.inert = false;
      };
    }

    if (!active) return;
    node.setAttribute('aria-hidden', 'true');
    const focusable = node.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const restore = [];
    focusable.forEach((el) => {
      restore.push([el, el.getAttribute('tabindex')]);
      el.setAttribute('tabindex', '-1');
    });
    return () => {
      node.removeAttribute('aria-hidden');
      restore.forEach(([el, prev]) => {
        if (prev === null) el.removeAttribute('tabindex');
        else el.setAttribute('tabindex', prev);
      });
    };
  }, [active]);

  return (
    <div className={`loading-boundary ${className}`.trim()}>
      <div
        className="loading-content"
        ref={contentRef}
        data-loading-locked={String(active)}
      >
        {children}
      </div>
      <PixelFlameLoader active={active} {...loaderProps} />
    </div>
  );
}

export default LoadingSpinner;

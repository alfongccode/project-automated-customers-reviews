import React from 'react';
import './KarmaBar.styles.css';

const STEPS = [0, 1, 2, 3, 4, 5];
const MIN = 0;
const MAX = 5;

function KarmaBar({ name = 'karma', value = 0, onChange }) {
  function handleChange(ev) {
    const nextValue = Number(ev.target.value);
    onChange?.(nextValue);
  }

  const percent = ((value - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="karma-bar">
      <input
        type="range"
        className="karma-bar-input"
        name={name}
        min={MIN}
        max={MAX}
        step={1}
        value={value}
        onChange={handleChange}
        style={{ '--karma-bar-percent': `${percent}%` }}
        aria-label="Karma level"
      />
      <div className="karma-bar-ticks">
        {STEPS.map((step) => (
          <span
            key={step}
            className={`karma-bar-tick ${step === value ? 'active' : ''}`}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}

export default KarmaBar;

import { useEffect, useRef } from 'react';
import styles from './ParticleField.module.css';

/**
 * Animated particle field for the splash and victory screens.
 * Pure CSS-animated canvas dots — no canvas API needed.
 */
export default function ParticleField({ count = 60, color = '#00f5a0' }) {
  return (
    <div className={styles.field} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const size = Math.random() * 3 + 1;
        const x    = Math.random() * 100;
        const dur  = Math.random() * 12 + 8;
        const del  = Math.random() * 10;
        const opacity = Math.random() * 0.5 + 0.1;
        return (
          <div
            key={i}
            className={styles.particle}
            style={{
              '--x': `${x}%`,
              '--size': `${size}px`,
              '--dur': `${dur}s`,
              '--del': `${-del}s`,
              '--opacity': opacity,
              '--color': color,
            }}
          />
        );
      })}
    </div>
  );
}

import { useEffect, useRef } from 'react';
import { useArrowAngle } from '../hooks/useDeviceOrientation.js';
import { getBearingLabel } from '../data/checkpoints.js';
import styles from './CompassArrow.module.css';

/**
 * CompassArrow
 * The centrepiece screen-space dynamic arrow that rotates in real-time
 * based on device heading vs. target direction.
 */
export default function CompassArrow({ targetDirection, userHeading, color, isFinal }) {
  const angle = useArrowAngle(targetDirection, userHeading);
  const wrapRef = useRef(null);

  // Update transform directly for 60fps without React re-renders
  useEffect(() => {
    if (wrapRef.current) {
      wrapRef.current.style.transform = `rotate(${angle}deg)`;
    }
  }, [angle]);

  const targetLabel = targetDirection !== null
    ? `${targetDirection}° ${getBearingLabel(targetDirection)}`
    : '🏆 FINAL';

  return (
    <div className={styles.wrap}>
      {/* Outer decorative rings */}
      <div className={styles.ringOuter} style={{ '--c': color }} />
      <div className={styles.ringMid}   style={{ '--c': color }} />
      <div className={styles.ringInner} style={{ '--c': color }} />

      {/* Tick marks around compass */}
      <svg className={styles.ticks} viewBox="0 0 200 200">
        {Array.from({ length: 36 }, (_, i) => {
          const a = (i * 10) * Math.PI / 180;
          const isMajor = i % 9 === 0; // N/E/S/W
          const r = 92, len = isMajor ? 10 : 5;
          const x1 = 100 + r * Math.sin(a);
          const y1 = 100 - r * Math.cos(a);
          const x2 = 100 + (r - len) * Math.sin(a);
          const y2 = 100 - (r - len) * Math.cos(a);
          return (
            <line
              key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={color}
              strokeWidth={isMajor ? 2 : 0.8}
              opacity={isMajor ? 0.5 : 0.2}
            />
          );
        })}
        {/* Cardinal labels */}
        {[['N',100,16],['E',184,103],['S',100,192],['W',16,103]].map(([l,x,y]) => (
          <text
            key={l} x={x} y={y}
            textAnchor="middle" dominantBaseline="middle"
            fill={color} fontSize="10" fontWeight="700"
            opacity="0.4" fontFamily="Orbitron,monospace"
          >{l}</text>
        ))}
      </svg>

      {/* The rotating arrow */}
      <div
        ref={wrapRef}
        className={`${styles.arrowWrap} ${isFinal ? styles.finalSpin : ''}`}
        style={{ '--c': color, '--glow': color + '88' }}
      >
        <svg className={styles.arrow} viewBox="0 0 56 100" fill="none">
          <defs>
            <linearGradient id={`ag-${color.replace('#','')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.55" />
            </linearGradient>
            <filter id="arrowGlow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Arrowhead */}
          <polygon
            points="28,2 52,40 36,34 36,90 20,90 20,34 4,40"
            fill={`url(#ag-${color.replace('#','')})`}
            filter="url(#arrowGlow)"
          />
          {/* Tail notch */}
          <polygon points="20,90 28,100 36,90" fill={color} opacity="0.4" />
        </svg>
      </div>

      {/* Center hub */}
      <div className={styles.hub} style={{ '--c': color }}>
        <div className={styles.hubInner} />
      </div>

      {/* Target bearing badge */}
      <div className={styles.bearing} style={{ '--c': color }}>
        <span className={styles.bearingVal}>{targetLabel}</span>
      </div>
    </div>
  );
}

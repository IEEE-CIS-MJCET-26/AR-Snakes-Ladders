import { useState } from 'react';
import ParticleField from './ParticleField.jsx';
const MARKER_ORDER = ['A', 'B', 'C', 'D', 'E'];
const CHECKPOINTS = {
  A: { name: 'Alpha Station', type: 'digit', targetDirection: 60, color: '#00f5a0', gradient: 'linear-gradient(135deg, #00f5a0, #00d9f5)', icon: '🔢' },
  B: { name: 'Beta Crossing', type: 'arrow', targetDirection: 120, color: '#f5c400', gradient: 'linear-gradient(135deg, #f5c400, #f97316)', icon: '🧭' },
  C: { name: 'Charlie Peak', type: 'both', targetDirection: 200, color: '#a855f7', gradient: 'linear-gradient(135deg, #a855f7, #ec4899)', icon: '⚡' },
  D: { name: 'Delta Ridge', type: 'arrow', targetDirection: 300, color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ef4444)', icon: '🔥' },
  E: { name: 'Echo Summit', type: 'both', targetDirection: null, color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #a855f7)', icon: '🏆' }
};
import styles from './SplashScreen.module.css';

const TYPE_COLORS = {
  digit: '#00f5a0',
  arrow: '#f5c400',
  both: '#a855f7',
};

const TYPE_LABELS = {
  digit: '🔢 Digit',
  arrow: '🧭 Arrow',
  both: '✨ Both',
};

export default function SplashScreen({ onLaunch, permissionState, requestPermission }) {
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    if (permissionState === 'unknown') {
      await requestPermission();
    }
    onLaunch();
  };

  return (
    <div className={styles.splash}>
      <ParticleField count={55} color="#00f5a0" />
      <ParticleField count={25} color="#00d9f5" />

      {/* Radial glow blobs */}
      <div className={styles.blob} style={{ '--bx': '15%', '--by': '20%', '--bc': 'rgba(0,245,160,0.12)' }} />
      <div className={styles.blob} style={{ '--bx': '80%', '--by': '65%', '--bc': 'rgba(0,217,245,0.10)' }} />
      <div className={styles.blob} style={{ '--bx': '50%', '--by': '80%', '--bc': 'rgba(168,85,247,0.08)' }} />

      {/* Grid lines */}
      <div className={styles.grid} aria-hidden="true" />

      <div className={styles.content}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <svg className={styles.logoSvg} viewBox="0 0 120 120" fill="none">
            <defs>
              <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f5a0" />
                <stop offset="100%" stopColor="#00d9f5" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Outer rings */}
            <circle cx="60" cy="60" r="55" stroke="url(#lg1)" strokeWidth="0.8" opacity="0.3" />
            <circle cx="60" cy="60" r="44" stroke="url(#lg1)" strokeWidth="0.5" opacity="0.15" />
            {/* Compass ticks */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
              const r = 52, r2 = a % 90 === 0 ? 44 : 47;
              const x1 = 60 + r * Math.sin(a * Math.PI / 180);
              const y1 = 60 - r * Math.cos(a * Math.PI / 180);
              const x2 = 60 + r2 * Math.sin(a * Math.PI / 180);
              const y2 = 60 - r2 * Math.cos(a * Math.PI / 180);
              return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#lg1)" strokeWidth={a % 90 === 0 ? 1.5 : 0.8} opacity={a % 90 === 0 ? 0.6 : 0.3} />;
            })}
            {/* North arrow */}
            <polygon points="60,14 64,44 60,50 56,44" fill="url(#lg1)" filter="url(#glow)" />
            <polygon points="60,106 56,75 60,69 64,75" fill="url(#lg1)" opacity="0.35" />
            {/* Center dot */}
            <circle cx="60" cy="60" r="5" fill="url(#lg1)" filter="url(#glow)" />
            <circle cx="60" cy="60" r="2" fill="#fff" opacity="0.9" />
          </svg>
          <div className={styles.logoPulse} />
        </div>

        {/* Title */}
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>
            Trail<span className={styles.accent}>Blaze</span>
            <span className={styles.arBadge}>AR</span>
          </h1>
          <p className={styles.tagline}>
            <span className={styles.tagWord}>Scan</span>
            <span className={styles.tagDot}>·</span>
            <span className={styles.tagWord}>Collect</span>
            <span className={styles.tagDot}>·</span>
            <span className={styles.tagWord}>Navigate</span>
          </p>
        </div>

        {/* Description */}
        <p className={styles.desc}>
          An augmented reality treasure hunt. Scan physical AR markers, collect
          digit clues, and follow dynamic arrows to hidden checkpoints.
        </p>

        {/* Route map */}
        <div className={styles.routeCard}>
          <div className={styles.routeLabel}>YOUR ROUTE</div>
          <div className={styles.routeRow}>
            {MARKER_ORDER.map((id, i) => {
              const cp = CHECKPOINTS[id];
              return (
                <div key={id} className={styles.routeStep}>
                  <div
                    className={styles.routeDot}
                    style={{
                      background: cp.gradient,
                      boxShadow: `0 0 14px ${cp.color}55`,
                    }}
                  >
                    {cp.icon}
                  </div>
                  <span className={styles.routeName}>{cp.name.split(' ')[0]}</span>
                  <span
                    className={styles.routeType}
                    style={{ color: TYPE_COLORS[cp.type] }}
                  >
                    {TYPE_LABELS[cp.type]}
                  </span>
                  {i < MARKER_ORDER.length - 1 && (
                    <div className={styles.routeLine}>
                      <div
                        className={styles.routeLineInner}
                        style={{ background: cp.gradient }}
                      />
                      <span className={styles.routeBearing}>
                        {cp.targetDirection}°
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats row */}
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statVal}>5</span>
            <span className={styles.statLab}>Checkpoints</span>
          </div>
          <div className={styles.statDiv} />
          <div className={styles.stat}>
            <span className={styles.statVal}>3</span>
            <span className={styles.statLab}>Digit Clues</span>
          </div>
          <div className={styles.statDiv} />
          <div className={styles.stat}>
            <span className={styles.statVal}>AR</span>
            <span className={styles.statLab}>Marker-Based</span>
          </div>
        </div>

        {/* Launch button */}
        <button
          id="launch-btn"
          className={styles.launchBtn}
          onClick={handleStart}
          disabled={loading}
        >
          {loading ? (
            <span className={styles.spinner} />
          ) : (
            <>
              <span className={styles.btnGlow} />
              <span className={styles.btnIcon}>
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                  <path d="M5 3l14 9-14 9V3z" fill="currentColor" />
                </svg>
              </span>
              Launch Trailblazer
            </>
          )}
        </button>

        <p className={styles.permNote}>
          📷 Camera · 🧭 Motion sensor access required
        </p>
      </div>
    </div>
  );
}

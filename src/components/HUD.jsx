import CompassArrow from './CompassArrow.jsx';
import { CHECKPOINTS, MARKER_ORDER } from '../data/checkpoints.js';
import styles from './HUD.module.css';

/**
 * HUD — full screen heads-up display overlay
 * Shown over the AR camera view
 */
export default function HUD({
  activeMarker,
  visitedMarkers,
  collectedDigits,
  progressPct,
  nextUnvisited,
  userHeading,
  simulateNextMarker,
  demoIndex,
}) {
  const cp = activeMarker ? CHECKPOINTS[activeMarker] : null;
  const showArrow  = cp && (cp.type === 'arrow' || cp.type === 'both');
  const showDigit  = cp && (cp.type === 'digit' || cp.type === 'both') && cp.digit !== null;
  const isFinal    = cp?.targetDirection === null;
  const nextCp     = nextUnvisited ? CHECKPOINTS[nextUnvisited] : null;

  return (
    <div className={styles.hud}>

      {/* ── TOP BAR ── */}
      <div className={styles.topBar}>
        <div className={styles.topLeft}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>⬡</span>
            <span className={styles.logoText}>
              Trail<span className={styles.accent}>Blaze</span>
              <span className={styles.arTag}>AR</span>
            </span>
          </div>
          {cp && (
            <div
              className={styles.cpChip}
              style={{ '--c': cp.color, '--bg': cp.colorDim }}
            >
              <span className={styles.cpIcon}>{cp.icon}</span>
              <span className={styles.cpName}>{cp.name}</span>
            </div>
          )}
          {!cp && (
            <div className={styles.scanChip}>
              <div className={styles.scanDot} />
              <span>Scanning for markers…</span>
            </div>
          )}
        </div>

        {/* Progress dots */}
        <div className={styles.progress}>
          {MARKER_ORDER.map(id => {
            const isVisited = visitedMarkers.has(id);
            const isActive  = id === nextUnvisited && !activeMarker;
            const isCurrent = id === activeMarker;
            const dotCp = CHECKPOINTS[id];
            return (
              <div
                key={id}
                className={`${styles.dot}
                  ${isVisited  ? styles.dotVisited  : ''}
                  ${isCurrent  ? styles.dotCurrent  : ''}
                  ${isActive   ? styles.dotActive   : ''}
                `}
                style={{
                  '--c': dotCp.color,
                  '--g': dotCp.gradient,
                }}
                title={dotCp.name}
              >
                {isVisited ? '✓' : id}
              </div>
            );
          })}
          <div className={styles.trackBar}>
            <div
              className={styles.trackFill}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── CENTER CONTENT ── */}
      <div className={styles.center}>
        {showArrow && (
          <div className={styles.arrowZone}>
            <CompassArrow
              targetDirection={cp.targetDirection}
              userHeading={userHeading}
              color={cp.color}
              isFinal={isFinal}
            />
          </div>
        )}

        {!cp && (
          <div className={styles.idleCenter}>
            <div className={styles.idleRing}>
              <svg viewBox="0 0 120 120" className={styles.idleSvg}>
                <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1" fill="none" strokeDasharray="4 6" />
                <circle cx="60" cy="60" r="36" stroke="rgba(0,245,160,0.15)"
                  strokeWidth="1" fill="none" />
              </svg>
              <div className={styles.idleLabel}>
                <span className={styles.idleIcon}>📷</span>
                <span>Point at a marker</span>
              </div>
            </div>
            {nextCp && (
              <div
                className={styles.nextHint}
                style={{ '--c': nextCp.color }}
              >
                <span className={styles.nextIcon}>{nextCp.icon}</span>
                <div>
                  <div className={styles.nextLabel}>FIND NEXT</div>
                  <div className={styles.nextName}>{nextCp.name}</div>
                  <div className={styles.nextHintText}>{nextCp.hint}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className={styles.bottomBar}>

        {/* Heading display */}
        <div className={styles.headingRow}>
          <div className={styles.hdgItem}>
            <span className={styles.hdgLabel}>HEADING</span>
            <span className={styles.hdgVal}>{Math.round(userHeading)}°</span>
          </div>
          {cp?.targetDirection !== null && cp?.targetDirection !== undefined && (
            <div className={styles.hdgItem}>
              <span className={styles.hdgLabel}>TARGET</span>
              <span className={styles.hdgVal} style={{ color: cp.color }}>
                {cp.targetDirection}°
              </span>
            </div>
          )}
          <div className={styles.hdgItem}>
            <span className={styles.hdgLabel}>FOUND</span>
            <span className={styles.hdgVal}>{visitedMarkers.size} / 5</span>
          </div>
        </div>

        {/* Digit readout */}
        {showDigit && (
          <div
            className={styles.digitPanel}
            style={{ '--c': cp.color, '--bg': cp.colorDim, '--g': cp.gradient }}
          >
            <div className={styles.digitLabel}>COLLECTED DIGIT</div>
            <div className={styles.digitValue}>{cp.digit}</div>
            <div className={styles.digitHint}>From {cp.name}</div>
          </div>
        )}

        {/* Collected clues row */}
        {Object.keys(collectedDigits).length > 0 && (
          <div className={styles.clueRow}>
            <span className={styles.clueLabel}>Clue Bank:</span>
            {Object.entries(collectedDigits).map(([id, digit]) => {
              const dcp = CHECKPOINTS[id];
              return (
                <div
                  key={id}
                  className={styles.clueChip}
                  style={{ '--c': dcp.color }}
                >
                  <span className={styles.clueId}>{dcp.name.split(' ')[0][0]}</span>
                  <span className={styles.clueDigit}>{digit}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Demo button */}
        {demoIndex < 5 && (
          <button
            id="simulate-btn"
            className={styles.demoBtn}
            onClick={simulateNextMarker}
          >
            <span className={styles.demoBtnGlow} />
            🎭 Simulate: {CHECKPOINTS[MARKER_ORDER[demoIndex]]?.name}
          </button>
        )}
      </div>
    </div>
  );
}

import CompassArrow from './CompassArrow.jsx';
import styles from './HUD.module.css';

const MARKER_ORDER = ['A', 'B', 'C', 'D', 'E'];
const CHECKPOINTS = {
  A: { name: 'Alpha Station', type: 'digit', digit: 7, targetDirection: 60, color: '#00f5a0', colorDim: 'rgba(0,245,160,0.15)', gradient: 'linear-gradient(135deg, #00f5a0, #00d9f5)', icon: '🔢', hint: 'Find the HIRO marker', nextHint: 'Head 60° (NNE) to find Beta Crossing' },
  B: { name: 'Beta Crossing', type: 'arrow', targetDirection: 120, color: '#f5c400', colorDim: 'rgba(245,196,0,0.15)', gradient: 'linear-gradient(135deg, #f5c400, #f97316)', icon: '🧭', hint: 'Find the KANJI marker', nextHint: 'Head 120° (ESE) to find Charlie Peak' },
  C: { name: 'Charlie Peak', type: 'both', digit: 3, targetDirection: 200, color: '#a855f7', colorDim: 'rgba(168,85,247,0.15)', gradient: 'linear-gradient(135deg, #a855f7, #ec4899)', icon: '⚡', hint: 'Find the LETTER-A marker', nextHint: 'Head 200° (SSW) to find Delta Ridge' },
  D: { name: 'Delta Ridge', type: 'arrow', targetDirection: 300, color: '#f97316', colorDim: 'rgba(249,115,22,0.15)', gradient: 'linear-gradient(135deg, #f97316, #ef4444)', icon: '🔥', hint: 'Find the LETTER-B marker', nextHint: 'Head 300° (WNW) to find Echo Summit' },
  E: { name: 'Echo Summit', type: 'both', digit: 9, targetDirection: null, color: '#ec4899', colorDim: 'rgba(236,72,153,0.15)', gradient: 'linear-gradient(135deg, #ec4899, #a855f7)', icon: '🏆', hint: 'Find the LETTER-C marker', nextHint: "You've reached the final checkpoint!" }
};

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
  const showArrow = cp && (cp.type === 'arrow' || cp.type === 'both');
  const showDigit = cp && (cp.type === 'digit' || cp.type === 'both') && cp.digit !== null;
  const isFinal = cp?.targetDirection === null;
  const nextCp = nextUnvisited ? CHECKPOINTS[nextUnvisited] : null;

  return (
    <div className={styles.hud}>
      
      {/* ── BACKGROUND ── */}
      <div className={styles.hudBg} />
      <div className={styles.hudGridOverlay} />
      <div className={styles.hudGlow1} />
      <div className={styles.hudGlow2} />

      {/* ── ZONE 1: TOP BAR ── */}
      <div className={styles.topBar}>
        <div className={styles.topLeft}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>⬡</span>
            <span className={styles.logoText}>
              Trail<span className={styles.accent}>Blaze</span>
              <span className={styles.arTag}>AR</span>
            </span>
          </div>
          <div className={styles.topRightGrp}>
            {cp ? (
              <div
                className={styles.cpChip}
                style={{ '--c': cp.color, '--bg': cp.colorDim }}
              >
                <span className={styles.cpIcon}>{cp.icon}</span>
                <span className={styles.cpName}>{cp.name}</span>
              </div>
            ) : (
              <div className={styles.scanChip}>
                <div className={styles.scanDot} />
                <span>Scanning...</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress track */}
        <div className={styles.progress}>
          <div className={styles.trackBar}>
            <div className={styles.trackFill} style={{ width: `${progressPct}%` }} />
          </div>
          {MARKER_ORDER.map(id => {
            const isVisited = visitedMarkers.has(id);
            const isActive = id === nextUnvisited && !activeMarker;
            const isCurrent = id === activeMarker;
            const dotCp = CHECKPOINTS[id];
            return (
              <div
                key={id}
                className={`${styles.dot}
                  ${isVisited ? styles.dotVisited : ''}
                  ${isCurrent ? styles.dotCurrent : ''}
                  ${isActive ? styles.dotActive : ''}
                `}
                style={{ '--c': dotCp.color, '--g': dotCp.gradient }}
                title={dotCp.name}
              >
                {isVisited ? '✓' : id}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ZONE 2: CENTER ── */}
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

        {showDigit && (
          <div
            className={styles.digitCard}
            style={{ '--c': cp.color, '--bg': cp.colorDim, '--g': cp.gradient }}
          >
            <div className={styles.digitInner}>
              <div className={styles.digitLabel}>DATA EXTRACTED</div>
              <div className={styles.digitValueWrap}>
                <div className={styles.digitValueGlow}>{cp.digit}</div>
                <div className={styles.digitValue}>{cp.digit}</div>
              </div>
              <div className={styles.digitHint}>Origin: {cp.name}</div>
            </div>
          </div>
        )}

        {!cp && (
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
        )}
      </div>

      {/* ── ZONE 3: NEXT HINT CARD ── */}
      {nextCp && (
        <div className={styles.nextHintOuter}>
          <div className={styles.nextHintCard} style={{ '--c': nextCp.color, '--bg': nextCp.colorDim }}>
            <div className={styles.nextHintIconWrap}>
              <span className={styles.nextHintIcon}>📡</span>
            </div>
            <div className={styles.nextHintContent}>
              <div className={styles.nextHintLabel}>OBJECTIVE DETECTED</div>
              <div className={styles.nextHintTarget} style={{ color: nextCp.color }}>{nextCp.name}</div>
              <div className={styles.nextHintText}>{nextCp.hint}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── ZONE 4: BOTTOM BAR ── */}
      <div className={styles.bottomBar}>
        {/* Modern 3-Card Stats Row */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>🧭</span>
            <div className={styles.statText}>
              <span className={styles.statVal}>{Math.round(userHeading)}°</span>
              <span className={styles.statLabel}>HEADING</span>
            </div>
          </div>
          {cp?.targetDirection !== null && cp?.targetDirection !== undefined && (
            <div className={styles.statCardTarget} style={{ '--c': cp.color, '--bg': cp.colorDim }}>
              <span className={styles.statIcon}>🎯</span>
              <div className={styles.statText}>
                <span className={styles.statVal} style={{ color: cp.color }}>{cp.targetDirection}°</span>
                <span className={styles.statLabel}>TARGET</span>
              </div>
            </div>
          )}
          <div className={styles.statCard}>
            <span className={styles.statIcon}>🔋</span>
            <div className={styles.statText}>
              <span className={styles.statVal}>{visitedMarkers.size} / 5</span>
              <span className={styles.statLabel}>FOUND</span>
            </div>
          </div>
        </div>

        {/* Clue Bank */}
        {Object.keys(collectedDigits).length > 0 && (
          <div className={styles.clueRow}>
            <span className={styles.clueLabel}>DATA BANK</span>
            <div className={styles.clueChips}>
              {Object.entries(collectedDigits).map(([id, digit]) => {
                const dcp = CHECKPOINTS[id];
                return (
                  <div key={id} className={styles.clueChip} style={{ '--c': dcp.color, '--bg': dcp.colorDim }}>
                    <span className={styles.clueId}>{dcp.name.split(' ')[0][0]}</span>
                    <span className={styles.clueDigit}>{digit}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Demo Button */}
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

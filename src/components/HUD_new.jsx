import styles from "./HUD.module.css";

export default function HUD({
  position,
  turnNumber,
  moveHistory,
  lastSymbolHit,
}) {
  return (
    <div className={styles.hud}>
      <header className={styles.topBar}>
        <div className={styles.brand}>Snakes and Ladders</div>
        <div className={styles.statRow}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Position</span>
            <span className={styles.statValue}>{position}/16</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Turn</span>
            <span className={styles.statValue}>{turnNumber}</span>
          </div>
        </div>
      </header>

      <section className={styles.bottomPanel}>
        <div className={styles.panelHeader}>
          <h2>Move History</h2>
          <span>{moveHistory.length} moves</span>
        </div>

        <div className={styles.historyList}>
          {moveHistory.length === 0 ? (
            <p className={styles.empty}>No moves yet</p>
          ) : (
            moveHistory
              .slice()
              .reverse()
              .map((move, idx) => (
                <div
                  key={`${move.timestamp}-${idx}`}
                  className={styles.historyItem}
                >
                  <span className={styles.turn}>#{move.turnNumber}</span>
                  <span className={styles.path}>
                    {move.positionBefore} to {move.finalPosition}
                  </span>
                  <span className={styles.symbol}>
                    {move.symbolHit?.name || "-"}
                  </span>
                </div>
              ))
          )}
        </div>
      </section>

      {lastSymbolHit && (
        <div className={styles.lastHit}>Last hit: {lastSymbolHit.name}</div>
      )}
    </div>
  );
}

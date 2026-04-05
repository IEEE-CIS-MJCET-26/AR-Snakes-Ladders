import styles from "./GameOverScreen.module.css";

export default function GameOverScreen({
  position,
  turnNumber,
  moveHistory,
  onRestart,
}) {
  return (
    <section className={styles.screen}>
      <div className={styles.card}>
        <p className={styles.kicker}>Result</p>
        <h1 className={styles.title}>Game Over</h1>
        <p className={styles.message}>You hit the instant-kill snake.</p>

        <div className={styles.stats}>
          <div>
            <span>Position</span>
            <strong>{position}</strong>
          </div>
          <div>
            <span>Turns</span>
            <strong>{turnNumber}</strong>
          </div>
          <div>
            <span>Moves</span>
            <strong>{moveHistory.length}</strong>
          </div>
        </div>

        <button className={styles.button} onClick={onRestart}>
          Try Again
        </button>
      </div>
    </section>
  );
}

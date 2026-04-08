import styles from "./VictoryScreen.module.css";

export default function VictoryScreen({
  position,
  turnNumber,
  moveHistory,
  onRestart,
}) {
  return (
    <section className={styles.screen}>
      <div className={styles.card}>
        <p className={styles.kicker}>Result</p>
        <h1 className={styles.title}>You Win</h1>
        <p className={styles.message}>You reached square 16.</p>

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
          Play Again
        </button>
      </div>
    </section>
  );
}

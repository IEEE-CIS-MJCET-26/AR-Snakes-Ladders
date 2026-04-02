import ParticleField from './ParticleField.jsx';
import styles from './VictoryScreen.module.css';

/**
 * VictoryScreen
 * Displayed when all 5 checkpoints have been found.
 * Reveals the final 3-digit secret code.
 */
export default function VictoryScreen({ secretCode, onRestart }) {
  // Pad with dashes if incomplete (should not happen in normal flow)
  const codeDisplay = [...secretCode, '-', '-', '-'].slice(0, 3);

  return (
    <div className={styles.victory}>
      <ParticleField count={80} color="#ec4899" />
      <ParticleField count={40} color="#a855f7" />

      <div className={styles.bgBlobs}>
        <div className={styles.blob} style={{ '--c': 'rgba(236,72,153,0.15)', '--x': '20%', '--y': '30%' }} />
        <div className={styles.blob} style={{ '--c': 'rgba(168,85,247,0.12)', '--x': '80%', '--y': '70%' }} />
      </div>

      <div className={styles.content}>
        <div className={styles.trophyWrap}>
          <div className={styles.trophyGlow} />
          <span className={styles.trophyIcon}>🏆</span>
        </div>

        <h2 className={styles.title}>Trail Complete!</h2>
        <p className={styles.sub}>You've successfully found all 5 checkpoints.</p>

        <div className={styles.codeReveal}>
          <p className={styles.codeLabel}>THE SECRET CODE</p>
          <div className={styles.codeDigits}>
            {codeDisplay.map((digit, i) => (
              <span key={i} className={styles.digitBox} style={{ '--del': `${i * 0.2}s` }}>
                {digit}
              </span>
            ))}
          </div>
        </div>

        <button className={styles.restartBtn} onClick={onRestart}>
          <span className={styles.restartIcon}>🔄</span> Play Again
        </button>
      </div>
    </div>
  );
}

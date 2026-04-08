import { SYMBOLS } from "../hooks/useGameState.js";
import styles from "./SplashScreen.module.css";

export default function SplashScreen({
  onLaunch,
  permissionState,
  requestPermission,
}) {
  const handleStart = async () => {
    if (permissionState === "unknown") {
      await requestPermission();
    }
    onLaunch();
  };

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <p className={styles.kicker}>AR Board Game</p>
        <h1 className={styles.title}>Snakes and Ladders</h1>
        <p className={styles.subtitle}>
          Scan one barcode at a time to move. Reach square 16 to win.
        </p>

        <div className={styles.legend}>
          {Object.values(SYMBOLS).map((symbol) => (
            <div key={symbol.barcode} className={styles.legendItem}>
              <div className={styles.code}>Code {symbol.barcode}</div>
              <div className={styles.name}>{symbol.name}</div>
              <div className={styles.effect}>{symbol.description}</div>
            </div>
          ))}
        </div>

        <button className={styles.button} onClick={handleStart}>
          Start Game
        </button>

        <p className={styles.note}>
          Camera and motion sensor permissions are required.
        </p>
      </div>
    </div>
  );
}

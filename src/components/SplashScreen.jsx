import { SYMBOLS } from "../hooks/useGameState.js";
import styles from "./SplashScreen.module.css";
import adsophosLogo from "../assets/logos/adsophos.png";
import whiteLogo from "../assets/logos/white-logo.png";

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
      <div className={styles.logoHeader}>
        <img src={adsophosLogo} alt="Adsophos" className={styles.headerLogo} />
        <img
          src={whiteLogo}
          alt="IEEE CIS Logo"
          className={styles.headerLogo}
        />
      </div>
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
      <p className={styles.copyright}>© 2026 IEEE CIS MJCET. All rights reserved.</p>
    </div>
  );
}

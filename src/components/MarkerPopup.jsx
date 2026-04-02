import { useEffect, useState } from 'react';
import styles from './MarkerPopup.module.css';

/**
 * MarkerPopup
 * Animated notification that slides in when a new marker is detected.
 */
export default function MarkerPopup({ lastFound }) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (!lastFound) return;
    setCurrent(lastFound.cp);
    setVisible(true);

    const t = setTimeout(() => setVisible(false), 3500);
    return () => clearTimeout(t);
  }, [lastFound]);

  if (!current) return null;

  return (
    <div
      className={`${styles.popup} ${visible ? styles.visible : styles.hidden}`}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.track} style={{ '--c': current.color, background: current.gradient }}>
        <div className={styles.icon}>{current.icon}</div>
        <div className={styles.body}>
          <div className={styles.title}>{current.name}</div>
          <div className={styles.sub}>{current.subtitle}</div>
        </div>
        <div className={styles.badge}>
          {current.type === 'digit'
            ? <span className={styles.digitBadge}>{current.digit}</span>
            : current.type === 'arrow'
            ? <span className={styles.arrowBadge}>→</span>
            : <span className={styles.bothBadge}>✨</span>}
        </div>
      </div>
      <div className={styles.hint}>{current.nextHint}</div>
    </div>
  );
}

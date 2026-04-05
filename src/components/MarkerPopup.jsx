import { useEffect, useState } from "react";
import styles from "./MarkerPopup.module.css";

export default function MarkerPopup({ lastSymbolHit }) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (!lastSymbolHit) return;
    setCurrent(lastSymbolHit);
    setVisible(true);

    const t = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(t);
  }, [lastSymbolHit]);

  if (!current) return null;

  return (
    <aside
      className={`${styles.toast} ${visible ? styles.visible : styles.hidden}`}
      role="status"
      aria-live="polite"
    >
      <strong>{current.name}</strong>
      <span>{current.description}</span>
    </aside>
  );
}

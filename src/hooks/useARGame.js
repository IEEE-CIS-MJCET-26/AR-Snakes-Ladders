import { useState, useEffect, useRef, useCallback } from 'react';
import { MARKER_ORDER, CHECKPOINTS, DIGIT_MARKERS } from '../data/checkpoints.js';

/**
 * useARGame
 * Core game state manager. Handles:
 *  - AR marker detection via A-Frame events
 *  - Progress / visited tracking
 *  - Digit collection
 *  - Demo simulation mode
 */
export function useARGame() {
  const [phase, setPhase] = useState('splash'); // splash | ar | victory
  const [activeMarker, setActiveMarker] = useState(null);
  const [visitedMarkers, setVisitedMarkers] = useState(new Set());
  const [collectedDigits, setCollectedDigits] = useState({});
  const [lastFound, setLastFound] = useState(null);   // { cp, timestamp }
  const [demoIndex, setDemoIndex] = useState(0);
  const lostTimerRef = useRef(null);

  // Register A-Frame marker event listeners once AR phase begins
  useEffect(() => {
    if (phase !== 'ar') return;

    const handlers = [];

    MARKER_ORDER.forEach(id => {
      const el = document.getElementById(`marker-${id}`);
      if (!el) return;

      const onFound = () => handleMarkerFound(id);
      const onLost  = () => handleMarkerLost(id);

      el.addEventListener('markerFound', onFound);
      el.addEventListener('markerLost',  onLost);

      handlers.push({ el, onFound, onLost });
    });

    return () => {
      handlers.forEach(({ el, onFound, onLost }) => {
        el.removeEventListener('markerFound', onFound);
        el.removeEventListener('markerLost',  onLost);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleMarkerFound = useCallback((id) => {
    setActiveMarker(id);

    // Show popup
    setLastFound({ cp: CHECKPOINTS[id], timestamp: Date.now() });

    setVisitedMarkers(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);

      const cp = CHECKPOINTS[id];

      // Collect digit
      if ((cp.type === 'digit' || cp.type === 'both') && cp.digit !== null) {
        setCollectedDigits(d => ({ ...d, [id]: cp.digit }));
      }

      // Victory after all 5 visited
      if (next.size === MARKER_ORDER.length) {
        setTimeout(() => setPhase('victory'), 3000);
      }

      return next;
    });
  }, []);

  const handleMarkerLost = useCallback((id) => {
    // Small debounce to avoid flicker
    lostTimerRef.current = setTimeout(() => {
      setActiveMarker(prev => prev === id ? null : prev);
    }, 800);
  }, []);

  // Demo: simulate finding next unvisited marker
  const simulateNextMarker = useCallback(() => {
    if (demoIndex >= MARKER_ORDER.length) return;
    const id = MARKER_ORDER[demoIndex];
    handleMarkerFound(id);
    setDemoIndex(i => i + 1);

    // Auto-lose after 4.5s
    setTimeout(() => handleMarkerLost(id), 4500);
  }, [demoIndex, handleMarkerFound, handleMarkerLost]);

  const launch = useCallback(() => setPhase('ar'), []);
  const restart = useCallback(() => {
    setPhase('splash');
    setActiveMarker(null);
    setVisitedMarkers(new Set());
    setCollectedDigits({});
    setLastFound(null);
    setDemoIndex(0);
  }, []);

  // Derived values
  const progressPct = visitedMarkers.size === 0 ? 0
    : ((visitedMarkers.size - 1) / (MARKER_ORDER.length - 1)) * 100;

  const secretCode = DIGIT_MARKERS.map(id => collectedDigits[id] ?? null);

  const nextUnvisited = MARKER_ORDER.find(id => !visitedMarkers.has(id)) ?? null;

  return {
    phase, launch, restart,
    activeMarker,
    visitedMarkers,
    collectedDigits,
    lastFound,
    progressPct,
    secretCode,
    nextUnvisited,
    simulateNextMarker,
    demoIndex,
  };
}

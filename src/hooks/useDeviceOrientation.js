import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useDeviceOrientation
 * Tracks device compass heading via DeviceOrientationEvent.
 * Returns: { heading, cardinal, tilt, permissionState, requestPermission }
 */
export function useDeviceOrientation() {
  const [heading, setHeading] = useState(0);
  const [tilt, setTilt] = useState({ beta: 0, gamma: 0 });
  const [permissionState, setPermissionState] = useState('unknown'); // 'unknown'|'granted'|'denied'|'not-required'
  const smoothed = useRef(0);

  const handleOrientation = useCallback((e) => {
    let raw = 0;

    if (e.webkitCompassHeading !== undefined) {
      // iOS — directly gives compass bearing
      raw = e.webkitCompassHeading;
    } else if (e.alpha !== null && e.alpha !== undefined) {
      // Android — alpha is 0 at North, increases CCW
      raw = 360 - e.alpha;
      if (raw >= 360) raw -= 360;
    }

    // Exponential moving average smoothing
    let diff = raw - smoothed.current;
    while (diff > 180)  diff -= 360;
    while (diff < -180) diff += 360;
    smoothed.current = (smoothed.current + diff * 0.15 + 360) % 360;

    setHeading(Math.round(smoothed.current));
    setTilt({ beta: Math.round(e.beta ?? 0), gamma: Math.round(e.gamma ?? 0) });
  }, []);

  const startListening = useCallback(() => {
    window.addEventListener('deviceorientation', handleOrientation, true);
  }, [handleOrientation]);

  const requestPermission = useCallback(async () => {
    if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
      try {
        const result = await DeviceOrientationEvent.requestPermission();
        setPermissionState(result);
        if (result === 'granted') startListening();
      } catch {
        setPermissionState('denied');
      }
    } else {
      setPermissionState('not-required');
      startListening();
    }
  }, [startListening]);

  // Auto-try on desktop / Android (no permission needed)
  useEffect(() => {
    if (typeof DeviceOrientationEvent?.requestPermission !== 'function') {
      setPermissionState('not-required');
      startListening();
    }
    return () => window.removeEventListener('deviceorientation', handleOrientation, true);
  }, [handleOrientation, startListening]);

  return { heading, tilt, permissionState, requestPermission };
}

/**
 * useArrowAngle
 * Computes the smoothed screen-space arrow rotation toward a target compass bearing.
 */
export function useArrowAngle(targetDegrees, userHeading) {
  const [angle, setAngle] = useState(0);
  const smoothedRef = useRef(0);
  const rafRef = useRef(null);
  const isFinal = targetDegrees === null;

  useEffect(() => {
    let frame = 0;

    const tick = () => {
      if (isFinal) {
        // Spin for final checkpoint
        smoothedRef.current = (smoothedRef.current + 1.2) % 360;
      } else {
        const raw = ((targetDegrees - userHeading) % 360 + 360) % 360;
        const adjusted = raw > 180 ? raw - 360 : raw;
        let diff = adjusted - smoothedRef.current;
        while (diff > 180)  diff -= 360;
        while (diff < -180) diff += 360;
        smoothedRef.current += diff * 0.12;
      }
      setAngle(Math.round(smoothedRef.current * 10) / 10);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [targetDegrees, userHeading, isFinal]);

  return angle;
}

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useDeviceOrientation
 *
 * Returns a smoothed compass heading (0-360°) from device orientation sensors.
 *
 * Handles:
 *  - iOS 13+ permission model (DeviceOrientationEvent.requestPermission)
 *  - Android absolute orientation (deviceorientationabsolute)
 *  - Fallback to deviceorientation with webkitCompassHeading (Safari)
 *  - Low-pass filter for jitter smoothing
 */

// ── Smoothing helpers ──────────────────────────────────────

const SMOOTHING = 0.25; // lower = more smoothing (0-1)

/** Shortest-arc interpolation between two angles */
function lerpAngle(from, to, t) {
  let diff = ((to - from + 540) % 360) - 180;
  return ((from + diff * t) % 360 + 360) % 360;
}

// ── Permission states ──────────────────────────────────────
// 'unknown'  – haven't asked yet (or Android, where no ask is needed)
// 'granted'  – user said yes
// 'denied'   – user said no
// 'unsupported' – browser doesn't have orientation events at all

function detectInitialState() {
  if (typeof DeviceOrientationEvent === 'undefined') return 'unsupported';
  // iOS gate
  if (typeof DeviceOrientationEvent.requestPermission === 'function') return 'unknown';
  // Android / desktop – permission not required
  return 'granted';
}

// ── Hook ───────────────────────────────────────────────────

export default function useDeviceOrientation() {
  const [heading, setHeading] = useState(0);
  const [permissionState, setPermissionState] = useState(detectInitialState);
  const smoothRef = useRef(0);
  const rafRef = useRef(null);
  const latestRaw = useRef(null);

  // ── iOS permission request (must be triggered by user gesture) ──
  const requestPermission = useCallback(async () => {
    if (typeof DeviceOrientationEvent === 'undefined') {
      setPermissionState('unsupported');
      return 'unsupported';
    }
    if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
      // Android: no gating
      setPermissionState('granted');
      return 'granted';
    }
    try {
      const result = await DeviceOrientationEvent.requestPermission();
      setPermissionState(result); // 'granted' | 'denied'
      return result;
    } catch {
      setPermissionState('denied');
      return 'denied';
    }
  }, []);

  // ── Sensor listener ──────────────────────────────────────
  useEffect(() => {
    if (permissionState !== 'granted') return;

    let eventName = 'deviceorientation';

    const handler = (e) => {
      let raw = null;

      // 1. webkitCompassHeading (iOS Safari) — most reliable on iOS
      if (e.webkitCompassHeading != null) {
        raw = e.webkitCompassHeading;
      }
      // 2. absolute orientation (Android Chrome)
      else if (e.absolute && e.alpha != null) {
        // alpha is the compass heading relative to magnetic north
        // but measured counter-clockwise in the spec, so invert
        raw = (360 - e.alpha) % 360;
      }
      // 3. Non-absolute orientation fallback
      else if (e.alpha != null) {
        raw = (360 - e.alpha) % 360;
      }

      if (raw !== null) {
        latestRaw.current = raw;
      }
    };

    // Try absolute first (Android prefers this)
    const hasAbsolute = 'ondeviceorientationabsolute' in window;
    if (hasAbsolute) {
      eventName = 'deviceorientationabsolute';
    }

    window.addEventListener(eventName, handler, { passive: true });

    // Also listen to the non-absolute event as a fallback
    // (some devices only fire the non-absolute one)
    let fallbackName = null;
    if (hasAbsolute) {
      fallbackName = 'deviceorientation';
      window.addEventListener(fallbackName, handler, { passive: true });
    }

    // ── Smoothing loop (60fps) ──
    const tick = () => {
      if (latestRaw.current !== null) {
        smoothRef.current = lerpAngle(smoothRef.current, latestRaw.current, SMOOTHING);
        setHeading(Math.round(smoothRef.current * 10) / 10);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener(eventName, handler);
      if (fallbackName) window.removeEventListener(fallbackName, handler);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [permissionState]);

  return { heading, permissionState, requestPermission };
}

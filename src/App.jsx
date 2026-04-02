import { useEffect } from 'react';
import { useARGame } from './hooks/useARGame.js';
import { useDeviceOrientation } from './hooks/useDeviceOrientation.js';
import SplashScreen from './components/SplashScreen.jsx';
import HUD from './components/HUD.jsx';
import VictoryScreen from './components/VictoryScreen.jsx';
import MarkerPopup from './components/MarkerPopup.jsx';
import ARScene from './components/ARScene.jsx';

/**
 * Main Application Component
 */
export default function App() {
  const { heading, permissionState, requestPermission } = useDeviceOrientation();
  const game = useARGame();

  // Sync active marker visibility with A-Frame elements
  // This bridges React's state to A-Frame's imperative API
  useEffect(() => {
    ['A', 'B', 'C', 'D', 'E'].forEach(id => {
      const el = document.getElementById(`content-${id}`);
      if (el) {
        el.setAttribute('visible', game.activeMarker === id ? 'true' : 'false');
      }
    });
  }, [game.activeMarker]);

  return (
    <div className="app-container">
      {/* Splash Screen */}
      {game.phase === 'splash' && (
        <SplashScreen
          onLaunch={game.launch}
          permissionState={permissionState}
          requestPermission={requestPermission}
        />
      )}

      {/* AR Mode (HUD and popups) */}
      {game.phase === 'ar' && (
        <>
          {/* Always render ARScene but maybe hide it, or just let it run. 
              Actually it's better if it's rendered when 'ar' starts.
              Since it relies on global A-Frame, we can conditionally render it. */}
          <ARScene />
          
          <HUD
            activeMarker={game.activeMarker}
            visitedMarkers={game.visitedMarkers}
            collectedDigits={game.collectedDigits}
            progressPct={game.progressPct}
            nextUnvisited={game.nextUnvisited}
            userHeading={heading}
            simulateNextMarker={game.simulateNextMarker}
            demoIndex={game.demoIndex}
          />
          <MarkerPopup lastFound={game.lastFound} />
        </>
      )}

      {/* Victory Screen */}
      {game.phase === 'victory' && (
        <>
          <ARScene /> {/* Keep AR in bg if we want, or remove it */}
          <VictoryScreen
            secretCode={game.secretCode}
            onRestart={game.restart}
          />
        </>
      )}
    </div>
  );
}

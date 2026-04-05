import SplashScreen from "./components/SplashScreen.jsx";
import HUD from "./components/HUD_new.jsx";
import VictoryScreen from "./components/VictoryScreen.jsx";
import GameOverScreen from "./components/GameOverScreen.jsx";
import MarkerPopup from "./components/MarkerPopup.jsx";
import ARScene from "./components/ARScene.jsx";
import useGameState from "./hooks/useGameState.js";
import useDeviceOrientation from "./hooks/useDeviceOrientation.js";
import "./App.css";

export default function App() {
  const {
    phase,
    position,
    turnNumber,
    moveHistory,
    lastSymbolHit,
    debugLog,
    onMarkerDetected,
    onMarkerLost,
    startGame,
    restartGame,
  } = useGameState();

  const { permissionState, requestPermission } = useDeviceOrientation();

  return (
    <div
      className="app-container"
      style={{ background: phase === "playing" ? "transparent" : "#f5f5f2" }}
    >
      {phase === "splash" && (
        <SplashScreen
          onLaunch={startGame}
          permissionState={permissionState}
          requestPermission={requestPermission}
        />
      )}

      {phase === "playing" && (
        <>
          {debugLog && <div className="debug-overlay">{debugLog}</div>}

          <ARScene
            onMarkerDetected={onMarkerDetected}
            onMarkerLost={onMarkerLost}
          />

          <HUD
            position={position}
            turnNumber={turnNumber}
            moveHistory={moveHistory}
            lastSymbolHit={lastSymbolHit}
          />

          <MarkerPopup lastSymbolHit={lastSymbolHit} />

          {permissionState === "denied" && (
            <div className="permission-warning">
              Motion access denied. Restart app and grant permission.
            </div>
          )}
        </>
      )}

      {phase === "won" && (
        <VictoryScreen
          position={position}
          turnNumber={turnNumber}
          moveHistory={moveHistory}
          onRestart={restartGame}
        />
      )}

      {phase === "gameover" && (
        <GameOverScreen
          position={position}
          turnNumber={turnNumber}
          moveHistory={moveHistory}
          onRestart={restartGame}
        />
      )}
    </div>
  );
}

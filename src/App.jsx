import { useState } from 'react';
import SplashScreen from './components/SplashScreen.jsx';
import HUD from './components/HUD.jsx';
import VictoryScreen from './components/VictoryScreen.jsx';
import MarkerPopup from './components/MarkerPopup.jsx';
import './App.css';

export default function App() {
  // Use 'splash', 'ar', or 'victory' to preview the different UI components
  const [phase, setPhase] = useState('splash'); 

  return (
    <div className="app-container" style={{ background: '#05070f' }}>
      {phase === 'splash' && <SplashScreen onLaunch={() => setPhase('ar')} />}
      
      {phase === 'ar' && (
        <>
          <HUD 
            activeMarker="A"
            visitedMarkers={new Set(['A'])}
            collectedDigits={{ A: 7 }}
            progressPct={25}
            nextUnvisited="B"
            userHeading={0}
            simulateNextMarker={() => {}}
            demoIndex={0}
          />
          <MarkerPopup lastFound={{ cp: { 
            name: 'Alpha Station', 
            subtitle: 'Checkpoint 1 of 5',
            type: 'digit',
            digit: 7,
            color: '#00f5a0',
            gradient: 'linear-gradient(135deg, #00f5a0, #00d9f5)',
            icon: '🔢',
            nextHint: 'Head 60° (NNE) to find Beta Crossing'
          }, timestamp: Date.now() }} />
        </>
      )}

      {phase === 'victory' && <VictoryScreen secretCode={[7, 3, 9]} onRestart={() => setPhase('splash')} />}
    </div>
  );
}

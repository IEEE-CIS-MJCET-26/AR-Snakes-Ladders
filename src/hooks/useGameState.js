import { useState, useCallback, useRef } from "react";

/**
 * SNAKES & LADDERS - Symbol Configuration
 *
 * Barcode 0-4 map to 5 symbol types:
 * - 0: Big Ladder (+10 spaces)
 * - 1: Small Ladder (+3 spaces)
 * - 2: Small Snake (-5 spaces)
 * - 3: Medium Snake (return to start = 0)
 * - 4: Instant Kill (game over)
 */

export const SYMBOLS = {
  0: {
    barcode: 0,
    name: "Big Ladder",
    type: "ladder",
    effect: 10,
    icon: "🪜",
    color: "#22c55e",
    description: "Jump forward 10 spaces!",
  },
  1: {
    barcode: 1,
    name: "Small Ladder",
    type: "ladder",
    effect: 3,
    icon: "🪜",
    color: "#86efac",
    description: "Jump forward 3 spaces!",
  },
  2: {
    barcode: 2,
    name: "Small Snake",
    type: "snake",
    effect: -5,
    icon: "🐍",
    color: "#ef4444",
    description: "Ouch! Go back 5 spaces",
  },
  3: {
    barcode: 3,
    name: "Medium Snake",
    type: "snake",
    effect: "start",
    icon: "🐍",
    color: "#dc2626",
    description: "Back to start!",
  },
  4: {
    barcode: 4,
    name: "Instant Kill",
    type: "snake",
    effect: "gameOver",
    icon: "☠️",
    color: "#000000",
    description: "Game Over!",
  },
};

/**
 * Board configuration - positions where symbols appear
 * Format: position: barcode (0-4)
 * Symbols can appear at multiple positions
 */
export const BOARD_LAYOUT = {
  5: 1, // Small Ladder at 5
  9: 0, // Big Ladder at 9
  17: 3, // Medium Snake at 17
  22: 1, // Small Ladder at 22
  28: 2, // Small Snake at 28
  35: 0, // Big Ladder at 35
  41: 4, // Instant Kill at 41
  48: 2, // Small Snake at 48
  54: 0, // Big Ladder at 54
  60: 3, // Medium Snake at 60
  67: 1, // Small Ladder at 67
  71: 2, // Small Snake at 71
  79: 0, // Big Ladder at 79
  85: 4, // Instant Kill at 85
  92: 1, // Small Ladder at 92
  98: 3, // Medium Snake at 98
};

// ══════════════════════════════════════════════════════════════════
// GAME HOOK: useGameState
// ══════════════════════════════════════════════════════════════════

export default function useGameState() {
  // ── Game State ──
  const [phase, setPhase] = useState("splash"); // splash | playing | won | gameover
  const [position, setPosition] = useState(0); // Current position on board (0-100)
  const [turnNumber, setTurnNumber] = useState(0); // Total turns played
  const [moveHistory, setMoveHistory] = useState([]); // Array of all moves
  const [gameStatus, setGameStatus] = useState(null); // won | lost | null
  const [lastSymbolHit, setLastSymbolHit] = useState(null); // Last symbol encountered
  const [debugLog, setDebugLog] = useState(null);
  const lockRef = useRef(false);

  /**
   * Process barcode scan
   * Call this when player scans a barcode (0-4)
   * Directly applies symbol effect to player's position
   * @param {number} barcodeValue - Scanned barcode (0-4)
   */
  const onMarkerDetected = useCallback(
    (barcodeValue) => {
      if (lockRef.current || phase !== "playing") {
        return;
      }

      lockRef.current = true;

      const symbol = SYMBOLS[barcodeValue];
      if (!symbol) {
        setDebugLog(`Invalid barcode: ${barcodeValue}`);
        setTimeout(() => setDebugLog(null), 2000);
        lockRef.current = false;
        return;
      }

      // Apply symbol movement directly to current position
      let newPosition = position;
      let symbolEffect = null;

      if (barcodeValue === 0 || barcodeValue === 1) {
        // Ladder: move forward
        newPosition = Math.min(position + symbol.effect, 100);
        symbolEffect = `+${symbol.effect}`;
      } else if (barcodeValue === 2) {
        // Small Snake: move back
        newPosition = Math.max(0, position + symbol.effect);
        symbolEffect = `${symbol.effect}`;
      } else if (barcodeValue === 3) {
        // Medium Snake: return to start
        newPosition = 0;
        symbolEffect = "Back to start";
      } else if (barcodeValue === 4) {
        // Instant Kill: game over
        newPosition = position; // Don't move
        symbolEffect = "Game Over!";
      }

      // Record the move
      const completedMove = {
        turnNumber: turnNumber + 1,
        positionBefore: position,
        positionAfter: newPosition,
        barcodeScanned: barcodeValue,
        symbolHit: symbol,
        symbolEffect,
        finalPosition: newPosition,
        timestamp: Date.now(),
      };

      setMoveHistory((prev) => [...prev, completedMove]);
      setPosition(newPosition);
      setTurnNumber((prev) => prev + 1);
      setLastSymbolHit(symbol);

      // Check win/lose conditions
      if (newPosition >= 100) {
        setGameStatus("won");
        setTimeout(() => setPhase("won"), 1500);
        setDebugLog("🎉 You reached 100! You Won!");
      } else if (barcodeValue === 4) {
        // Instant Kill
        setGameStatus("lost");
        setTimeout(() => setPhase("gameover"), 1500);
        setDebugLog("💀 Game Over!");
      } else {
        setDebugLog(`${symbol.name}: ${symbolEffect}`);
      }

      setTimeout(() => {
        lockRef.current = false;
        setDebugLog(null);
      }, 1500);
    },
    [phase, position, turnNumber],
  );

  const onMarkerLost = useCallback(() => {
    // Optional: handle marker loss
  }, []);

  // ── Phase transitions ──
  const startGame = useCallback(() => {
    setPhase("playing");
    setPosition(0);
    setTurnNumber(0);
    setMoveHistory([]);
    setGameStatus(null);
    setLastSymbolHit(null);
    lockRef.current = false;
  }, []);

  const restartGame = useCallback(() => {
    setPhase("splash");
    setPosition(0);
    setTurnNumber(0);
    setMoveHistory([]);
    setGameStatus(null);
    setLastSymbolHit(null);
    lockRef.current = false;
  }, []);

  return {
    // Game state
    phase,
    position,
    turnNumber,
    moveHistory,
    lastSymbolHit,
    gameStatus,
    debugLog,

    // Actions
    onMarkerDetected,
    onMarkerLost,
    startGame,
    restartGame,
  };
}

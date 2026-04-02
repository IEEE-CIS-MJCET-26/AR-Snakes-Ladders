/**
 * TrailBlaze AR — Checkpoint Configuration
 * All hardcoded route data for the 5-marker treasure hunt
 */

export const CHECKPOINTS = {
  A: {
    id: 'A',
    name: 'Alpha Station',
    subtitle: 'Checkpoint 1 of 5',
    type: 'digit',          // 'digit' | 'arrow' | 'both'
    digit: 7,
    targetDirection: 60,    // degrees clockwise from North toward next marker
    color: '#00f5a0',
    colorDim: 'rgba(0,245,160,0.15)',
    gradient: 'linear-gradient(135deg, #00f5a0, #00d9f5)',
    icon: '🔢',
    arjsPreset: 'hiro',     // AR.js built-in preset ID
    hint: 'Find the HIRO marker',
    nextHint: 'Head 60° (NNE) to find Beta Crossing',
    order: 0,
  },
  B: {
    id: 'B',
    name: 'Beta Crossing',
    subtitle: 'Checkpoint 2 of 5',
    type: 'arrow',
    digit: null,
    targetDirection: 120,
    color: '#f5c400',
    colorDim: 'rgba(245,196,0,0.15)',
    gradient: 'linear-gradient(135deg, #f5c400, #f97316)',
    icon: '🧭',
    arjsPreset: 'kanji',
    hint: 'Find the KANJI marker',
    nextHint: 'Head 120° (ESE) to find Charlie Peak',
    order: 1,
  },
  C: {
    id: 'C',
    name: 'Charlie Peak',
    subtitle: 'Checkpoint 3 of 5',
    type: 'both',
    digit: 3,
    targetDirection: 200,
    color: '#a855f7',
    colorDim: 'rgba(168,85,247,0.15)',
    gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
    icon: '⚡',
    arjsPreset: null,
    hint: 'Find the LETTER-A marker',
    nextHint: 'Head 200° (SSW) to find Delta Ridge',
    order: 2,
  },
  D: {
    id: 'D',
    name: 'Delta Ridge',
    subtitle: 'Checkpoint 4 of 5',
    type: 'arrow',
    digit: null,
    targetDirection: 300,
    color: '#f97316',
    colorDim: 'rgba(249,115,22,0.15)',
    gradient: 'linear-gradient(135deg, #f97316, #ef4444)',
    icon: '🔥',
    arjsPreset: null,
    hint: 'Find the LETTER-B marker',
    nextHint: 'Head 300° (WNW) to find Echo Summit',
    order: 3,
  },
  E: {
    id: 'E',
    name: 'Echo Summit',
    subtitle: 'FINAL CHECKPOINT',
    type: 'both',
    digit: 9,
    targetDirection: null,  // final — no next
    color: '#ec4899',
    colorDim: 'rgba(236,72,153,0.15)',
    gradient: 'linear-gradient(135deg, #ec4899, #a855f7)',
    icon: '🏆',
    arjsPreset: null,
    hint: 'Find the LETTER-C marker',
    nextHint: 'You\'ve reached the final checkpoint!',
    order: 4,
  },
};

export const MARKER_ORDER = ['A', 'B', 'C', 'D', 'E'];
export const DIGIT_MARKERS = ['A', 'C', 'E'];

// Route bearing labels
export const BEARING_LABELS = [
  'N','NNE','NE','ENE','E','ESE','SE','SSE',
  'S','SSW','SW','WSW','W','WNW','NW','NNW','N',
];

export function getBearingLabel(degrees) {
  const index = Math.round(degrees / 22.5);
  return BEARING_LABELS[index % 16];
}

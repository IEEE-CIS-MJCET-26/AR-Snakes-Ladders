# Snakes and Ladders AR

Snakes and Ladders AR is a mobile-first augmented reality board game built with React and Vite. Players scan printed barcode markers to trigger ladders, snakes, and special effects while the game keeps track of position, turns, and move history.

## Features

- Barcode-driven gameplay with markers `0` through `4`
- Five symbol types mapped to the board logic
- Full move history with turn-by-turn tracking
- Victory and game-over states
- Printable marker sheet for the barcode cards
- Mobile-friendly layout designed for phone use

## Tech Stack

- React `19.2.4`
- React DOM `19.2.4`
- Vite `8.0.1`
- A-Frame `1.4.2` via CDN
- AR.js via CDN
- ESLint `9.39.4`

## Requirements

- Node.js 18 or newer
- A camera-enabled phone or tablet for AR gameplay
- HTTPS or a secure local network connection for mobile camera access

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the app in a browser.

## Scripts

- `npm run dev` - Start the Vite development server
- `npm run build` - Build the production bundle
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint across the project

## How To Play

1. Open the app on a phone with camera access.
2. Start the game from the splash screen.
3. Point the camera at one of the printed barcode markers.
4. Each scanned barcode applies its effect immediately.
5. Reach position `100` to win.

## Barcode Mapping

- `0` - Big Ladder, move forward 10 spaces
- `1` - Small Ladder, move forward 3 spaces
- `2` - Small Snake, move back 5 spaces
- `3` - Medium Snake, return to start
- `4` - Instant Kill, game over

## Marker Printing

Printable marker sheets are available in [public/markers/print-markers.html](public/markers/print-markers.html).

The generated barcode images used by the sheet are stored in [public/markers/generated](public/markers/generated).

## Project Structure

```text
src/
	App.jsx
	App.css
	index.css
	main.jsx
	components/
		ARScene.jsx
		GameOverScreen.jsx
		HUD_new.jsx
		MarkerPopup.jsx
		SplashScreen.jsx
		VictoryScreen.jsx
	hooks/
		useDeviceOrientation.js
		useGameState.js
public/
	markers/
		print-markers.html
		generated/
```

## Notes

- The AR camera layer is configured for mobile browser use and depends on camera permissions.
- The game uses only barcode markers `0` to `4`; higher values are not part of the current build.
- The project is intentionally kept in plain JavaScript and React for a lightweight mobile experience.

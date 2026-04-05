# Snakes and Ladders AR: Testing Guide

This guide covers manual testing for the current barcode-based Snakes and Ladders AR build.

## 1. Build Check

Run a production build first to confirm the project compiles:

```bash
npm run build
```

Expected result: build completes without errors.

## 2. Start The Dev Server

Use Vite directly so host and port flags are accepted:

```bash
npx vite --host 0.0.0.0 --port 5173
```

Look for the network URL in terminal output, for example:

```text
Network: https://192.168.x.x:5173/
```

## 3. Open On Mobile

1. Connect phone and computer to the same Wi-Fi.
2. Open the `https://` network URL on the phone.
3. Accept the local certificate warning when prompted.
4. Allow camera and motion permissions.

## 4. Open Marker Sheet

Open the printable marker page:

- `/markers/print-markers.html`

Markers used by this build:

- `barcode-0.png`
- `barcode-1.png`
- `barcode-2.png`
- `barcode-3.png`
- `barcode-4.png`

No other barcodes are used.

## 5. Gameplay Validation

From the app splash screen, press Start Game and validate the following:

1. Camera frame appears in the center square.
2. Scanning each barcode triggers exactly one move update.
3. Move history updates after every successful scan.
4. Last-hit popup appears with correct symbol text.
5. Position rules match the mapping below.

Symbol mapping:

- Barcode `0`: Big Ladder (`+10`)
- Barcode `1`: Small Ladder (`+3`)
- Barcode `2`: Small Snake (`-5`)
- Barcode `3`: Medium Snake (back to start)
- Barcode `4`: Instant Kill (game over)

## 6. End-State Tests

Run both end conditions:

1. Win path: reach position `100` and verify Victory screen stats.
2. Lose path: scan barcode `4` and verify Game Over screen stats.
3. Restart from each end screen and confirm state resets to splash.

## 7. Regression Checklist

- No references to legacy checkpoint flow remain in gameplay.
- Only barcode values `0` to `4` are active.
- Marker page references only existing generated marker assets.
- App remains usable in mobile portrait layout.

## 8. Common Issues

### Black camera square but scanning works

Cause: preview layer rendering issue in mobile browser.

Actions:

1. Close the browser tab completely and reopen.
2. Re-grant camera permission.
3. Retry from splash screen.

### Dev server host/port args ignored

Cause: using `npm run dev -- --host ...` with unsupported npm arg forwarding behavior.

Use:

```bash
npx vite --host 0.0.0.0 --port 5173
```

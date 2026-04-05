# 🧪 TrailBlaze AR: Mobile Testing Guide

Everything you requested has been implemented! To test this properly on a real iPhone or Android device, follow these steps:

## 1. Start the Dev Server

The development server is now configured with the `@vitejs/plugin-basic-ssl` plugin. This generates a temporary SSL certificate.

- When you run `npm run dev` (already started for you), Vite will bind to your local IP address over `https://`.
- Look at your terminal output for a line like:
  ```
  ➜  Network: https://192.168.1.XX:5173/
  ```

## 2. Connect Your Phone

1. Ensure your phone is connected to the **same Wi-Fi network** as your computer.
2. Open your phone's browser (Safari for iOS, Chrome for Android).
3. Type in the `https://` Network URL from the terminal exactly as shown.
4. **Bypass the Privacy Warning:** Because the SSL certificate is self-signed just for local dev, your browser will warn you.
   - **Chrome:** Click `Advanced` -> `Proceed to 192.168... (unsafe)`
   - **Safari:** Click `Show Details` -> `visit this website`

## 3. Print or Open the AR Markers

To test the game flow, you need the physical markers. You can print them or just open them on your desktop monitor while pointing your phone at them.

Primary option (recommended):

- Open the local print sheet at `/markers/print-markers.html` from your running app URL.
- Example: `https://192.168.1.XX:5173/markers/print-markers.html`

Here are the markers used for each checkpoint:

1. **Checkpoint A (Alpha Station)** - HIRO marker: `/markers/generated/hiro.png`
   _Fallback also supported in-app:_ **Barcode 3**: `/markers/generated/barcode-3.png`
2. **Checkpoint B (Beta Crossing)** - **Barcode 4**: `/markers/generated/barcode-4.png`
3. **Checkpoint C (Charlie Peak)** - **Barcode 0**: `/markers/generated/barcode-0.png`
4. **Checkpoint D (Delta Ridge)** - **Barcode 1**: `/markers/generated/barcode-1.png`
5. **Checkpoint E (Echo Summit)** - **Barcode 2**: `/markers/generated/barcode-2.png`

## 4. Test the Pipeline

1. **Launch AR:** Tap the "Launch TrailBlaze AR" button on the splash screen.
2. **Permissions:**
   - On iOS, a prompt will appear asking for **Device Motion** access. **You must allow this** for the compass arrow to work.
   - The browser will ask for **Camera** access. Allow it.
3. **Scan Markers:** Point your phone camera at the Hiro marker first. Ensure the popup appears and checkpoint A is marked as found.
4. **Test Compass:** Rotate your phone towards the target direction indicated. Verify the arrow rotates dynamically.

_(Note: If you deny device motion on iOS, the app catches this fallback gracefully, but the arrow will remain locked to 0° instead of crashing.)_

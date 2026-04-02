import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

/**
 * AR.js uses WebAssembly (OpenCV) for marker detection.
 * On desktop browsers without a real camera, the WASM buffer
 * gets a null/empty video stream and throws:
 *   "RuntimeError: memory access out of bounds"
 *
 * This handler silently swallows that specific crash so DevTools
 * doesn't pause and the simulation/"demo" mode still works fine.
 * On a real mobile device with a camera, the error never occurs.
 */
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason instanceof Error &&
      e.reason.message?.includes('memory access out of bounds')) {
    e.preventDefault(); // stops DevTools pausing on this
    return;
  }
});

window.addEventListener('error', (e) => {
  if (e.message?.includes('memory access out of bounds')) {
    e.preventDefault();
    return;
  }
});

createRoot(document.getElementById('root')).render(<App />);

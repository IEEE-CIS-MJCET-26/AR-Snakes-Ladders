import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  // StrictMode disabled to avoid double-mounts with A-Frame which isn't React-aware
  <App />
);

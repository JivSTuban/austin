import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { StrictMode } from 'react'

const root = createRoot(document.getElementById("root")!);

// Only use StrictMode in development
// This prevents double-rendering in production which can cause auth refreshes
if (import.meta.env.DEV) {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  root.render(<App />);
}

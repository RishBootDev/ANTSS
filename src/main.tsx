import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.tsx'

// Intercept global fetch to prepend VITE_API_URL for relative API calls
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  let baseUrl = import.meta.env.VITE_API_URL || '';
  if (baseUrl) {
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }
    if (typeof input === 'string' && input.startsWith('/api')) {
      input = `${baseUrl}${input}`;
    }
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')!).render(
  <App />
)



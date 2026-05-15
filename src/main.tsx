import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Fix for fetch-getter crash in certain environments (e.g. Chrome extensions or locked down iframes)
// Some libraries try to polyfill fetch by assignment, which fails if window.fetch is read-only.
try {
  const descriptor = Object.getOwnPropertyDescriptor(window, 'fetch');
  if (descriptor && !descriptor.writable && !descriptor.set && descriptor.configurable) {
    const originalFetch = window.fetch;
    Object.defineProperty(window, 'fetch', {
      get: () => originalFetch,
      set: (val) => {
        console.warn('[ReleaseHub] Attempt to overwrite read-only fetch suppressed.', val);
      },
      configurable: true,
      enumerable: true
    });
  }
} catch (e) {
  // Ignore errors if we can't redefine
}

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

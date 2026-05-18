/**
 * main.tsx — application entry point.
 *
 * Mounts the React application into the #root element defined in index.html.
 * StrictMode is enabled to surface potential issues during development;
 * it has no effect in the production build.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

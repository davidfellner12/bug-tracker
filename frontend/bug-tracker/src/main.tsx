import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// ✅ Sentry imports
import * as Sentry from '@sentry/react'

// ✅ Sentry Initialization
// @ts-ignore
Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration],
    tracesSampleRate: 1.0,
    environment: import.meta.env.MODE,
    sendDefaultPii: true,
})

// ✅ React App Mount
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App.tsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext.tsx'

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


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </StrictMode>,
)


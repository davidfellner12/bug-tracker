import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './components/App.tsx'
import LoginPage from './components/LoginPage.tsx'
import RegisterPage from './components/RegisterPage.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'

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
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/" element={<ProtectedRoute />}>
                            <Route path="/" element={<App />} />
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>,
)
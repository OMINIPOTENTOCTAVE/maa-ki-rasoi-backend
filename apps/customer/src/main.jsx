import * as Sentry from "@sentry/react"
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useLocation, Routes } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
                    <App />
                </Sentry.ErrorBoundary>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)

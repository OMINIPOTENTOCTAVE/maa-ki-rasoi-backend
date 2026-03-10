import * as Sentry from "@sentry/react"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AdminErrorFallback from './components/AdminErrorFallback'

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Sentry.ErrorBoundary fallback={({ error, resetError }) => <AdminErrorFallback error={error} resetError={resetError} />}>
            <App />
        </Sentry.ErrorBoundary>
    </React.StrictMode>,
)

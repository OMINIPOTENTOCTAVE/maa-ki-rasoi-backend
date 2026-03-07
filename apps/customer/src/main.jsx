import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useLocation, Routes } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;

const MobileHeader = () => (
    <header className="top-nav">
        <h1>Maa Ki Rasoi - Kitchen</h1>
    </header>
);

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/login" element={
                    <div className="min-h-screen bg-[var(--brand-cream)] flex flex-col items-center justify-center p-4">
                        <MobileHeader />
                        <main className="w-full max-w-sm"><AdminLogin /></main>
                    </div>
                } />
                <Route path="/admin/*" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

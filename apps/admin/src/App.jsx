import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;

const LegacyAdminLayout = ({ children }) => (
    <div className="app-container">
        <header className="top-nav">
            <h1>Maa Ki Rasoi - Kitchen</h1>
        </header>
        <main className="main-content">
            {children}
        </main>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/login" element={<LegacyAdminLayout><AdminLogin /></LegacyAdminLayout>} />
                <Route path="/admin/*" element={<LegacyAdminLayout><AdminDashboard /></LegacyAdminLayout>} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

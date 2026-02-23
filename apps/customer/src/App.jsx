import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Checkout from './pages/Checkout';
import CustomerDashboard from './pages/CustomerDashboard';
import Login from './pages/Auth/Login';

// A simple wrapper to protect routes
function ProtectedRoute({ children }) {
    const token = localStorage.getItem('customer_token');

    // Set axios header automatically if returning from refresh
    if (token && !axios.defaults.headers.common['Authorization']) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    if (!token) {
        return <Login />;
    }
    return children;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('customer_token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

function App() {
    const [cart, setCart] = useState([]);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(i => {
            if (i.id === id) {
                return { ...i, qty: Math.max(0, i.qty + delta) };
            }
            return i;
        }).filter(i => i.qty > 0));
    };

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const clearCart = () => setCart([]);

    return (
        <BrowserRouter>
            {isOffline && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#ff9800', color: '#fff', textAlign: 'center', padding: '0.5rem', zIndex: 9999, fontWeight: 'bold' }}>
                    ⚠️ You are currently offline. Viewing cached mode.
                </div>
            )}
            <Routes>
                <Route path="/" element={
                    <ProtectedRoute>
                        <CustomerDashboard cart={cart} addToCart={addToCart} />
                    </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/checkout" element={
                    <ProtectedRoute>
                        <Checkout cart={cart} updateQty={updateQty} clearCart={clearCart} />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default App;

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Layout & UI
import AppLayout from './layouts/AppLayout';
import { Toaster } from './components/ui/sonner';

// Pages
import CustomerDashboard from './pages/CustomerDashboard';
import Login from './pages/Auth/Login';
import CheckoutPage from './pages/Checkout';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
    const [cart, setCart] = useState([]);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    // Initial Setup
    useEffect(() => {
        const token = localStorage.getItem('customer_token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Axios interceptor for token refresh
    axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            // Handle 401 (Unauthorized) and 403 (Forbidden) errors by logging out
            if (error.response?.status === 403 || error.response?.status === 401) {
                localStorage.removeItem('customer_token');
                localStorage.removeItem('customer_data'); // Also remove customer data
                delete axios.defaults.headers.common['Authorization']; // Clear auth header
                window.location.href = '/login'; // Redirect to login page
            }
            return Promise.reject(error);
        }
    );

    // Cart Actions
    const addToCart = (item) => {
        setCart(prev => {
            const exists = prev.find(i => i.id === item.id);
            if (exists) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(i => {
            if (i.id === id) {
                const newQty = Math.max(0, i.qty + delta);
                return { ...i, qty: newQty };
            }
            return i;
        }).filter(i => i.qty > 0));
    };

    const clearCart = () => setCart([]);

    return (
        <div className="texture-overlay">
            <AppLayout>
                {isOffline && (
                    <div className="fixed top-0 left-0 right-0 z-[2000] bg-error text-white text-center py-2 text-xs font-bold animate-fade-in">
                        Working Offline — Changes will sync when reconnected
                    </div>
                )}

                <Routes>
                    <Route path="/" element={<CustomerDashboard activeView="home" cart={cart} addToCart={addToCart} />} />
                    <Route path="/menu" element={<CustomerDashboard activeView="menu" cart={cart} addToCart={addToCart} />} />
                    <Route path="/orders" element={
                        <ProtectedRoute>
                            <CustomerDashboard activeView="orders" cart={cart} addToCart={addToCart} />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <CustomerDashboard activeView="profile" cart={cart} addToCart={addToCart} />
                        </ProtectedRoute>
                    } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/checkout" element={
                        <ProtectedRoute>
                            <CheckoutPage cart={cart} updateQty={updateQty} clearCart={clearCart} />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AppLayout>
            <Toaster position="top-center" richColors />
        </div>
    );
}

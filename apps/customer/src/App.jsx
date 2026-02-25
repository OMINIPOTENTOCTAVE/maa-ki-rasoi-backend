import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Checkout from './pages/Checkout';
import CustomerDashboard from './pages/CustomerDashboard';
import Login from './pages/Auth/Login';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;

// Auto-set auth header if token exists (e.g. after page refresh)
const existingToken = localStorage.getItem('customer_token');
if (existingToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;
}

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh' && originalRequest.url !== '/auth/otp/verify') {

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axios(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Fetch new access token using httpOnly refresh cookie
                const res = await axios.post('/auth/refresh', {}, { withCredentials: true });
                const newToken = res.data.token;

                localStorage.setItem('customer_token', newToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                processQueue(null, newToken);
                return axios(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem('customer_token');
                localStorage.removeItem('customer_data');
                delete axios.defaults.headers.common['Authorization'];
                // Not forcing a redirect here, let components handle missing auth state
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// Only protect routes that truly need auth (checkout, orders, etc.)
function ProtectedRoute({ children }) {
    const token = localStorage.getItem('customer_token');
    if (!token) {
        return <Login />;
    }
    return children;
}

function App() {
    const [cart, setCart] = useState([]);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Remove initial skeleton loader once React mounts
        const loader = document.getElementById('initial-loader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.transition = 'opacity 0.4s ease';
                setTimeout(() => loader.remove(), 400);
            }, 500); // 500ms artificial delay so the branded screen doesn't just flash on fast networks
        }

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
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#E67E22', color: '#fff', textAlign: 'center', padding: '0.5rem', zIndex: 9999, fontWeight: 'bold' }}>
                    ⚠️ You are currently offline. Viewing cached mode.
                </div>
            )}
            <Routes>
                {/* Home — open to everyone (guests + logged-in) */}
                <Route path="/" element={
                    <CustomerDashboard cart={cart} addToCart={addToCart} />
                } />
                <Route path="/login" element={<Login />} />
                {/* Checkout — requires login */}
                <Route path="/checkout" element={
                    <ProtectedRoute>
                        <CheckoutPage cart={cart} updateQty={updateQty} clearCart={clearCart} />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

function CheckoutPage({ cart, updateQty, clearCart }) {
    return (
        <div className="min-h-screen bg-brand-cream dark:bg-brand-dark">
            <div className="max-w-2xl mx-auto">
                <Checkout cart={cart} updateQty={updateQty} clearCart={clearCart} />
            </div>
        </div>
    );
}

export default App;

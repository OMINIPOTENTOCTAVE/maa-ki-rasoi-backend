import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
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

function App() {
    const [cart, setCart] = useState([]);

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

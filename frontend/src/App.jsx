import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';

import CustomerView from './pages/CustomerView';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;

function App() {
    const [cart, setCart] = useState([]);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(i => {
            if (i.id === id) {
                return { ...i, qty: Math.max(0, i.qty + delta) };
            }
            return i;
        }).filter(i => i.qty > 0));
    };

    const clearCart = () => setCart([]);

    return (
        <BrowserRouter>
            <div className="app-container">
                <header className="top-nav">
                    <h1>Maa Ki Rasoi</h1>
                </header>

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<CustomerView cart={cart} addToCart={addToCart} updateQty={updateQty} />} />
                        <Route path="/checkout" element={<Checkout cart={cart} updateQty={updateQty} clearCart={clearCart} />} />
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin/*" element={<AdminDashboard />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    )
}

export default App;

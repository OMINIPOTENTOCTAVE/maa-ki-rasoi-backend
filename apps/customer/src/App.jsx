import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

import Checkout from './pages/Checkout';
import CustomerDashboard from './pages/CustomerDashboard';
import Login from './pages/Auth/Login';

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

    const clearCart = () => setCart([]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<CustomerDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/checkout" element={<Checkout cart={cart} updateQty={updateQty} clearCart={clearCart} />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;

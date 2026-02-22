import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

export default function Checkout({ cart, updateQty, clearCart }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const cartTotalAmount = cart.reduce((acc, c) => acc + (c.price * c.qty), 0);

    if (cart.length === 0 && !success) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h3>Your cart is empty</h3>
                <button className="btn" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
                    Browse Menu
                </button>
            </div>
        );
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        try {
            const payload = {
                customerName: formData.name,
                customerPhone: formData.phone,
                address: formData.address,
                items: cart.map(c => ({ menuItemId: c.id, quantity: c.qty }))
            };

            await axios.post('/orders', payload);
            setSuccess(true);
            clearCart();
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Error placing order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h2>Order Placed Successfully!</h2>
                <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
                    Your home-style meal will be prepared and delivered to you soon. Pay via Cash on Delivery.
                </p>
                <button className="btn" onClick={() => navigate('/')}>Back to Menu</button>
            </div>
        );
    }

    return (
        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', background: 'var(--card-bg)', backdropFilter: 'blur(8px)', padding: '1rem', borderRadius: '16px', boxShadow: 'var(--glass-shadow)' }}>
                <button onClick={() => navigate('/')} style={{ background: 'rgba(255,87,34,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', transition: 'all 0.2s' }}>
                    <ArrowLeft size={20} color="var(--primary)" />
                </button>
                <h2 style={{ margin: 0, fontWeight: 800 }}>Complete Your Order</h2>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🛒</span> Order Summary
                </h3>
                {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontWeight: 600 }}>{item.name}</span>
                            <span style={{ color: 'var(--primary)', marginLeft: '0.5rem', fontWeight: 700, background: 'rgba(255,87,34,0.1)', padding: '0.1rem 0.4rem', borderRadius: '12px', fontSize: '0.8rem' }}>x{item.qty}</span>
                        </div>
                        <span style={{ fontWeight: 600 }}>₹{item.price * item.qty}</span>
                    </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '2px dashed rgba(255,87,34,0.2)', fontWeight: '800', fontSize: '1.2rem' }}>
                    <span>Total Amount</span>
                    <span style={{ color: 'var(--primary)' }}>₹{cartTotalAmount}</span>
                </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>📍</span> Delivery Details
                </h3>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Full Name</label>
                    <input
                        className="input-field"
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid transparent' }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Phone Number</label>
                    <input
                        className="input-field"
                        placeholder="10-digit mobile number"
                        required
                        type="tel"
                        pattern="[0-9]{10}"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid transparent' }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Complete Delivery Address</label>
                    <textarea
                        className="input-field"
                        placeholder="House/Flat No., Building Name, Street, Landmark"
                        required
                        rows="3"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid transparent', resize: 'vertical' }}
                    ></textarea>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: '0.85rem', background: 'rgba(255,152,0,0.1)', borderRadius: '8px', border: '1px dashed rgba(255,152,0,0.3)', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>
                    <span style={{ fontSize: '1.2rem' }}>💵</span> Please keep exact change ready for Cash on Delivery.
                </div>

                {errorMsg && (
                    <div style={{ color: 'white', background: '#dc3545', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                        {errorMsg}
                    </div>
                )}

                <button className="btn btn-block" disabled={loading} style={{ padding: '1rem', fontSize: '1.1rem', background: 'linear-gradient(90deg, #ff5722 0%, #ff9800 100%)', boxShadow: '0 4px 15px rgba(255, 87, 34, 0.4)' }}>
                    {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span className="spinner">↻</span> Processing Order...</span>
                    ) : (
                        <span>Place Order • ₹{cartTotalAmount}</span>
                    )}
                </button>
            </form>
        </div>
    );
}

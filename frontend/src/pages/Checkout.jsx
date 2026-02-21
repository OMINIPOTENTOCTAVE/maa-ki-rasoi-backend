import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

export default function Checkout({ cart, updateQty, clearCart }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

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
            alert(err.response?.data?.message || 'Error placing order. Please try again.');
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
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={24} color="var(--primary)" />
                </button>
                <h2 style={{ margin: 0 }}>Checkout</h2>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Order Summary</h3>
                {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div>
                            <span>{item.name}</span>
                            <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>x{item.qty}</span>
                        </div>
                        <span>₹{item.price * item.qty}</span>
                    </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    <span>Total To Pay</span>
                    <span>₹{cartTotalAmount}</span>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    * Cash on Delivery Only
                </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="card">
                <h3 style={{ marginBottom: '1rem' }}>Delivery Details</h3>
                <input
                    className="input-field"
                    placeholder="Your Full Name"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                    className="input-field"
                    placeholder="Phone Number (e.g. 9876543210)"
                    required
                    type="tel"
                    pattern="[0-9]{10}"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
                <textarea
                    className="input-field"
                    placeholder="Complete Delivery Address"
                    required
                    rows="3"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                ></textarea>

                <button className="btn btn-block" disabled={loading} style={{ marginTop: '0.5rem' }}>
                    {loading ? 'Processing...' : 'Place Order'}
                </button>
            </form>
        </div>
    );
}

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CalendarRange } from 'lucide-react';
import SubscriptionWizard from '../components/SubscriptionWizard';

export default function CustomerView({ cart, addToCart, updateQty }) {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const navigate = useNavigate();

    const handleWizardSuccess = () => {
        setIsWizardOpen(false);
        alert("🎉 Subscription Activated! Our kitchen team will contact you shortly.");
    };

    useEffect(() => {
        axios.get('/menu?available=true')
            .then(res => {
                setMenuItems(res.data.data.filter(item => item.isAvailable));
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const categories = ['All', ...new Set(menuItems.map(m => m.category))];

    const filteredItems = selectedCategory === 'All'
        ? menuItems
        : menuItems.filter(m => m.category === selectedCategory);

    const cartTotalAmount = cart.reduce((acc, c) => acc + (c.price * c.qty), 0);
    const cartTotalItems = cart.reduce((acc, c) => acc + c.qty, 0);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading menu...</div>;

    return (
        <div>
            <div style={{
                borderRadius: '24px',
                marginBottom: '2rem',
                background: 'linear-gradient(135deg, rgba(255,87,34,0.1) 0%, rgba(255,152,0,0.1) 100%)',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-main)', lineHeight: 1.2 }}>
                    Maa Ki Rasoi
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                    Authentic, hygienic, home-style meals delivered daily. Skip the cooking, keep the health.
                </p>
                <button
                    className="btn"
                    onClick={() => setIsWizardOpen(true)}
                    style={{ fontSize: '1.1rem', padding: '1rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(255,87,34,0.3)', width: 'auto' }}
                >
                    <CalendarRange size={24} /> Subscribe to a Plan
                </button>
            </div>

            <div id="instant-menu" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Instant Order / Trial</h3>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try before subscribing</span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
                {categories.map(c => (
                    <button
                        key={c}
                        onClick={() => setSelectedCategory(c)}
                        className={`category-pill ${selectedCategory === c ? 'active' : ''}`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            <div className="menu-list">
                {filteredItems.map(item => {
                    const cartItem = cart.find(c => c.id === item.id);
                    return (
                        <div key={item.id} className="card menu-item">
                            <div>
                                <h3 style={{ marginBottom: '0.25rem' }}>{item.name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{item.description}</p>
                                <div className="price">₹{item.price}</div>
                            </div>
                            <div>
                                {cartItem ? (
                                    <div className="qty-controls">
                                        <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>-</button>
                                        <span style={{ fontWeight: '600', minWidth: '1.2rem', textAlign: 'center' }}>{cartItem.qty}</span>
                                        <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                                    </div>
                                ) : (
                                    <button className="btn btn-secondary" onClick={() => addToCart(item)}>
                                        Add
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
                {filteredItems.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
                        No items in this category right now.
                    </div>
                )}
            </div>

            {cartTotalItems > 0 && (
                <div className="sticky-cart">
                    <div className="cart-info">
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', fontWeight: 500 }}>{cartTotalItems} items • Total</div>
                        <div style={{ fontWeight: '800', fontSize: '1.4rem' }}>₹{cartTotalAmount}</div>
                    </div>
                    <button className="btn" onClick={() => navigate('/checkout')}>
                        <ShoppingCart size={20} />
                        Checkout
                    </button>
                </div>
            )}

            {isWizardOpen && (
                <SubscriptionWizard
                    onClose={() => setIsWizardOpen(false)}
                    onSuccess={handleWizardSuccess}
                />
            )}
        </div>
    );
}

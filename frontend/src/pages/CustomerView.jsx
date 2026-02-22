import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

export default function CustomerView({ cart, addToCart, updateQty }) {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const navigate = useNavigate();

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
                height: '180px',
                borderRadius: '20px',
                marginBottom: '1.5rem',
                backgroundImage: 'url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '1.5rem',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)' }}></div>
                <h2 style={{ position: 'relative', fontSize: '1.8rem', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.5)', lineHeight: 1.2 }}>
                    Fresh. Home Style.<br />Made with Love.
                </h2>
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
        </div>
    );
}

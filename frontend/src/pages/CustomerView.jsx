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
            .catch(err => {
                console.error(err);
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
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1rem', paddingBottom: '0.5rem' }}>
                {categories.map(c => (
                    <button
                        key={c}
                        onClick={() => setSelectedCategory(c)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            border: '1px solid var(--border)',
                            background: selectedCategory === c ? 'var(--primary)' : 'white',
                            color: selectedCategory === c ? 'white' : 'var(--text-main)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
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
                    <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{cartTotalItems} items</div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>₹{cartTotalAmount}</div>
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

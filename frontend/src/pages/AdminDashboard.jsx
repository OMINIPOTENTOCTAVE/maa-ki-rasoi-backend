import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('orders'); // orders, menu, stats
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [stats, setStats] = useState(null);
    const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '', category: '' });

    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
            return;
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        fetchData();
    }, [token, activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'orders') {
                const res = await axios.get('/orders');
                setOrders(res.data.data);
            } else if (activeTab === 'menu') {
                const res = await axios.get('/menu');
                setMenuItems(res.data.data);
            } else if (activeTab === 'stats') {
                const res = await axios.get('/orders/stats');
                setStats(res.data.data);
            }
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
            }
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.patch(`/orders/${orderId}/status`, { status: newStatus });
            fetchData();
        } catch (err) {
            alert('Error updating status');
        }
    };

    const handleAddMenu = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/menu', { ...menuForm, isAvailable: true });
            setMenuForm({ name: '', description: '', price: '', category: '' });
            fetchData();
        } catch (err) {
            alert('Error adding menu item');
        }
    };

    const handleToggleMenu = async (id) => {
        try {
            await axios.patch(`/menu/${id}/toggle`);
            fetchData();
        } catch (err) {
            alert('Error toggling status');
        }
    };

    return (
        <div style={{ padding: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                <button className={`category-pill ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Orders ({orders.length})</button>
                <button className={`category-pill ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>Revenue Stats</button>
                <button className={`category-pill ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>Menu Items</button>
                <button className="category-pill" style={{ marginLeft: 'auto', background: 'transparent', borderColor: 'var(--text-muted)' }} onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin/login'); }}>Logout</button>
            </div>

            {activeTab === 'stats' && stats && (
                <div className="card" style={{ padding: '2rem 1.5rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', fontWeight: '800' }}>Today's Overview</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--success)' }}>₹{stats.revenueToday}</div>
                            <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>Revenue (Delivered)</div>
                        </div>
                        <div style={{ background: 'rgba(255, 152, 0, 0.1)', border: '1px solid rgba(255, 152, 0, 0.3)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>{stats.pendingCount}</div>
                            <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>Pending Orders</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.03)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', gridColumn: 'span 2' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '800' }}>{stats.totalOrdersToday}</div>
                            <div style={{ color: 'var(--text-muted)' }}>Total Orders Today</div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'menu' && (
                <>
                    <form className="card" onSubmit={handleAddMenu} style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Add New Menu Item</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input className="input-field" placeholder="Name (e.g. Rajma Chawal)" required value={menuForm.name} onChange={e => setMenuForm({ ...menuForm, name: e.target.value })} style={{ marginBottom: 0 }} />
                            <input className="input-field" placeholder="Price (₹)" type="number" required value={menuForm.price} onChange={e => setMenuForm({ ...menuForm, price: e.target.value })} style={{ marginBottom: 0 }} />
                            <input className="input-field" placeholder="Category" required value={menuForm.category} onChange={e => setMenuForm({ ...menuForm, category: e.target.value })} style={{ marginBottom: 0 }} />
                            <input className="input-field" placeholder="Short Description" required value={menuForm.description} onChange={e => setMenuForm({ ...menuForm, description: e.target.value })} style={{ marginBottom: 0 }} />
                        </div>
                        <button className="btn btn-block" style={{ marginTop: '1.5rem' }}>+ Add Item to Menu</button>
                    </form>

                    <h3 style={{ marginBottom: '1rem', paddingLeft: '0.5rem' }}>Current Menu ({menuItems.length})</h3>
                    <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.8)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--glass-shadow)' }}>
                        <table className="admin-table">
                            <thead>
                                <tr style={{ background: 'rgba(255,87,34,0.05)' }}>
                                    <th>Item Details</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menuItems.map(m => (
                                    <tr key={m.id}>
                                        <td>
                                            <div style={{ fontWeight: '700' }}>{m.name}</div>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.category}</span>
                                        </td>
                                        <td style={{ fontWeight: '600' }}>₹{m.price}</td>
                                        <td>
                                            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: m.isAvailable ? 'var(--success)' : 'var(--text-muted)' }}>
                                                {m.isAvailable ? '● Available' : '○ Hidden'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleToggleMenu(m.id)}>
                                                Toggle
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {activeTab === 'orders' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {orders.map(o => (
                        <div key={o.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,87,34,0.03)' }}>
                                <div>
                                    <strong style={{ fontSize: '1.1rem' }}>{o.customerName}</strong>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>📞 {o.customerPhone}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--primary)' }}>₹{o.totalAmount}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                            </div>
                            <div style={{ padding: '1.25rem' }}>
                                <div style={{ fontSize: '0.95rem', marginBottom: '1.25rem', background: 'rgba(0,0,0,0.02)', padding: '0.75rem', borderRadius: '8px' }}>
                                    <strong>Delivery To:</strong><br />
                                    <span style={{ color: 'var(--text-muted)' }}>{o.address}</span>
                                </div>
                                <div style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                                    <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Order Details:</strong>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {o.items.map(item => (
                                            <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', borderBottom: '1px dashed rgba(0,0,0,0.05)', paddingBottom: '0.3rem' }}>
                                                <span><strong style={{ color: 'var(--primary)' }}>{item.quantity}x</strong> {item.menuItem?.name || 'Item deleted'}</span>
                                                <span style={{ color: 'var(--text-muted)' }}>₹{item.price}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.02)', padding: '0.75rem', borderRadius: '8px' }}>
                                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Update Status:</div>
                                    <select
                                        value={o.status}
                                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                        style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', fontWeight: '600', outline: 'none', background: 'white' }}
                                    >
                                        <option value="Pending">🟠 Pending</option>
                                        <option value="Confirmed">🔵 Confirmed</option>
                                        <option value="Preparing">🟡 Preparing</option>
                                        <option value="Delivered">🟢 Delivered</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                    {orders.length === 0 && <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>No recent orders to display. Catch your breath!</div>}
                </div>
            )}
        </div>
    );
}

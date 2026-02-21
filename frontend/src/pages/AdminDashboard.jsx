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
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
                <button className={`btn ${activeTab !== 'orders' ? 'btn-secondary' : ''}`} onClick={() => setActiveTab('orders')}>Orders</button>
                <button className={`btn ${activeTab !== 'menu' ? 'btn-secondary' : ''}`} onClick={() => setActiveTab('menu')}>Menu Items</button>
                <button className={`btn ${activeTab !== 'stats' ? 'btn-secondary' : ''}`} onClick={() => setActiveTab('stats')}>Revenue Stats</button>
                <button className="btn btn-secondary" style={{ marginLeft: 'auto' }} onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin/login'); }}>Logout</button>
            </div>

            {activeTab === 'stats' && stats && (
                <div className="card">
                    <h2>Today's Overview</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                        <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>₹{stats.revenueToday}</div>
                            <div style={{ color: 'var(--text-muted)' }}>Revenue (Delivered)</div>
                        </div>
                        <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalOrdersToday}</div>
                            <div style={{ color: 'var(--text-muted)' }}>Total Orders</div>
                        </div>
                        <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center', gridColumn: 'span 2' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>{stats.pendingCount}</div>
                            <div style={{ color: 'var(--text-muted)' }}>Pending Orders</div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'menu' && (
                <>
                    <form className="card" onSubmit={handleAddMenu}>
                        <h3>Add New Item</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
                            <input className="input-field" placeholder="Name" required value={menuForm.name} onChange={e => setMenuForm({ ...menuForm, name: e.target.value })} style={{ marginBottom: 0 }} />
                            <input className="input-field" placeholder="Price" type="number" required value={menuForm.price} onChange={e => setMenuForm({ ...menuForm, price: e.target.value })} style={{ marginBottom: 0 }} />
                            <input className="input-field" placeholder="Category" required value={menuForm.category} onChange={e => setMenuForm({ ...menuForm, category: e.target.value })} style={{ marginBottom: 0 }} />
                            <input className="input-field" placeholder="Description" required value={menuForm.description} onChange={e => setMenuForm({ ...menuForm, description: e.target.value })} style={{ marginBottom: 0 }} />
                        </div>
                        <button className="btn" style={{ marginTop: '1rem' }}>Save Item</button>
                    </form>

                    <div style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <table className="admin-table">
                            <thead>
                                <tr style={{ background: '#f8f9fa' }}>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menuItems.map(m => (
                                    <tr key={m.id}>
                                        <td>{m.name} <br /><small style={{ color: 'gray' }}>{m.category}</small></td>
                                        <td>₹{m.price}</td>
                                        <td>{m.isAvailable ? 'Available' : 'Hidden'}</td>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {orders.map(o => (
                        <div key={o.id} className="card" style={{ padding: '0' }}>
                            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcf9f5', borderRadius: '12px 12px 0 0' }}>
                                <div>
                                    <strong>{o.customerName}</strong>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{o.customerPhone}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 'bold' }}>₹{o.totalAmount}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'gray' }}>{new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                            </div>
                            <div style={{ padding: '1rem' }}>
                                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>📍 {o.address}</p>
                                <div style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#444' }}>
                                    {o.items.map(item => (
                                        <div key={item.id}>• {item.quantity}x {item.menuItem?.name}</div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className={`status-badge status-${o.status}`}>{o.status}</span>
                                    <select
                                        value={o.status}
                                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                        style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Preparing">Preparing</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                    {orders.length === 0 && <div style={{ textAlign: 'center', padding: '2rem' }}>No orders yet.</div>}
                </div>
            )}
        </div>
    );
}

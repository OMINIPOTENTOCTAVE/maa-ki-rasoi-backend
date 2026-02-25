import React from 'react';

export default function MenuManagement({ menuItems, menuForm, setMenuForm, handleAddMenu, handleToggleMenu }) {
    return (
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
                        <tr style={{ background: 'rgba(200,85,10,0.05)' }}>
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
    );
}

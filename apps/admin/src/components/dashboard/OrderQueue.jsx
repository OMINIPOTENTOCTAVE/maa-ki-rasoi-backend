import React from 'react';

export default function OrderQueue({ orders, partners, handleAssignDriver, handleStatusChange }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map(o => (
                <div key={o.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(200,85,10,0.03)' }}>
                        <div>
                            <strong style={{ fontSize: '1.1rem' }}>{o.customerName}</strong>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>📞 {o.customerPhone}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '0.2rem' }}>₹{o.totalAmount}</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.2rem', background: o.paymentStatus === 'Paid' ? '#e8f5e9' : '#ffebee', color: o.paymentStatus === 'Paid' ? '#2e7d32' : '#c62828', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>
                                {o.paymentMethod === 'ONLINE' ? '💳 ONLINE' : '💵 COD'} • {o.paymentStatus}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                    </div>
                    <div style={{ padding: '1.25rem' }}>
                        <div style={{ fontSize: '0.95rem', marginBottom: '1.25rem', background: 'rgba(0,0,0,0.02)', padding: '0.75rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <strong>Delivery To:</strong><br />
                                <span style={{ color: 'var(--text-muted)' }}>{o.address}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                                <strong style={{ color: 'var(--primary)' }}>Assign Driver:</strong>
                                <select
                                    value={o.deliveryPartnerId || ''}
                                    onChange={(e) => handleAssignDriver(o.id, e.target.value, 'instant')}
                                    style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                                >
                                    <option value="" disabled>Select Driver</option>
                                    {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
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
    );
}

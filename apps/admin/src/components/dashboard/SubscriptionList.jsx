import React from 'react';

export default function SubscriptionList({ subscriptions, dailyProduction, partners, handleAssignDriver, handleToggleSubscription }) {
    return (
        <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px' }}>
                    {dailyProduction && (
                        <div className="card" style={{ borderLeft: '4px solid var(--primary)', padding: '1.5rem', height: '100%' }}>
                            <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Today's Kitchen Production</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '12px' }}>
                                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Lunch ({dailyProduction.stats.lunchSummary.total})</h3>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ color: '#2e7d32', fontWeight: 'bold' }}>🟢 Veg: {dailyProduction.stats.lunchSummary.total}</div>
                                    </div>
                                </div>
                                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '12px' }}>
                                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Dinner ({dailyProduction.stats.dinnerSummary.total})</h3>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ color: '#2e7d32', fontWeight: 'bold' }}>🟢 Veg: {dailyProduction.stats.dinnerSummary.total}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ flex: '2 1 400px' }}>
                    {dailyProduction && dailyProduction.data && (
                        <div className="card" style={{ height: '100%' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Assign Setup (Today's Scheduled Deliveries)</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                {dailyProduction.data.map(delivery => (
                                    <div key={delivery.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.02)', padding: '0.75rem 1rem', borderRadius: '8px', borderLeft: `3px solid ${delivery.mealType === 'Lunch' ? '#2E7D4F' : '#E67E22'}` }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{delivery.subscription.customer?.name} ({delivery.mealType})</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{delivery.subscription.customer?.address}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: delivery.status === 'Pending' ? '#E67E22' : '#2E7D4F' }}>{delivery.status}</span>
                                            <select
                                                value={delivery.deliveryPartnerId || ''}
                                                onChange={(e) => handleAssignDriver(delivery.id, e.target.value, 'subscription')}
                                                style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                                            >
                                                <option value="" disabled>Assign Driver</option>
                                                {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                                {dailyProduction.data.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No pending deliveries for today.</div>}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <h3 style={{ marginBottom: '1rem', paddingLeft: '0.5rem' }}>All Active Subscribers ({subscriptions.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {subscriptions.map(sub => (
                    <div key={sub.id} className="card" style={{ padding: '1.25rem', borderLeft: `4px solid ${sub.status === 'Active' ? '#2E7D4F' : '#E67E22'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{sub.customer?.name || 'Customer'}</h4>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>📞 {sub.customer?.phone}</div>

                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                    <span style={{ background: 'rgba(0,0,0,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{sub.planType}</span>
                                    <span style={{ background: 'rgba(0,0,0,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>{sub.mealType}</span>
                                    <span style={{ background: 'rgba(46, 125, 79, 0.1)', color: '#2E7D4F', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>🟢 Pure Veg</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    Ends: {new Date(sub.endDate).toLocaleDateString()}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '0.2rem' }}>₹{sub.totalPrice}</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem', background: sub.paymentStatus === 'Paid' ? '#e8f5e9' : '#ffebee', color: sub.paymentStatus === 'Paid' ? '#2e7d32' : '#c62828', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>
                                    {sub.paymentMethod === 'ONLINE' ? '💳 ONLINE' : '💵 COD'} • {sub.paymentStatus}
                                </div>
                                <br />
                                <button
                                    className="btn"
                                    style={{
                                        padding: '0.4rem 0.8rem', fontSize: '0.85rem',
                                        background: sub.status === 'Active' ? 'rgba(255, 152, 0, 0.1)' : 'var(--primary)',
                                        color: sub.status === 'Active' ? '#C8550A' : 'white',
                                        border: sub.status === 'Active' ? '1px solid #C8550A' : 'none'
                                    }}
                                    onClick={() => handleToggleSubscription(sub.id, sub.status)}
                                >
                                    {sub.status === 'Active' ? '⏸ Pause' : '▶ Resume'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

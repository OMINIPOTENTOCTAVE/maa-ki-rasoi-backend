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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0 }}>Dispatch Manifest (Today)</h3>
                                <span style={{ fontSize: '0.8rem', background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>
                                    {dailyProduction.data.length} Total Deliveries
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                {(() => {
                                    // Group deliveries by partner
                                    const grouped = dailyProduction.data.reduce((acc, delivery) => {
                                        const partnerId = delivery.deliveryPartnerId || 'unassigned';
                                        if (!acc[partnerId]) acc[partnerId] = [];
                                        acc[partnerId].push(delivery);
                                        return acc;
                                    }, {});

                                    const getPartnerName = (id) => {
                                        if (id === 'unassigned') return '⚠️ Unassigned';
                                        const p = partners.find(p => p.id === id);
                                        return p ? `🚚 ${p.name}` : 'Unknown Partner';
                                    };

                                    return Object.entries(grouped).map(([partnerId, deliveries]) => (
                                        <div key={partnerId} style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '12px', border: partnerId === 'unassigned' ? '1px dashed #E67E22' : '1px solid #eee' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #ddd' }}>
                                                <strong style={{ color: partnerId === 'unassigned' ? '#E67E22' : 'var(--text-main)' }}>
                                                    {getPartnerName(partnerId)}
                                                </strong>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{deliveries.length} orders</span>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {deliveries.map(delivery => (
                                                    <div key={delivery.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '0.5rem 0.75rem', borderRadius: '6px', borderLeft: `3px solid ${delivery.mealType === 'Lunch' ? '#2E7D4F' : '#E67E22'}`, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                                        <div>
                                                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{delivery.subscription.customer?.name} ({delivery.mealType})</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{delivery.subscription.customer?.address}</div>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', background: delivery.status === 'Pending' ? '#E67E2220' : '#2E7D4F20', color: delivery.status === 'Pending' ? '#E67E22' : '#2E7D4F' }}>
                                                                {delivery.status}
                                                            </span>
                                                            <select
                                                                value={delivery.deliveryPartnerId || ''}
                                                                onChange={(e) => handleAssignDriver(delivery.id, e.target.value, 'subscription')}
                                                                style={{ padding: '0.2rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.75rem', maxWidth: '100px' }}
                                                            >
                                                                <option value="" disabled>Assign</option>
                                                                {partners.map(p => <option key={p.id} value={p.id}>{p.name.split(' ')[0]}</option>)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ));
                                })()}

                                {dailyProduction.data.length === 0 && <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No pending deliveries for today.</div>}
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

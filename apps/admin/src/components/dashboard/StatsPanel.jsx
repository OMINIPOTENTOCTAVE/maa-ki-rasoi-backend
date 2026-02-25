import React from 'react';

export default function StatsPanel({ stats }) {
    if (!stats) return null;

    return (
        <div className="card" style={{ padding: '2rem 1.5rem' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', fontWeight: '800' }}>Today's Instant Orders</h2>
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
    );
}

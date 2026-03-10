import React, { useState, useEffect } from 'react';
import api from '../../config/api';

const METRICS = [
    { key: 'todayOrders', label: "Today's Orders", icon: 'receipt_long', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)', emptyText: '0' },
    { key: 'mealsToCook', label: 'Meals to Cook', icon: 'skillet', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', emptyText: '0' },
    { key: 'revenueToday', label: 'Revenue Today', icon: 'payments', gradient: 'linear-gradient(135deg, #10b981, #34d399)', prefix: '₹', emptyText: '₹0' },
    { key: 'openComplaints', label: 'Open Complaints', icon: 'warning', gradient: 'linear-gradient(135deg, #ef4444, #f87171)', emptyText: '0', alertIfAbove: 0 },
    { key: 'activeZones', label: 'Active Zones', icon: 'location_on', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', emptyText: '0' },
];

export default function LaunchConsole() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const fetchConsole = async () => {
            try {
                const res = await api.get('/analytics/launch-console');
                setData(res.data.data);
            } catch (err) {
                console.error('Launch console fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchConsole();
        const interval = setInterval(fetchConsole, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const tick = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(tick);
    }, []);

    const greeting = (() => {
        const h = time.getHours();
        if (h < 12) return 'Good Morning';
        if (h < 17) return 'Good Afternoon';
        return 'Good Evening';
    })();

    const dateStr = time.toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    const timeStr = time.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    if (loading) {
        return (
            <div style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
                borderRadius: '20px',
                padding: '32px',
                marginBottom: '24px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        border: '3px solid rgba(255,255,255,0.2)',
                        borderTopColor: '#818cf8',
                        animation: 'spin 0.8s linear infinite'
                    }} />
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
        );
    }

    return (
        <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
            borderRadius: '20px',
            padding: '28px',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative orbs */}
            <div style={{
                position: 'absolute', top: '-40px', right: '-40px',
                width: '160px', height: '160px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(129,140,248,0.15), transparent)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', bottom: '-60px', left: '20%',
                width: '200px', height: '200px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(168,85,247,0.1), transparent)',
                pointerEvents: 'none'
            }} />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#818cf8', fontSize: '20px' }}>rocket_launch</span>
                        <span style={{ color: '#c7d2fe', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>Launch Console</span>
                    </div>
                    <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, margin: 0 }}>{greeting}, Founder</h2>
                    <p style={{ color: '#a5b4fc', fontSize: '13px', margin: '4px 0 0 0' }}>{dateStr}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{
                        color: '#e0e7ff', fontSize: '24px', fontWeight: 800,
                        fontVariantNumeric: 'tabular-nums', fontFamily: 'monospace'
                    }}>{timeStr}</div>
                    <div style={{ color: '#818cf8', fontSize: '10px', fontWeight: 700, letterSpacing: '1px' }}>IST</div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px',
                position: 'relative',
                zIndex: 1
            }}>
                {METRICS.map(metric => {
                    const value = data?.[metric.key] ?? 0;
                    const displayValue = metric.prefix ? `${metric.prefix}${value}` : value;
                    const isAlert = metric.alertIfAbove !== undefined && value > metric.alertIfAbove;

                    return (
                        <div key={metric.key} style={{
                            background: 'rgba(255,255,255,0.06)',
                            backdropFilter: 'blur(12px)',
                            borderRadius: '14px',
                            padding: '16px',
                            border: isAlert ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.06)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'default'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px',
                                background: metric.gradient,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '12px'
                            }}>
                                <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '18px' }}>{metric.icon}</span>
                            </div>
                            <div style={{
                                color: '#fff', fontSize: '26px', fontWeight: 800,
                                lineHeight: 1, marginBottom: '4px',
                                fontVariantNumeric: 'tabular-nums'
                            }}>
                                {displayValue}
                            </div>
                            <div style={{
                                color: '#94a3b8', fontSize: '11px', fontWeight: 600,
                                textTransform: 'uppercase', letterSpacing: '0.5px'
                            }}>
                                {metric.label}
                            </div>
                            {isAlert && (
                                <div style={{
                                    marginTop: '6px', fontSize: '10px', fontWeight: 700, color: '#fca5a5',
                                    display: 'flex', alignItems: 'center', gap: '4px'
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>priority_high</span>
                                    Needs attention
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Zone list */}
            {data?.zoneList?.length > 0 && (
                <div style={{
                    marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px',
                    position: 'relative', zIndex: 1, flexWrap: 'wrap'
                }}>
                    <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Zones:</span>
                    {data.zoneList.map(zone => (
                        <span key={zone} style={{
                            background: 'rgba(139,92,246,0.2)', color: '#c4b5fd',
                            fontSize: '10px', fontWeight: 700, padding: '3px 10px',
                            borderRadius: '20px', border: '1px solid rgba(139,92,246,0.3)'
                        }}>{zone}</span>
                    ))}
                </div>
            )}
        </div>
    );
}

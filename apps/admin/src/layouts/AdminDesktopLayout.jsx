import React from 'react';

const navItems = [
    { id: 'subscriptions', icon: 'card_membership', label: 'Subscriptions' },
    { id: 'orders', icon: 'receipt_long', label: 'Orders' },
    { id: 'team', icon: 'local_shipping', label: 'Delivery Team' },
    { id: 'menu', icon: 'restaurant_menu', label: 'Menu' },
    { id: 'complaints', icon: 'report_problem', label: 'Complaints' },
    { id: 'stats', icon: 'bar_chart', label: 'Stats' },
];

export default function AdminDesktopLayout({ children, activeTab, onTabChange, onLogout }) {
    return (
        <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--bg)', color: 'var(--text-main)' }}>
            {/* Skip to Content */}
            <a
                href="#admin-main"
                className="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:shadow-lg"
                style={{ background: 'var(--primary)', color: '#fff' }}
            >
                Skip to content
            </a>

            {/* ── Fixed Left Sidebar ── */}
            <aside
                role="navigation"
                aria-label="Admin navigation"
                style={{
                    width: '260px',
                    flexShrink: 0,
                    background: 'white',
                    borderRight: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                }}
            >
                {/* Logo */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.2 }}>
                        Maa Ki<br /><span style={{ fontStyle: 'italic', opacity: 0.8 }}>Rasoi</span>
                    </h1>
                    <p style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 500 }}>Admin Kitchen Panel</p>
                </div>

                {/* Nav Items */}
                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', padding: '1rem 0.75rem', overflowY: 'auto' }} aria-label="Admin sections">
                    {navItems.map(item => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                aria-current={isActive ? 'page' : undefined}
                                aria-label={`Navigate to ${item.label}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    width: '100%',
                                    textAlign: 'left',
                                    outline: 'none',
                                    background: isActive ? 'rgba(200,85,10,0.1)' : 'transparent',
                                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                }}
                                onFocus={(e) => { e.target.style.boxShadow = '0 0 0 2px var(--primary)'; }}
                                onBlur={(e) => { e.target.style.boxShadow = 'none'; }}
                                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}
                                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                                {item.label}
                                {isActive && <span style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }}></span>}
                            </button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)' }}>
                    <button
                        onClick={onLogout}
                        aria-label="Log out"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            width: '100%',
                            textAlign: 'left',
                            outline: 'none',
                            background: 'transparent',
                            color: 'var(--text-muted)',
                        }}
                        onFocus={(e) => { e.target.style.boxShadow = '0 0 0 2px #c0392b'; }}
                        onBlur={(e) => { e.target.style.boxShadow = 'none'; }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(192,57,43,0.08)'; e.currentTarget.style.color = '#c0392b'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>logout</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* ── Main Content Area ── */}
            <main id="admin-main" role="main" style={{ flex: 1, overflowY: 'auto', height: '100vh', padding: '1.5rem 2rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}

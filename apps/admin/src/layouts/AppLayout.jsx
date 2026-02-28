import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AppLayout = ({ children, activeTab, onTabChange, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1025);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1025);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navItems = [
        { id: 'subscriptions', icon: 'card_membership', label: 'Subscriptions' },
        { id: 'orders', icon: 'receipt_long', label: 'Orders' },
        { id: 'team', icon: 'local_shipping', label: 'Team' },
        { id: 'menu', icon: 'restaurant_menu', label: 'Menu' },
        { id: 'complaints', icon: 'report_problem', label: 'Complaints' },
        { id: 'stats', icon: 'bar_chart', label: 'Stats' },
    ];

    if (location.pathname === '/admin/login') {
        return <div className="min-h-screen bg-[var(--brand-cream)] dark:bg-[#121212] flex flex-col items-center justify-center p-4">{children}</div>;
    }

    return (
        <div className="min-h-screen bg-[var(--brand-cream)] dark:bg-[#121212] flex flex-col md:flex-row overflow-x-hidden">
            {/* Desktop Sidebar */}
            {isDesktop && (
                <aside className="sidebar fixed left-0 top-0 h-screen bg-[var(--brand-cream)] border-r border-brand-orange/5 flex flex-col p-8 z-50">
                    <div className="mb-12">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-orange to-brand-orange-light bg-clip-text text-transparent">
                            Maa Ki Rasoi <span className="text-sm font-normal text-text-muted">Admin</span>
                        </h1>
                    </div>

                    <nav className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${activeTab === item.id
                                    ? 'bg-brand-orange text-white shadow-lg'
                                    : 'text-brand-dark hover:bg-transparent'
                                    }`}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span className="font-semibold">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <button
                        onClick={onLogout}
                        className="text-error font-semibold flex items-center gap-2 mt-auto p-4 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Logout
                    </button>
                </aside>
            )}

            {/* Main Content Area */}
            <main className={`flex-1 transition-all flex flex-col ${isDesktop ? 'ml-[280px]' : 'pb-[80px]'}`}>
                {/* Mobile Header */}
                {!isDesktop && (
                    <header className="header px-4 flex justify-between items-center shadow-sm">
                        <h1 className="text-xl font-bold text-brand-orange mb-0 font-heading">MKR Admin</h1>
                        <button onClick={onLogout} className="text-error material-symbols-outlined text-xl">
                            logout
                        </button>
                    </header>
                )}

                <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            {!isDesktop && (
                <nav className="bottom-nav overflow-x-auto justify-start gap-4 px-4 py-2">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`flex flex-col items-center gap-1 transition-colors min-w-[70px] shrink-0 ${activeTab === item.id ? 'text-brand-orange' : 'text-text-muted'}`}
                        >
                            <span className={`material-symbols-outlined ${activeTab === item.id ? 'fill-current' : ''}`}>
                                {item.icon}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                        </button>
                    ))}
                </nav>
            )}
        </div>
    );
};

export default AppLayout;



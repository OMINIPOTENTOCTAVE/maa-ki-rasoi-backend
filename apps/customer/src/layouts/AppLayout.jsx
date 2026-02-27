import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const AppLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('customer_token'));
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1025);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1025);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navItems = [
        { id: 'home', path: '/', icon: 'home', label: 'Home' },
        { id: 'menu', path: '/menu', icon: 'restaurant_menu', label: 'Menu' },
        { id: 'orders', path: '/orders', icon: 'receipt_long', label: 'Orders', protected: true },
        { id: 'profile', path: '/profile', icon: 'person', label: 'Profile', protected: true },
    ];

    const visibleItems = navItems.filter(item => !item.protected || isLoggedIn);

    const handleNav = (path) => {
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-brand-cream dark:bg-brand-dark flex flex-col md:flex-row">
            {/* Desktop Sidebar */}
            {isDesktop && (
                <aside className="sidebar fixed left-0 top-0 h-screen bg-brand-white border-r border-gray-100 flex flex-col p-8 z-50">
                    <div className="mb-12">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-orange to-brand-orange-light bg-clip-text text-transparent">
                            Maa Ki Rasoi
                        </h1>
                    </div>

                    <nav className="flex flex-col gap-4 flex-1">
                        {visibleItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleNav(item.path)}
                                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${location.pathname === item.path
                                        ? 'bg-brand-orange text-white shadow-lg'
                                        : 'text-brand-brown-muted hover:bg-brand-beige'
                                    }`}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span className="font-semibold">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    {!isLoggedIn ? (
                        <button
                            onClick={() => navigate('/login')}
                            className="btn btn-secondary mt-auto"
                        >
                            <span className="material-symbols-outlined">login</span>
                            Login
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                localStorage.removeItem('customer_token');
                                window.location.reload();
                            }}
                            className="text-error font-semibold flex items-center gap-2 mt-auto p-4"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            Logout
                        </button>
                    )}
                </aside>
            )}

            {/* Main Content Area */}
            <main className={`flex-1 transition-all ${isDesktop ? 'ml-[280px]' : 'pb-[80px]'}`}>
                {/* Mobile Header */}
                {!isDesktop && (
                    <header className="header px-4 flex justify-between items-center shadow-sm">
                        <h1 className="text-xl font-bold text-brand-orange mb-0">Maa Ki Rasoi</h1>
                        {!isLoggedIn && (
                            <Link to="/login" className="text-brand-orange font-semibold flex items-center gap-1">
                                <span className="material-symbols-outlined text-xl">login</span>
                                Login
                            </Link>
                        )}
                    </header>
                )}

                <div className="page-wrapper py-6 animate-fade-in">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            {!isDesktop && (
                <nav className="bottom-nav">
                    {visibleItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleNav(item.path)}
                            className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === item.path ? 'text-brand-orange' : 'text-text-muted'
                                }`}
                        >
                            <span className={`material-symbols-outlined ${location.pathname === item.path ? 'fill-current' : ''}`}>
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

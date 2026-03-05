import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Home, UtensilsCrossed, Receipt, User, LogOut, LogIn } from 'lucide-react';

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
        { id: 'home', path: '/', icon: <Home className="w-6 h-6" />, label: 'Home' },
        { id: 'menu', path: '/menu', icon: <UtensilsCrossed className="w-6 h-6" />, label: 'Menu' },
        { id: 'orders', path: '/orders', icon: <Receipt className="w-6 h-6" />, label: 'Orders', protected: true },
        { id: 'profile', path: '/profile', icon: <User className="w-6 h-6" />, label: 'Profile', protected: true },
    ];

    const visibleItems = navItems.filter(item => !item.protected || isLoggedIn);

    const handleNav = (path) => {
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row overflow-x-hidden selection:bg-primary/20">
            {/* Global noise texture overlay — subtle paper feel */}
            <div className="noise-overlay" aria-hidden="true" />
            {/* Desktop Sidebar */}
            {isDesktop && (
                <aside className="sidebar fixed left-0 top-0 h-screen bg-background border-r border-border flex flex-col p-8 z-50 w-[280px]">
                    <div className="mb-12">
                        <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                            Maa Ki Rasoi
                        </h1>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 font-bold">Daily Tiffin Service</p>
                    </div>

                    <nav className="flex flex-col gap-3 flex-1">
                        {visibleItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleNav(item.path)}
                                className={`flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all outline-none font-bold ${location.pathname === item.path
                                    ? 'bg-primary text-white shadow-md shadow-primary/20 translate-x-2'
                                    : 'text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm border border-transparent hover:border-border'
                                    }`}
                            >
                                {item.icon}
                                <span className="text-base">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    {!isLoggedIn ? (
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full flex justify-center items-center gap-2 px-6 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 mt-auto"
                        >
                            <LogIn className="w-5 h-5" />
                            Login
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                localStorage.removeItem('customer_token');
                                window.location.reload();
                            }}
                            className="text-destructive font-bold flex items-center justify-center gap-2 mt-auto p-4 hover:bg-destructive/10 rounded-full transition-colors w-full"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    )}
                </aside>
            )}

            {/* Main Content Area */}
            <main className={`flex-1 transition-all flex flex-col min-h-screen ${isDesktop ? 'ml-[280px]' : 'pb-[80px]'}`}>
                {/* Mobile Header */}
                {!isDesktop && location.pathname !== '/login' && (
                    <header className="px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
                        <h1 className="text-2xl font-bold text-primary font-heading">MKR.</h1>
                        {!isLoggedIn && (
                            <Link to="/login" className="px-5 py-2 bg-primary/10 text-primary rounded-full font-bold text-sm flex items-center gap-2 active:scale-95 transition-transform">
                                <LogIn className="w-4 h-4" />
                                Login
                            </Link>
                        )}
                    </header>
                )}

                <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            {!isDesktop && location.pathname !== '/login' && (
                <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-border shadow-2xl rounded-t-[2rem] px-6 py-4 pb-safe flex justify-between items-center max-w-md mx-auto">
                    {visibleItems.map(item => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNav(item.path)}
                                className={`flex flex-col items-center gap-1.5 transition-all relative ${isActive ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <div className={`p-2 rounded-2xl transition-colors ${isActive ? 'bg-primary/10' : ''}`}>
                                    {item.icon}
                                </div>
                                <span className={`text-[10px] uppercase tracking-wider ${isActive ? 'font-bold' : 'font-medium'}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            )}
        </div>
    );
};

export default AppLayout;




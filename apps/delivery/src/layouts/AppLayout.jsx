import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AppLayout = ({ children, customSidebarData }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1025);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1025);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('deliveryToken');
        navigate('/login');
    };

    if (location.pathname === '/login') {
        return <div className="min-h-screen bg-[var(--brand-cream)] dark:bg-[#121212] flex flex-col items-center justify-center p-4">{children}</div>;
    }

    return (
        <div className="min-h-screen bg-[var(--brand-cream)] dark:bg-[#121212] flex flex-col md:flex-row overflow-x-hidden">
            {/* Desktop Sidebar */}
            {isDesktop && (
                <aside className="sidebar fixed left-0 top-0 h-screen bg-[var(--brand-cream)] border-r border-brand-orange/5 flex flex-col p-8 z-50">
                    <div className="mb-12">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-orange to-brand-orange-light bg-clip-text text-transparent leading-tight">
                            Maa Ki Rasoi <br /><span className="text-sm font-normal text-text-muted">Delivery</span>
                        </h1>
                    </div>

                    <nav className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-orange text-white shadow-lg">
                            <span className="material-symbols-outlined">route</span>
                            <span className="font-semibold">Today's Route</span>
                            <span className="ml-auto w-2 h-2 rounded-full bg-white"></span>
                        </div>
                        {customSidebarData}
                    </nav>

                    <div className="mt-auto flex flex-col gap-2 pt-4">
                        <div className="flex items-center gap-2 p-2 px-4">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                            </span>
                            <span className="text-sm font-bold text-text-main">Online</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-error font-semibold flex items-center gap-2 p-4 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            Logout
                        </button>
                    </div>
                </aside>
            )}

            {/* Main Content Area */}
            <main className={`flex-1 transition-all flex flex-col ${isDesktop ? 'ml-[280px]' : ''}`}>
                {/* Mobile Header */}
                {!isDesktop && (
                    <header className="header sticky top-0 px-4 flex justify-between items-center shadow-sm z-20">
                        <h1 className="text-xl font-bold text-brand-orange mb-0 font-heading tracking-tight">Today's Route</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                                </span>
                                <span className="text-xs font-bold text-text-main">Online</span>
                            </div>
                            <button onClick={handleLogout} className="text-xs font-bold text-text-muted hover:text-text-main">
                                Logout
                            </button>
                        </div>
                    </header>
                )}

                <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AppLayout;

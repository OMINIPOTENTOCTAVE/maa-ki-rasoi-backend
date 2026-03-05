import React from 'react';
import { Home, UtensilsCrossed, Receipt, User, HeadphonesIcon, LogOut, LogIn } from 'lucide-react';

export default function DesktopLayout({ children, activeTab, onTabChange, rightPanel, isLoggedIn }) {
    const allNavItems = [
        { id: 'home', icon: <Home className="w-5 h-5" />, label: 'Home', guestVisible: true },
        { id: 'menu', icon: <UtensilsCrossed className="w-5 h-5" />, label: 'Menu', guestVisible: true },
        { id: 'orders', icon: <Receipt className="w-5 h-5" />, label: 'Orders', guestVisible: false },
        { id: 'profile', icon: <User className="w-5 h-5" />, label: 'Profile', guestVisible: false },
    ];

    const navItems = allNavItems.filter(item => isLoggedIn || item.guestVisible);

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/20">
            {/* ── Skip to Content (A11y) ── */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:top-4 focus:left-4 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:shadow-lg"
            >
                Skip to content
            </a>

            {/* ── Fixed Left Sidebar ── */}
            <aside
                className="hidden md:flex flex-col w-[260px] shrink-0 bg-white border-r border-border h-screen sticky top-0"
                role="navigation"
                aria-label="Main navigation"
            >
                {/* Logo */}
                <div className="px-8 pt-8 pb-6 border-b border-border/50">
                    <h1 className="font-heading text-3xl font-bold text-primary leading-tight">
                        Maa Ki<br /><span className="italic opacity-80">Rasoi</span>
                    </h1>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2 font-bold">Daily Tiffin Service</p>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 flex flex-col gap-2 px-4 py-6 overflow-y-auto" aria-label="Sidebar navigation">
                    {navItems.map(item => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                aria-current={isActive ? 'page' : undefined}
                                aria-label={`Navigate to ${item.label}`}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-[1rem] text-sm font-bold transition-all group outline-none
                                    focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                                    ${isActive
                                        ? 'bg-primary text-white shadow-md shadow-primary/20 translate-x-1'
                                        : 'text-muted-foreground hover:bg-background hover:text-foreground'
                                    }`}
                            >
                                <span className={`transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`}>
                                    {item.icon}
                                </span>
                                {item.label}
                                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></span>}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => onTabChange('support')}
                        aria-label="Navigate to Support"
                        className="flex items-center gap-4 px-4 py-3.5 rounded-[1rem] text-sm font-bold text-muted-foreground hover:bg-background hover:text-foreground transition-all group outline-none mt-2
                            focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                        <span className="transition-transform group-hover:scale-110"><HeadphonesIcon className="w-5 h-5" /></span>
                        Support
                    </button>
                </nav>

                {/* Auth — pinned to bottom */}
                <div className="p-6 border-t border-border/50 bg-background/50">
                    {isLoggedIn ? (
                        <button
                            onClick={() => {
                                localStorage.removeItem('customer_token');
                                localStorage.removeItem('customer_data');
                                window.location.href = '/';
                            }}
                            aria-label="Log out"
                            className="flex items-center justify-center gap-3 px-4 py-3.5 rounded-[1.5rem] text-sm font-bold text-destructive hover:bg-destructive/10 transition-all w-full group outline-none
                                focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2"
                        >
                            <span className="transition-transform group-hover:scale-110"><LogOut className="w-5 h-5" /></span>
                            Logout
                        </button>
                    ) : (
                        <button
                            onClick={() => { window.location.href = '/login'; }}
                            aria-label="Log in"
                            className="flex items-center justify-center gap-3 px-4 py-3.5 rounded-full text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-all w-full group outline-none shadow-md shadow-primary/20
                                focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                            <span className="transition-transform group-hover:scale-110"><LogIn className="w-5 h-5" /></span>
                            Login / Sign Up
                        </button>
                    )}
                </div>
            </aside>

            {/* ── Main Content Area ── */}
            <main id="main-content" className="flex-1 overflow-y-auto h-screen" role="main">
                <div className="max-w-5xl mx-auto px-6 py-8">
                    {children}
                </div>
            </main>

            {/* ── Optional Right Panel (wide screens only) ── */}
            {rightPanel && (
                <aside
                    className="hidden lg:flex flex-col w-[320px] shrink-0 bg-white border-l border-border h-screen sticky top-0 overflow-y-auto p-6 gap-6"
                    aria-label="Context panel"
                >
                    {rightPanel}
                </aside>
            )}
        </div>
    );
}


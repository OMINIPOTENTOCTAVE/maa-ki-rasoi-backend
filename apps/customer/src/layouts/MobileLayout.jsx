import React from 'react';
import { Home, UtensilsCrossed, Receipt, User, LogIn } from 'lucide-react';

export default function MobileLayout({ children, activeTab, onTabChange, isLoggedIn }) {
    const allNavItems = [
        { id: 'home', icon: <Home className="w-6 h-6" />, label: 'Home', guestVisible: true },
        { id: 'menu', icon: <UtensilsCrossed className="w-6 h-6" />, label: 'Menu', guestVisible: true },
        { id: 'orders', icon: <Receipt className="w-6 h-6" />, label: 'Orders', guestVisible: false },
        { id: 'profile', icon: <User className="w-6 h-6" />, label: 'Profile', guestVisible: false },
    ];

    // Guests see Home + Menu + Login button. Logged-in see all 4 tabs.
    const navItems = allNavItems.filter(item => isLoggedIn || item.guestVisible);

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background selection:bg-primary/20 pb-[90px]">
            {children}

            {/* Fixed Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] rounded-t-[2rem] max-w-md mx-auto">
                <div className="flex justify-between items-center px-6 py-4 pb-safe">
                    {navItems.map(item => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
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

                    {/* Login tab for guests */}
                    {!isLoggedIn && (
                        <button
                            onClick={() => { window.location.href = '/login'; }}
                            className="flex flex-col items-center gap-1.5 transition-all text-primary"
                        >
                            <div className="p-2 rounded-2xl bg-primary/10 transition-colors">
                                <LogIn className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] uppercase tracking-wider font-bold">Login</span>
                        </button>
                    )}
                </div>
            </nav>
        </div>
    );
}


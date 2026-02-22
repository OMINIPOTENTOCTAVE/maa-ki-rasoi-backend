import React from 'react';

export default function MobileLayout({ children, activeTab, onTabChange }) {
    const navItems = [
        { id: 'home', icon: 'home', label: 'Home' },
        { id: 'menu', icon: 'restaurant_menu', label: 'Menu' },
        { id: 'orders', icon: 'receipt_long', label: 'Orders' },
        { id: 'profile', icon: 'person', label: 'Profile' }
    ];

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-brand-cream dark:bg-brand-dark shadow-xl font-display text-slate-900 pb-[72px]">
            {/* Dynamic Content Area */}
            {children}

            {/* Fixed Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#181511]/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 max-w-md mx-auto">
                <div className="flex justify-between items-center px-4 pb-safe pt-2">
                    {navItems.map(item => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className={`flex flex-1 flex-col items-center justify-end gap-1 pb-2 transition-colors group ${isActive ? 'text-brand-saffron' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                            >
                                <div className={`flex flex-col items-center ${isActive ? 'bg-brand-saffron/10 px-4 py-0.5 rounded-full' : ''}`}>
                                    <span className={`material-symbols-outlined text-2xl transition-transform group-hover:-translate-y-0.5 ${isActive ? 'fill-current' : ''}`}>{item.icon}</span>
                                    <span className={`text-[10px] sm:text-xs leading-none mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}

import React from 'react';

const navItems = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'menu', icon: 'restaurant_menu', label: 'Menu' },
    { id: 'orders', icon: 'receipt_long', label: 'Orders' },
    { id: 'profile', icon: 'person', label: 'Profile' },
];

export default function DesktopLayout({ children, activeTab, onTabChange, rightPanel }) {
    return (
        <div className="flex h-screen w-full bg-brand-cream dark:bg-brand-dark overflow-hidden">
            {/* ── Fixed Left Sidebar ── */}
            <aside className="hidden md:flex flex-col w-[250px] shrink-0 bg-white dark:bg-[#1e1710] border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0">
                {/* Logo */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <h1 className="font-heading text-xl font-bold text-brand-saffron leading-tight">
                        Maa Ki<br /><span className="italic opacity-80">Rasoi</span>
                    </h1>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-medium">Daily Tiffin Service</p>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
                    {navItems.map(item => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group
                                    ${isActive
                                        ? 'bg-brand-saffron/10 text-brand-saffron shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-xl transition-transform group-hover:scale-110 ${isActive ? 'text-brand-saffron' : ''}`}>
                                    {item.icon}
                                </span>
                                {item.label}
                                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-saffron"></span>}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => onTabChange('support')}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all group"
                    >
                        <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">support_agent</span>
                        Support
                    </button>
                </nav>

                {/* Logout — pinned to bottom */}
                <div className="px-3 pb-4 border-t border-gray-100 dark:border-gray-800 pt-3">
                    <button
                        onClick={() => {
                            localStorage.removeItem('customer_token');
                            localStorage.removeItem('customer_data');
                            window.location.href = '/login';
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all w-full group"
                    >
                        <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">logout</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* ── Main Content Area ── */}
            <main className="flex-1 overflow-y-auto h-screen">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>

            {/* ── Optional Right Panel (wide screens only) ── */}
            {rightPanel && (
                <aside className="hidden 2xl:flex flex-col w-[300px] shrink-0 bg-white dark:bg-[#1e1710] border-l border-gray-200 dark:border-gray-800 h-screen sticky top-0 overflow-y-auto p-5 gap-5">
                    {rightPanel}
                </aside>
            )}
        </div>
    );
}

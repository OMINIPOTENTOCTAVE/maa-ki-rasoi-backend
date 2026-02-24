import React, { useState, useEffect } from 'react';
import useMediaQuery from '@/hooks/useMediaQuery';

export default function ProfileView({ onLogout, onManageSubscription, onSupportClick }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [customer, setCustomer] = useState(null);
    const { isMobile } = useMediaQuery();

    useEffect(() => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
        const storedCustomer = localStorage.getItem('customer_data');
        if (storedCustomer) {
            try {
                setCustomer(JSON.parse(storedCustomer));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-brand-cream dark:bg-brand-dark overflow-y-auto no-scrollbar pb-24 md:pb-8">
            <div className="flex items-center justify-between p-4 pt-6 md:p-6 bg-brand-cream dark:bg-[#2d2418] sticky top-0 z-20 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-slate-900 dark:text-white text-lg md:text-2xl font-bold leading-tight tracking-[-0.015em] ml-2 font-heading">Profile & Settings</h2>
                <button className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-2xl">notifications</span>
                </button>
            </div>

            {/* ── Desktop: 2-column / Mobile: stacked ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6 lg:p-8">
                {/* Left: Profile Info + Plan */}
                <div className="space-y-6">
                    {/* Avatar + Name */}
                    <div className="flex flex-col items-center md:items-start md:flex-row md:gap-5 pt-2">
                        <div className="relative group cursor-pointer shrink-0">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-28 w-28 md:h-20 md:w-20 border-4 border-white dark:border-[#2d2418] shadow-lg" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCPvboZp9gcnjYOYBP57Qb6UYUcm0X_MH9O56828bEVYLsw_S-1d_ah8PlF6MmODNUBxImZezYatfJPbjleSoAkMFmEFEGLZ_HNO3rjwPQv5EG1q2OqbEgLpprGGVFRMOojg5uGhj5vx9TgMqL3Gkiu22UpQWk5bXudDP1LyK6Ea9Q5DhrGrtDQzgRZ9t1WkTAaEbVJ_okqjLmaHU1loYJ47SC_-UfZdQP80bA7OCiptmyIVAqes94Q-JeDfjBApmoiDV3QBxi0qXBY')" }}></div>
                            <div className="absolute bottom-0 right-0 bg-brand-saffron text-white p-1.5 rounded-full border-2 border-brand-cream dark:border-brand-dark flex items-center justify-center shadow-md">
                                <span className="material-symbols-outlined text-sm">edit</span>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 text-center md:text-left">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">{customer?.name || 'Customer'}</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">+91 {customer?.phone || '...'}</p>
                        </div>
                    </div>

                    {/* Active Plan Card */}
                    <div className="bg-white dark:bg-[#2d2418] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-saffron/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Active Plan</p>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Standard Veg Thali</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Next delivery: Today, 1:00 PM</p>
                            </div>
                            <div className="bg-brand-saffron/20 text-brand-saffron px-3 py-1 rounded-lg">
                                <span className="text-xs font-bold">LUNCH</span>
                            </div>
                        </div>
                        <div className="mt-5 relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-brand-saffron">12 Meals Remaining</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">Expires 25 Aug</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div className="bg-brand-saffron h-2 rounded-full w-[60%]"></div>
                            </div>
                        </div>
                        <button onClick={onManageSubscription} className="mt-4 w-full py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                            <span>Manage Subscription</span>
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </button>
                    </div>
                </div>

                {/* Right: Settings */}
                <div className="space-y-6">
                    <div>
                        <h3 className="px-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">App Settings</h3>
                        <div className="bg-white dark:bg-[#2d2418] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                            <button onClick={toggleDarkMode} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xl">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                                    </div>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">
                                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                    </span>
                                </div>
                                <label className="relative inline-flex cursor-pointer items-center pointer-events-none">
                                    <input type="checkbox" className="peer sr-only" checked={isDarkMode} readOnly />
                                    <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-saffron peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-700"></div>
                                </label>
                            </button>
                            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xl">location_on</span>
                                    </div>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">Manage Addresses</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 text-xl">chevron_right</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="px-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Support & Legal</h3>
                        <div className="bg-white dark:bg-[#2d2418] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                            <button onClick={onSupportClick} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-lg bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xl">help</span>
                                    </div>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">Help & Support</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 text-xl">chevron_right</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-lg bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xl">description</span>
                                    </div>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">Terms & Conditions</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 text-xl">chevron_right</span>
                            </button>
                        </div>
                    </div>

                    {/* Logout — on desktop, sidebar has logout, but keep it here too for consistency */}
                    {isMobile && (
                        <div className="flex flex-col items-center gap-4 mt-4 mb-4">
                            <button onClick={onLogout} className="flex items-center gap-2 text-red-500 dark:text-red-400 font-bold px-6 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                <span className="material-symbols-outlined text-xl">logout</span> Log Out
                            </button>
                            <div className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                                <p className="text-[10px] text-slate-400 dark:text-slate-500">Maa Ki Rasoi App v2.4.0</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

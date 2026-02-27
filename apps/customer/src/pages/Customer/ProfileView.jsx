import React, { useState, useEffect } from 'react';
import useMediaQuery from '@/hooks/useMediaQuery';

export default function ProfileView({ onLogout, onManageSubscription, onSupportClick, subscriptions = [] }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [customer, setCustomer] = useState(null);
    const { isMobile } = useMediaQuery();

    const activeSub = subscriptions.find(s => s.status === 'Active');

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
        const nextMode = !isDarkMode;
        setIsDarkMode(nextMode);
        if (nextMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-brand-cream dark:bg-brand-dark overflow-y-auto no-scrollbar pb-24 md:pb-8">
            <div className="flex items-center justify-between p-4 pt-5 md:p-6 bg-brand-cream dark:bg-[#2d2418] sticky top-0 z-20 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-slate-900 dark:text-white text-lg md:text-2xl font-bold leading-tight tracking-[-0.015em] ml-2 font-heading">Profile & Settings</h2>
                <button className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-2xl">notifications</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 md:p-6 lg:p-8">
                {/* Left: Profile Info + Plan */}
                <div className="space-y-5">
                    {/* Avatar + Name */}
                    <div className="flex flex-col items-center md:items-start md:flex-row md:gap-5 pt-2">
                        <div className="relative group cursor-pointer shrink-0">
                            <div className="bg-brand-saffron/10 rounded-full h-24 w-24 md:h-20 md:w-20 border-4 border-white dark:border-[#2d2418] shadow-lg flex items-center justify-center text-3xl font-bold text-brand-saffron capitalize">
                                {customer?.name?.charAt(0) || 'C'}
                            </div>
                            <div className="absolute bottom-0 right-0 bg-brand-saffron text-white p-1 rounded-full border-2 border-brand-cream dark:border-brand-dark flex items-center justify-center shadow-md">
                                <span className="material-symbols-outlined text-xs">edit</span>
                            </div>
                        </div>
                        <div className="mt-3 md:mt-0 text-center md:text-left">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{customer?.name || 'Customer'}</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-0.5">+91 {customer?.phone || '...'}</p>
                        </div>
                    </div>

                    {/* Active Plan Card — bound to real data */}
                    <div className="bg-white dark:bg-[#2d2418] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">Active Plan</p>
                                {activeSub ? (
                                    <>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{activeSub.planType} Pure Veg</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                            {activeSub.mealsRemaining} meals remaining • Expires {new Date(activeSub.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Active Plan</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Subscribe to get daily meals!</p>
                                    </>
                                )}
                            </div>
                            {activeSub && (
                                <div className="bg-brand-green/20 text-brand-green px-2.5 py-0.5 rounded-lg">
                                    <span className="text-xs font-bold">Active</span>
                                </div>
                            )}
                        </div>
                        <button onClick={onManageSubscription} className="mt-3 w-full py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                            <span>{activeSub ? 'Manage Subscription' : 'Explore Plans'}</span>
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </button>
                    </div>
                </div>

                {/* Right: Settings */}
                <div className="space-y-5">
                    <div>
                        <h3 className="px-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">App Settings</h3>
                        <div className="bg-white dark:bg-[#2d2418] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                            <button onClick={toggleDarkMode} className="w-full flex items-center justify-between p-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-lg">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                                    </div>
                                    <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                    </span>
                                </div>
                                <label className="relative inline-flex cursor-pointer items-center pointer-events-none">
                                    <input type="checkbox" className="peer sr-only" checked={isDarkMode} readOnly />
                                    <div className="peer h-5 w-9 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-saffron peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-700"></div>
                                </label>
                            </button>
                            <button className="w-full flex items-center justify-between p-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-lg">location_on</span>
                                    </div>
                                    <span className="font-medium text-sm text-slate-900 dark:text-slate-100">Manage Addresses</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 text-lg">chevron_right</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="px-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Support & Legal</h3>
                        <div className="bg-white dark:bg-[#2d2418] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                            <button onClick={onSupportClick} className="w-full flex items-center justify-between p-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-lg">help</span>
                                    </div>
                                    <span className="font-medium text-sm text-slate-900 dark:text-slate-100">Help & Support</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 text-lg">chevron_right</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-lg">description</span>
                                    </div>
                                    <span className="font-medium text-sm text-slate-900 dark:text-slate-100">Terms & Conditions</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 text-lg">chevron_right</span>
                            </button>
                        </div>
                    </div>

                    {isMobile && (
                        <div className="flex flex-col items-center gap-3 mt-2 mb-4">
                            <button onClick={onLogout} className="flex items-center gap-2 text-red-500 dark:text-red-400 font-bold px-6 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-sm">
                                <span className="material-symbols-outlined text-lg">logout</span> Log Out
                            </button>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">Maa Ki Rasoi v2.4.0</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

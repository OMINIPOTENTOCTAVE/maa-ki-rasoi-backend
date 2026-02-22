import React from 'react';

export default function OrdersView({ onBack, onExtendPlan, onReviewMeal, onRepeatMeal }) {
    return (
        <div className="flex flex-col h-full w-full bg-brand-cream dark:bg-brand-dark pb-24">
            <header className="sticky top-0 z-20 flex items-center justify-between bg-white/95 dark:bg-[#2d2418]/95 backdrop-blur-md px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="flex items-center justify-center rounded-full w-10 h-10 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                        <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">arrow_back</span>
                    </button>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Your Meal History</h1>
                </div>
                <button className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-brand-saffron">
                    <span className="material-symbols-outlined">filter_list</span>
                </button>
            </header>

            <main className="flex-1 px-4 py-6 space-y-8">
                <section className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white dark:bg-[#2d2418] shadow-sm p-4 border border-gray-100 dark:border-gray-800">
                        <p className="text-3xl font-bold text-brand-saffron">24</p>
                        <div className="flex items-center gap-1.5 opacity-80 text-slate-600 dark:text-slate-400">
                            <span className="material-symbols-outlined text-lg">restaurant</span>
                            <p className="text-xs font-medium uppercase tracking-wider">Meals Enjoyed</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white dark:bg-[#2d2418] shadow-sm p-4 border border-gray-100 dark:border-gray-800">
                        <p className="text-3xl font-bold text-brand-saffron">4.8</p>
                        <div className="flex items-center gap-1.5 opacity-80 text-slate-600 dark:text-slate-400">
                            <span className="material-symbols-outlined text-lg">star</span>
                            <p className="text-xs font-medium uppercase tracking-wider">Avg Rating</p>
                        </div>
                    </div>
                </section>

                <div className="rounded-xl bg-gradient-to-r from-brand-saffron/20 to-brand-saffron/5 p-4 border border-brand-saffron/20 flex items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-base text-brand-saffron">Love Maa's Food?</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Extend your monthly plan and get 10% off.</p>
                    </div>
                    <button onClick={onExtendPlan} className="whitespace-nowrap rounded-lg bg-brand-saffron px-4 py-2 text-sm font-bold text-white shadow-lg shadow-brand-saffron/20 hover:bg-[#D97706] transition-all">
                        Extend Plan
                    </button>
                </div>

                <section className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Past Deliveries</h2>

                    {/* Item */}
                    <div className="group relative flex flex-col gap-4 rounded-xl bg-white dark:bg-[#2d2418] p-4 shadow-sm border border-gray-100 dark:border-gray-800 hover:border-brand-saffron/50 transition-colors">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                                    <img alt="Thali" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqJr6at4N4f4ZYpHo2IMJ3GPmpSEQEWOWaON5tgIe2EbkSW0cR6_FHtE5-EioDiFwx-sy71AuAXal-Vi5ghA8Ty-acpxDCtTveEzHQ49si1Q2HVik59nGivNIOdRAc9EirKQGezhsOZB9XmRkxN0ITNMXf-QrvwG3T7cTj4mOSPDKJhLGDp3hXUi89cYaAg1CL5V6XgbOpal-09wYaU8_bPmAl5jZRszBidgj7UwlbUWig9TEuHalM24jzfpO7DCmSjsveH2XfJZNG" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base leading-tight text-slate-900 dark:text-slate-100">Monday Special Thali</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Oct 24, 2023 • Lunch</p>
                                    <div className="mt-2 flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 w-fit">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                                        <span className="text-[10px] font-bold uppercase tracking-wide text-green-600 dark:text-green-400">Delivered</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800/50 pt-3">
                            <div className="flex flex-col gap-1">
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Rate this meal</p>
                                <div className="flex text-brand-saffron">
                                    <span className="material-symbols-outlined text-[20px] font-variation-settings-fill">star</span>
                                    <span className="material-symbols-outlined text-[20px] font-variation-settings-fill">star</span>
                                    <span className="material-symbols-outlined text-[20px] font-variation-settings-fill">star</span>
                                    <span className="material-symbols-outlined text-[20px] font-variation-settings-fill">star</span>
                                    <span className="material-symbols-outlined text-[20px]">star</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={onReviewMeal} className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <span className="material-symbols-outlined text-sm">edit</span> Review
                                </button>
                                <button onClick={onRepeatMeal} className="flex items-center gap-1 rounded-lg bg-brand-saffron/10 px-3 py-1.5 text-xs font-semibold text-brand-saffron hover:bg-brand-saffron/20 transition-colors">
                                    <span className="material-symbols-outlined text-sm">autorenew</span> Repeat
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Additional simulated historical item */}
                    <div className="group relative flex flex-col gap-4 rounded-xl bg-white dark:bg-[#2d2418] p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                                    <img alt="Rajma" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHsHm7_3c4KWCpxa9OrG31W1in0EBdPKqNdmhPUpEi-Z8Tt3SYwbTgxPP_9ERrsKYaMLsGtnUm09quOZ_SQPyggeTpKo-Mm8-7j_SWua9WicF0IyL-n2YTM4r_d2THatCtJcs6vhskccdU5gV4bY3E368ffODu5XcrDHmUo0wyrjT_vzH_60Jp__a7sZOvnAAE2dq9pDheMT5t5a413cxyQMF450hpfx23ksTW8nGpJ8k8UPaXGU1_XjD22XoaWuiWBGYeFnXyddJW" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base leading-tight text-slate-900 dark:text-slate-100">Rajma Chawal Combo</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Oct 23, 2023 • Dinner</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

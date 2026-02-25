import React, { useState } from 'react';

export default function ExplorePlansView({ onBack, onCheckout }) {
    return (
        <div className="flex flex-col h-full w-full bg-brand-cream dark:bg-brand-dark overflow-y-auto pb-24 md:pb-8 no-scrollbar">
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#221b10]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 px-4 md:px-6 py-3">
                <div className="flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors md:hidden">
                        <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">arrow_back</span>
                    </button>
                    <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 font-heading">Choose Your Plan</h1>
                    <button onClick={() => window.open('https://wa.me/917428020104?text=Hi, I need help choosing a plan', '_blank')} className="text-brand-saffron text-sm font-bold hover:text-brand-saffron/80 transition-colors">
                        Help
                    </button>
                </div>
            </header>

            <main className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
                <div className="flex flex-col gap-2 mt-2">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                        Unlock Daily <br />
                        <span className="text-brand-saffron">Home-Cooked Meals</span>
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Experience the warmth of Maa Ki Rasoi. Simple, healthy, and delivered to your door.
                    </p>
                </div>

                {/* Plans — side-by-side on desktop, stacked on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Weekly Trial */}
                    <div className="group relative flex flex-col gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2d2418] p-5 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-saffron transition-colors">Weekly Trial</h3>
                                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Perfect for testing the taste</span>
                            </div>
                            <div className="bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10">
                                <span className="text-xs font-bold text-slate-900 dark:text-slate-200">₹114/meal</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">₹800</span>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ week</span>
                        </div>
                        <div className="h-px w-full bg-gray-100 dark:bg-white/5"></div>
                        <button onClick={() => onCheckout({ planType: 'Weekly', mealType: 'Lunch', dietaryPreference: 'Veg' })} className="mt-2 w-full py-3 rounded-xl bg-slate-900 dark:bg-white/10 text-white font-bold text-sm hover:bg-brand-saffron dark:hover:bg-brand-saffron transition-colors active:scale-95">
                            Subscribe for ₹800
                        </button>
                    </div>

                    {/* Monthly Standard (Highlighted) */}
                    <div className="relative flex flex-col gap-4 rounded-2xl border-2 border-brand-saffron bg-white dark:bg-[#2d2418] p-6 shadow-xl shadow-brand-saffron/10 md:scale-100 scale-[1.02] z-10">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-saffron text-slate-900 px-4 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase shadow-sm">
                            Best Value
                        </div>
                        <div className="flex justify-between items-start mt-2">
                            <div className="flex flex-col">
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Monthly Standard</h3>
                                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Our most popular plan</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">₹3000</span>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ month</span>
                        </div>
                        <ul className="flex flex-col gap-3 mt-2">
                            <li className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                                <span className="material-symbols-outlined text-brand-saffron">check_circle</span>
                                30 Days Lunch
                            </li>
                            <li className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                                <span className="material-symbols-outlined text-brand-saffron">check_circle</span>
                                <span className="text-brand-saffron font-bold">Free Delivery</span>
                            </li>
                        </ul>
                        <button onClick={() => onCheckout({ planType: 'Monthly', mealType: 'Lunch', dietaryPreference: 'Veg' })} className="mt-2 w-full py-4 rounded-xl bg-brand-saffron text-slate-900 font-extrabold text-base shadow-lg shadow-brand-saffron/25 hover:-translate-y-0.5 transition-all active:scale-95">
                            Subscribe Now
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

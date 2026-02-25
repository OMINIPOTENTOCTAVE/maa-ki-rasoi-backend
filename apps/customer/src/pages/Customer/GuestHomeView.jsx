import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function GuestHomeView({ onExploreClick, onMenuClick }) {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        axios.get('/menu').then(res => {
            setMenuItems(res.data.data || []);
        }).catch(() => { });
    }, []);

    return (
        <main className="flex-1 overflow-y-auto pb-24 md:pb-6">
            {/* ── Hero Section ── */}
            <section className="relative bg-gradient-to-br from-brand-saffron via-[#D97706] to-[#B45309] text-white px-5 py-7 md:px-8 md:py-10 md:rounded-xl md:mx-4 md:mt-4 overflow-hidden">
                <div className="relative z-10 max-w-xl">
                    <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold mb-3">
                        <span className="material-symbols-outlined text-sm">eco</span>
                        100% Pure Veg • Home-Style
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold leading-tight font-heading mb-2">
                        Ghar Ka Khana,<br />Har Din. 🍛
                    </h1>
                    <p className="text-white/80 text-sm md:text-base leading-relaxed mb-5">
                        Fresh, wholesome meals made with love — delivered to your doorstep daily. Starting at just <span className="font-bold text-white">₹100/meal</span>.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={onExploreClick}
                            className="px-5 py-2.5 bg-white text-brand-saffron font-bold rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95 text-sm"
                        >
                            View Plans & Pricing
                        </button>
                        <button
                            onClick={onMenuClick}
                            className="px-5 py-2.5 bg-white/15 text-white font-bold rounded-lg border border-white/25 hover:bg-white/25 transition-all active:scale-95 text-sm"
                        >
                            Today's Menu
                        </button>
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="px-4 md:px-8 py-5">
                <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-4 font-heading">How It Works</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        { icon: 'smartphone', title: 'Choose a Plan', desc: 'Pick Weekly or Monthly — flexible & affordable', color: 'bg-orange-50 text-brand-saffron dark:bg-orange-900/20' },
                        { icon: 'local_shipping', title: 'We Deliver Daily', desc: 'Fresh meals cooked & delivered to your door', color: 'bg-green-50 text-brand-green dark:bg-green-900/20' },
                        { icon: 'favorite', title: 'Enjoy Ghar Ka Khana', desc: 'Healthy, wholesome food — just like home', color: 'bg-red-50 text-red-500 dark:bg-red-900/20' },
                    ].map((step, i) => (
                        <div key={i} className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow group">
                            <div className={`w-10 h-10 rounded-lg ${step.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                                <span className="material-symbols-outlined text-xl">{step.icon}</span>
                            </div>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-0.5">{step.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Today's Menu Preview ── */}
            {menuItems.length > 0 && (
                <section className="px-4 md:px-8 py-3">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white font-heading">Today's Menu</h2>
                        <button onClick={onMenuClick} className="text-sm font-bold text-brand-saffron hover:underline">See Full Menu →</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {menuItems.slice(0, 3).map(item => (
                            <div key={item.id} className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                                <div className="h-24 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-neutral-800 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-5xl text-brand-saffron/30 group-hover:scale-110 transition-transform">lunch_dining</span>
                                </div>
                                <div className="p-3">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</h3>
                                        <span className="text-brand-saffron font-black">₹{item.price}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 line-clamp-1">{item.description}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">
                                            <span className="material-symbols-outlined text-xs">eco</span> Pure Veg
                                        </span>
                                        <span className="text-[10px] font-medium text-slate-400 capitalize">{item.category}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Pricing Cards ── */}
            <section className="px-4 md:px-8 py-5">
                <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1 font-heading">Simple, Honest Pricing</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">No hidden charges. Cancel anytime.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                    {/* Weekly */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-0.5">Weekly Plan</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Try us — 7 days of daily meals</p>
                        <div className="flex items-baseline gap-1 mb-3">
                            <span className="text-3xl font-black text-brand-saffron">₹699</span>
                            <span className="text-xs text-slate-400">/week</span>
                        </div>
                        <ul className="space-y-1.5 mb-4 text-xs text-slate-600 dark:text-slate-300">
                            <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-brand-green text-sm">check_circle</span> 7 meals included</li>
                            <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-brand-green text-sm">check_circle</span> Daily doorstep delivery</li>
                            <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-brand-green text-sm">check_circle</span> Pure veg home-style food</li>
                        </ul>
                        <button onClick={onExploreClick} className="w-full py-2.5 bg-brand-saffron/10 text-brand-saffron font-bold text-sm rounded-lg border border-brand-saffron/20 hover:bg-brand-saffron hover:text-white transition-all active:scale-95">
                            Get Started
                        </button>
                    </div>

                    {/* Monthly — Popular */}
                    <div className="bg-brand-saffron rounded-xl p-5 shadow-lg shadow-brand-saffron/20 text-white relative overflow-hidden">
                        <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded-full">⭐ Best Value</div>
                        <h3 className="font-bold mb-0.5">Monthly Plan</h3>
                        <p className="text-xs text-white/70 mb-3">Maximum savings — 30 days</p>
                        <div className="flex items-baseline gap-1 mb-3">
                            <span className="text-3xl font-black">₹2,499</span>
                            <span className="text-xs text-white/60">/month</span>
                        </div>
                        <ul className="space-y-1.5 mb-4 text-xs text-white/90">
                            <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-white text-sm">check_circle</span> 30 meals included</li>
                            <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-white text-sm">check_circle</span> Save ₹300 vs weekly</li>
                            <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-white text-sm">check_circle</span> Priority delivery slot</li>
                        </ul>
                        <button onClick={onExploreClick} className="w-full py-2.5 bg-white text-brand-saffron font-bold text-sm rounded-lg hover:bg-white/90 transition-all active:scale-95 shadow-md">
                            Get Started
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Trust Badges ── */}
            <section className="px-4 md:px-8 py-4">
                <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        {[
                            { icon: '🌿', label: '100% Pure Veg', sub: 'No compromise' },
                            { icon: '👩‍🍳', label: 'Home Cooked', sub: 'Fresh daily' },
                            { icon: '🚚', label: 'Free Delivery', sub: 'To your door' },
                            { icon: '💰', label: '₹100/meal', sub: 'Affordable' },
                        ].map((badge, i) => (
                            <div key={i}>
                                <div className="text-2xl mb-1">{badge.icon}</div>
                                <div className="text-xs font-bold text-slate-900 dark:text-white">{badge.label}</div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">{badge.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="px-4 md:px-8 py-5 text-center">
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mb-2 font-heading">Ready to eat well?</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 max-w-md mx-auto">Join hundreds of happy customers enjoying home-cooked meals every day.</p>
                <button
                    onClick={() => { window.location.href = '/login'; }}
                    className="px-6 py-3 bg-brand-saffron hover:bg-[#D97706] text-white font-bold rounded-lg shadow-lg shadow-brand-saffron/30 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95"
                >
                    Sign Up — It's Free
                </button>
            </section>
        </main>
    );
}

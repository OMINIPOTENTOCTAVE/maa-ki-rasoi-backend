import React, { useState } from 'react';
import { PLANS, MEAL_TYPES, computePrice, DIETARY_PREFERENCE, SUPPORT_WHATSAPP } from '../../config/pricing';

export default function ExplorePlansView({ onBack, onCheckout }) {
    const [selectedMeal, setSelectedMeal] = useState('Lunch');
    const planList = Object.values(PLANS);

    return (
        <div className="flex flex-col h-full w-full bg-brand-cream dark:bg-brand-dark overflow-y-auto pb-24 md:pb-8 no-scrollbar">
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#221b10]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 px-4 md:px-6 py-3">
                <div className="flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors md:hidden">
                        <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">arrow_back</span>
                    </button>
                    <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 font-heading">Choose Your Plan</h1>
                    <button onClick={() => window.open(`https://wa.me/${SUPPORT_WHATSAPP}?text=Hi, I need help choosing a plan`, '_blank')} className="text-brand-saffron text-sm font-bold hover:text-brand-saffron/80 transition-colors">
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

                {/* ── Meal Type Selector ── */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Select Your Meal</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {Object.values(MEAL_TYPES).map(meal => (
                            <button
                                key={meal.id}
                                onClick={() => setSelectedMeal(meal.id)}
                                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all text-sm font-bold active:scale-95 ${selectedMeal === meal.id
                                        ? 'border-brand-saffron bg-brand-saffron/10 text-brand-saffron shadow-sm'
                                        : 'border-gray-200 dark:border-gray-700 text-slate-600 dark:text-slate-300 hover:border-brand-saffron/40'
                                    }`}
                            >
                                <span className="text-lg">{meal.icon}</span>
                                {meal.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Plan Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {planList.map(plan => {
                        const price = computePrice(plan.id, selectedMeal);
                        const isHighlighted = !!plan.badge;

                        return (
                            <div
                                key={plan.id}
                                className={`relative flex flex-col gap-4 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 ${isHighlighted
                                        ? 'border-2 border-brand-saffron bg-white dark:bg-[#2d2418] shadow-xl shadow-brand-saffron/10 md:scale-100 scale-[1.02] z-10'
                                        : 'group border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2d2418]'
                                    }`}
                            >
                                {plan.badge && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-saffron text-slate-900 px-4 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase shadow-sm">
                                        {plan.badge}
                                    </div>
                                )}

                                <div className={`flex justify-between items-start ${isHighlighted ? 'mt-2' : ''}`}>
                                    <div className="flex flex-col">
                                        <h3 className={`font-bold text-slate-900 dark:text-white ${isHighlighted ? 'text-xl font-extrabold' : 'text-lg group-hover:text-brand-saffron'} transition-colors`}>
                                            {plan.title}
                                        </h3>
                                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">{plan.subtitle}</span>
                                    </div>
                                    {!isHighlighted && (
                                        <div className="bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10">
                                            <span className="text-xs font-bold text-slate-900 dark:text-slate-200">₹{plan.perMealPrice}/meal</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-baseline gap-1">
                                    <span className={`font-extrabold text-slate-900 dark:text-white tracking-tight ${isHighlighted ? 'text-4xl font-black' : 'text-3xl'}`}>
                                        ₹{price.toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        / {plan.duration} days
                                    </span>
                                </div>

                                {isHighlighted && (
                                    <ul className="flex flex-col gap-3 mt-2">
                                        {plan.features.slice(0, 2).map((feat, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                                                <span className="material-symbols-outlined text-brand-saffron">check_circle</span>
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <div className="h-px w-full bg-gray-100 dark:bg-white/5"></div>

                                <button
                                    onClick={() => onCheckout({
                                        planType: plan.id,
                                        mealType: selectedMeal,
                                        dietaryPreference: DIETARY_PREFERENCE,
                                        totalPrice: price,
                                    })}
                                    className={`mt-1 w-full rounded-xl font-bold text-sm active:scale-95 transition-all ${isHighlighted
                                            ? 'py-4 bg-brand-saffron text-slate-900 font-extrabold text-base shadow-lg shadow-brand-saffron/25 hover:-translate-y-0.5'
                                            : 'py-3 bg-slate-900 dark:bg-white/10 text-white hover:bg-brand-saffron dark:hover:bg-brand-saffron'
                                        }`}
                                >
                                    Subscribe for ₹{price.toLocaleString('en-IN')}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* ── Inclusions ── */}
                <p className="text-xs text-center text-slate-400 dark:text-slate-500 px-4">
                    All prices are exclusive of 5% GST. Cancel or pause anytime.
                </p>
            </main>
        </div>
    );
}

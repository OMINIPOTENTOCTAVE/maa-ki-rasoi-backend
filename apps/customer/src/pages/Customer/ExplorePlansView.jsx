import React, { useState } from 'react';
import { PLANS, MEAL_TYPES, computePrice, DIETARY_PREFERENCE, SUPPORT_WHATSAPP } from '../../config/pricing';

export default function ExplorePlansView({ onBack, onCheckout }) {
    const [selectedMeal, setSelectedMeal] = useState('Lunch');
    const planList = Object.values(PLANS);

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-brand-beige text-brand-orange">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Choose Your Plan</h1>
                        <p className="text-text-muted">Pure Veg Home-style Meals, delivered daily.</p>
                    </div>
                </div>
                <button
                    onClick={() => window.open(`https://wa.me/${SUPPORT_WHATSAPP}?text=Hi, I need help choosing a plan`, '_blank')}
                    className="text-brand-orange font-bold text-sm flex items-center gap-1 hover:underline"
                >
                    <span className="material-symbols-outlined text-sm">help</span>
                    Assistance
                </button>
            </div>

            {/* Meal Type Selection */}
            <div className="card !p-6 border-none shadow-sm bg-brand-beige">
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">1. Select Delivery Slot</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.values(MEAL_TYPES).map(meal => (
                        <button
                            key={meal.id}
                            onClick={() => setSelectedMeal(meal.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all font-bold text-sm ${selectedMeal === meal.id
                                    ? 'border-brand-orange bg-white text-brand-orange shadow-md scale-[1.02]'
                                    : 'border-transparent bg-white/50 text-text-muted hover:border-brand-orange/30'
                                }`}
                        >
                            <span className="text-xl">{meal.icon}</span>
                            {meal.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Plan Grid */}
            <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-6 ml-2">2. Pick Your Duration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {planList.map(plan => {
                        const price = computePrice(plan.id, selectedMeal);
                        const isPopular = !!plan.badge;

                        return (
                            <div
                                key={plan.id}
                                className={`card flex flex-col h-full transition-all duration-300 ${isPopular
                                        ? 'border-2 border-brand-orange shadow-premium scale-[1.02] z-10'
                                        : 'hover:scale-[1.02]'
                                    }`}
                            >
                                {plan.badge && (
                                    <div className="bg-brand-orange text-white text-[10px] font-bold uppercase tracking-widest py-1 px-4 rounded-full w-fit mb-4 mx-auto">
                                        {plan.badge}
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold mb-1 capitalize">{plan.title} Plan</h3>
                                    <p className="text-xs text-text-muted mb-4 italic">"Ideal for {plan.duration} days"</p>

                                    <div className="flex items-baseline justify-center gap-1 mb-2">
                                        <span className="text-4xl font-bold text-text-main">₹{price}</span>
                                        <span className="text-xs text-text-muted font-medium">/{plan.duration}d</span>
                                    </div>
                                    <div className="text-[10px] font-bold text-brand-orange bg-brand-orange/5 px-2 py-1 rounded inline-block">
                                        SAVE ₹{(plan.perMealPrice * 30 - price) > 0 ? (plan.perMealPrice * 30 - price) : 0} compared to daily
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-8 flex-1">
                                    {plan.features.map((feat, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-text-body">
                                            <span className="material-symbols-outlined text-success text-sm mt-0.5">check_circle</span>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => onCheckout({
                                        planType: plan.id,
                                        mealType: selectedMeal,
                                        dietaryPreference: DIETARY_PREFERENCE,
                                        totalPrice: price,
                                    })}
                                    className={`btn btn-block py-4 text-base ${isPopular ? '' : 'btn-secondary'}`}
                                >
                                    Choose {plan.title}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <p className="text-[10px] text-center text-text-muted italic px-8">
                * Prices exclude 5% GST. Delivery timings: Lunch (12-2 PM), Dinner (7-9 PM). <br />
                Managed by Maa Ki Rasoi Home Kitchen Network.
            </p>
        </div>
    );
}

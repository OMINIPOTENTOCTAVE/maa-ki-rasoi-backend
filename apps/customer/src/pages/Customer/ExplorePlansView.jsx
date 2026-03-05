import React, { useState } from 'react';
import { PLANS, MEAL_TYPES, computePrice, DIETARY_PREFERENCE, SUPPORT_WHATSAPP } from '../../config/pricing';
import { Check, HelpCircle, ArrowLeft, Sun, Moon, UtensilsCrossed, Shield } from 'lucide-react';

export default function ExplorePlansView({ onBack, onCheckout }) {
    const [selectedMeal, setSelectedMeal] = useState('Lunch');
    const planList = Object.values(PLANS);

    const getMealIcon = (id) => {
        switch (id) {
            case 'Lunch': return <Sun className="w-5 h-5" />;
            case 'Dinner': return <Moon className="w-5 h-5" />;
            default: return <UtensilsCrossed className="w-5 h-5" />;
        }
    };

    return (
        <div className="pb-24 page-transition -mt-8">
            {/* Header Section */}
            <section className="relative pt-12 pb-20 overflow-hidden bg-brand-dark rounded-[2.5rem] px-4 sm:px-6 lg:px-8 shadow-premium mb-12 mt-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>

                <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <button
                            onClick={onBack}
                            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white mb-6 transition-colors backdrop-blur-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                            Choose Your Plan
                        </h1>
                        <p className="text-xl text-white/80 font-medium">
                            Authentic home-cooked meals, delivered daily to your doorstep.
                        </p>
                    </div>

                    <button
                        onClick={() => window.open(`https://wa.me/${SUPPORT_WHATSAPP}?text=Hi, I need help choosing a plan`, '_blank')}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 font-medium flex items-center gap-2 transition-all backdrop-blur-sm shadow-lg w-fit"
                    >
                        <HelpCircle className="w-5 h-5" />
                        Need Help?
                    </button>
                </div>
            </section>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

                {/* 1. Meal Type Selection */}
                <div className="text-center">
                    <span className="inline-block px-4 py-1.5 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider rounded-full mb-6 text-brand-dark">
                        Step 1: Select Delivery Slot
                    </span>

                    <div className="flex flex-wrap justify-center gap-4">
                        {Object.values(MEAL_TYPES).map(meal => (
                            <button
                                key={meal.id}
                                onClick={() => setSelectedMeal(meal.id)}
                                className={`flex items-center gap-3 px-8 py-4 rounded-full transition-all text-lg font-semibold border-2 ${selectedMeal === meal.id
                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30 outline-none ring-offset-2 ring-2 ring-primary'
                                        : 'bg-white border-border text-foreground hover:border-primary/30 shadow-sm'
                                    }`}
                            >
                                {getMealIcon(meal.id)}
                                {meal.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Plan Grid */}
                <div>
                    <div className="text-center mb-10">
                        <span className="inline-block px-4 py-1.5 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider rounded-full mb-2 text-brand-dark">
                            Step 2: Pick Your Duration
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {planList.map(plan => {
                            const price = computePrice(plan.id, selectedMeal);
                            const isPopular = !!plan.badge;

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative bg-white rounded-[2rem] p-8 transition-all duration-300 card-hover flex flex-col ${isPopular
                                            ? 'border-4 border-primary shadow-xl shadow-primary/20 scale-100 md:scale-105 z-10'
                                            : 'border border-border shadow-sm mt-0 md:mt-4 mb-0 md:mb-4'
                                        }`}
                                >
                                    {plan.badge && (
                                        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs font-bold uppercase tracking-widest py-2 px-6 rounded-full shadow-lg border-2 border-white">
                                            {plan.badge}
                                        </div>
                                    )}

                                    <div className="text-center mb-8 mt-2">
                                        <h3 className="text-3xl font-heading font-bold text-foreground mb-2">{plan.title}</h3>
                                        <p className="text-muted-foreground font-medium mb-6">"{plan.subtitle}"</p>

                                        <div className="flex items-end justify-center gap-1 mb-3">
                                            <span className="text-5xl font-heading font-bold text-foreground">₹{price}</span>
                                            <span className="text-lg text-muted-foreground font-medium mb-1">/{plan.duration}d</span>
                                        </div>

                                        {(plan.perMealPrice * 30 - price) > 0 ? (
                                            <div className="inline-flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-3 py-1.5 rounded-full">
                                                <Shield className="w-3.5 h-3.5" />
                                                Save ₹{plan.perMealPrice * 30 - price} compared to daily
                                            </div>
                                        ) : (
                                            <div className="h-7"></div> /* spacer */
                                        )}
                                    </div>

                                    <div className="flex-1 bg-background rounded-2xl p-6 mb-8 border border-border">
                                        <ul className="space-y-4">
                                            {plan.features.map((feat, i) => (
                                                <li key={i} className="flex items-start gap-3 text-foreground font-medium">
                                                    <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <Check className="w-4 h-4 text-success" />
                                                    </div>
                                                    {feat}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <button
                                        onClick={() => onCheckout({
                                            planType: plan.id,
                                            mealType: selectedMeal,
                                            dietaryPreference: DIETARY_PREFERENCE,
                                            totalPrice: price,
                                        })}
                                        className={`w-full py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 ${isPopular
                                                ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30'
                                                : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-white'
                                            }`}
                                    >
                                        Choose {plan.title}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="text-center text-sm text-muted-foreground px-8 bg-white border border-border rounded-2xl py-6 shadow-sm max-w-2xl mx-auto">
                    <p className="font-medium text-foreground mb-1">Pricing Information</p>
                    <p>Prices exclude 5% GST. Delivery timings: Lunch (12-2 PM), Dinner (7-9 PM).</p>
                    <p className="mt-2">Refundable security deposit of ₹500 applies at checkout.</p>
                </div>
            </div>
        </div>
    );
}




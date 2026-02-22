import React, { useState } from 'react';
import MealCard from '../../components/ui/MealCard';
import StatusBanner from '../../components/ui/StatusBanner';

export default function HomeView({ onManageClick, onExploreClick }) {
    return (
        <main className="flex-1 p-5 space-y-6 pb-32">
            <header className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Hello, Priya! 👋</h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Standard Veg Plan • <span className="text-brand-green font-bold">Active</span>
                    </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-brand-saffron/10 flex items-center justify-center text-brand-saffron border border-brand-saffron/20">
                    <span className="material-symbols-outlined">person</span>
                </div>
            </header>

            <section className="relative">
                <div className="flex items-center justify-between mb-3 px-1">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Next Meal</h2>
                    <span className="text-xs font-bold bg-brand-green/10 text-brand-green px-2 py-1 rounded-full">
                        Arriving by 1:30 PM
                    </span>
                </div>

                <MealCard
                    title="Ghar Ka Khana"
                    subtitle="Dal Tadka, Jeera Rice, Aloo Gobi, 2 Rotis"
                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuCn5WRfuP-mNB5rtMQEMXgvPQ9qdY68cmNoOkTLqZve4qs9riUQ7db6vKkvUmDKJ8IhZYryISONHkTIuWzqR8WYLgMz7GUCVKX4o7q3jV47b8HBZnjMde1auW2Nj-RBjAasxahXXTSqr_KdFc4BHKEvD2vW4JujWFJpG9RROM7ZFr8PvBBVsbjvnddjGKiigxeEK0px1AQpTZOq4I0HtNDcbC-K2LUtq8ejWebW5QisqTPZDFHMye_NW-_rCnJmFz6nONBShxiyreal"
                    tags={["Today's Lunch"]}
                    onAction={() => alert('Meal Details')}
                />

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <button onClick={onManageClick} className="flex flex-col items-center justify-center p-3 rounded-xl bg-brand-saffron/10 border border-brand-saffron/30 active:scale-98 transition-transform">
                        <span className="material-symbols-outlined text-brand-saffron mb-1">pause_circle</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-white">Pause Delivery</span>
                        <span className="text-[10px] text-slate-500">Traveling? Skip meal</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/50 border border-gray-200 dark:border-gray-700 active:scale-98 transition-transform">
                        <span className="material-symbols-outlined text-slate-600 mb-1">edit_calendar</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-white">Modify Plan</span>
                        <span className="text-[10px] text-slate-500">Change preferences</span>
                    </button>
                </div>
            </section>

            <section className="bg-white/50 dark:bg-brand-dark/50 p-0 rounded-tiffin border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-4 py-3 bg-gray-50 dark:bg-[#231e16] border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-brand-green">health_and_safety</span>
                        <h2 className="text-md font-bold text-slate-900 dark:text-white">Nutrition Snapshot</h2>
                    </div>
                </div>
                <div className="p-4 flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Protein</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-900">18g</span>
                            <span className="text-[10px] font-medium text-brand-green">High</span>
                        </div>
                    </div>
                    <div className="w-px h-10 bg-gray-200"></div>
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Fiber</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-900">8g</span>
                        </div>
                    </div>
                    <div className="w-px h-10 bg-gray-200"></div>
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Calories</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-900">450</span>
                        </div>
                    </div>
                </div>
            </section>

            <StatusBanner
                type="info"
                icon="school"
                message="Student Offer: Refer a friend, get 3 FREE meals! Tap to details."
            />
            <section className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-800">Want more variety?</h3>
                    <span className="material-symbols-outlined text-brand-saffron">restaurant_menu</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">Discover our Weekly and Monthly subscription plans for the best value.</p>
                <button
                    onClick={onExploreClick}
                    className="w-full py-3 bg-brand-saffron/10 text-brand-saffron font-bold text-sm rounded-lg border border-brand-saffron/20 active:scale-95 transition-transform"
                >
                    Explore Plans
                </button>
            </section>
        </main>
    );
}

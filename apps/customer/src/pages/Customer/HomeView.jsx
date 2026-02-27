import React, { useState } from 'react';
import MealCard from '../../components/ui/MealCard';
import StatusBanner from '../../components/ui/StatusBanner';

export default function HomeView({ subscriptions = [], onManageClick, onExploreClick }) {
    const customer = JSON.parse(localStorage.getItem('customer_data') || '{}');
    const activeSub = subscriptions.find(s => s.status === 'Active');
    const nextDelivery = activeSub?.deliveries?.[0];

    const greetingName = customer.name?.split(' ')[0] || 'Customer';
    return (
        <main className="flex-1 p-5 md:p-8 lg:p-10 space-y-6 pb-32 md:pb-10">
            <header className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white capitalize font-heading">Hello, {greetingName}! 👋</h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {activeSub ? (
                            <><span className="capitalize">{activeSub.planType}</span> Pure Veg Plan • <span className="text-brand-green font-bold">Active</span></>
                        ) : (
                            <span>No active plan</span>
                        )}
                    </p>
                </div>
                <div className="h-10 w-10 md:hidden rounded-full bg-brand-saffron/10 flex items-center justify-center text-brand-saffron border border-brand-saffron/20 capitalize font-bold">
                    {greetingName.charAt(0)}
                </div>
            </header>

            {/* ── Desktop: Multi-column grid / Mobile: Stacked ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left column: Meal + Actions */}
                <div className="space-y-4">
                    <section className="relative">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Your Next Meal</h2>
                            {nextDelivery && (
                                <span className="text-xs font-bold bg-brand-green/10 text-brand-green px-2 py-1 rounded-full">
                                    {new Date(nextDelivery.deliveryDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {nextDelivery.mealType}
                                </span>
                            )}
                        </div>

                        {activeSub && nextDelivery ? (
                            <MealCard
                                title={`Pure Veg Ghar Ka Khana`}
                                subtitle="Dal Tadka, Sabzi, Rice, 3 Rotis"
                                image="https://lh3.googleusercontent.com/aida-public/AB6AXuCn5WRfuP-mNB5rtMQEMXgvPQ9qdY68cmNoOkTLqZve4qs9riUQ7db6vKkvUmDKJ8IhZYryISONHkTIuWzqR8WYLgMz7GUCVKX4o7q3jV47b8HBZnjMde1auW2Nj-RBjAasxahXXTSqr_KdFc4BHKEvD2vW4JujWFJpG9RROM7ZFr8PvBBVsbjvnddjGKiigxeEK0px1AQpTZOq4I0HtNDcbC-K2LUtq8ejWebW5QisqTPZDFHMye_NW-_rCnJmFz6nONBShxiyreal"
                                tags={[`Upcoming ${nextDelivery.mealType}`]}
                                onAction={() => { }}
                            />
                        ) : (
                            <div className="bg-white dark:bg-brand-dark/50 p-6 md:p-8 rounded-xl border border-gray-100 dark:border-gray-800 text-center shadow-sm">
                                <span className="material-symbols-outlined text-4xl md:text-5xl text-slate-300 mb-2">restaurant</span>
                                <h3 className="text-slate-900 dark:text-white font-bold md:text-lg">Nothing scheduled</h3>
                                <p className="text-slate-500 text-sm mt-1 mb-4">You don't have any meals arriving soon. Start a plan to get home-cooked food delivered daily.</p>
                                <button onClick={onExploreClick} className="px-4 py-2 md:px-6 md:py-3 bg-brand-saffron text-white font-bold rounded-lg shadow-md shadow-brand-saffron/20 hover:bg-brand-saffron-dark transition-colors">
                                    See Menu & Plans
                                </button>
                            </div>
                        )}

                        {activeSub && (
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <button onClick={onManageClick} className="flex flex-col items-center justify-center p-3 md:p-4 rounded-xl bg-brand-saffron/10 border border-brand-saffron/30 active:scale-98 hover:bg-brand-saffron/15 transition-all group">
                                    <span className="material-symbols-outlined text-brand-saffron mb-1 group-hover:scale-110 transition-transform">settings</span>
                                    <span className="text-sm font-bold text-slate-800 dark:text-white">Manage Plan</span>
                                    <span className="text-[10px] text-slate-500">Pause or Renew</span>
                                </button>
                                <button onClick={onManageClick} className="flex flex-col items-center justify-center p-3 md:p-4 rounded-xl bg-white/50 border border-gray-200 dark:border-gray-700 active:scale-98 hover:bg-white transition-all group">
                                    <span className="material-symbols-outlined text-slate-600 mb-1 group-hover:scale-110 transition-transform">edit_calendar</span>
                                    <span className="text-sm font-bold text-slate-800 dark:text-white">Delivery Days</span>
                                    <span className="text-[10px] text-slate-500">View Schedule</span>
                                </button>
                            </div>
                        )}
                    </section>
                </div>

                {/* Right column: Promotions + CTA */}
                <div className="space-y-4">
                    <StatusBanner
                        type="info"
                        icon="school"
                        message="Student Offer: Refer a friend, get 3 FREE meals! Tap to details."
                    />
                    <section className="bg-white p-4 md:p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-slate-800">Want more variety?</h3>
                            <span className="material-symbols-outlined text-brand-saffron">restaurant_menu</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-4">Discover our Weekly and Monthly subscription plans for the best value.</p>
                        <button
                            onClick={onExploreClick}
                            className="w-full py-3 bg-brand-saffron/10 text-brand-saffron font-bold text-sm rounded-lg border border-brand-saffron/20 active:scale-95 hover:bg-brand-saffron/15 transition-all"
                        >
                            Explore Plans
                        </button>
                    </section>
                </div>
            </div>
        </main>
    );
}

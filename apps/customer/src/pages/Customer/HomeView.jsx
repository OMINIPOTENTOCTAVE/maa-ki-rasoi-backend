import React from 'react';
import MealCard from '../../components/ui/MealCard';
import StatusBanner from '../../components/ui/StatusBanner';

export default function HomeView({ subscriptions = [], onManageClick, onExploreClick }) {
    const customer = JSON.parse(localStorage.getItem('customer_data') || '{}');
    const activeSub = subscriptions.find(s => s.status === 'Active');
    const nextDelivery = activeSub?.deliveries?.[0];

    const greetingName = customer.name?.split(' ')[0] || 'Customer';

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Namaste, {greetingName}! 👋</h1>
                    <p className="text-brand-dark flex items-center gap-2">
                        {activeSub ? (
                            <>
                                <span className="w-2 h-2 rounded-full bg-success"></span>
                                <span className="capitalize">{activeSub.planType}</span> Pure Veg Plan • Active
                            </>
                        ) : (
                            "No active subscription"
                        )}
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Your Next Meal</h2>
                            {nextDelivery && (
                                <span className="text-xs font-bold text-brand-orange bg-[#fffaf4] border border-brand-orange/10 px-3 py-1 rounded-full uppercase tracking-wider">
                                    {new Date(nextDelivery.deliveryDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </span>
                            )}
                        </div>

                        {activeSub && nextDelivery ? (
                            <MealCard
                                title={`Ghar Ka Khana`}
                                subtitle="Dal Tadka, Seasonal Sabzi, Rice & 3 Rotis"
                                image="https://lh3.googleusercontent.com/aida-public/AB6AXuCn5WRfuP-mNB5rtMQEMXgvPQ9qdY68cmNoOkTLqZve4qs9riUQ7db6vKkvUmDKJ8IhZYryISONHkTIuWzqR8WYLgMz7GUCVKX4o7q3jV47b8HBZnjMde1auW2Nj-RBjAasxahXXTSqr_KdFc4BHKEvD2vW4JujWFJpG9RROM7ZFr8PvBBVsbjvnddjGKiigxeEK0px1AQpTZOq4I0HtNDcbC-K2LUtq8ejWebW5QisqTPZDFHMye_NW-_rCnJmFz6nONBShxiyreal"
                                tags={[nextDelivery.mealType, nextDelivery.status]}
                                onAction={() => { }}
                            />
                        ) : (
                            <div className="card text-center py-10">
                                <span className="material-symbols-outlined text-5xl text-brand-orange/20 mb-4">restaurant</span>
                                <h3 className="text-xl font-bold mb-2">Ready to eat healthy?</h3>
                                <p className="text-brand-dark mb-6 max-w-xs mx-auto text-sm">You don't have any meals scheduled. Subscribe to start receiving home-cooked food.</p>
                                <button onClick={onExploreClick} className="btn py-3 px-8">
                                    Browse Plans
                                </button>
                            </div>
                        )}
                    </section>

                    {activeSub && (
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={onManageClick} className="card !p-6 flex flex-col items-center hover:scale-[1.02] transition-transform">
                                <span className="material-symbols-outlined text-brand-orange mb-2 text-3xl">settings</span>
                                <span className="font-bold">Manage Plan</span>
                                <span className="text-[10px] text-text-muted">Pause or Renew</span>
                            </button>
                            <button onClick={onManageClick} className="card !p-6 flex flex-col items-center hover:scale-[1.02] transition-transform">
                                <span className="material-symbols-outlined text-brand-orange mb-2 text-3xl">calendar_month</span>
                                <span className="font-bold">Schedule</span>
                                <span className="text-[10px] text-text-muted">View Calendar</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar/Right Column */}
                <div className="space-y-6">
                    <StatusBanner
                        type="info"
                        icon="redeem"
                        message="Refer a friend and get 3 free meals added to your current plan!"
                    />

                    <div className="card bg-brand-dark text-white">
                        <h3 className="text-lg font-bold mb-2 text-brand-orange-light">Chef's Choice</h3>
                        <p className="text-brand-dark/60 text-sm mb-6">Our chefs recommend the Monthly Premium plan for consistent nutrition.</p>
                        <button onClick={onExploreClick} className="btn btn-block">
                            Explore All Plans
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}



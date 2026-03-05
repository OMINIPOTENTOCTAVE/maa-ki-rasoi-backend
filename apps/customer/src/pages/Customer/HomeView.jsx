import React from 'react';
import MealCard from '../../components/MealCard';
import StatusBanner from '../../components/StatusBanner';
import { Settings, CalendarRange, UtensilsCrossed, Gift, ChevronRight } from 'lucide-react';

export default function HomeView({ subscriptions = [], onManageClick, onExploreClick }) {
    const customer = JSON.parse(localStorage.getItem('customer_data') || '{}');
    const activeSub = subscriptions.find(s => s.status === 'Active');
    const nextDelivery = activeSub?.deliveries?.[0];

    const greetingName = customer.name?.split(' ')[0] || 'Customer';

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <header className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-4xl font-heading font-bold mb-2 text-foreground">Namaste, {greetingName}! 👋</h1>
                    <p className="text-muted-foreground flex items-center gap-2 text-lg">
                        {activeSub ? (
                            <>
                                <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
                                <span className="capitalize font-bold text-foreground">{activeSub.planType}</span> Pure Veg Plan • Active
                            </>
                        ) : (
                            "No active subscription"
                        )}
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-heading font-bold text-foreground pl-2">Your Next Meal</h2>
                            {nextDelivery && (
                                <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full uppercase tracking-wider">
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
                            <div className="bg-white border border-border rounded-[2rem] text-center p-12 shadow-sm card-hover">
                                <div className="w-24 h-24 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                                    <UtensilsCrossed className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-heading font-bold mb-3 text-foreground">Ready to eat healthy?</h3>
                                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">You don't have any meals scheduled. Subscribe to start receiving home-cooked food.</p>
                                <button onClick={onExploreClick} className="px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                                    Browse Plans
                                </button>
                            </div>
                        )}
                    </section>

                    {activeSub && (
                        <div className="grid grid-cols-2 gap-6">
                            <button onClick={onManageClick} className="bg-white border border-border p-6 rounded-[2rem] flex flex-col items-center hover:scale-[1.02] hover:border-primary/30 transition-all shadow-sm group">
                                <div className="w-14 h-14 rounded-2xl bg-secondary mb-4 flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Settings className="w-6 h-6" />
                                </div>
                                <span className="font-heading font-bold text-lg text-foreground mb-1">Manage Plan</span>
                                <span className="text-xs text-muted-foreground font-medium">Pause or Renew</span>
                            </button>
                            <button onClick={onManageClick} className="bg-white border border-border p-6 rounded-[2rem] flex flex-col items-center hover:scale-[1.02] hover:border-primary/30 transition-all shadow-sm group">
                                <div className="w-14 h-14 rounded-2xl bg-secondary mb-4 flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                                    <CalendarRange className="w-6 h-6" />
                                </div>
                                <span className="font-heading font-bold text-lg text-foreground mb-1">Schedule</span>
                                <span className="text-xs text-muted-foreground font-medium">View Calendar</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar/Right Column */}
                <div className="space-y-6">
                    <StatusBanner
                        type="info"
                        icon={<Gift className="w-5 h-5" />}
                        message="Refer a friend and get 3 free meals added to your current plan!"
                    />

                    <div className="bg-foreground text-white rounded-[2rem] p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-[100px] -z-0"></div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-heading font-bold mb-2 text-primary">Chef's Choice</h3>
                            <p className="text-white/70 text-sm mb-8 font-medium leading-relaxed">Our chefs recommend the Monthly Premium plan for consistent nutrition.</p>
                            <button onClick={onExploreClick} className="w-full px-6 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                                Explore All Plans
                                <ChevronRight className="w-5 h-5 relative top-[1px]" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



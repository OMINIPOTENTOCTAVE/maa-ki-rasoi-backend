import React from 'react';

/**
 * Right-side context panel for desktop layout.
 * Shows subscription status, delivery info, and quick actions.
 */
export default function RightPanel({ subscriptions = [] }) {
    const activeSub = subscriptions.find(s => s.status === 'Active');
    const customer = JSON.parse(localStorage.getItem('customer_data') || '{}');

    return (
        <>
            {/* User Card */}
            <div className="rounded-xl bg-brand-saffron/5 border border-brand-saffron/15 p-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-brand-saffron/15 flex items-center justify-center text-brand-saffron font-bold capitalize">
                        {(customer.name || 'C').charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white capitalize">{customer.name || 'Customer'}</p>
                        <p className="text-xs text-slate-500">{customer.phone || ''}</p>
                    </div>
                </div>
            </div>

            {/* Subscription Status */}
            <div className="rounded-xl bg-white dark:bg-[#2d2418] border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Subscription</h3>
                {activeSub ? (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">{activeSub.planType} Plan</span>
                            <span className="text-[10px] font-bold uppercase tracking-wide bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full">Active</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            Ends {new Date(activeSub.endDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <span className="material-symbols-outlined text-sm">restaurant</span>
                            {activeSub.mealType} • Pure Veg
                        </div>
                        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
                            <span className="text-lg font-bold text-brand-saffron">₹{activeSub.totalPrice}</span>
                            <span className="text-xs text-slate-400 ml-1">total</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-3">
                        <span className="material-symbols-outlined text-3xl text-slate-300">event_busy</span>
                        <p className="text-xs text-slate-500 mt-1">No active plan</p>
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="rounded-xl bg-white dark:bg-[#2d2418] border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Today's Meal</h3>
                {activeSub ? (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="material-symbols-outlined text-brand-saffron text-lg">lunch_dining</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">Pure Veg Ghar Ka Khana</span>
                        </div>
                        <p className="text-xs text-slate-500 pl-7">Dal Tadka, Sabzi, Rice, 3 Rotis</p>
                        <div className="flex items-center gap-1.5 text-xs text-brand-green pl-7">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            12:30 PM - 1:30 PM
                        </div>
                    </div>
                ) : (
                    <p className="text-xs text-slate-500 text-center py-3">Subscribe to see today's meal</p>
                )}
            </div>

            {/* Delivery Progress */}
            {activeSub && (
                <div className="rounded-xl bg-white dark:bg-[#2d2418] border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Delivery Status</h3>
                    <div className="flex items-center gap-2">
                        {['Preparing', 'Packed', 'On the way', 'Delivered'].map((step, i) => (
                            <React.Fragment key={step}>
                                <div className={`flex flex-col items-center gap-1 ${i === 0 ? 'text-brand-saffron' : 'text-slate-300'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 
                                        ${i === 0 ? 'bg-brand-saffron text-white border-brand-saffron' : 'border-slate-300 text-slate-300'}`}>
                                        {i + 1}
                                    </div>
                                    <span className="text-[9px] font-medium leading-tight text-center">{step}</span>
                                </div>
                                {i < 3 && <div className={`flex-1 h-0.5 rounded ${i === 0 ? 'bg-brand-saffron/30' : 'bg-slate-200'}`}></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

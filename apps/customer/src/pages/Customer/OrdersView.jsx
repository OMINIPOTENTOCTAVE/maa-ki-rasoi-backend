import React from 'react';
import useMediaQuery from '@/hooks/useMediaQuery';

export default function OrdersView({ orders = [], subscriptions = [], onBack, onExtendPlan, onReviewMeal, onRepeatMeal }) {
    const totalOrders = orders.length;
    const { isMobile } = useMediaQuery();

    return (
        <div className="flex flex-col h-full w-full bg-brand-cream dark:bg-brand-dark pb-24 md:pb-8">
            <header className="sticky top-0 z-20 flex items-center justify-between bg-white/95 dark:bg-[#2d2418]/95 backdrop-blur-md px-4 md:px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    {isMobile && (
                        <button onClick={onBack} className="flex items-center justify-center rounded-full w-10 h-10 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                            <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">arrow_back</span>
                        </button>
                    )}
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading">Your Meal History</h1>
                </div>
                <button className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-brand-saffron">
                    <span className="material-symbols-outlined">filter_list</span>
                </button>
            </header>

            <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 space-y-8">
                {/* Stats row */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white dark:bg-[#2d2418] shadow-sm p-4 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <p className="text-3xl font-bold text-brand-saffron">{totalOrders}</p>
                        <div className="flex items-center gap-1.5 opacity-80 text-slate-600 dark:text-slate-400">
                            <span className="material-symbols-outlined text-lg">history</span>
                            <p className="text-xs font-medium uppercase tracking-wider">Past Orders</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white dark:bg-[#2d2418] shadow-sm p-4 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <p className="text-3xl font-bold text-brand-saffron">4.8</p>
                        <div className="flex items-center gap-1.5 opacity-80 text-slate-600 dark:text-slate-400">
                            <span className="material-symbols-outlined text-lg">star</span>
                            <p className="text-xs font-medium uppercase tracking-wider">Avg Rating</p>
                        </div>
                    </div>
                    <div className="hidden md:flex flex-col items-center justify-center gap-1 rounded-xl bg-white dark:bg-[#2d2418] shadow-sm p-4 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <p className="text-3xl font-bold text-brand-green">{subscriptions.filter(s => s.status === 'Active').length}</p>
                        <div className="flex items-center gap-1.5 opacity-80 text-slate-600 dark:text-slate-400">
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                            <p className="text-xs font-medium uppercase tracking-wider">Active Plans</p>
                        </div>
                    </div>
                    <div className="hidden md:flex flex-col items-center justify-center gap-1 rounded-xl bg-white dark:bg-[#2d2418] shadow-sm p-4 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <p className="text-3xl font-bold text-slate-700 dark:text-slate-300">₹{orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)}</p>
                        <div className="flex items-center gap-1.5 opacity-80 text-slate-600 dark:text-slate-400">
                            <span className="material-symbols-outlined text-lg">payments</span>
                            <p className="text-xs font-medium uppercase tracking-wider">Total Spent</p>
                        </div>
                    </div>
                </section>

                {/* CTA Banner */}
                <div className="rounded-xl bg-gradient-to-r from-brand-saffron/20 to-brand-saffron/5 p-4 border border-brand-saffron/20 flex items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-base text-brand-saffron">Love Maa's Food?</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Extend your monthly plan and get 10% off.</p>
                    </div>
                    <button onClick={onExtendPlan} className="whitespace-nowrap rounded-lg bg-brand-saffron px-4 py-2 text-sm font-bold text-white shadow-lg shadow-brand-saffron/20 hover:bg-brand-saffron-dark transition-all">
                        Extend Plan
                    </button>
                </div>

                {/* Orders list — 2 columns on desktop */}
                <section className="space-y-4">
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">Past Orders</h2>

                    {orders.length === 0 ? (
                        <div className="text-center p-8 bg-white dark:bg-brand-dark/50 rounded-xl border border-gray-100 dark:border-gray-800">
                            <p className="text-slate-500">You haven't placed any orders yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {orders.map(order => (
                                <div key={order.id} className="group relative flex flex-col gap-4 rounded-xl bg-white dark:bg-[#2d2418] p-4 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md hover:-translate-y-0.5 transition-all">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-3 w-full">
                                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-brand-saffron/10 flex items-center justify-center text-brand-saffron">
                                                <span className="material-symbols-outlined text-3xl">receipt_long</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-base leading-tight text-slate-900 dark:text-slate-100">
                                                        Order #{order.id.slice(0, 8)}
                                                    </h3>
                                                    <span className="text-brand-saffron font-bold">₹{order.totalAmount}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                    {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} items
                                                </p>
                                                <div className="mt-2 flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 w-fit">
                                                    <span className={`h-1.5 w-1.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-brand-saffron'}`}></span>
                                                    <span className={`text-[10px] font-bold uppercase tracking-wide ${order.status === 'Delivered' ? 'text-green-600' : 'text-brand-saffron'}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-500 border-t border-gray-100 dark:border-gray-800 pt-2">
                                        {order.items?.map(item => (
                                            <div key={item.id} className="flex justify-between">
                                                <span>{item.quantity}x {item.menuItem?.name || 'Item'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

import React from 'react';

export default function OrdersView({ orders = [], subscriptions = [], onExtendPlan }) {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const activeSubs = subscriptions.filter(s => s.status === 'Active').length;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Order History</h1>
                    <p className="text-brand-dark">Tracking your journey of healthy home-cooked meals.</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Orders', value: totalOrders, icon: 'history', color: 'text-brand-orange' },
                    { label: 'Active Plans', value: activeSubs, icon: 'check_circle', color: 'text-success' },
                    { label: 'Avg Rating', value: totalOrders > 0 ? '4.9' : '--', icon: 'star', color: 'text-warning' },
                    { label: 'Total Spent', value: `₹${totalSpent}`, icon: 'payments', color: 'text-brand-dark' },
                ].map((stat, i) => (
                    <div key={i} className="card !p-6 text-center">
                        <span className={`material-symbols-outlined text-2xl ${stat.color} mb-2`}>{stat.icon}</span>
                        <p className="text-2xl font-bold text-text-main">{stat.value}</p>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Promotional Banner */}
            <div className="card !bg-brand-orange/5 border-brand-orange/20 flex flex-col md:flex-row items-center justify-between gap-6 !p-8">
                <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-brand-orange mb-1">Love the food?</h3>
                    <p className="text-sm text-text-muted italic">"Healthy, ghar jaisa swaad, har din."</p>
                </div>
                <button
                    onClick={onExtendPlan}
                    className="btn px-8"
                >
                    Extend Your Plan
                </button>
            </div>

            {/* Orders List */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold">Past Orders</h2>

                {orders.length === 0 ? (
                    <div className="card py-20 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-transparent text-brand-orange rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-4xl">receipt_long</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">No history yet</h3>
                        <p className="text-text-muted mb-8 max-w-xs">Your meal history will appear here once you start your journey with us.</p>
                        <button
                            onClick={() => window.location.href = '/menu'}
                            className="btn btn-secondary px-8"
                        >
                            Browse Today's Menu
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {orders.map(order => (
                            <div key={order.id} className="card flex flex-col hover:scale-[1.01] transition-transform">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-transparent flex items-center justify-center text-brand-orange">
                                            <span className="material-symbols-outlined">restaurant</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold">Order #{order.id.slice(0, 8)}</h3>
                                            <p className="text-[10px] text-text-muted">
                                                {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-success/10 text-success' : 'bg-brand-orange/10 text-brand-orange'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-6 flex-1 px-1">
                                    {order.items?.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-text-body">{item.quantity}x {item.menuItem?.name || 'Item'}</span>
                                            <span className="font-bold text-text-main">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-transparent flex justify-between items-center">
                                    <span className="text-xs font-bold text-text-muted uppercase">Total Paid</span>
                                    <span className="text-lg font-bold text-brand-orange">₹{order.totalAmount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}




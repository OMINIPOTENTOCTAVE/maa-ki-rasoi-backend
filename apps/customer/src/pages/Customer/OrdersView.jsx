import React from 'react';
import { History, CheckCircle2, Star, Banknote, UtensilsCrossed, Receipt, HeartHandshake } from 'lucide-react';

export default function OrdersView({ orders = [], subscriptions = [], onExtendPlan }) {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const activeSubs = subscriptions.filter(s => s.status === 'Active').length;

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-bold text-foreground mb-2">Order History</h1>
                    <p className="text-muted-foreground text-lg">Tracking your journey of healthy home-cooked meals.</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Orders', value: totalOrders, icon: <History className="w-6 h-6" />, color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'Active Plans', value: activeSubs, icon: <CheckCircle2 className="w-6 h-6" />, color: 'text-success', bg: 'bg-success/10' },
                    { label: 'Avg Rating', value: totalOrders > 0 ? '4.9' : '--', icon: <Star className="w-6 h-6" />, color: 'text-warning', bg: 'bg-warning/10' },
                    { label: 'Total Spent', value: `₹${totalSpent}`, icon: <Banknote className="w-6 h-6" />, color: 'text-foreground', bg: 'bg-background' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-border shadow-sm text-center flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${stat.bg} ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <p className="text-2xl font-heading font-bold text-foreground mb-1">{stat.value}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Promotional Banner */}
            <div className="bg-primary/5 border border-primary/20 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 p-8 shadow-sm">
                <div className="text-center md:text-left flex items-center gap-4">
                    <div className="hidden sm:flex w-14 h-14 bg-primary/10 rounded-full items-center justify-center text-primary flex-shrink-0">
                        <HeartHandshake className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-heading font-bold text-primary mb-1">Love the food?</h3>
                        <p className="text-sm text-muted-foreground font-medium">"Healthy, ghar jaisa swaad, har din."</p>
                    </div>
                </div>
                <button
                    onClick={onExtendPlan}
                    className="px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 w-full sm:w-auto whitespace-nowrap"
                >
                    Extend Your Plan
                </button>
            </div>

            {/* Orders List */}
            <section className="space-y-6">
                <h2 className="text-2xl font-heading font-bold text-foreground pl-2">Past Orders</h2>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-[2rem] py-20 border border-border text-center flex flex-col items-center shadow-sm">
                        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                            <Receipt className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-heading font-bold mb-2">No history yet</h3>
                        <p className="text-muted-foreground mb-8 max-w-sm">Your meal history will appear here once you start your journey with us.</p>
                        <button
                            onClick={() => window.location.href = '/menu'}
                            className="px-8 py-3 bg-secondary text-secondary-foreground rounded-full font-bold hover:bg-primary hover:text-white transition-all shadow-sm"
                        >
                            Browse Today's Menu
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white border border-border rounded-[2rem] shadow-sm p-6 flex flex-col card-hover">
                                <div className="flex justify-between items-start mb-6 pb-4 border-b border-border/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <UtensilsCrossed className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-heading font-bold text-lg text-foreground">Order #{order.id.slice(0, 8)}</h3>
                                            <p className="text-[12px] text-muted-foreground font-medium">
                                                {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider ${order.status === 'Delivered'
                                            ? 'bg-success/10 text-success border border-success/20'
                                            : 'bg-primary/10 text-primary border border-primary/20'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="space-y-3 mb-8 flex-1">
                                    {order.items?.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm items-center">
                                            <span className="text-foreground font-medium flex items-center gap-2">
                                                <span className="text-xs bg-background px-2 py-0.5 rounded-md border border-border">{item.quantity}x</span>
                                                {item.menuItem?.name || 'Item'}
                                            </span>
                                            <span className="font-bold text-foreground">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 bg-background -mx-6 -mb-6 px-6 pb-6 rounded-b-[2rem] flex justify-between items-center border-t border-border">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Paid</span>
                                    <span className="text-xl font-heading font-bold text-primary">₹{order.totalAmount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}




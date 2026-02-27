import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PLANS } from '../../config/pricing';

export default function GuestHomeView({ onExploreClick }) {
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        axios.get('/menu').then(res => {
            setMenuItems(res.data.data?.filter(m => m.isAvailable) || []);
        }).catch(() => { });
    }, []);

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-[2rem] bg-brand-brown p-8 md:p-16 text-white shadow-premium">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

                <div className="relative z-10 max-w-2xl">
                    <span className="inline-block px-4 py-1 rounded-full bg-brand-orange/20 text-brand-orange-light text-xs font-bold uppercase tracking-widest mb-6">
                        Authentic • Pure Veg • Daily
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                        Ghar Ka Khana,<br />
                        <span className="text-brand-orange-light italic">Har Din.</span>
                    </h1>
                    <p className="text-lg text-brand-beige/80 mb-10 leading-relaxed">
                        Fresh, wholesome meals made with love — delivered to your doorstep daily.
                        Starting at just <span className="font-bold text-white">₹{PLANS.Monthly.perMealPrice}/meal</span>.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={onExploreClick}
                            className="btn py-4 px-8 text-lg"
                        >
                            View Plans
                        </button>
                        <button
                            onClick={() => navigate('/menu')}
                            className="btn btn-secondary py-4 px-8 text-lg !bg-white/10 !text-white hover:!bg-white/20"
                        >
                            Today's Menu
                        </button>
                    </div>
                </div>
            </section>

            {/* Features/Stats */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: '100% Pure Veg', icon: 'eco', color: 'text-success' },
                    { label: 'Daily Delivery', icon: 'local_shipping', color: 'text-brand-orange' },
                    { label: 'Home Style', icon: 'cooking', color: 'text-warning' },
                    { label: 'Zero Preservatives', icon: 'verified', color: 'text-success' },
                ].map((stat, i) => (
                    <div key={i} className="card !p-6 text-center hover:scale-105 transition-transform">
                        <span className={`material-symbols-outlined text-3xl ${stat.color} mb-2`}>{stat.icon}</span>
                        <p className="text-xs font-bold text-text-main uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </section>

            {/* Menu Preview */}
            {menuItems.length > 0 && (
                <section>
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Today's Specials</h2>
                            <p className="text-text-muted">A glimpse of what's cooking today.</p>
                        </div>
                        <button
                            onClick={() => navigate('/menu')}
                            className="text-brand-orange font-bold flex items-center gap-1 hover:underline"
                        >
                            Full Menu <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {menuItems.slice(0, 3).map(item => (
                            <div key={item.id} className="card !p-0">
                                <div className="h-32 bg-brand-beige flex items-center justify-center">
                                    <span className="material-symbols-outlined text-6xl text-brand-orange/20">restaurant</span>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                                    <p className="text-xs text-text-muted mb-4 line-clamp-2">{item.description}</p>
                                    <span className="text-brand-orange font-bold">₹{item.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Final CTA */}
            <section className="bg-brand-orange-light/5 rounded-[2rem] p-8 md:p-16 text-center border border-brand-orange/10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Healthy Journey</h2>
                <p className="text-text-muted max-w-xl mx-auto mb-8 text-lg">
                    Join hundreds of happy families enjoying authentic home-cooked meals every day.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="btn py-4 px-12 text-lg"
                    >
                        Sign Up Now
                    </button>
                    <button
                        onClick={() => navigate('/menu')}
                        className="btn btn-secondary py-4 px-12 text-lg"
                    >
                        Learn More
                    </button>
                </div>
            </section>
        </div>
    );
}

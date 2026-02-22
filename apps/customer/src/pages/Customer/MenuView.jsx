import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MenuView({ onBack, cart, addToCart }) {
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await axios.get('/menu');
                setMenuItems(res.data.data.filter(m => m.isAvailable));
            } catch (err) {
                console.error(err);
            }
        };
        fetchMenu();
    }, []);

    const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

    return (
        <div className="flex flex-col h-full w-full bg-brand-cream dark:bg-brand-dark pb-24">
            <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#2d2418]/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
                <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-slate-800 dark:text-slate-200">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Daily Menu</h1>
                    <button onClick={() => navigate('/checkout')} className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-slate-800 dark:text-slate-200">
                        <span className="material-symbols-outlined">shopping_bag</span>
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-saffron text-[10px] font-bold text-white border-2 border-white dark:border-[#2d2418]">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
                <div className="px-4 pb-0 pt-2">
                    <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-3 snap-x">
                        <button className="snap-start flex flex-col items-center justify-center min-w-[4.5rem] py-3 rounded-2xl bg-brand-saffron text-white shadow-lg shadow-brand-saffron/30 transition-transform active:scale-95">
                            <span className="text-xs font-medium opacity-90 uppercase tracking-wide">Mon</span>
                            <span className="text-xl font-bold">12</span>
                        </button>
                        {[13, 14, 15, 16, 17].map((date, idx) => (
                            <button key={idx} className="snap-start flex flex-col items-center justify-center min-w-[4.5rem] py-3 rounded-2xl bg-white dark:bg-[#2d2418] border border-gray-200 dark:border-gray-700 text-slate-500 dark:text-slate-400 hover:border-brand-saffron/50 transition-colors active:scale-95">
                                <span className="text-xs font-medium uppercase tracking-wide">{['Tue', 'Wed', 'Thu', 'Fri', 'Sat'][idx]}</span>
                                <span className="text-xl font-bold text-slate-800 dark:text-slate-200">{date}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="flex flex-col gap-6 p-4 mt-2">
                {menuItems.length === 0 ? (
                    <div className="text-center p-8 text-slate-500">Loading today's exquisite selection...</div>
                ) : (
                    menuItems.map(item => (
                        <section key={item.id}>
                            <div className="flex items-center justify-between mb-3 px-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{item.category}</h2>
                                </div>
                                <span className="text-xl font-bold text-brand-saffron tracking-tight transition-transform">₹{item.price}</span>
                            </div>
                            <div className="group bg-white dark:bg-[#2d2418] rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-lg">
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight mb-2">{item.name}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                        {item.description}
                                    </p>
                                    <button onClick={() => addToCart(item)} className="w-full mt-2 py-3 border border-brand-saffron/20 rounded-xl bg-brand-saffron/10 text-brand-saffron font-bold text-sm shadow-sm flex items-center justify-center gap-2 group active:scale-95 transition-all">
                                        <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                                        Add to Order
                                    </button>
                                </div>
                            </div>
                        </section>
                    ))
                )}
                <div className="h-8"></div>
            </main>
        </div>
    );
}

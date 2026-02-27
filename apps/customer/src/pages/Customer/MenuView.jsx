import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@/hooks/useMediaQuery';

function getWeekDates() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 6; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push({ day: days[d.getDay()], date: d.getDate(), full: d.toISOString().split('T')[0] });
    }
    return dates;
}

export default function MenuView({ onBack, cart, addToCart }) {
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const { isMobile } = useMediaQuery();
    const [selectedDate, setSelectedDate] = useState(0);
    const weekDates = useMemo(() => getWeekDates(), []);

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
        <div className="flex flex-col h-full w-full bg-brand-cream dark:bg-brand-dark pb-24 md:pb-8">
            <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#2d2418]/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
                <div className="flex items-center justify-between px-4 md:px-6 py-2.5">
                    {isMobile && (
                        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-slate-800 dark:text-slate-200">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                    )}
                    <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 font-heading">{isMobile ? 'Daily Menu' : 'Today\'s Menu'}</h1>
                    <button onClick={() => navigate('/checkout')} className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-slate-800 dark:text-slate-200">
                        <span className="material-symbols-outlined">shopping_bag</span>
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-saffron text-[10px] font-bold text-white border-2 border-white dark:border-[#2d2418]">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            <main className="flex flex-col gap-4 p-4 md:p-6 lg:p-8 mt-1">
                {menuItems.length === 0 ? (
                    <div className="text-center p-6 text-slate-500 text-sm">Loading today's menu...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {menuItems.map(item => (
                            <div key={item.id} className="group bg-white dark:bg-[#2d2418] rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md border border-gray-100 dark:border-gray-800">
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.category}</span>
                                        <span className="text-lg font-bold text-brand-saffron">₹{item.price}</span>
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight mb-1.5">{item.name}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-3">
                                        {item.description}
                                    </p>
                                    <button onClick={() => addToCart(item)} className="w-full py-2.5 border border-brand-saffron/20 rounded-lg bg-brand-saffron/10 text-brand-saffron font-bold text-sm flex items-center justify-center gap-2 active:scale-95 hover:bg-brand-saffron hover:text-white transition-all">
                                        <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                                        Add to Order
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

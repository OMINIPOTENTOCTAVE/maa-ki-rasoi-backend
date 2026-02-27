import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MenuSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card">
                <div className="skeleton-title w-1/3 mb-4"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text w-5/6"></div>
                <div className="skeleton-text w-2/3 mb-6"></div>
                <div className="skeleton h-12 w-full rounded-xl"></div>
            </div>
        ))}
    </div>
);

export default function MenuView({ cart, addToCart }) {
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/menu');
                setMenuItems(res.data.data.filter(m => m.isAvailable));
            } catch (err) {
                console.error('Error fetching menu:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Today's Selection</h1>
                    <p className="text-text-muted">Freshly prepared, pure vegetarian meals.</p>
                </div>
                <MenuSkeleton />
            </div>
        );
    }

    if (menuItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                <div className="w-24 h-24 rounded-full bg-brand-beige flex items-center justify-center text-brand-orange mb-6">
                    <span className="material-symbols-outlined text-5xl">restaurant_menu</span>
                </div>
                <h1 className="text-3xl font-bold mb-4">Updating the Kitchen</h1>
                <p className="text-text-muted max-w-sm mx-auto mb-8">
                    Our chefs are finalizing today's special menu. <br />
                    Please check back in a few moments!
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="btn btn-secondary px-8"
                >
                    Refresh Menu
                </button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Today's Selection</h1>
                    <p className="text-text-muted">Freshly prepared, pure vegetarian meals.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-success flex items-center gap-1">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        100% Pure Veg
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map(item => (
                    <div key={item.id} className="card flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-brand-orange bg-brand-beige px-3 py-1 rounded-full">
                                {item.category}
                            </span>
                            <span className="text-xl font-bold text-text-main">₹{item.price}</span>
                        </div>

                        <h3 className="text-xl font-bold mb-3">{item.name}</h3>
                        <p className="text-text-muted text-sm mb-6 flex-1">
                            {item.description}
                        </p>

                        <button
                            onClick={() => addToCart(item)}
                            className="btn btn-block"
                        >
                            <span className="material-symbols-outlined">add_shopping_cart</span>
                            Add to Plate
                        </button>
                    </div>
                ))}
            </div>

            {/* Sticky Cart Mobile Shortcut (if items in cart) */}
            {cart.length > 0 && (
                <div className="md:hidden fixed bottom-[96px] left-4 right-4 z-50">
                    <button
                        onClick={() => navigate('/checkout')}
                        className="btn btn-block !bg-brand-brown !text-brand-cream border-2 border-brand-orange-light shadow-2xl py-4"
                    >
                        <div className="flex items-center justify-between w-full px-2">
                            <span className="font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined">shopping_basket</span>
                                {cart.length} Items Added
                            </span>
                            <span className="font-bold flex items-center">
                                Checkout
                                <span className="material-symbols-outlined">chevron_right</span>
                            </span>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}

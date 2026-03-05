import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, ShoppingBasket, ChevronRight, Sparkles } from 'lucide-react';

// Fallback image from ui-updates design guidelines
const FALLBACK_MENU_IMG = 'https://images.unsplash.com/photo-1666251214795-a1296307d29c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwyfHxkZWxpY2lvdXMlMjBpbmRpYW4lMjB0aGFsaSUyMGx1bmNoJTIwZGlubmVyfGVufDB8fHx8MTc3MjcwNjY0MHww&ixlib=rb-4.1.0&q=85';

function MenuCard({ item, index, onAdd, isFeatured = false }) {
    const categoryLabel =
        item.category === 'both' ? 'Lunch & Dinner'
            : item.category?.charAt(0).toUpperCase() + item.category?.slice(1)
            || 'Daily';

    const categoryStyle =
        item.category === 'lunch' ? 'bg-amber-100 text-amber-800'
            : item.category === 'dinner' ? 'bg-primary text-white'
                : 'bg-success text-white';

    return (
        <div
            data-testid={`menu-card-${item.id || index}`}
            className={`bg-white rounded-3xl overflow-hidden border border-border shadow-sm card-hover flex flex-col group ${isFeatured ? 'md:col-span-2 md:row-span-2 flex-row md:flex-col' : 'col-span-1 row-span-1'
                }`}
        >
            {/* Image */}
            <div className={`relative bg-primary/5 overflow-hidden img-zoom ${isFeatured ? 'h-48 md:h-[60%] w-1/3 md:w-full flex-shrink-0 md:flex-shrink' : 'h-[55%]'
                }`}>
                <img
                    src={item.image_url || FALLBACK_MENU_IMG}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.src = FALLBACK_MENU_IMG; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Category badge */}
                <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${categoryStyle}`}>
                        {categoryLabel}
                    </span>
                </div>

                {/* Veg indicator */}
                {item.is_veg !== false && (
                    <div className="absolute top-3 right-3 w-7 h-7 bg-white rounded-md shadow-sm flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-success rounded-sm flex items-center justify-center">
                            <div className="w-2 h-2 bg-success rounded-full" />
                        </div>
                    </div>
                )}

                {/* Featured badge */}
                {isFeatured && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-bold text-foreground">Chef's Special</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className={`font-heading font-bold text-[#2D2418] mb-2 line-clamp-1 ${isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                        {item.name}
                    </h3>
                    <p className={`text-slate-600 mb-6 line-clamp-2 ${isFeatured ? 'text-base md:text-lg' : 'text-sm'}`}>
                        {item.description || 'Delicious home-cooked meal, made fresh daily with love.'}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <span className={`font-heading font-bold text-[#C05621] ${isFeatured ? 'text-3xl lg:text-4xl' : 'text-2xl'}`}>
                        ₹{item.price}
                    </span>
                    <button
                        onClick={() => onAdd(item)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-foreground rounded-full font-bold text-sm hover:bg-primary hover:text-white transition-all active:scale-95 group/btn border border-border hover:border-primary"
                    >
                        <ShoppingBasket className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" />
                        Add to Plate
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function MenuView({ cart, addToCart }) {
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/menu');
                setMenuItems(res.data.data?.filter(m => m.isAvailable) || []);
            } catch (err) {
                console.error('Error fetching menu:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    const filteredItems = filter === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === filter || item.category === 'both');

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                    <p className="text-muted-foreground font-medium">Loading today's menu…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-32 page-transition">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center py-12 space-y-4">
                    <span className="inline-block px-4 py-1.5 bg-secondary text-foreground/70 text-xs font-bold uppercase tracking-wider rounded-full">
                        Freshly Prepared
                    </span>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
                        Today's Menu
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Fresh, home-style dishes prepared daily with love
                    </p>
                </div>

                {/* Filters */}
                <div className="flex justify-center gap-4 mb-12">
                    {['all', 'lunch', 'dinner'].map((f) => (
                        <button
                            key={f}
                            data-testid={`filter-${f}`}
                            onClick={() => setFilter(f)}
                            className={`px-7 py-3 rounded-full font-bold transition-all active:scale-95 ${filter === f
                                ? 'bg-primary text-white shadow-xl shadow-primary/30 ring-4 ring-primary/10'
                                : 'bg-white text-foreground border border-border hover:border-primary/30 hover:shadow-md shadow-sm'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Menu Grid — Bento Layout */}
                {filteredItems.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-border shadow-sm">
                        <UtensilsCrossed className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
                        <h3 className="text-2xl font-heading font-bold text-foreground mb-2">Updating the Kitchen</h3>
                        <p className="text-muted-foreground mb-8">Our chefs are finalizing today's special menu. Please check back soon!</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/90 active:scale-95 transition-all shadow-lg"
                        >
                            Refresh Menu
                        </button>
                    </div>
                ) : (
                    // Bento grid: dense packing with standard row height
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-[24rem] gap-6 grid-flow-row-dense">
                        {filteredItems.map((item, i) => (
                            <MenuCard
                                key={item.id || i}
                                item={item}
                                index={i}
                                onAdd={addToCart}
                                isFeatured={i === 0}
                            />
                        ))}
                    </div>
                )}

                {/* Sticky Cart Bar */}
                {cart.length > 0 && (
                    <div className="md:hidden fixed bottom-24 left-4 right-4 z-50 animate-slide-up">
                        <button
                            data-testid="sticky-cart-btn"
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-foreground text-white rounded-2xl py-4 px-6 shadow-2xl flex items-center justify-between border-2 border-primary/30 hover:bg-foreground/90 transition-colors active:scale-95"
                        >
                            <span className="font-bold flex items-center gap-2 text-lg">
                                <ShoppingBasket className="w-5 h-5 text-primary" />
                                {cart.length} {cart.length === 1 ? 'Item' : 'Items'} Added
                            </span>
                            <span className="font-bold flex items-center text-primary">
                                Checkout
                                <ChevronRight className="w-5 h-5 ml-1" />
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

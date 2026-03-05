import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Plus, ShoppingBasket, ChevronRight } from 'lucide-react';

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
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="pb-24 page-transition">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center py-12">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
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
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2.5 rounded-full font-medium transition-all ${filter === f
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'bg-white text-foreground border border-border hover:border-primary/30'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Menu Grid */}
                {filteredItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-border shadow-sm">
                        <UtensilsCrossed className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-2xl font-heading font-semibold text-foreground mb-2">Updating the Kitchen</h3>
                        <p className="text-muted-foreground mb-6">Our chefs are finalizing today's special menu. Please check back soon!</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg"
                        >
                            Refresh Menu
                        </button>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map((item, i) => (
                            <div
                                key={item.id || i}
                                className="bg-white rounded-3xl overflow-hidden border border-border card-hover flex flex-col"
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                <div className="relative h-48 bg-primary/5 overflow-hidden flex items-center justify-center">
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <UtensilsCrossed className="w-16 h-16 text-primary/20" />
                                    )}

                                    <div className="absolute top-3 left-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${item.category === 'lunch' ? 'bg-accent text-foreground' :
                                                item.category === 'dinner' ? 'bg-primary text-white' :
                                                    'bg-success text-white'
                                            }`}>
                                            {item.category === 'both' ? 'Lunch & Dinner' : item.category?.charAt(0).toUpperCase() + item.category?.slice(1) || 'Daily'}
                                        </span>
                                    </div>
                                    {item.is_veg !== false && (
                                        <div className="absolute top-3 right-3 w-7 h-7 bg-white rounded-md shadow-sm flex items-center justify-center">
                                            <div className="w-4 h-4 border-2 border-success rounded-sm flex items-center justify-center">
                                                <div className="w-2 h-2 bg-success rounded-full"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="font-heading font-semibold text-foreground text-xl mb-2">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-6 flex-1 line-clamp-2">{item.description || 'Delicious home-cooked meal'}</p>

                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl font-heading font-bold text-primary">₹{item.price}</span>
                                    </div>

                                    <button
                                        onClick={() => addToCart(item)}
                                        className="w-full py-3 bg-secondary text-secondary-foreground rounded-full font-medium hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <ShoppingBasket className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                                        Add to Plate
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Sticky Cart Mobile Shortcut */}
                {cart.length > 0 && (
                    <div className="md:hidden fixed bottom-24 left-4 right-4 z-50 animate-slide-up">
                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-foreground text-white rounded-2xl py-4 px-6 shadow-2xl flex items-center justify-between border-2 border-primary/20 hover:bg-black transition-colors"
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





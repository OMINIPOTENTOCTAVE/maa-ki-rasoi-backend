import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

// Sub-views
import HomeView from './Customer/HomeView';
import GuestHomeView from './Customer/GuestHomeView';
import ManageView from './Customer/ManageView';
import ExplorePlansView from './Customer/ExplorePlansView';
import MenuView from './Customer/MenuView';
import OrdersView from './Customer/OrdersView';
import ProfileView from './Customer/ProfileView';
import CheckoutView from './Customer/CheckoutView';
import SupportView from './Customer/SupportView';

export default function CustomerDashboard({ activeView, cart, addToCart }) {
    const [subscriptions, setSubscriptions] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const isLoggedIn = !!localStorage.getItem('customer_token');

    // Internal navigation state (for sub-modals like 'explore' or 'checkout')
    const [subView, setSubView] = useState(null);
    const [checkoutConfig, setCheckoutConfig] = useState(null);

    const fetchData = async () => {
        if (!isLoggedIn) {
            setLoadingData(false);
            return;
        }
        try {
            setLoadingData(true);
            const [subRes, ordRes] = await Promise.all([
                axios.get('/subscriptions'),
                axios.get('/orders')
            ]);
            setSubscriptions(subRes.data.data || []);
            setOrders(ordRes.data.data || []);
        } catch (error) {
            
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Pulse every minute
        return () => clearInterval(interval);
    }, [isLoggedIn]);

    // Handle internal sub-navigation (e.g. clicking "Explore Plans" from Home)
    const handleSubBack = () => {
        setSubView(null);
        setCheckoutConfig(null);
        fetchData();
    };

    if (loadingData && isLoggedIn) {
        return (
            <div className="flex flex-col gap-6 w-full animate-fade-in">
                <div className="skeleton-title"></div>
                <div className="skeleton-card"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="skeleton-card !h-32"></div>
                    <div className="skeleton-card !h-32"></div>
                </div>
            </div>
        );
    }

    // Prioritize Sub-Views (these act like temporary overlays or flow steps)
    if (subView === 'explore') {
        return <ExplorePlansView onBack={handleSubBack} onCheckout={(config) => {
            setCheckoutConfig(config);
            setSubView('checkout');
        }} />;
    }
    if (subView === 'checkout') {
        return <CheckoutView planConfig={checkoutConfig} onBack={handleSubBack} onSuccessComplete={() => {
            setSubView(null);
            fetchData();
        }} />;
    }
    if (subView === 'manage') {
        return <ManageView onBack={handleSubBack} subscriptions={subscriptions} onUpdate={fetchData} />;
    }
    if (subView === 'support') {
        return <SupportView onBack={handleSubBack} />;
    }

    // Render Main Views based on activeView route
    switch (activeView) {
        case 'home':
            return isLoggedIn ? (
                <HomeView
                    subscriptions={subscriptions}
                    onManageClick={() => setSubView('manage')}
                    onExploreClick={() => setSubView('explore')}
                />
            ) : (
                <GuestHomeView
                    onExploreClick={() => setSubView('explore')}
                    onMenuClick={() => {/* Router will handle this via AppLayout nav */ }}
                />
            );
        case 'menu':
            return (
                <MenuView
                    onBack={null} // Back button is now in AppLayout header
                    cart={cart}
                    addToCart={addToCart}
                />
            );
        case 'orders':
            return (
                <OrdersView
                    orders={orders}
                    subscriptions={subscriptions}
                    onBack={null}
                    onExtendPlan={() => setSubView('explore')}
                />
            );
        case 'profile':
            return (
                <ProfileView
                    onLogout={() => {
                        localStorage.removeItem('customer_token');
                        localStorage.removeItem('customer_data');
                        window.location.href = '/login';
                    }}
                    onManageSubscription={() => setSubView('manage')}
                    onSupportClick={() => setSubView('support')}
                    subscriptions={subscriptions}
                />
            );
        default:
            return <Navigate to="/" replace />;
    }
}


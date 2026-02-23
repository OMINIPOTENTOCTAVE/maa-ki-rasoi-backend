import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MobileLayout from '@/layouts/MobileLayout';
import HomeView from './Customer/HomeView';
import ManageView from './Customer/ManageView';
import ExplorePlansView from './Customer/ExplorePlansView';
import MenuView from './Customer/MenuView';
import OrdersView from './Customer/OrdersView';
import ProfileView from './Customer/ProfileView';
import CheckoutView from './Customer/CheckoutView';
import SupportView from './Customer/SupportView';

export default function CustomerDashboard({ cart, addToCart }) {
    const [activeTab, setActiveTab] = useState('home');
    const [subscriptions, setSubscriptions] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    // Modal screens
    const [modalView, setModalView] = useState(null); // 'explore', 'checkout', 'support'
    const [checkoutConfig, setCheckoutConfig] = useState(null);

    const fetchData = async () => {
        try {
            setLoadingData(true);
            const [subRes, ordRes] = await Promise.all([
                axios.get('/subscriptions'),
                axios.get('/orders')
            ]);
            setSubscriptions(subRes.data.data || []);
            setOrders(ordRes.data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBack = () => {
        setModalView(null);
        setCheckoutConfig(null);
        fetchData(); // Refresh basically when a modal closes
    };

    // Render full-screen modals covering the layout
    if (modalView === 'explore') {
        return <ExplorePlansView onBack={handleBack} onCheckout={(config) => {
            setCheckoutConfig(config);
            setModalView('checkout');
        }} />;
    }
    if (modalView === 'checkout') {
        return <CheckoutView planConfig={checkoutConfig} onBack={handleBack} onSuccessComplete={() => {
            setModalView('manage');
            fetchData();
        }} />;
    }
    if (modalView === 'support') {
        return <SupportView onBack={handleBack} />;
    }
    if (modalView === 'manage') {
        return <ManageView onBack={handleBack} subscriptions={subscriptions} onUpdate={fetchData} />;
    }

    if (loadingData) {
        return (
            <div className="flex bg-brand-cream dark:bg-brand-dark h-screen w-full items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-brand-saffron text-4xl">progress_activity</span>
            </div>
        );
    }

    return (
        <MobileLayout activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'home' &&
                <HomeView
                    subscriptions={subscriptions}
                    onManageClick={() => setModalView('manage')}
                    onExploreClick={() => setModalView('explore')}
                />
            }
            {activeTab === 'menu' &&
                <MenuView
                    onBack={() => setActiveTab('home')}
                    cart={cart}
                    addToCart={addToCart}
                />
            }
            {activeTab === 'orders' &&
                <OrdersView
                    orders={orders}
                    subscriptions={subscriptions}
                    onBack={() => setActiveTab('home')}
                    onExtendPlan={() => setModalView('explore')}
                    onReviewMeal={() => alert('Opening review prompt...')}
                    onRepeatMeal={() => setModalView('checkout')}
                />
            }
            {activeTab === 'profile' &&
                <ProfileView
                    onLogout={() => {
                        localStorage.removeItem('customer_token');
                        localStorage.removeItem('customer_data');
                        window.location.href = '/login';
                    }}
                    onManageSubscription={() => setModalView('manage')}
                    onSupportClick={() => setModalView('support')}
                />
            }
        </MobileLayout>
    );
}

import React, { useState } from 'react';
import MobileLayout from '../layouts/MobileLayout';
import HomeView from './Customer/HomeView';
import ManageView from './Customer/ManageView';
import ExplorePlansView from './Customer/ExplorePlansView';
import MenuView from './Customer/MenuView';
import OrdersView from './Customer/OrdersView';
import ProfileView from './Customer/ProfileView';
import CheckoutView from './Customer/CheckoutView';
import SupportView from './Customer/SupportView';

export default function CustomerDashboard() {
    const [activeTab, setActiveTab] = useState('home');

    // Modal screens
    const [modalView, setModalView] = useState(null); // 'explore', 'checkout', 'support'

    const handleBack = () => {
        setModalView(null);
    };

    // Render full-screen modals covering the layout
    if (modalView === 'explore') {
        return <ExplorePlansView onBack={handleBack} onCheckout={() => setModalView('checkout')} />;
    }
    if (modalView === 'checkout') {
        return <CheckoutView onBack={handleBack} onSuccessComplete={() => {
            setModalView('manage');
        }} />;
    }
    if (modalView === 'support') {
        return <SupportView onBack={handleBack} />;
    }
    if (modalView === 'manage') {
        return <ManageView onBack={handleBack} />;
    }

    return (
        <MobileLayout activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'home' &&
                <HomeView
                    onManageClick={() => setModalView('manage')}
                    onExploreClick={() => setModalView('explore')}
                />
            }
            {activeTab === 'menu' &&
                <MenuView onBack={() => setActiveTab('home')} />
            }
            {activeTab === 'orders' &&
                <OrdersView
                    onBack={() => setActiveTab('home')}
                    onExtendPlan={() => setModalView('explore')}
                    onReviewMeal={() => alert('Opening review prompt...')}
                    onRepeatMeal={() => setModalView('checkout')}
                />
            }
            {activeTab === 'profile' &&
                <ProfileView
                    onLogout={() => window.location.href = '/login'}
                    onManageSubscription={() => setModalView('manage')}
                    onSupportClick={() => setModalView('support')}
                />
            }
        </MobileLayout>
    );
}

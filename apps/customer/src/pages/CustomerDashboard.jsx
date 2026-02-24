import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import useMediaQuery from '@/hooks/useMediaQuery';
import MobileLayout from '@/layouts/MobileLayout';

// Desktop-only: lazy-loaded so mobile users skip this code
const DesktopLayout = lazy(() => import('@/layouts/DesktopLayout'));
const RightPanel = lazy(() => import('@/components/RightPanel'));
const DesktopModal = lazy(() => import('@/components/DesktopModal'));

const LazyFallback = () => (
    <div className="flex items-center justify-center h-screen bg-brand-cream dark:bg-brand-dark">
        <span className="material-symbols-outlined animate-spin text-brand-saffron text-3xl">progress_activity</span>
    </div>
);
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
    const { isMobile } = useMediaQuery();
    const isLoggedIn = !!localStorage.getItem('customer_token');

    // Modal screens
    const [modalView, setModalView] = useState(null);
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
        fetchData();
    };

    const handleSupportClick = () => {
        if (isMobile) {
            setModalView('support');
        } else {
            setActiveTab('support');
        }
    };

    const handleTabChange = (tab) => {
        if (tab === 'support') {
            handleSupportClick();
            return;
        }
        setModalView(null);
        setActiveTab(tab);
    };

    // ── Mobile: full-screen modals (original behavior) ──
    if (isMobile) {
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
    }

    if (loadingData) {
        return (
            <div className="flex bg-brand-cream dark:bg-brand-dark h-screen w-full items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-brand-saffron text-4xl">progress_activity</span>
            </div>
        );
    }

    // ── Render the active view content ──
    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <HomeView
                        subscriptions={subscriptions}
                        onManageClick={() => setModalView('manage')}
                        onExploreClick={() => setModalView('explore')}
                    />
                );
            case 'menu':
                return (
                    <MenuView
                        onBack={() => setActiveTab('home')}
                        cart={cart}
                        addToCart={addToCart}
                    />
                );
            case 'orders':
                return (
                    <OrdersView
                        orders={orders}
                        subscriptions={subscriptions}
                        onBack={() => setActiveTab('home')}
                        onExtendPlan={() => setModalView('explore')}
                        onReviewMeal={() => alert('Opening review prompt...')}
                        onRepeatMeal={() => setModalView('checkout')}
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
                        onManageSubscription={() => setModalView('manage')}
                        onSupportClick={handleSupportClick}
                    />
                );
            case 'support':
                return <SupportView onBack={() => setActiveTab('home')} />;
            default:
                return null;
        }
    };

    // ── Desktop: modal overlay titles ──
    const modalTitles = {
        explore: 'Explore Plans',
        checkout: 'Complete Checkout',
        support: 'Help & Support',
        manage: 'Manage Subscription',
    };

    // ── Desktop: render modal content as overlay dialog ──
    const renderDesktopModal = () => {
        if (!modalView) return null;

        let content;
        switch (modalView) {
            case 'explore':
                content = <ExplorePlansView onBack={handleBack} onCheckout={(config) => {
                    setCheckoutConfig(config);
                    setModalView('checkout');
                }} />;
                break;
            case 'checkout':
                content = <CheckoutView planConfig={checkoutConfig} onBack={handleBack} onSuccessComplete={() => {
                    setModalView('manage');
                    fetchData();
                }} />;
                break;
            case 'support':
                content = <SupportView onBack={handleBack} />;
                break;
            case 'manage':
                content = <ManageView onBack={handleBack} subscriptions={subscriptions} onUpdate={fetchData} />;
                break;
            default:
                return null;
        }

        return (
            <DesktopModal title={modalTitles[modalView]} onClose={handleBack}>
                {content}
            </DesktopModal>
        );
    };

    // ── Layout Selection ──
    if (isMobile) {
        return (
            <MobileLayout activeTab={activeTab} onTabChange={handleTabChange} isLoggedIn={isLoggedIn}>
                {renderContent()}
            </MobileLayout>
        );
    }

    return (
        <Suspense fallback={<LazyFallback />}>
            <DesktopLayout
                activeTab={activeTab}
                onTabChange={handleTabChange}
                rightPanel={isLoggedIn ? <RightPanel subscriptions={subscriptions} /> : null}
                isLoggedIn={isLoggedIn}
            >
                {renderContent()}
            </DesktopLayout>
            {renderDesktopModal()}
        </Suspense>
    );
}

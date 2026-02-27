import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '../hooks/useMediaQuery';
import AdminDesktopLayout from '../layouts/AdminDesktopLayout';
import useAdminData from '../hooks/useAdminData';

// Dashboard Components
import StatsPanel from '../components/dashboard/StatsPanel';
import TeamManagement from '../components/dashboard/TeamManagement';
import SubscriptionList from '../components/dashboard/SubscriptionList';
import MenuManagement from '../components/dashboard/MenuManagement';
import OrderQueue from '../components/dashboard/OrderQueue';
import ComplaintManager from '../components/dashboard/ComplaintManager';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('subscriptions');
    const { isMobile } = useMediaQuery();
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');

    const {
        orders, menuItems, stats, subscriptions, dailyProduction, partners, fetchData
    } = useAdminData();

    // Form states remain local
    const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '', category: '' });
    const [partnerForm, setPartnerForm] = useState({ name: '', phone: '', vehicleDetails: '' });

    const loadData = useCallback(() => {
        fetchData(activeTab, token);
    }, [activeTab, token, fetchData]);

    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
            return;
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        loadData();

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchData(activeTab, token);
        }, 30000);

        return () => clearInterval(interval);
    }, [token, activeTab, loadData, fetchData]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.patch(`/orders/${orderId}/status`, { status: newStatus });
            loadData();
        } catch (err) {
            alert('Error updating status');
        }
    };

    const handleAddMenu = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/menu', { ...menuForm, isAvailable: true });
            setMenuForm({ name: '', description: '', price: '', category: '' });
            loadData();
        } catch (err) {
            alert('Error adding menu item');
        }
    };

    const handleToggleMenu = async (id) => {
        try {
            await axios.patch(`/menu/${id}/toggle`);
            loadData();
        } catch (err) {
            alert('Error toggling status');
        }
    };

    const handleToggleSubscription = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
        try {
            await axios.patch(`/subscriptions/${id}/status`, { status: newStatus });
            loadData();
        } catch (err) {
            alert('Error toggling subscription status');
        }
    };

    const handleAddPartner = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/delivery/partners', partnerForm);
            setPartnerForm({ name: '', phone: '', vehicleDetails: '' });
            loadData();
        } catch (err) {
            alert('Error adding partner');
        }
    };

    const handleAssignDriver = async (taskId, partnerId, type) => {
        if (!partnerId) return;
        try {
            await axios.post('/delivery/assign', { partnerId, taskId, type });
            loadData();
        } catch (err) {
            alert('Error assigning driver');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const content = (
        <div style={{ padding: isMobile ? '0.5rem' : '0' }}>
            {/* Inline tab bar — mobile only */}
            {isMobile && (
                <>
                    <header className="top-nav"><h1>Maa Ki Rasoi - Kitchen</h1></header>
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem', padding: '0.5rem' }}>
                        <button className={`category-pill ${activeTab === 'subscriptions' ? 'active' : ''}`} onClick={() => setActiveTab('subscriptions')}>Subscriptions</button>
                        <button className={`category-pill ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Orders ({orders.length})</button>
                        <button className={`category-pill ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>Team</button>
                        <button className={`category-pill ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>Stats</button>
                        <button className={`category-pill ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>Menu</button>
                        <button className="category-pill" style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid var(--text-muted)' }} onClick={handleLogout}>Logout</button>
                    </div>
                </>
            )}

            {activeTab === 'stats' && <StatsPanel stats={stats} />}

            {activeTab === 'team' && (
                <TeamManagement
                    partners={partners}
                    partnerForm={partnerForm}
                    setPartnerForm={setPartnerForm}
                    handleAddPartner={handleAddPartner}
                />
            )}

            {activeTab === 'subscriptions' && (
                <SubscriptionList
                    subscriptions={subscriptions}
                    dailyProduction={dailyProduction}
                    partners={partners}
                    handleAssignDriver={handleAssignDriver}
                    handleToggleSubscription={handleToggleSubscription}
                />
            )}

            {activeTab === 'menu' && (
                <MenuManagement
                    menuItems={menuItems}
                    menuForm={menuForm}
                    setMenuForm={setMenuForm}
                    handleAddMenu={handleAddMenu}
                    handleToggleMenu={handleToggleMenu}
                />
            )}

            {activeTab === 'orders' && (
                <OrderQueue
                    orders={orders}
                    partners={partners}
                    handleAssignDriver={handleAssignDriver}
                    handleStatusChange={handleStatusChange}
                />
            )}

            {activeTab === 'complaints' && <ComplaintManager />}
        </div>
    );

    if (isMobile) {
        return <div className="app-container"><main className="main-content">{content}</main></div>;
    }

    return (
        <AdminDesktopLayout activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout}>
            {content}
        </AdminDesktopLayout>
    );
}

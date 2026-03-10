import { useState, useCallback } from 'react';
import api from '../config/api';
import { useNavigate } from 'react-router-dom';

export default function useAdminData() {
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [stats, setStats] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [dailyProduction, setDailyProduction] = useState(null);
    const [partners, setPartners] = useState([]);
    const [forecast, setForecast] = useState(null);
    const [payments, setPayments] = useState([]);
    const navigate = useNavigate();

    const fetchData = useCallback(async (activeTab, token) => {
        if (!token) return;

        try {
            const partnersRes = await api.get('/delivery/partners');
            setPartners(partnersRes.data.partners);

            if (activeTab === 'orders') {
                const res = await api.get('/orders');
                setOrders(res.data.data);
            } else if (activeTab === 'menu') {
                const res = await api.get('/menu');
                setMenuItems(res.data.data);
            } else if (activeTab === 'payments') {
                const res = await api.get('/payments/history');
                setPayments(res.data.data);
            } else if (activeTab === 'stats') {
                const [statsRes, kpiRes, forecastRes] = await Promise.all([
                    api.get('/orders/stats'),
                    api.get('/analytics/kpis'),
                    api.get('/analytics/forecast/tomorrow').catch(() => ({ data: { data: null } }))
                ]);
                setStats({ ...statsRes.data.data, ...kpiRes.data.data });
                setForecast(forecastRes.data.data);
            } else if (activeTab === 'subscriptions') {
                const subRes = await api.get('/subscriptions');
                setSubscriptions(subRes.data.data);
                const prodRes = await api.get('/subscriptions/production/today');
                setDailyProduction(prodRes.data);
            }
        } catch (err) {
            console.error("Admin data fetch error:", err);
        }
    }, [navigate]);

    return {
        orders,
        menuItems,
        stats,
        subscriptions,
        dailyProduction,
        partners,
        forecast,
        payments,
        fetchData
    };
}

import { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function useAdminData() {
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [stats, setStats] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [dailyProduction, setDailyProduction] = useState(null);
    const [partners, setPartners] = useState([]);
    const navigate = useNavigate();

    const fetchData = useCallback(async (activeTab, token) => {
        if (!token) return;

        try {
            const partnersRes = await axios.get('/delivery/partners');
            setPartners(partnersRes.data.partners);

            if (activeTab === 'orders') {
                const res = await axios.get('/orders');
                setOrders(res.data.data);
            } else if (activeTab === 'menu') {
                const res = await axios.get('/menu');
                setMenuItems(res.data.data);
            } else if (activeTab === 'stats') {
                const res = await axios.get('/orders/stats');
                setStats(res.data.data);
            } else if (activeTab === 'subscriptions') {
                const subRes = await axios.get('/subscriptions');
                setSubscriptions(subRes.data.data);
                const prodRes = await axios.get('/subscriptions/production/today');
                setDailyProduction(prodRes.data);
            }
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
            }
        }
    }, [navigate]);

    return {
        orders,
        menuItems,
        stats,
        subscriptions,
        dailyProduction,
        partners,
        fetchData
    };
}

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useMediaQuery from './hooks/useMediaQuery';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;

function DeliveryLogin() {
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/delivery/auth', { phone });
            localStorage.setItem('deliveryToken', res.data.token);
            navigate('/');
        } catch (err) {
            alert('Login failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-cream dark:bg-brand-dark p-4 font-display">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">Delivery Partner</h1>
            <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col items-center">
                <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 mb-4 focus:border-brand-saffron focus:ring-1 focus:ring-brand-saffron text-slate-900 dark:text-white"
                />
                <button type="submit" className="w-full rounded-xl py-3 font-bold text-white shadow-lg bg-brand-saffron hover:bg-[#D97706] transition-colors">
                    Login
                </button>
            </form>
        </div>
    );
}

function DeliveryDashboard() {
    const [tasks, setTasks] = useState({ subscriptions: [], instantOrders: [] });
    const navigate = useNavigate();
    const token = localStorage.getItem('deliveryToken');
    const { isMobile } = useMediaQuery();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        fetchTasks();
    }, [token]);

    const fetchTasks = async () => {
        try {
            const res = await axios.get('/delivery/tasks');
            setTasks(res.data.tasks);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('deliveryToken');
                navigate('/login');
            }
        }
    };

    const updateTaskStatus = async (taskId, type, status) => {
        try {
            await axios.post('/delivery/tasks/status', { taskId, type, status });
            fetchTasks();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('deliveryToken');
        navigate('/login');
    };

    const hasTasks = tasks.subscriptions.length > 0 || tasks.instantOrders.length > 0;
    const pendingSubs = tasks.subscriptions.filter(t => t.status !== 'Delivered');
    const pendingInstant = tasks.instantOrders.filter(t => t.status !== 'Delivered');

    // ── Task cards content (shared between layouts) ──
    const taskCards = (
        <>
            {!hasTasks && (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400 md:col-span-2">
                    <span className="material-symbols-outlined text-4xl mb-4 opacity-50">all_done</span>
                    <p className="font-medium">No tasks assigned for today.</p>
                    <p className="text-sm mt-1">Take a break or check back later!</p>
                </div>
            )}

            {/* Pending Subscription Deliveries */}
            {pendingSubs.map(task => (
                <div key={task.id} className="rounded-xl bg-white dark:bg-[#2d2418] p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4 relative overflow-hidden hover:shadow-md transition-shadow">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-saffron"></div>
                    <div className="flex justify-between items-start pl-2">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{task.subscription.customer?.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1">
                                <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">location_on</span>
                                {task.subscription.customer?.address}
                            </p>
                            <p className="text-xs text-brand-saffron font-medium mt-2 bg-brand-saffron/10 inline-block px-2 py-1 rounded-md">
                                Meal Plan: {task.mealType} (🌿 Pure Veg)
                            </p>
                        </div>
                        <a href={`tel:${task.subscription.customer?.phone}`} className="h-10 w-10 flex shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-600 dark:text-green-400 transition-active active:scale-95">
                            <span className="material-symbols-outlined">call</span>
                        </a>
                    </div>

                    {task.subscription.paymentMethod === 'ONLINE' && task.subscription.paymentStatus === 'Paid' ? (
                        <div className="mt-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-2 text-green-700 dark:text-green-400 font-bold">
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                            PREPAID - Do Not Collect Cash
                        </div>
                    ) : (
                        <div className="mt-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center justify-between text-red-700 dark:text-red-400 font-bold">
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">payments</span>
                                Collect Cash
                            </span>
                            <span className="text-xl tracking-tight">₹{task.subscription.totalPrice}</span>
                        </div>
                    )}

                    {task.status === 'Pending' ? (
                        <button onClick={() => updateTaskStatus(task.id, 'subscription', 'Out for Delivery')} className="w-full py-3 mt-1 rounded-xl bg-blue-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 group active:scale-95 hover:bg-blue-600 transition-all">
                            Start Delivery <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">local_shipping</span>
                        </button>
                    ) : (
                        <button onClick={() => updateTaskStatus(task.id, 'subscription', 'Delivered')} className="w-full py-3 mt-1 rounded-xl bg-brand-saffron text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 group active:scale-95 hover:bg-brand-saffron-dark transition-all">
                            Mark Delivered <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">check_circle</span>
                        </button>
                    )}
                </div>
            ))}

            {/* Pending Instant Orders */}
            {pendingInstant.map(task => (
                <div key={task.id} className="rounded-xl bg-white dark:bg-[#2d2418] p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4 relative overflow-hidden hover:shadow-md transition-shadow">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                    <div className="flex justify-between items-start pl-2">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{task.customerName}</h3>
                                <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">INSTANT</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-start gap-1">
                                <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">location_on</span>
                                {task.address}
                            </p>
                            <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                                {task.items.map(item => (
                                    <div key={item.id}>• {item.quantity}x {item.menuItem?.name || 'Item'}</div>
                                ))}
                            </div>
                        </div>
                        <a href={`tel:${task.customerPhone}`} className="h-10 w-10 flex shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-600 dark:text-green-400 transition-active active:scale-95">
                            <span className="material-symbols-outlined">call</span>
                        </a>
                    </div>

                    {task.paymentMethod === 'ONLINE' && task.paymentStatus === 'Paid' ? (
                        <div className="mt-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-2 text-green-700 dark:text-green-400 font-bold">
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                            PREPAID - Do Not Collect Cash
                        </div>
                    ) : (
                        <div className="mt-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center justify-between text-red-700 dark:text-red-400 font-bold">
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">payments</span>
                                Collect Cash
                            </span>
                            <span className="text-xl tracking-tight">₹{task.totalAmount}</span>
                        </div>
                    )}

                    {task.status === 'Pending' || task.status === 'Confirmed' ? (
                        <button onClick={() => updateTaskStatus(task.id, 'instant', 'Preparing')} className="w-full py-3 mt-1 rounded-xl bg-yellow-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 group active:scale-95 hover:bg-yellow-600 transition-all">
                            Start Preparing <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">cooking</span>
                        </button>
                    ) : task.status === 'Preparing' ? (
                        <button onClick={() => updateTaskStatus(task.id, 'instant', 'Out for Delivery')} className="w-full py-3 mt-1 rounded-xl bg-blue-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 group active:scale-95 hover:bg-blue-600 transition-all">
                            Out for Delivery <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">local_shipping</span>
                        </button>
                    ) : (
                        <button onClick={() => updateTaskStatus(task.id, 'instant', 'Delivered')} className="w-full py-3 mt-1 rounded-xl bg-brand-saffron text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 group active:scale-95 hover:bg-brand-saffron-dark transition-all">
                            Mark Delivered <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">check_circle</span>
                        </button>
                    )}
                </div>
            ))}
        </>
    );

    // ── Desktop Layout: Sidebar + 2-column card grid ──
    if (!isMobile) {
        return (
            <div className="flex h-screen w-full bg-brand-cream dark:bg-brand-dark overflow-hidden">
                {/* Skip to Content */}
                <a href="#delivery-main" className="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:top-4 focus:left-4 focus:bg-brand-saffron focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:shadow-lg">Skip to content</a>
                {/* Sidebar */}
                <aside className="w-[250px] shrink-0 bg-white dark:bg-[#1e1710] border-r border-gray-200 dark:border-gray-800 h-screen flex flex-col" role="navigation" aria-label="Delivery navigation">
                    <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                        <h1 className="font-heading text-xl font-bold text-brand-saffron leading-tight">
                            Maa Ki<br /><span className="italic opacity-80">Rasoi</span>
                        </h1>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-medium">Delivery Partner</p>
                    </div>

                    <nav className="flex-1 flex flex-col gap-1 px-3 py-4" aria-label="Delivery route">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-brand-saffron/10 text-brand-saffron">
                            <span className="material-symbols-outlined text-xl">route</span>
                            Today's Route
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-saffron"></span>
                        </div>
                    </nav>

                    {/* Stats */}
                    <div className="px-4 pb-4 space-y-2">
                        <div className="flex items-center justify-between px-3 py-2 bg-brand-saffron/5 rounded-lg">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Meal Plans</span>
                            <span className="text-sm font-bold text-brand-saffron">{pendingSubs.length} pending</span>
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Instant Orders</span>
                            <span className="text-sm font-bold text-blue-500">{pendingInstant.length} pending</span>
                        </div>
                    </div>

                    {/* Online Status + Logout */}
                    <div className="px-3 pb-4 border-t border-gray-100 dark:border-gray-800 pt-3 space-y-2">
                        <div className="flex items-center gap-2 px-4 py-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Online</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all w-full group"
                        >
                            <span className="material-symbols-outlined text-xl">logout</span>
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto h-screen">
                    <div className="max-w-5xl mx-auto p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">Today's Deliveries</h1>
                            <div className="text-sm text-slate-500">{pendingSubs.length + pendingInstant.length} tasks remaining</div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {taskCards}
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // ── Mobile Layout: Original single-column ──
    return (
        <div className="flex flex-col h-full min-h-screen w-full bg-brand-cream dark:bg-brand-dark overflow-y-auto no-scrollbar pb-safe font-display text-slate-900">
            <header className="sticky top-0 z-20 flex items-center justify-between bg-white/95 dark:bg-[#181511]/95 px-4 py-4 border-b border-gray-100 dark:border-gray-800 shadow-sm">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Today's Route</h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Online</span>
                    </div>
                    <button onClick={handleLogout} className="text-xs font-bold text-slate-400 hover:text-slate-600">
                        Logout
                    </button>
                </div>
            </header>

            <main className="p-4 flex flex-col gap-4">
                {taskCards}
            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DeliveryDashboard />} />
                <Route path="/login" element={<DeliveryLogin />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProfileView({ onLogout, onManageSubscription, onSupportClick, subscriptions = [] }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [customer, setCustomer] = useState(null);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [address, setAddress] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const activeSub = subscriptions.find(s => s.status === 'Active');

    useEffect(() => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
        const storedCustomer = localStorage.getItem('customer_data');
        if (storedCustomer) {
            try {
                const parsedCustomer = JSON.parse(storedCustomer);
                setCustomer(parsedCustomer);
                setAddress(parsedCustomer.address || '');
            } catch (e) {
                
            }
        }
    }, []);

    const toggleDarkMode = () => {
        const nextMode = !isDarkMode;
        setIsDarkMode(nextMode);
        if (nextMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold mb-2">Profile & Settings</h1>
                <p className="text-text-muted">Manage your account and preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* User Info & Subscription Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card text-center flex flex-col items-center !p-8">
                        <div className="w-24 h-24 bg-transparent text-brand-orange rounded-full flex items-center justify-center text-4xl font-bold mb-4 border-4 border-white shadow-lg">
                            {customer?.name?.charAt(0) || 'C'}
                        </div>
                        <h2 className="text-2xl font-bold capitalize">{customer?.name || 'Customer'}</h2>
                        <p className="text-text-muted font-medium mb-6">+91 {customer?.phone || '...'}</p>

                        <div className="w-full pt-6 border-t border-transparent">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Active Plan</p>
                                {activeSub && (
                                    <span className="bg-success/10 text-success px-2 py-0.5 rounded text-[10px] font-bold uppercase">Active</span>
                                )}
                            </div>

                            {activeSub ? (
                                <div className="text-left mb-6">
                                    <h3 className="font-bold text-brand-orange">{activeSub.planType} Pure Veg</h3>
                                    <p className="text-xs text-text-muted">
                                        {activeSub.mealsRemaining} meals left • Expires {new Date(activeSub.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-text-muted mb-6">No active subscription</p>
                            )}

                            <button
                                onClick={onManageSubscription}
                                className="btn btn-block btn-secondary"
                            >
                                {activeSub ? 'Manage Plan' : 'View Plans'}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="btn btn-block !bg-red-50 !text-error !shadow-none hover:!bg-red-100"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Sign Out
                    </button>
                </div>

                {/* Settings & Address */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Address Section */}
                    <div className="card">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-brand-orange">
                            <span className="material-symbols-outlined">location_on</span>
                            Delivery Address
                        </h3>

                        {isEditingAddress ? (
                            <div className="space-y-4">
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="input-field"
                                    rows={4}
                                    placeholder="Enter your full delivery address..."
                                />
                                <div className="flex gap-4">
                                    <button onClick={() => setIsEditingAddress(false)} className="btn btn-secondary flex-1">Cancel</button>
                                    <button
                                        disabled={isSaving}
                                        onClick={async () => {
                                            setIsSaving(true);
                                            try {
                                                const res = await axios.patch('/auth/profile', { address });
                                                if (res.data.success) {
                                                    localStorage.setItem('customer_data', JSON.stringify(res.data.customer));
                                                    setIsEditingAddress(false);
                                                }
                                            } catch (err) {  }
                                            finally { setIsSaving(false); }
                                        }}
                                        className="btn flex-[2]"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start justify-between gap-6 p-4 bg-transparent/30 rounded-xl border border-transparent">
                                <p className="text-sm leading-relaxed">
                                    {address || 'No address saved yet. Please add one for deliveries!'}
                                </p>
                                <button
                                    onClick={() => setIsEditingAddress(true)}
                                    className="text-brand-orange font-bold text-xs flex items-center gap-1 hover:underline"
                                >
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                    {address ? 'Edit' : 'Add'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* App Settings */}
                    <div className="card">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-brand-orange">
                            <span className="material-symbols-outlined">settings</span>
                            Preferences
                        </h3>

                        <div className="divide-y divide-transparent">
                            <div className="py-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-transparent flex items-center justify-center text-brand-orange">
                                        <span className="material-symbols-outlined">{isDarkMode ? 'dark_mode' : 'light_mode'}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold">Dark Theme</p>
                                        <p className="text-xs text-text-muted">Switch between light and dark appearance</p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleDarkMode}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-brand-orange' : 'bg-transparent'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            <button
                                onClick={onSupportClick}
                                className="w-full py-4 flex items-center justify-between hover:bg-brand-orange/10 transition-colors"
                            >
                                <div className="flex items-center gap-4 text-left">
                                    <div className="w-10 h-10 rounded-lg bg-transparent flex items-center justify-center text-brand-orange">
                                        <span className="material-symbols-outlined">help</span>
                                    </div>
                                    <div>
                                        <p className="font-bold">Help & Support</p>
                                        <p className="text-xs text-text-muted">Frequently asked questions and chat</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-text-muted">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center pt-8">
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">Maa Ki Rasoi PWA v3.0.0</p>
            </div>
        </div>
    );
}





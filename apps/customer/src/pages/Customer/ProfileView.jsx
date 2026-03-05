import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, LogOut, MapPin, Edit2, Settings, Moon, Sun, HelpCircle, ChevronRight, ShieldCheck } from 'lucide-react';

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
                console.error("Failed parsing customer data", e);
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
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10">
                <h1 className="text-4xl font-heading font-bold text-foreground mb-2">Profile & Settings</h1>
                <p className="text-muted-foreground text-lg">Manage your account and preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* User Info & Subscription Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2rem] border border-border overflow-hidden shadow-sm card-hover text-center flex flex-col items-center p-8">
                        <div className="w-28 h-28 bg-primary/10 text-primary rounded-full flex items-center justify-center text-5xl font-heading font-bold mb-4 shadow-inner border-4 border-white">
                            {customer?.name?.charAt(0) || <User className="w-12 h-12" />}
                        </div>
                        <h2 className="text-2xl font-heading font-bold capitalize text-foreground mb-1">{customer?.name || 'Customer'}</h2>
                        <p className="text-muted-foreground font-medium mb-8">+91 {customer?.phone || 'XXXXXXXXXX'}</p>

                        <div className="w-full pt-6 border-t border-border/50">
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Plan</p>
                                {activeSub && (
                                    <span className="bg-success/10 text-success px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        Active
                                    </span>
                                )}
                            </div>

                            {activeSub ? (
                                <div className="text-left mb-8 bg-background p-4 rounded-2xl border border-border">
                                    <h3 className="font-heading font-bold text-primary text-xl mb-1">{activeSub.planType} Pure Veg</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {activeSub.mealsRemaining} meals left • Expires {new Date(activeSub.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-background p-6 rounded-2xl border border-border mb-8">
                                    <p className="text-muted-foreground mb-2">No active subscription</p>
                                    <p className="text-xs text-muted-foreground">Subscribe to a plan to start receiving daily meals.</p>
                                </div>
                            )}

                            <button
                                onClick={onManageSubscription}
                                className="w-full py-4 bg-primary text-white rounded-full font-bold transition-all hover:bg-primary/90 shadow-md shadow-primary/20"
                            >
                                {activeSub ? 'Manage Plan' : 'View Plans'}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="w-full py-4 bg-red-50 text-red-600 border border-red-100 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 hover:bg-red-100 hover:text-red-700 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>

                {/* Settings & Address */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Address Section */}
                    <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm card-hover">
                        <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2 text-foreground">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <MapPin className="w-5 h-5" />
                            </div>
                            Delivery Address
                        </h3>

                        {isEditingAddress ? (
                            <div className="space-y-4 animate-fade-in">
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full border-2 border-border rounded-xl p-4 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none text-foreground bg-background"
                                    rows={4}
                                    placeholder="Enter your full delivery address, including flat number and landmarks..."
                                />
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsEditingAddress(false)}
                                        className="px-6 py-3 rounded-full font-semibold text-muted-foreground bg-background hover:bg-border/50 transition-colors flex-1"
                                    >
                                        Cancel
                                    </button>
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
                                            } catch (err) {
                                                console.error("Failed to update address", err);
                                            } finally {
                                                setIsSaving(false);
                                            }
                                        }}
                                        className={`px-8 py-3 rounded-full font-semibold text-white transition-all flex-[2] ${isSaving ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 shadow-md'}`}
                                    >
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start justify-between gap-6 p-6 bg-background rounded-2xl border border-border">
                                <p className="text-base text-foreground leading-relaxed flex-1">
                                    {address || <span className="text-muted-foreground italic">No address saved yet. Please add one for deliveries!</span>}
                                </p>
                                <button
                                    onClick={() => setIsEditingAddress(true)}
                                    className="text-primary font-bold text-sm flex items-center gap-1 hover:underline whitespace-nowrap bg-primary/10 px-4 py-2 rounded-full"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    {address ? 'Edit' : 'Add'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* App Settings */}
                    <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm card-hover">
                        <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2 text-foreground">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Settings className="w-5 h-5" />
                            </div>
                            Preferences
                        </h3>

                        <div className="space-y-2">
                            <div className="p-4 flex items-center justify-between hover:bg-background rounded-2xl transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        {isDarkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground text-lg">Dark Theme</p>
                                        <p className="text-sm text-muted-foreground">Switch between light and dark appearance</p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleDarkMode}
                                    className={`w-14 h-8 rounded-full transition-colors relative flex items-center ${isDarkMode ? 'bg-primary' : 'bg-border'}`}
                                >
                                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-sm ${isDarkMode ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            <button
                                onClick={onSupportClick}
                                className="w-full p-4 flex items-center justify-between hover:bg-background rounded-2xl transition-colors group"
                            >
                                <div className="flex items-center gap-4 text-left">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <HelpCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground text-lg">Help & Support</p>
                                        <p className="text-sm text-muted-foreground">Frequently asked questions and chat</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center pt-12 pb-4">
                <p className="text-xs text-muted-foreground/50 font-bold uppercase tracking-[0.2em]">Maa Ki Rasoi • PWA v3.0</p>
            </div>
        </div>
    );
}





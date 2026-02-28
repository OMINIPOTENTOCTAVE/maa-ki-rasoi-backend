import React, { useState } from 'react';
import axios from 'axios';

export default function ManageView({ onBack, subscriptions = [], onUpdate }) {
    const activeSub = subscriptions.find(s => s.status === 'Active' || s.status === 'Paused');
    const [loading, setLoading] = useState(false);

    if (!activeSub) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                <div className="w-24 h-24 bg-transparent text-brand-orange rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-5xl">event_busy</span>
                </div>
                <h1 className="text-2xl font-bold mb-2">No Active Plan</h1>
                <p className="text-text-muted mb-8">You can start a new journey from the home screen.</p>
                <button onClick={onBack} className="btn px-8">Back to Home</button>
            </div>
        );
    }

    const toggleStatus = async () => {
        setLoading(true);
        try {
            const newStatus = activeSub.status === 'Active' ? 'Paused' : 'Active';
            await axios.patch(`/subscriptions/${activeSub.id}/status`, { status: newStatus });
            if (onUpdate) await onUpdate();
        } catch (error) {
            
            alert("Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-transparent text-brand-orange">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-3xl font-bold mb-1">Manage Plan</h1>
                    <p className="text-text-muted">Control your active meal subscription.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* Left: Current Subscription Details */}
                <div className="card !bg-brand-dark text-white shadow-premium !p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-brand-orange-light text-xs font-bold uppercase tracking-widest mb-2">Subscription Details</p>
                            <h2 className="text-2xl md:text-3xl font-bold capitalize">{activeSub.planType} Plan</h2>
                            <p className="text-brand-dark/60 text-sm mt-1">100% Pure Veg • {activeSub.mealType}</p>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${activeSub.status === 'Active' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                            }`}>
                            {activeSub.status}
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center py-3 border-b border-white/10">
                            <span className="text-brand-dark/50 text-sm">Ends On</span>
                            <span className="font-bold">{new Date(activeSub.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/10">
                            <span className="text-brand-dark/50 text-sm">Meals Remanining</span>
                            <span className="font-bold">{activeSub.mealsRemaining} / {activeSub.totalMeals}</span>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-brand-orange/20 flex items-center justify-center text-brand-orange-light">
                            <span className="material-symbols-outlined">lock_clock</span>
                        </div>
                        <p className="text-xs text-brand-dark/70 leading-relaxed">
                            Order pauses made after 10:00 PM will be effective from the day after tomorrow.
                        </p>
                    </div>
                </div>

                {/* Right: Master Controls */}
                <div className="space-y-6">
                    <div className="card">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-orange">pause_circle</span>
                            Master Pause
                        </h3>
                        <p className="text-sm text-text-muted mb-8 leading-relaxed">
                            Going out of town? Pause your entire subscription. No meals will be delivered and your quota remains safe.
                        </p>

                        <button
                            onClick={toggleStatus}
                            disabled={loading}
                            className={`btn btn-block py-4 text-lg ${activeSub.status === 'Active' ? '!bg-brand-orange !text-white' : '!bg-success !text-white'
                                }`}
                        >
                            {loading ? 'Processing...' : (activeSub.status === 'Active' ? 'Pause Subscription' : 'Resume Deliveries')}
                        </button>
                    </div>

                    <div className="card !bg-transparent border-none shadow-none">
                        <h3 className="text-lg font-bold mb-2">Need help?</h3>
                        <p className="text-xs text-text-muted mb-4 leading-relaxed">
                            If you have specific meal requests or need a partial pause for specific days, please contact our support team.
                        </p>
                        <button onClick={() => window.open('https://wa.me/917428020104?text=Hi, I need help with my Maa Ki Rasoi Manage View', '_blank')} className="text-brand-orange font-bold text-sm flex items-center gap-1 hover:underline">
                            Chat with Support <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>

                    <button
                        onClick={onBack}
                        className="btn btn-secondary btn-block py-4 shadow-sm"
                    >
                        Save & Exit
                    </button>
                </div>
            </div>
        </div>
    );
}





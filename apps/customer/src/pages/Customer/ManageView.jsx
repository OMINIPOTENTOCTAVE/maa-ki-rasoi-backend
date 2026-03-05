import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft, CalendarX, Lock, PauseCircle, PlayCircle, MessageCircle } from 'lucide-react';

export default function ManageView({ onBack, subscriptions = [], onUpdate }) {
    const activeSub = subscriptions.find(s => s.status === 'Active' || s.status === 'Paused');
    const [loading, setLoading] = useState(false);

    if (!activeSub) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center page-transition px-4">
                <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                    <CalendarX className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-heading font-bold mb-4 text-foreground">No Active Plan</h1>
                <p className="text-muted-foreground text-lg mb-8 max-w-sm mx-auto">Subscribe to a plan from the home screen to start enjoying daily meals.</p>
                <button
                    onClick={onBack}
                    className="px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                    Explore Plans
                </button>
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
            console.error(error);
            alert("Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 page-transition pb-24">
            <div className="bg-white rounded-[2rem] p-8 border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-background transition-colors text-foreground"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-foreground">Manage Plan</h1>
                        <p className="text-muted-foreground">Control your active meal subscription.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* Left: Current Subscription Details */}
                <div className="bg-brand-dark text-white rounded-[2.5rem] shadow-premium p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>

                    <div className="flex justify-between items-start mb-10 relative z-10">
                        <div>
                            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                Subscription Details
                            </p>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold capitalize mb-2">{activeSub.planType} Plan</h2>
                            <p className="text-white/60 text-base">100% Pure Veg • {activeSub.mealType}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm ${activeSub.status === 'Active'
                                ? 'bg-success/20 text-success border border-success/30'
                                : 'bg-warning/20 text-warning border border-warning/30'
                            }`}>
                            {activeSub.status}
                        </div>
                    </div>

                    <div className="bg-black/20 rounded-2xl p-6 space-y-4 mb-8 border border-white/5 relative z-10">
                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                            <span className="text-white/50 text-sm font-medium">Ends On</span>
                            <span className="font-bold text-lg">{new Date(activeSub.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-white/50 text-sm font-medium">Meals Remaining</span>
                            <div className="flex items-baseline gap-1">
                                <span className="font-bold text-2xl">{activeSub.mealsRemaining}</span>
                                <span className="text-white/50 text-sm">/ {activeSub.totalMeals}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary/20 rounded-2xl p-5 border border-primary/30 flex items-start gap-4 relative z-10">
                        <div className="mt-1 flex-shrink-0 text-primary">
                            <Lock className="w-5 h-5" />
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed font-medium">
                            Order pauses made after <strong className="text-white">10:00 PM</strong> will be effective from the day after tomorrow due to ingredient prep.
                        </p>
                    </div>
                </div>

                {/* Right: Master Controls */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] p-8 border border-border shadow-sm card-hover">
                        <h3 className="text-2xl font-heading font-bold mb-4 flex items-center gap-3 text-foreground">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeSub.status === 'Active' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                                {activeSub.status === 'Active' ? <PauseCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
                            </div>
                            Master {activeSub.status === 'Active' ? 'Pause' : 'Resume'}
                        </h3>
                        <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                            {activeSub.status === 'Active'
                                ? "Going out of town? Pause your entire subscription. No meals will be delivered and your quota remains safe to be used later."
                                : "Back in town? Resume your deliveries. Your meal quota will start deducting from tomorrow."
                            }
                        </p>

                        <button
                            onClick={toggleStatus}
                            disabled={loading}
                            className={`w-full py-4 rounded-full font-bold transition-all text-lg flex justify-center items-center gap-2 ${activeSub.status === 'Active'
                                    ? 'bg-warning/10 text-warning-foreground hover:bg-warning hover:text-white border border-warning/20'
                                    : 'bg-success text-white hover:bg-success/90 shadow-lg shadow-success/30'
                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                activeSub.status === 'Active' ? 'Pause Subscription' : 'Resume Deliveries'
                            )}
                        </button>
                    </div>

                    <div className="bg-white rounded-[2rem] p-8 border border-border shadow-sm flex items-center justify-between gap-6 card-hover group cursor-pointer" onClick={() => window.open('https://wa.me/917428020104?text=Hi, I need help with my Maa Ki Rasoi subscription', '_blank')}>
                        <div>
                            <h3 className="text-xl font-heading font-bold mb-2 text-foreground">Need help?</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                                Have specific meal requests or need a partial pause for specific days?
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all flex-shrink-0 shadow-sm">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}





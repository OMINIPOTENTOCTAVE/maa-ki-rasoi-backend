import React, { useState } from 'react';
import axios from 'axios';

export default function ManageView({ onBack, subscriptions = [], onUpdate }) {
    const activeSub = subscriptions.find(s => s.status === 'Active' || s.status === 'Paused');
    const [loading, setLoading] = useState(false);

    if (!activeSub) {
        return (
            <div className="flex flex-col h-full w-full bg-brand-cream dark:bg-brand-dark pb-24 overflow-y-auto no-scrollbar">
                <div className="sticky top-0 z-50 flex items-center bg-white/90 dark:bg-[#2d2418]/90 p-4 pb-2 justify-between border-b border-gray-100 dark:border-gray-800 backdrop-blur-md">
                    <button onClick={onBack} className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center cursor-pointer hover:opacity-70 transition-opacity">
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </button>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Manage Active Plan</h2>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center mt-20">
                    <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">event_busy</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Active Plan</h3>
                    <p className="text-gray-500 mb-6">You don't have any active meal subscription.</p>
                    <button onClick={onBack} className="px-6 py-2 bg-brand-saffron text-white font-bold rounded-lg shadow-md">Browse Plans</button>
                </div>
            </div>
        );
    }

    const toggleStatus = async () => {
        setLoading(true);
        try {
            const newStatus = activeSub.status === 'Active' ? 'Paused' : 'Active';
            await axios.patch(`/subscriptions/${activeSub.id}/status`, { status: newStatus });
            if (onUpdate) await onUpdate(); // Refresh parent state
        } catch (error) {
            console.error(error);
            alert("Failed to update status");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex flex-col h-full w-full bg-brand-cream dark:bg-brand-dark pb-24 overflow-y-auto no-scrollbar">
            <div className="sticky top-0 z-50 flex items-center bg-white/90 dark:bg-[#2d2418]/90 p-4 pb-2 justify-between border-b border-gray-100 dark:border-gray-800 backdrop-blur-md">
                <button onClick={onBack} className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center cursor-pointer hover:opacity-70 transition-opacity">
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Manage Active Plan</h2>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
                <div className="p-4">
                    <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-[#2d2418] p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col gap-1 flex-[2_2_0px]">
                                <p className="text-brand-saffron text-xs font-bold uppercase tracking-wider mb-1">Current Plan</p>
                                <h3 className="text-slate-900 dark:text-white text-xl font-bold leading-tight capitalize">{activeSub.planType} Pure Veg</h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="material-symbols-outlined text-gray-400 text-sm">calendar_today</span>
                                    <p className="text-gray-500 text-sm font-medium leading-normal">
                                        Valid until {new Date(activeSub.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="w-20 h-20 bg-center bg-no-repeat bg-cover rounded-xl shadow-inner border border-gray-100 dark:border-gray-700 flex-shrink-0" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGlGRd_WWFCu3VWXCsXfRnxjz1ikZkqley-3kWWgnza1UHD99gP7gvK_fT0Pi_I-DOR85tMwkRnUVV8Xvpemk_ppJfNbyc_Inwho59JyJ1HNuqZkpineJmTmaVbvmStAO7UGXlW0EwbvAxMDrzq7-eHExHninE0ck8wqXdKgVlndnOkbdrN8U7CZuZZExE6_5586t4Gcf4VCmXPtUknGjfORbbvt79ZOxYNUorqRhXH0NfVkesYsl8FsUWtp0dLXHrWD0DH0ObITsr')" }}></div>
                        </div>
                        <div className="flex flex-col gap-3 mt-2">
                            <div className="flex gap-6 justify-between items-end">
                                <p className="text-slate-900 dark:text-white text-lg font-bold leading-none">Status: <span className={activeSub.status === 'Active' ? 'text-green-500' : 'text-amber-500'}>{activeSub.status}</span></p>
                                <p className="text-gray-500 text-sm font-bold leading-normal text-brand-saffron">₹{activeSub.totalPrice}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4">
                    <div className="flex items-center justify-between mb-3 mt-2">
                        <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Master Pause</h3>
                        <span className="text-xs text-brand-saffron font-medium bg-brand-saffron/10 px-2 py-1 rounded-full">Suspend deliveries</span>
                    </div>
                    <div className="rounded-xl bg-white dark:bg-[#2d2418] p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col items-center p-1 mb-4 text-center">
                            <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">
                                Going out of town? You can pause your entire subscription here. We will not deliver any meals or charge your daily quota until you reactive it.
                            </p>
                            <button onClick={toggleStatus} disabled={loading} className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-md active:scale-95 ${activeSub.status === 'Active' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'}`}>
                                {loading ? 'Processing...' : (activeSub.status === 'Active' ? 'Pause Subscription' : 'Re-Activate Subscription')}
                            </button>
                        </div>
                        <div className="mt-4 flex items-center gap-2 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                            <span className="material-symbols-outlined text-blue-500 text-sm">info</span>
                            <p className="text-blue-600 dark:text-blue-200 text-xs">Note: Active daily management calendar is coming in v2.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 w-full bg-white/80 dark:bg-[#181511]/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 p-4 pb-8 z-50 max-w-md">
                <button onClick={onBack} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]">
                    Done
                </button>
            </div>
        </div>
    );
}

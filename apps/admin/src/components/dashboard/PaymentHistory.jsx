import React from 'react';

export default function PaymentHistory({ payments }) {
    if (!payments || payments.length === 0) {
        return (
            <div className="card text-center py-12">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">payments</span>
                <p className="text-slate-500 font-medium">No payment records found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Transactions</h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{payments.length} Records</span>
            </div>

            <div className="bg-white dark:bg-[#2d2418] rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-border">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Plan</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Razorpay ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {payments.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800 dark:text-white">{p.customer?.name}</div>
                                        <div className="text-xs text-slate-500">{p.customer?.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.planId === 'Premium' ? 'bg-purple-100 text-purple-700' :
                                                p.planId === 'Standard' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-slate-100 text-slate-700'
                                            }`}>
                                            {p.planId}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-black text-slate-900 dark:text-white">
                                        ₹{p.amount}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-1.5 text-xs font-bold ${p.status === 'SUCCESS' ? 'text-emerald-600' :
                                                p.status === 'FAILED' ? 'text-red-500' :
                                                    'text-amber-500'
                                            }`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(p.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-mono text-slate-400">
                                        {p.razorpayOrderId}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

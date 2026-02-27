import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ComplaintManager() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComplaints = async () => {
        try {
            const res = await axios.get('/complaints');
            setComplaints(res.data.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
        const interval = setInterval(fetchComplaints, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleResolve = async (id) => {
        try {
            await axios.patch(`/complaints/${id}/resolve`);
            fetchComplaints();
        } catch (err) {
            alert('Error resolving complaint');
        }
    };

    const getOverdueStatus = (createdAt) => {
        const created = new Date(createdAt);
        const diff = (new Date() - created) / (1000 * 60 * 60); // hours
        return diff > 2; // Rule 2.4: Resolution within 2 hours
    };

    if (loading && complaints.length === 0) return <div className="p-8 text-center text-slate-500">Loading complaints...</div>;

    return (
        <div className="card p-6">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500">report</span>
                Customer Complaints (Rule 2.4)
            </h2>

            <div className="space-y-4">
                {complaints.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        No complaints filed yet. Great job!
                    </div>
                ) : (
                    complaints.map(complaint => {
                        const isOverdue = complaint.status !== 'Resolved' && getOverdueStatus(complaint.createdAt);
                        return (
                            <div key={complaint.id} className={`p-5 rounded-2xl border transition-all ${complaint.status === 'Resolved' ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200' : 'bg-white dark:bg-[#2d2418] border-gray-200 shadow-sm'}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {complaint.status}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400">{complaint.category}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-slate-400">{new Date(complaint.createdAt).toLocaleString()}</div>
                                        {isOverdue && (
                                            <div className="text-[10px] font-black text-red-500 uppercase flex items-center justify-end gap-1 mt-1">
                                                <span className="material-symbols-outlined text-xs">timer</span>
                                                Overdue (Rule 2.4 Violation)
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{complaint.customer?.name || 'Unknown Customer'} ({complaint.customer?.phone})</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{complaint.description}</p>
                                </div>

                                {complaint.status !== 'Resolved' && (
                                    <button
                                        onClick={() => handleResolve(complaint.id)}
                                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
                                    >
                                        Mark as Resolved
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

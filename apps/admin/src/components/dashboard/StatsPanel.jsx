import React from 'react';

export default function StatsPanel({ stats }) {
    if (!stats) return null;

    return (
        <div className="space-y-6">
            {/* Rule 10: Critical Health Status */}
            {stats.criticalAlert && (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-4">
                    <span className="material-symbols-outlined text-red-500 text-3xl">warning</span>
                    <div>
                        <h4 className="text-red-800 dark:text-red-400 font-bold">SCALING CIRCUIT BREAKER ACTIVE</h4>
                        <p className="text-red-600 dark:text-red-500 text-sm font-medium">Rule 10 violated. Complaint rate {'>'} 5% or On-Time Delivery {'<'} 90%. Fix systems before further expansion.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Rule 8: Key Metrics */}
                <MetricCard
                    title="Active Subscribers"
                    value={stats.activeSubscribers}
                    icon="group"
                    color="blue"
                />
                <MetricCard
                    title="Avg Revenue (ARPU)"
                    value={`₹${stats.arpu}`}
                    icon="payments"
                    color="green"
                    subtitle="Monthly Value"
                />
                <MetricCard
                    title="On-Time Delivery"
                    value={stats.onTimeRate}
                    icon="schedule"
                    color={parseFloat(stats.onTimeRate) >= 95 ? 'green' : 'amber'}
                    subtitle="Sacred Time Rule 2"
                />
                <MetricCard
                    title="Weekly Churn"
                    value={stats.churnRate}
                    icon="trending_down"
                    color={parseFloat(stats.churnRate) <= 10 ? 'green' : 'red'}
                    subtitle="Retention > Acquisition"
                />
                <MetricCard
                    title="Complaint Rate"
                    value={stats.complaintRate}
                    icon="report_problem"
                    color={parseFloat(stats.complaintRate) <= 5 ? 'green' : 'red'}
                    subtitle="Target: < 5%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Financial Operations Rule 6 */}
                <div className="bg-white dark:bg-[#2d2418] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Financial Operations (Today)</h3>
                    <div className="flex items-end justify-between">
                        <div>
                            <div className="text-3xl font-black text-slate-900 dark:text-white">₹{stats.revenueToday}</div>
                            <p className="text-sm font-medium text-slate-500">Gross Revenue (Delivered Only)</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-bold text-brand-saffron">{stats.totalOrdersToday}</div>
                            <p className="text-xs text-slate-400">Instant Orders</p>
                        </div>
                    </div>
                </div>

                {/* Complaint Handling Rule 2.4 */}
                <div className="bg-white dark:bg-[#2d2418] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Complaint Pulse</h3>
                    <div className="flex items-center gap-6">
                        <div className="size-16 rounded-full border-4 border-red-500/20 flex items-center justify-center text-red-500 text-2xl font-black">
                            {stats.complaintsThisWeek}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">New Complaints (Last 7 Days)</p>
                            <p className="text-xs text-slate-500">Resolution Target: Within 2 Hours (Rule 2.4)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon, color, subtitle }) {
    const colorMap = {
        green: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        red: 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    return (
        <div className={`p-5 rounded-2xl border bg-white dark:bg-[#2d2418] shadow-sm flex flex-col gap-3`}>
            <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${colorMap[color].split(' ')[0]} ${colorMap[color].split(' ')[1]}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                {subtitle && <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">{subtitle}</span>}
            </div>
            <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">{value}</div>
                <div className="text-xs font-bold text-slate-500 mt-1">{title}</div>
            </div>
        </div>
    );
}

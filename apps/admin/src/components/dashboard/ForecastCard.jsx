import React from 'react';

export default function ForecastCard({ forecast }) {
    if (!forecast) {
        return (
            <div className="bg-white dark:bg-[#2d2418] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                        <span className="material-symbols-outlined text-purple-500">insights</span>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                        AI Demand Forecast
                    </h3>
                </div>
                <p className="text-sm text-slate-400 italic">No prediction available yet. Forecasts generate at 9:50 PM IST when AI Forecasting is enabled.</p>
            </div>
        );
    }

    const { totalPredictedMeals, averageConfidence, clusters, date, hasPrediction, generatedAt } = forecast;

    if (!hasPrediction) {
        return (
            <div className="bg-white dark:bg-[#2d2418] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                        <span className="material-symbols-outlined text-purple-500">insights</span>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                        AI Demand Forecast
                    </h3>
                </div>
                <p className="text-sm text-slate-400 italic">No forecast for {date}. Enable AI Forecasting in Settings and wait for the nightly cron.</p>
            </div>
        );
    }

    const confidenceColor = averageConfidence >= 80 ? 'emerald' : averageConfidence >= 70 ? 'amber' : 'orange';

    return (
        <div className="bg-white dark:bg-[#2d2418] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
                padding: '20px 24px'
            }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-white text-2xl">insights</span>
                        <div>
                            <h3 className="text-white font-bold text-sm uppercase tracking-wider">AI Demand Forecast</h3>
                            <p className="text-purple-200 text-xs">{date} • Generated {generatedAt ? new Date(generatedAt).toLocaleTimeString('en-IN') : 'N/A'}</p>
                        </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-white text-xs font-bold">{averageConfidence}% conf.</span>
                    </div>
                </div>
            </div>

            {/* Main Stat */}
            <div className="p-6">
                <div className="flex items-end gap-2 mb-6">
                    <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">{totalPredictedMeals}</span>
                    <span className="text-sm font-bold text-slate-500 mb-1">meals predicted</span>
                </div>

                {/* Cluster Breakdown */}
                {clusters && clusters.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Zone Breakdown</h4>
                        {clusters.map((cluster) => (
                            <div key={cluster.clusterId} className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-20">
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{cluster.clusterId}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500`}
                                            style={{
                                                width: `${Math.min(100, (cluster.predictedMeals / totalPredictedMeals) * 100)}%`,
                                                background: cluster.confidence >= 80
                                                    ? 'linear-gradient(90deg, #10b981, #34d399)'
                                                    : cluster.confidence >= 70
                                                        ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                                        : 'linear-gradient(90deg, #f97316, #fb923c)'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex-shrink-0 text-right w-16">
                                    <span className="text-sm font-black text-slate-900 dark:text-white">{cluster.predictedMeals}</span>
                                </div>
                                <div className="flex-shrink-0 w-12 text-right">
                                    <span className={`text-[10px] font-bold text-${confidenceColor}-500`}>{cluster.confidence}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

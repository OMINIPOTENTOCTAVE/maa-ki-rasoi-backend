import React from 'react';

export default function PlanCard({
    title,
    price,
    features,
    isBestValue = false,
    isSelected = false,
    onClick
}) {
    return (
        <label
            className={`cursor-pointer group relative block h-full rounded-2xl p-5 transition-all ${isSelected
                    ? 'border-2 border-brand-saffron bg-brand-saffron/5 shadow-[0_8px_30px_-6px_rgba(245,158,11,0.3)]'
                    : 'border border-gray-200 dark:border-gray-800 bg-white dark:bg-brand-dark hover:border-brand-saffron/50 hover:bg-gray-50 dark:hover:bg-[#231e16]'
                }`}
            onClick={onClick}
        >
            <input type="radio" checked={isSelected} readOnly className="peer sr-only" name="plan" />

            {/* Best Value Badge */}
            {isBestValue && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-saffron text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md shadow-brand-saffron/40 whitespace-nowrap z-10 border-2 border-white dark:border-brand-dark">
                    Most Popular
                </div>
            )}

            <div className="flex justify-between items-start mb-4">
                <h3 className={`font-display font-bold text-lg ${isSelected ? 'text-brand-saffron' : 'text-slate-900 dark:text-white'}`}>
                    {title}
                </h3>
                <div className="flex flex-col items-end">
                    <span className={`text-2xl font-black ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
                        ₹{price}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Per Meal
                    </span>
                </div>
            </div>

            <ul className="space-y-2.5 mb-2 mt-4">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                        <span className={`material-symbols-outlined text-[16px] leading-tight ${isSelected ? 'text-brand-saffron' : 'text-brand-green'}`}>
                            {feature.icon || 'check_circle'}
                        </span>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            {feature.text}
                        </span>
                    </li>
                ))}
            </ul>

            {/* Custom Checkbox Indicator */}
            <div className={`absolute bottom-4 right-4 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-brand-saffron bg-brand-saffron text-white' : 'border-gray-300 dark:border-gray-700 bg-transparent'
                }`}>
                {isSelected && <span className="material-symbols-outlined text-[14px] font-bold">check</span>}
            </div>
        </label>
    );
}


